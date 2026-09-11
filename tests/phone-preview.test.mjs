import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createGateway } from "../scripts/phone-preview-gateway.mjs";

async function withGateway(run) {
  const config = {
    origin: "https://phone.test",
    invite: "private-invite",
    access: "private-cookie",
    userId: "phone-family",
    upstreamCookie: "village_session=server-only",
    expiresAt: Date.now() + 60000,
  };
  const calls = [];
  const gateway = createGateway({
    config,
    fetcher: async (url, options) => {
      calls.push({ url, options });
      return url.includes("/session")
        ? Response.json({
            mode: "preview",
            user: { id: "phone-family", role: "family" },
          })
        : new Response("test asset");
    },
  });
  await new Promise((resolve) => gateway.listen(0, "127.0.0.1", resolve));
  const base = "http://127.0.0.1:" + gateway.address().port;
  const request = (path, options = {}) =>
    new Promise((resolve, reject) => {
      const req = http.request(
        base + path,
        {
          method: options.method || "GET",
          headers: { host: "phone.test", ...options.headers },
        },
        (response) => {
          const chunks = [];
          response.on("data", (chunk) => chunks.push(chunk));
          response.on("end", () =>
            resolve(
              new Response(Buffer.concat(chunks), {
                status: response.statusCode,
                headers: response.headers,
              }),
            ),
          );
        },
      );
      req.on("error", reject);
      req.end(options.body);
    });
  try {
    await run({ config, calls, request });
  } finally {
    await new Promise((resolve) => gateway.close(resolve));
  }
}
const auth = {
  cookie: "__Host-village_phone=private-cookie; village_session=attacker-value",
};

test("phone preview requires the private invite and secure cookie before exposing data", async () =>
  withGateway(async ({ request, calls }) => {
    assert.equal((await request("/app")).status, 303);
    assert.equal((await request("/api/village/session")).status, 401);
    assert.equal(
      (
        await request("/api/village/session", {
          headers: { cookie: "village_session=server-only" },
        })
      ).status,
      401,
    );
    const send = (invite, origin = "https://phone.test") =>
      request("/phone/unlock", {
        method: "POST",
        headers: { Origin: origin, "Content-Type": "application/json" },
        body: JSON.stringify({ invite }),
      });
    assert.equal(
      (await send("private-invite", "https://wrong.test")).status,
      403,
    );
    assert.equal((await send("wrong")).status, 403);
    assert.equal((await send("é".repeat(14))).status, 403);
    const response = await send("private-invite");
    assert.equal(response.status, 200);
    assert.match(
      response.headers.get("set-cookie"),
      /HttpOnly; Secure; SameSite=Lax/,
    );
    assert.equal(calls.length, 0);
  }));

test("phone access cannot reach role shortcuts, account creation, owner tools or marketing submissions", async () =>
  withGateway(async ({ request, calls }) => {
    for (const path of ["preview", "register", "login", "owner", "partner"]) {
      assert.equal(
        (
          await request("/api/village/" + path, {
            method: "POST",
            headers: {
              ...auth,
              Origin: "https://phone.test",
              "Content-Type": "application/json",
            },
            body: "{}",
          })
        ).status,
        403,
      );
    }
    assert.equal((await request("/api/leads", { headers: auth })).status, 403);
    assert.equal(
      (await request("/app/owner", { headers: auth })).headers.get("location"),
      "/app",
    );
    const response = await request("/api/village/session", { headers: auth });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).previewAccess, "family");
    assert.equal(calls.length, 1);
    assert.equal(
      calls[0].options.headers.cookie,
      "village_session=server-only",
    );
    assert.equal(response.headers.get("set-cookie"), null);
  }));

test("phone gateway enforces its origin, write boundary, expiry and no-store responses", async () =>
  withGateway(async ({ request, config, calls }) => {
    assert.equal(
      (
        await request("/api/village/saved", {
          method: "POST",
          headers: {
            ...auth,
            Origin: "https://wrong.test",
            "Content-Type": "application/json",
          },
          body: "{}",
        })
      ).status,
      403,
    );
    const response = await request("/api/village/saved", {
      method: "POST",
      headers: {
        ...auth,
        Origin: "https://phone.test",
        "Content-Type": "application/json",
      },
      body: '{"providerId":"kindred-home","saved":true}',
    });
    assert.equal(response.status, 200);
    assert.equal(calls[0].options.headers.origin, "http://127.0.0.1:3101");
    assert.equal(response.headers.get("cache-control"), "no-store, private");
    assert.equal(
      (await request("/app", { headers: { host: "wrong.test" } })).status,
      421,
    );
    config.expiresAt = Date.now() - 1;
    assert.equal(
      (await request("/api/village/session", { headers: auth })).status,
      410,
    );
  }));
