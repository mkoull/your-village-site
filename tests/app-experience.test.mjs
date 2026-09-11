import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { VillageStore } from "../lib/app-store.ts";
import { handleApp } from "../lib/app-api.ts";
import {
  filterProviders,
  needsAction,
  nextStep,
  safeAppPath,
  supportReturnPath,
} from "../lib/app-experience.ts";
const make = () => new VillageStore(":memory:", true);
const payload = () => ({
  providerId: "kindred-home",
  suburb: "Richmond",
  timing: "This week",
  message: "Synthetic support request to exercise the inbox.",
  consent: true,
  key: randomUUID(),
});
const offer = {
  action: "offer",
  quoteCents: 14000,
  arrangement: "Tuesday, 10am. A two-hour cleaning visit.",
  message: "A synthetic offer for the family to review.",
};
test("unread updates belong to the viewer and only displayed messages are acknowledged", () => {
  const s = make();
  try {
    const f = s.user("preview-family"),
      p = s.user("preview-provider");
    const r = s.request(f, payload());
    assert.equal(s.getRequest(f, r.id).unreadCount, 0);
    assert.equal(s.getRequest(p, r.id).unreadCount, 1);
    const initial = s.getRequest(p, r.id).events.at(-1).id;
    s.markRead(p, r.id, initial);
    assert.equal(s.getRequest(p, r.id).unreadCount, 0);
    s.act(f, r.id, {
      action: "message",
      message: "An extra question from the family.",
    });
    s.markRead(p, r.id, initial);
    assert.equal(
      s.getRequest(p, r.id).unreadCount,
      1,
      "a reply arriving after a screen was read stays unread",
    );
    const newest = s.getRequest(p, r.id).events.at(-1).id;
    s.markRead(p, r.id, newest);
    s.markRead(p, r.id, initial);
    assert.equal(
      s.getRequest(p, r.id).unreadCount,
      0,
      "an older tab cannot move the read position backwards",
    );
    s.act(p, r.id, offer);
    assert.equal(s.getRequest(f, r.id).unreadCount, 1);
    assert.equal(s.getRequest(p, r.id).unreadCount, 0);
  } finally {
    s.db.close();
  }
});
test("read acknowledgements reject another account, request and cross-origin caller", async () => {
  const s = make();
  try {
    const f = s.user("preview-family"),
      p = s.user("preview-provider");
    const other = await s.register({
      name: f.name,
      email: "same-name@example.test",
      password: "test-passphrase-for-a-family",
      role: "family",
      consent: true,
    });
    const r = s.request(other, payload());
    assert.throws(() => s.markRead(f, r.id, r.events[0].id), /isn’t available/);
    assert.equal(
      s.getRequest(p, r.id).unreadCount,
      1,
      "identity does not depend on the displayed name",
    );
    const own = s.request(f, payload());
    assert.throws(() => s.markRead(p, own.id, r.events[0].id), /isn’t part/);
    const token = s.createSession(p);
    const path = ["requests", own.id, "read"];
    const request = new Request(
      "http://127.0.0.1:3101/api/village/" + path.join("/"),
      {
        method: "POST",
        headers: {
          origin: "https://example.test",
          "content-type": "application/json",
          cookie: "village_session=" + token,
        },
        body: JSON.stringify({ eventId: own.events[0].id }),
      },
    );
    assert.equal(
      (await handleApp(request, path, () => s, { mode: "preview" })).status,
      403,
    );
    assert.equal(s.getRequest(p, own.id).unreadCount, 1);
  } finally {
    s.db.close();
  }
});
test("the additive inbox migration retains legacy messages and survives a restart", () => {
  const dir = mkdtempSync(join(tmpdir(), "village-inbox-")),
    path = join(dir, "migration.sqlite");
  let s;
  try {
    const db = new DatabaseSync(path);
    db.exec(
      "CREATE TABLE events (id TEXT PRIMARY KEY,request_id TEXT NOT NULL,author TEXT NOT NULL,message TEXT NOT NULL,created_at TEXT NOT NULL); INSERT INTO events VALUES ('legacy','old-request','Legacy Person','Existing conversation','2026-09-01')",
    );
    db.close();
    s = new VillageStore(path, true);
    assert.equal(
      s.one("SELECT message FROM events WHERE id='legacy'").message,
      "Existing conversation",
    );
    assert.ok(
      s.all("PRAGMA table_info(events)").some((c) => c.name === "author_id"),
    );
    const p = s.user("preview-provider"),
      r = s.request(s.user("preview-family"), payload());
    s.markRead(p, r.id, r.events[0].id);
    s.db.close();
    s = new VillageStore(path, true);
    assert.equal(s.getRequest(p, r.id).unreadCount, 0);
  } finally {
    s?.db.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
test("saved paused profiles remain readable without allowing new requests or exposing applications", async () => {
  const s = make();
  try {
    const f = s.user("preview-family"),
      owner = s.user("preview-owner");
    s.save(f, "kindred-home", true);
    s.moderate(owner, "kindred-home", { status: "paused" });
    assert.equal(s.provider("kindred-home", f).status, "paused");
    assert.throws(() => s.provider("kindred-home"), /isn’t available/);
    assert.throws(() => s.request(f, payload()), /isn’t available/);
    s.save(f, "kindred-home", false);
    assert.throws(() => s.provider("kindred-home", f), /isn’t available/);
  } finally {
    s.db.close();
  }
});
test("free support can be arranged without a payment claim or referral", () => {
  const s = make();
  try {
    const f = s.user("preview-family"),
      p = s.user("preview-provider");
    const r = s.request(f, payload());
    s.act(p, r.id, { ...offer, quoteCents: 0 });
    s.act(f, r.id, {
      action: "accept",
      quoteCents: 0,
      arrangement: offer.arrangement,
    });
    s.act(p, r.id, { action: "delivered", paid: true });
    const completed = s.act(f, r.id, { action: "complete", paid: true });
    assert.equal(completed.feeCents, null);
    assert.match(completed.events.at(-1).message, /No payment was required/);
  } finally {
    s.db.close();
  }
});
test("provider search understands service needs, extra whitespace and online coverage", () => {
  const s = make();
  try {
    const all = s.providers();
    assert.ok(
      filterProviders(all, "", "", "  meals  ").some(
        (p) => p.category === "food",
      ),
    );
    assert.ok(
      filterProviders(all, "", "", "nanny").some(
        (p) => p.category === "postpartum-carers",
      ),
    );
    assert.ok(
      filterProviders(all, "", "Richmond", "clean").some(
        (p) => p.category === "cleaning",
      ),
    );
    assert.deepEqual(filterProviders(all, "food", "", "cleaning"), []);
    assert.ok(
      filterProviders(all, "", "Unlisted suburb", "").every(
        (p) => p.mode === "Online",
      ),
    );
  } finally {
    s.db.close();
  }
});
test("next steps and return links preserve intent without leaving the app", () => {
  const r = { status: "offered", unreadCount: 0 };
  assert.equal(needsAction(r, "family"), true);
  assert.equal(needsAction(r, "provider"), false);
  assert.equal(nextStep(r, "provider"), "Waiting for the family");
  assert.equal(
    needsAction({ status: "confirmed", unreadCount: 1 }, "family"),
    true,
  );
  assert.equal(
    safeAppPath("/app/providers/kindred-home?from=%2Fapp%2Fexplore"),
    "/app/providers/kindred-home?from=%2Fapp%2Fexplore",
  );
  for (const path of [
    "https://attacker.test/app",
    "//attacker.test/app",
    "/app/../../outside",
    "/app\\attacker",
    "/application",
    "/app/sign-in",
  ])
    assert.equal(safeAppPath(path), "/app");
  assert.equal(
    supportReturnPath("/app/explore?category=cleaning&area=Richmond"),
    "/app/explore?category=cleaning&area=Richmond",
  );
  assert.equal(supportReturnPath("/app/owner"), "/app/owner");
  assert.equal(supportReturnPath("/app/requests/123"), "/app/requests/123");
  assert.equal(supportReturnPath("/app/sign-in"), "/app/explore");
});
