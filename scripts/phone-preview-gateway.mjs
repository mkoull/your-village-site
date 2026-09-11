import http from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const cookieName = "__Host-village_phone";
const same = (a, b) =>
  typeof a === "string" &&
  Buffer.byteLength(a) === Buffer.byteLength(b) &&
  timingSafeEqual(Buffer.from(a), Buffer.from(b));
const cookies = (header) =>
  Object.fromEntries(
    (header || "").split(";").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i).trim(), p.slice(i + 1)];
    }),
  );
const json = (res, status, data, headers = {}) => {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(data));
};
const landing = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Your Village · Phone preview</title><style>body{margin:0;background:#faf8f5;color:#294c3e;font:16px/1.6 system-ui;display:grid;min-height:100svh;place-items:center}main{max-width:360px;padding:32px;text-align:center}img{width:76px;height:76px}h1{font:42px/1.1 Georgia;margin:24px 0}p{color:#596650}button{background:#294c3e;color:white;border:0;border-radius:14px;padding:16px 24px;font:inherit;cursor:pointer}small{display:block;margin-top:24px;color:#66725e}</style><main><img src="/app-icon.svg" alt="Your Village"><h1>A little support.<br>A little closer.</h1><p id="message">Open the private preview link to step into your village.</p><button id="open" hidden>Open my village</button><small>A private preview with fictional providers.<br>No real bookings or payments.</small></main><script>let invite=location.hash.slice(1);history.replaceState(null,'','/phone');const button=document.querySelector('#open'),message=document.querySelector('#message');async function openVillage(){button.disabled=true;message.textContent='Opening your village…';try{const response=await fetch('/phone/unlock',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({invite})});const data=await response.json();if(!response.ok)throw Error(data.error);location.replace('/app')}catch(e){message.textContent=e.message||'Please try opening the link again.';button.disabled=false;button.hidden=false}}if(invite){button.hidden=false;button.onclick=openVillage;openVillage()}</script></html>`;

export function createGateway({
  config,
  upstream = "http://127.0.0.1:3101",
  fetcher = fetch,
  clock = Date.now,
}) {
  return http.createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store, private");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    try {
      const url = new URL(req.url, "http://gateway.invalid");
      const path = url.pathname;
      const expected = config.origin;
      if (!expected || req.headers.host !== new URL(expected).host)
        return json(res, 421, { error: "Preview address not recognised." });
      if (clock() >= config.expiresAt)
        return json(res, 410, {
          error: "This private preview has expired. Ask for a fresh link.",
        });
      const post = req.method === "POST";
      if (!["GET", "HEAD", "POST"].includes(req.method))
        return json(res, 405, { error: "Method unavailable." });
      if (post && req.headers.origin !== expected)
        return json(res, 403, {
          error: "Please open this request from Village.",
        });
      let body;
      if (post) {
        if (!req.headers["content-type"]?.startsWith("application/json"))
          return json(res, 415, { error: "JSON required." });
        const chunks = [];
        let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 20000)
            return json(res, 413, { error: "Request too large." });
          chunks.push(chunk);
        }
        body = Buffer.concat(chunks);
      }
      if (path === "/phone/unlock" && post) {
        let input;
        try {
          input = JSON.parse(body);
        } catch {
          return json(res, 400, {
            error: "Please open your private preview link again.",
          });
        }
        if (!same(input?.invite, config.invite))
          return json(res, 403, {
            error: "Open the full private preview link from your message.",
          });
        const ttl = Math.max(
          0,
          Math.floor((config.expiresAt - clock()) / 1000),
        );
        return json(
          res,
          200,
          { ready: true },
          {
            "Set-Cookie": `${cookieName}=${config.access}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${ttl}`,
          },
        );
      }
      const authorised = same(
        cookies(req.headers.cookie)[cookieName],
        config.access,
      );
      const asset =
        /^\/_next\/static\/[a-zA-Z0-9_./%-]+$/.test(path) ||
        [
          "/app-icon.svg",
          "/app-icon-192.png",
          "/app-icon-512.png",
          "/apple-touch-icon.png",
          "/favicon.ico",
          "/village.webmanifest",
        ].includes(path);
      if (path === "/phone" && !post) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(landing);
      }
      if (!authorised && !asset) {
        if (path.startsWith("/api/"))
          return json(res, 401, {
            error: "Open your private phone-preview link to reconnect.",
          });
        res.writeHead(303, { Location: "/phone" });
        return res.end();
      }
      if (path === "/api/village/logout" && post)
        return json(
          res,
          200,
          { ok: true },
          {
            "Set-Cookie": `${cookieName}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
          },
        );
      const api =
        /^\/api\/village\/(session|providers(?:\/[a-z0-9-]+)?|saved|requests(?:\/[a-z0-9-]+(?:\/read)?)?)$/.test(
          path,
        );
      if (path.startsWith("/api/") && !api)
        return json(res, 403, {
          error: "This private link opens the family preview only.",
        });
      if (
        post &&
        (!api ||
          !/^\/api\/village\/(saved|requests(?:\/[a-z0-9-]+(?:\/read)?)?)$/.test(
            path,
          ))
      )
        return json(res, 405, { error: "Action unavailable." });
      const page =
        /^\/app(?:\/(explore|saved|privacy|requests(?:\/[a-z0-9-]+)?|providers\/[a-z0-9-]+))?$/.test(
          path,
        );
      if (!api && !asset && path !== "/village.webmanifest" && !page) {
        res.writeHead(303, {
          Location: path.startsWith("/app")
            ? "/app"
            : "https://your-village-site.vercel.app/",
        });
        return res.end();
      }
      const headers = { accept: req.headers.accept || "*/*" };
      // Only this dedicated family session is forwarded. Caller cookies, forwarding
      // headers, login endpoints and all local role shortcuts are never forwarded.
      if (api) headers.cookie = config.upstreamCookie;
      if (post) {
        headers.origin = upstream;
        headers["Content-Type"] = "application/json";
      }
      for (const name of [
        "rsc",
        "next-router-state-tree",
        "next-router-prefetch",
        "next-url",
      ])
        if (req.headers[name]) headers[name] = req.headers[name];
      const response = await fetcher(upstream + path + url.search, {
        method: req.method,
        headers,
        body,
        redirect: "manual",
        signal: AbortSignal.timeout(15000),
      });
      const contentType =
        response.headers.get("content-type") || "application/octet-stream";
      if (path === "/api/village/session" && response.ok) {
        const data = await response.json();
        if (data.user?.id !== config.userId || data.user?.role !== "family")
          return json(res, 503, {
            error: "The phone preview needs reconnecting.",
          });
        return json(res, 200, { ...data, previewAccess: "family" });
      }
      res.statusCode = response.status;
      res.setHeader("Content-Type", contentType);
      for (const name of ["vary", "content-disposition"])
        if (response.headers.has(name))
          res.setHeader(name, response.headers.get(name));
      if (response.headers.has("location")) {
        const to = new URL(response.headers.get("location"), upstream);
        res.setHeader(
          "Location",
          to.origin === upstream ? to.pathname + to.search : "/app",
        );
      }
      return res.end(Buffer.from(await response.arrayBuffer()));
    } catch {
      if (!res.headersSent)
        return json(res, 503, {
          error: "The preview is reconnecting. Please try again in a moment.",
        });
      res.end();
    }
  });
}

async function run() {
  const configPath = ".village-data/phone-preview.json";
  let config;
  try {
    config = JSON.parse(await readFile(configPath, "utf8"));
  } catch {}
  if (!config || config.expiresAt <= Date.now()) {
    const origin = "http://127.0.0.1:3101";
    const session = await fetch(origin + "/api/village/session").then((r) =>
      r.json(),
    );
    if (session.mode !== "preview")
      throw Error("Phone preview requires the local fictional-data server.");
    const response = await fetch(origin + "/api/village/register", {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alex",
        email: "phone-" + randomBytes(12).toString("hex") + "@example.test",
        password: randomBytes(32).toString("base64url"),
        role: "family",
        consent: true,
      }),
    });
    const data = await response.json();
    if (!response.ok || data.user?.role !== "family")
      throw Error("Could not prepare the phone preview account.");
    config = {
      invite: randomBytes(24).toString("base64url"),
      access: randomBytes(32).toString("base64url"),
      userId: data.user.id,
      upstreamCookie: response.headers.get("set-cookie").split(";")[0],
      expiresAt: Date.now() + 86400000,
      origin: null,
    };
    await writeFile(configPath, JSON.stringify(config), { mode: 0o600 });
  }
  // The origin is written after the tunnel assigns its random HTTPS address.
  const server = createGateway({ config });
  server.listen(3103, "127.0.0.1", () =>
    console.log("Private family gateway listening on loopback port 3103."),
  );
  const timer = setInterval(async () => {
    try {
      Object.assign(config, JSON.parse(await readFile(configPath, "utf8")));
    } catch {}
  }, 1000);
  server.on("close", () => clearInterval(timer));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await run();
