export interface KeyStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}
const prefix = "village.mobile.v1";
const maximumChunks = 40;
async function finishAll(operations: Promise<void>[]) {
  // Wait for every write, even after failure, before the queue starts another generation.
  const results = await Promise.allSettled(operations);
  const failure = results.find((result) => result.status === "rejected");
  if (failure?.status === "rejected") throw failure.reason;
}
// Two generations make the pointer swap atomic. Small values also work on older keychains.
export function createPersistence(store: KeyStore) {
  let queue: Promise<unknown> = Promise.resolve();
  const serial = <T>(action: () => Promise<T>): Promise<T> => {
    const result = queue.then(action, action);
    queue = result.catch(() => {});
    return result;
  };
  function manifest(
    raw: string | null,
  ): { slot: number; count: number } | null {
    if (raw === null) return null;
    const value = JSON.parse(raw);
    if (
      ![0, 1].includes(value.slot) ||
      !Number.isInteger(value.count) ||
      value.count < 1 ||
      value.count > maximumChunks
    )
      throw new Error("Saved village is incomplete.");
    return value;
  }
  return {
    read: () =>
      serial(async () => {
        const current = manifest(await store.get(`${prefix}.active`));
        if (!current) return null;
        const parts = await Promise.all(
          Array.from({ length: current.count }, (_, i) =>
            store.get(`${prefix}.${current.slot}.${i}`),
          ),
        );
        if (parts.some((part) => part === null))
          throw new Error("Saved village is incomplete.");
        return parts.join("");
      }),
    write: (raw: string) =>
      serial(async () => {
        if (raw.length > 16000)
          throw new Error("This village is too large to save.");
        const current = manifest(await store.get(`${prefix}.active`));
        const slot = current?.slot === 0 ? 1 : 0;
        // Split on Unicode code points, keeping each UTF-8 value below 2 KB.
        const chunks = raw.match(/[\s\S]{1,400}/gu) || [""];
        await finishAll(
          chunks.map((chunk, i) => store.set(`${prefix}.${slot}.${i}`, chunk)),
        );
        await store.set(
          `${prefix}.active`,
          JSON.stringify({ slot, count: chunks.length }),
        );
      }),
    clear: () =>
      serial(async () => {
        // Delete data before its pointer: interrupted deletion fails closed on the next read.
        await finishAll(
          [0, 1].flatMap((slot) =>
            Array.from({ length: maximumChunks }, (_, i) =>
              store.remove(`${prefix}.${slot}.${i}`),
            ),
          ),
        );
        await store.remove(`${prefix}.active`);
      }),
  };
}
