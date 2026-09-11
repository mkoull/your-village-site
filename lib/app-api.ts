import { AppError, type VillageStore } from "./app-store.ts";
type Config = { mode: "preview" | "pilot" | "off"; origin?: string };
const cookieName = "village_session";
function cookie(request: Request) { return request.headers.get("cookie")?.split(";").map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1); }
function result(data: unknown, status = 200, session?: string, secure = false) {
  return Response.json(data, { status, headers: {
    "Cache-Control": "no-store, private", "Vary": "Cookie", "X-Content-Type-Options": "nosniff",
    ...(session !== undefined ? { "Set-Cookie": `${cookieName}=${session}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${session ? 2592000 : 0}${secure ? "; Secure" : ""}` } : {}),
  } });
}
export async function handleApp(request: Request, path: string[], getStore: () => VillageStore, config: Config) {
  try {
    const url = new URL(request.url);
    const host = request.headers.get("host") || url.host;
    const hostname = host.split(":")[0];
    const local = ["127.0.0.1", "localhost"].includes(hostname);
    const mode = config.mode === "preview" && !local ? "off" : config.mode;
    if (mode === "off") return result({ error: "The Village app is not enabled on this server yet.", mode, user: null }, path.join("/") === "session" ? 200 : 503);
    const origin = config.origin || (local ? `http://${host}` : "");
    if (!origin || (mode === "pilot" && !origin.startsWith("https://"))) return result({ error: "The app’s secure address needs configuring." }, 503);
    const post = request.method === "POST";
    if (post && request.headers.get("origin") !== origin) return result({ error: "Please submit this form from Village." }, 403);
    if (post && !request.headers.get("content-type")?.startsWith("application/json")) return result({ error: "This request needs JSON." }, 415);
    let input: Record<string, unknown> = {};
    if (post) {
      if (Number(request.headers.get("content-length")) > 20000) return result({ error: "That request is too large." }, 413);
      // Read with a byte bound even for requests without Content-Length.
      const reader = request.body?.getReader(); let body = "", size = 0;
      const decoder = new TextDecoder();
      if (reader) while (true) { const part = await reader.read(); if (part.done) break; size += part.value.length; if (size > 20000) { await reader.cancel(); return result({ error: "That request is too large." }, 413); } body += decoder.decode(part.value, { stream: true }); }
      body += decoder.decode();
      try { const data: unknown = JSON.parse(body); if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error(); input = data as Record<string, unknown>; } catch { return result({ error: "The request couldn’t be read. Please try again." }, 400); }
    }
    const store = getStore(), token = cookie(request), user = store.session(token);
    const key = path.join("/");
    const secure = origin.startsWith("https://");
    if (!post && key === "session") return result({ mode, user: user || null });
    if (post && ["register", "login", "preview"].includes(key)) {
      // Single-origin pilot: a global persistent limit cannot be bypassed with forged proxy headers.
      store.rateLimit("authentication", mode === "preview" ? 100 : 30);
      let account;
      if (key === "preview") {
        if (mode !== "preview" || !["family", "provider", "owner"].includes(String(input.role))) return result({ error: "Preview access is unavailable." }, 403);
        account = store.user(`preview-${input.role}`)!;
      } else account = key === "register" ? await store.register(input) : await store.login(input);
      store.logout(token);
      return result({ user: account, mode }, 200, store.createSession(account), secure);
    }
    if (post && key === "logout") { store.logout(token); return result({ user: null }, 200, "", secure); }
    if (!post && key === "providers") return result({ providers: store.providers() });
    if (!post && path[0] === "providers" && path.length === 2) return result({ provider: store.provider(path[1], user) });
    const account = store.require(user);
    if (post) store.rateLimit(`write:${account.id}`, 120, 600000);
    if (!post && key === "saved") return result({ providers: store.saved(account) });
    if (post && key === "saved") { if (typeof input.providerId !== "string" || typeof input.saved !== "boolean") throw new AppError("Choose a provider to save."); store.save(account, input.providerId, input.saved); return result({ providers: store.saved(account) }); }
    if (!post && key === "requests") return result({ requests: store.requests(account) });
    if (post && key === "requests") return result({ request: store.request(account, input) }, 201);
    if (path[0] === "requests" && path.length === 2) return result({ request: post ? store.act(account, path[1], input) : store.getRequest(account, path[1]) });
    if (!post && key === "partner") { store.require(account, "provider"); return result({ providers: store.providers(account), requests: store.requests(account) }); }
    if (post && key === "partner") return result({ provider: store.apply(account, input) }, 201);
    if (post && path[0] === "partner" && path.length === 2) return result({ provider: store.updateListing(account, path[1], input) });
    if (!post && key === "owner") { store.require(account, "owner"); return result({ providers: store.providers(account), requests: store.requests(account), ledger: store.ledger(account) }); }
    if (post && path[0] === "owner" && path.length === 2) return result({ provider: store.moderate(account, path[1], input) });
    return result({ error: "That action wasn’t found." }, 404);
  } catch (error) {
    if (error instanceof AppError) return result({ error: error.message }, error.status);
    // Never expose SQL, credentials, messages or contact details in logs or responses.
    return result({ error: "We couldn’t save that change. Please try again." }, 500);
  }
}
