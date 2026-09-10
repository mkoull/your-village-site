const MAX_BYTES = 16_384;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedFields = [
  "name",
  "email",
  "phone",
  "notes",
  "message",
  "suburb",
  "stage",
  "needs",
  "aroundYou",
  "timing",
  "founding",
  "plan",
  "page",
] as const;

function reply(status: number, delivered = false) {
  return Response.json(
    { delivered },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

/** No personal data or webhook credentials are logged or returned to the browser. */
export async function handleLead(
  request: Request,
  webhook: string | undefined,
): Promise<Response> {
  const origin = request.headers.get("origin");
  // Next can use an internal hostname in request.url behind a proxy.
  // Host is the public request host; never use an arbitrary forwarded host.
  const requestUrl = new URL(request.url);
  const protocol =
    request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ||
    requestUrl.protocol.slice(0, -1);
  const publicOrigin = `${protocol}://${request.headers.get("host") || requestUrl.host}`;
  if (origin && origin !== publicOrigin) return reply(403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply(415);

  const reader = request.body?.getReader();
  if (!reader) return reply(400);
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        return reply(413);
      }
      chunks.push(value);
    }
  } catch {
    return reply(400);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  let input: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return reply(400);
    input = parsed as Record<string, unknown>;
  } catch {
    return reply(400);
  }

  if (typeof input.type !== "string" || !["assessment", "contact", "waitlist"].includes(input.type))
    return reply(400);
  if (
    typeof input.email !== "string" ||
    input.email.length > 254 ||
    !emailPattern.test(input.email.trim())
  )
    return reply(400);
  if (
    input.type !== "waitlist" &&
    (typeof input.name !== "string" || !input.name.trim())
  )
    return reply(400);
  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    const value = input[field];
    if (value === undefined) continue;
    if (typeof value === "string" && value.length <= 4000)
      data[field] = value.trim();
    else if (field === "founding" && typeof value === "boolean")
      data[field] = value;
    else if (
      (field === "needs" || field === "plan") &&
      Array.isArray(value) &&
      value.length <= 12 &&
      value.every((v) => typeof v === "string" && v.length <= 120)
    )
      data[field] = value;
    else return reply(400);
  }

  if (!webhook) return reply(503);
  try {
    const url = new URL(webhook);
    if (url.protocol !== "https:" || url.username || url.password)
      return reply(503);
  } catch {
    return reply(503);
  }

  try {
    const upstream = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        type: input.type,
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
      redirect: "error",
    });
    const accepted = upstream.ok;
    await upstream.body?.cancel();
    return accepted ? reply(200, true) : reply(502);
  } catch {
    return reply(502);
  }
}
