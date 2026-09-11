import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { VillageStore } from "../lib/app-store.ts";
import { handleApp } from "../lib/app-api.ts";
import { analyticsPageUrl } from "../lib/analytics-url.ts";
const make = () => new VillageStore(":memory:", true);
const family = s => s.user("preview-family"), provider = s => s.user("preview-provider"), owner = s => s.user("preview-owner");
const payload = () => ({ providerId: "kindred-home", suburb: "Richmond", timing: "This week", message: "Synthetic request for a two-hour clean.", consent: true, key: randomUUID() });
const offer = { action: "offer", quoteCents: 14000, arrangement: "Tuesday at 10am, two hours of cleaning.", message: "Synthetic offer. Cancel free with 24 hours notice." };
function finish(s, id, amount = 14000) {
  s.act(provider(s), id, { ...offer, quoteCents: amount });
  s.act(family(s), id, { action: "accept", quoteCents: amount, arrangement: offer.arrangement });
  s.act(provider(s), id, { action: "delivered", paid: true });
  return s.act(family(s), id, { action: "complete", paid: true });
}
async function other(s, role = "family") { return s.register({ name: "Other Person", email: `${randomUUID()}@example.test`, password: "a-test-password-12345", role, consent: true }); }
function http(path, body, token, origin = "http://127.0.0.1:3101") { return new Request(`http://127.0.0.1:3101/api/village/${path}`, { method: body === undefined ? "GET" : "POST", headers: { origin, "content-type": "application/json", ...(token ? { cookie: `village_session=${token}` } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) }); }

test("accounts hash passwords, issue opaque expiring sessions and revoke logout", async () => {
  const s = make(); try {
    const account = await other(s); assert.equal(account.role, "family");
    assert.ok(!String(s.one("SELECT password FROM users WHERE id=?", account.id).password).includes("test-password"));
    assert.equal((await s.login({ email: account.email, password: "a-test-password-12345" })).id, account.id);
    await assert.rejects(s.login({ email: account.email, password: "wrong-password" }), /email or password/);
    await assert.rejects(s.register({ name: "Bad Actor", email: "bad@example.test", password: "a-test-password-12345", role: "owner", consent: true }), /family or provider/);
    const token = s.createSession(account); assert.equal(s.session(token).id, account.id); assert.equal(s.one("SELECT token FROM sessions").token === token, false);
    s.logout(token); assert.equal(s.session(token), undefined);
    const expires = s.createSession(account); s.db.prepare("UPDATE sessions SET expires=0").run(); assert.equal(s.session(expires), undefined);
  } finally { s.db.close(); }
});
test("family and provider request isolation is enforced on reads and writes", async () => {
  const s = make(); try { const f = await other(s), p = await other(s, "provider"); const r = s.request(family(s), payload());
    assert.deepEqual(s.requests(f), []); assert.deepEqual(s.requests(p), []);
    for (const actor of [f, p]) { assert.throws(() => s.getRequest(actor, r.id), /not|isn’t/); assert.throws(() => s.act(actor, r.id, { action: "message", message: "intrusion" }), /not|isn’t/); }
    assert.equal(s.getRequest(provider(s), r.id).id, r.id); assert.equal(s.getRequest(owner(s), r.id).id, r.id);
    assert.throws(() => s.moderate(family(s), "kindred-home", { status: "paused" }), /different account/);
  } finally { s.db.close(); }
});
test("request delivery is durable, deduplicated and bound to its original payload", () => {
  const s = make(); try { const body = payload(); const r = s.request(family(s), body);
    assert.equal(s.request(family(s), body).id, r.id); assert.equal(s.requests(provider(s)).length, 1);
    assert.throws(() => s.request(family(s), { ...body, message: "A changed request with reused key." }), /already been used/);
    assert.throws(() => s.request(family(s), payload()), /already have an open request/);
    assert.throws(() => s.request(family(s), { ...payload(), providerId: "a-little-order", consent: false }), /sharing/);
    assert.throws(() => s.request(family(s), { ...payload(), providerId: "a-little-order", suburb: "Perth" }), /suburb/);
  } finally { s.db.close(); }
});
test("only the correct actor can advance a request and revised offers need fresh acceptance", () => {
  const s = make(); try { const r = s.request(family(s), payload());
    assert.throws(() => s.act(family(s), r.id, { action: "complete", paid: true }), /changed/);
    assert.throws(() => s.act(family(s), r.id, offer), /changed/);
    assert.throws(() => s.act(provider(s), r.id, { ...offer, quoteCents: -100 }), /total quote/);
    s.act(provider(s), r.id, offer); s.act(provider(s), r.id, { ...offer, quoteCents: 15000 });
    assert.throws(() => s.act(family(s), r.id, { action: "accept", quoteCents: 14000, arrangement: offer.arrangement }), /changed/);
    s.act(family(s), r.id, { action: "accept", quoteCents: 15000, arrangement: offer.arrangement });
    assert.throws(() => s.act(provider(s), r.id, { action: "delivered" }), /changed/);
    assert.equal(s.ledger(owner(s)).length, 0);
    s.act(provider(s), r.id, { action: "delivered", paid: true });
    assert.equal(s.ledger(owner(s)).length, 0);
    assert.throws(() => s.act(family(s), r.id, { action: "complete", paid: false }), /changed/);
    assert.equal(s.act(family(s), r.id, { action: "complete", paid: true }).feeCents, 1500);
  } finally { s.db.close(); }
});
test("referrals are capped, only charged once per family/provider and never called paid", () => {
  const s = make(); try { const r = s.request(family(s), payload()); assert.equal(finish(s, r.id, 80000).feeCents, 5000);
    assert.throws(() => s.act(family(s), r.id, { action: "complete", paid: true }), /changed/);
    const repeat = s.request(family(s), payload()); assert.equal(finish(s, repeat.id).feeCents, null);
    assert.equal(s.ledger(owner(s)).length, 1); assert.equal(s.ledger(owner(s))[0].state, "unbilled");
  } finally { s.db.close(); }
});
test("a completed request dispute voids the fee and only the owner can resolve it", () => {
  const s = make(); try { const r = s.request(family(s), payload()); finish(s, r.id);
    const disputed = s.act(family(s), r.id, { action: "dispute", message: "The agreed tasks were not all completed." });
    assert.equal(disputed.status, "disputed"); assert.equal(disputed.feeCents, null); assert.equal(s.ledger(owner(s))[0].state, "void");
    assert.throws(() => s.act(provider(s), r.id, { action: "resolve", message: "Provider cannot close this." }), /changed/);
    assert.equal(s.act(owner(s), r.id, { action: "resolve", message: "Both sides agreed to close this request." }).status, "cancelled");
  } finally { s.db.close(); }
});
test("cancellation and declining close a request without any referral fee", () => {
  const s = make(); try { let r = s.request(family(s), payload());
    assert.equal(s.act(family(s), r.id, { action: "cancel", message: "Our plans have changed." }).status, "cancelled");
    r = s.request(family(s), payload()); assert.equal(s.act(provider(s), r.id, { action: "decline", message: "No availability this week." }).status, "declined");
    assert.equal(s.ledger(owner(s)).length, 0);
  } finally { s.db.close(); }
});
test("provider application needs review, rejects forged claims and enforces listing ownership", async () => {
  const s = make(); try { const p = await other(s, "provider"), p2 = await other(s, "provider");
    const listing = s.apply(p, { name: "Synthetic Support", category: "cleaning", summary: "A synthetic service for testing.", description: "A synthetic description for testing publication access.", suburbs: "Richmond, Hawthorn", mode: "At home", price: "From $100", availability: "Enquire about weekdays", included: "A synthetic clean", consent: true, status: "published", demo: false, feeBps: 9999 });
    assert.equal(listing.status, "pending"); assert.equal(listing.demo, true); assert.equal(listing.feeBps, 1000);
    assert.ok(!s.providers().some(p => p.id === listing.id)); assert.throws(() => s.provider(listing.id), /isn’t available/);
    assert.throws(() => s.moderate(owner(s), listing.id, { status: "published" }), /reviewed/);
    s.moderate(owner(s), listing.id, { status: "published", reviewed: true }); assert.ok(s.providers().some(p => p.id === listing.id));
    assert.throws(() => s.updateListing(p2, listing.id, { price: "$1", availability: "Every day" }), /isn’t available/);
    s.updateListing(p, listing.id, { price: "From $110", availability: "Wednesday mornings" }); assert.equal(s.provider(listing.id).price, "From $110");
    s.moderate(owner(s), listing.id, { status: "paused" }); assert.throws(() => s.request(family(s), { ...payload(), providerId: listing.id }), /isn’t available/);
  } finally { s.db.close(); }
});
test("saved providers belong to an account and persist after a database restart", async () => {
  const dir = mkdtempSync(join(tmpdir(), "village-app-")); const path = join(dir, "test.sqlite"); let s;
  try { s = new VillageStore(path, true); s.save(family(s), "kindred-home", true); const f = await other(s); assert.equal(s.saved(f).length, 0); s.db.close(); s = new VillageStore(path, true); assert.equal(s.saved(family(s))[0].id, "kindred-home"); s.save(family(s), "kindred-home", false); assert.equal(s.saved(family(s)).length, 0); }
  finally { s?.db.close(); rmSync(dir, { recursive: true, force: true }); }
});
test("HTTP guards reject cross-origin, unauthorised access, malformed input and production preview sign-in", async () => {
  const s = make(), config = { mode: "preview" }; try {
    const call = (path, body, token, origin) => handleApp(http(path, body, token, origin), path.split("/"), () => s, config);
    assert.equal((await call("preview", { role: "owner" }, undefined, "https://attacker.test")).status, 403);
    assert.equal((await call("requests")).status, 401);
    assert.equal((await call("preview", { role: "root" })).status, 403);
    const preview = await call("preview", { role: "family" }); assert.equal(preview.status, 200); const cookie = preview.headers.get("set-cookie"); assert.match(cookie, /HttpOnly/); assert.match(cookie, /SameSite=Lax/); assert.match(preview.headers.get("cache-control"), /no-store/);
    const token = cookie.split(";")[0].split("=")[1]; assert.equal((await call("owner", undefined, token)).status, 403);
    assert.equal((await call("saved", { providerId: "kindred-home", saved: "yes" }, token)).status, 400);
    assert.equal((await call("requests", { ...payload(), message: "x".repeat(22000) }, token)).status, 413);
    const external = new Request("https://public.example.test/api/village/preview", { method: "POST", headers: { origin: "https://public.example.test", "content-type": "application/json" }, body: JSON.stringify({ role: "owner" }) });
    assert.equal((await handleApp(external, ["preview"], () => s, config)).status, 503);
    assert.equal((await handleApp(external, ["preview"], () => s, { mode: "pilot", origin: "https://public.example.test" })).status, 403);
  } finally { s.db.close(); }
});
test("the app, account routes and request IDs never enter page analytics", () => {
  for (const path of ["/app", "/app/requests/private-id", "/app/sign-in?email=private", "/api/village/session"]) assert.equal(analyticsPageUrl(`https://village.test${path}`), null);
});
