import test from "node:test";
import assert from "node:assert/strict";
import { createPersistence } from "../src/domain/persistence.ts";
function fixture() {
  const data = new Map();
  let fail = null;
  const store = {
    get: async (key) => data.get(key) ?? null,
    set: async (key, value) => {
      if (fail?.(key)) throw new Error("disk failure");
      data.set(key, value);
    },
    remove: async (key) => {
      data.delete(key);
    },
  };
  return {
    data,
    store,
    persistence: createPersistence(store),
    fail: (fn) => {
      fail = fn;
    },
  };
}
test("unicode remains intact and secure values stay below older keychain size limits", async () => {
  const f = fixture(),
    text = JSON.stringify({ label: "🫶".repeat(1700) });
  await f.persistence.write(text);
  assert.equal(await f.persistence.read(), text);
  for (const value of f.data.values())
    assert.ok(Buffer.byteLength(value, "utf8") < 2048);
});
test("failed chunk or pointer writes keep the last complete saved village", async () => {
  for (const point of ["village.mobile.v1.1.0", "village.mobile.v1.active"]) {
    const f = fixture();
    await f.persistence.write("original");
    f.fail((key) => key === point);
    await assert.rejects(f.persistence.write("updated"));
    assert.equal(await f.persistence.read(), "original");
    f.fail(null);
    await f.persistence.write("retry");
    assert.equal(await f.persistence.read(), "retry");
  }
});
test("concurrent writes are serialised, and deletion removes both generations", async () => {
  const f = fixture();
  await Promise.all([
    f.persistence.write("first"),
    f.persistence.write("second"),
    f.persistence.write("third"),
  ]);
  assert.equal(await f.persistence.read(), "third");
  await f.persistence.clear();
  assert.equal(f.data.size, 0);
  assert.equal(await f.persistence.read(), null);
});

test("a failed batch finishes its slow writes before the next save starts", async () => {
  const data = new Map();
  let release;
  let started;
  let secondSaveStarted = false;
  const pending = new Promise((resolve) => {
    release = resolve;
  });
  const slowWriteStarted = new Promise((resolve) => {
    started = resolve;
  });
  const persistence = createPersistence({
    get: async (key) => data.get(key) ?? null,
    remove: async (key) => {
      data.delete(key);
    },
    set: async (key, value) => {
      if (value === "a".repeat(400)) throw new Error("interrupted write");
      if (value === "a".repeat(100)) {
        started();
        await pending;
      }
      if (value.startsWith("b")) secondSaveStarted = true;
      data.set(key, value);
    },
  });
  const first = assert.rejects(persistence.write("a".repeat(500)));
  await slowWriteStarted;
  const second = persistence.write("b".repeat(500));
  await new Promise((resolve) => setImmediate(resolve));
  const raced = secondSaveStarted;
  release();
  await Promise.all([first, second]);
  assert.equal(raced, false);
  assert.equal(await persistence.read(), "b".repeat(500));
});
test("missing chunks and corrupt pointers fail visibly instead of becoming an empty village", async () => {
  const f = fixture();
  await f.persistence.write("test");
  f.data.delete("village.mobile.v1.0.0");
  await assert.rejects(f.persistence.read());
  f.data.set("village.mobile.v1.active", '{"slot":9,"count":9999}');
  await assert.rejects(f.persistence.read());
});
