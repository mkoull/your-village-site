// Server-only persistence boundary. Never import this module from a client component.
import { DatabaseSync } from "node:sqlite";
import {
  randomBytes,
  randomUUID,
  createHash,
  scrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { mkdirSync } from "node:fs";
import { dirname, isAbsolute } from "node:path";
import { previewProviders } from "../content/preview-providers.ts";
import { services } from "../content/services.ts";
import type {
  AppUser,
  Listing,
  RequestStatus,
  SupportRequest,
} from "./app-types.ts";

type Row = Record<string, string | number | null>;
const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const derive = promisify(scrypt);
const now = () => new Date().toISOString();
const categories = services.map((service) => service.slug);
export class AppError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
function fail(message: string, status = 400): never {
  throw new AppError(message, status);
}
export function textField(
  input: unknown,
  label: string,
  min = 1,
  max = 500,
): string {
  if (
    typeof input !== "string" ||
    input.trim().length < min ||
    input.trim().length > max
  )
    fail(`Enter ${label} (${min}–${max} characters).`);
  return input.trim();
}
export function emailField(input: unknown) {
  const email = textField(input, "a valid email", 3, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fail("Enter a valid email address.");
  return email;
}
export async function passwordHash(password: unknown) {
  const value = textField(password, "a password", 12, 128);
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${((await derive(value, salt, 64)) as Buffer).toString("hex")}`;
}
async function passwordMatches(password: string, stored: string) {
  const [salt, digest] = stored.split(":");
  const actual = (await derive(password, salt, 64)) as Buffer;
  return timingSafeEqual(actual, Buffer.from(digest, "hex"));
}
export class VillageStore {
  db: DatabaseSync;
  preview: boolean;
  constructor(path: string, preview = false) {
    if (path !== ":memory:") {
      if (!isAbsolute(path))
        fail("The app needs an absolute database path.", 503);
      mkdirSync(dirname(path), { recursive: true });
    }
    this.preview = preview;
    this.db = new DatabaseSync(path);
    this.db
      .exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS providers (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id), status TEXT NOT NULL, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS saves (user_id TEXT NOT NULL REFERENCES users(id), provider_id TEXT NOT NULL REFERENCES providers(id), PRIMARY KEY(user_id,provider_id));
      CREATE TABLE IF NOT EXISTS requests (id TEXT PRIMARY KEY, family_id TEXT NOT NULL REFERENCES users(id), provider_id TEXT NOT NULL REFERENCES providers(id), status TEXT NOT NULL, data TEXT NOT NULL, request_key TEXT NOT NULL, fingerprint TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, quote INTEGER, arrangement TEXT, fee_bps INTEGER NOT NULL, fee_cap INTEGER NOT NULL, UNIQUE(family_id,request_key));
      CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, request_id TEXT NOT NULL REFERENCES requests(id), author TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS referrals (request_id TEXT PRIMARY KEY REFERENCES requests(id), family_id TEXT NOT NULL, provider_id TEXT NOT NULL, amount INTEGER NOT NULL, state TEXT NOT NULL DEFAULT 'unbilled', UNIQUE(family_id,provider_id));
      CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, until INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS request_family ON requests(family_id,created_at);
      CREATE INDEX IF NOT EXISTS request_provider ON requests(provider_id,created_at);
      CREATE INDEX IF NOT EXISTS event_request ON events(request_id,created_at);`);
    // Additive migration: old conversations remain intact and visible.
    if (
      !this.all("PRAGMA table_info(events)").some(
        (column) => column.name === "author_id",
      )
    ) {
      this.db.exec("ALTER TABLE events ADD COLUMN author_id TEXT");
    }
    this.db.exec(
      "CREATE TABLE IF NOT EXISTS request_reads (user_id TEXT NOT NULL REFERENCES users(id), request_id TEXT NOT NULL REFERENCES requests(id), event_id TEXT NOT NULL REFERENCES events(id), PRIMARY KEY(user_id,request_id))",
    );
    const mode = this.one("SELECT value FROM settings WHERE key='mode'");
    if (mode && mode.value !== (preview ? "preview" : "pilot"))
      fail("Use a separate database for preview and pilot data.", 503);
    this.db
      .prepare("INSERT OR IGNORE INTO settings VALUES ('mode',?)")
      .run(preview ? "preview" : "pilot");
    if (preview) this.seed();
  }
  one(sql: string, ...args: (string | number | null)[]): Row | undefined {
    return this.db.prepare(sql).get(...args) as Row | undefined;
  }
  all(sql: string, ...args: (string | number | null)[]): Row[] {
    return this.db.prepare(sql).all(...args) as Row[];
  }
  tx<T>(fn: () => T): T {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const result = fn();
      this.db.exec("COMMIT");
      return result;
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  seed() {
    if (this.one("SELECT value FROM settings WHERE key='seed'")) return;
    this.tx(() => {
      for (const role of ["family", "provider", "owner"])
        this.db
          .prepare("INSERT INTO users VALUES (?,?,?,?,?)")
          .run(
            `preview-${role}`,
            role === "family"
              ? "Alex"
              : role === "provider"
                ? "Example provider team"
                : "Village owner",
            `${role}@preview.example.test`,
            "preview-only",
            role,
          );
      for (const example of previewProviders) {
        const listing: Listing = {
          ...example,
          suburbs: [...example.suburbs],
          included: [...example.included],
          status: "published",
          demo: true,
          updatedAt: now(),
          feeBps: 1000,
          feeCap: 5000,
        };
        this.db
          .prepare("INSERT INTO providers VALUES (?,?,?,?)")
          .run(
            listing.id,
            "preview-provider",
            listing.status,
            JSON.stringify(listing),
          );
      }
      this.db.prepare("INSERT INTO settings VALUES ('seed','1')").run();
    });
  }
  rateLimit(key: string, max = 15, window = 900000) {
    const time = Date.now();
    this.db.prepare("DELETE FROM limits WHERE until < ?").run(time);
    const result = this.one(
      "INSERT INTO limits VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
      hash(key),
      time + window,
    );
    if (Number(result?.count) > max)
      fail("Too many attempts. Please try again in a little while.", 429);
  }
  async register(input: Record<string, unknown>) {
    const name = textField(input.name, "your name", 2, 80),
      email = emailField(input.email);
    if (input.consent !== true)
      fail("Please accept the account privacy notice.");
    if (input.role !== "family" && input.role !== "provider")
      fail("Choose a family or provider account.");
    const password = await passwordHash(input.password);
    if (this.one("SELECT id FROM users WHERE email=?", email))
      fail(
        "An account could not be created with these details. Try signing in.",
        409,
      );
    const user: AppUser = { id: randomUUID(), name, email, role: input.role };
    this.db
      .prepare("INSERT INTO users VALUES (?,?,?,?,?)")
      .run(user.id, name, email, password, user.role);
    return user;
  }
  async login(input: Record<string, unknown>) {
    const email = emailField(input.email),
      password = textField(input.password, "your password", 1, 128);
    const row = this.one("SELECT * FROM users WHERE email=?", email);
    // A full derivation even for missing/demo accounts keeps failure timing comparable.
    const digest =
      row && row.password !== "preview-only"
        ? String(row.password)
        : `${"0".repeat(32)}:${"0".repeat(128)}`;
    const matches = await passwordMatches(password, digest);
    if (!row || !matches)
      fail("The email or password isn’t right. Please try again.", 401);
    return this.user(String(row.id))!;
  }
  user(id: string): AppUser | undefined {
    return this.one("SELECT id,name,email,role FROM users WHERE id=?", id) as
      | AppUser
      | undefined;
  }
  session(token: string | undefined): AppUser | undefined {
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return;
    const row = this.one(
      "SELECT user_id FROM sessions WHERE token=? AND expires>?",
      hash(token),
      Date.now(),
    );
    return row ? this.user(String(row.user_id)) : undefined;
  }
  createSession(user: AppUser) {
    this.db.prepare("DELETE FROM sessions WHERE expires<?").run(Date.now());
    const token = randomBytes(32).toString("hex");
    this.db
      .prepare("INSERT INTO sessions VALUES (?,?,?)")
      .run(hash(token), user.id, Date.now() + 30 * 86400000);
    return token;
  }
  logout(token: string | undefined) {
    if (token)
      this.db.prepare("DELETE FROM sessions WHERE token=?").run(hash(token));
  }
  require(user: AppUser | undefined, role?: AppUser["role"]): AppUser {
    if (!user) fail("Sign in to continue.", 401);
    if (role && user.role !== role)
      fail("This area is for a different account type.", 403);
    return user;
  }
  providers(user?: AppUser) {
    const rows =
      user?.role === "owner"
        ? this.all("SELECT data FROM providers")
        : user?.role === "provider"
          ? this.all("SELECT data FROM providers WHERE owner_id=?", user.id)
          : this.all("SELECT data FROM providers WHERE status='published'");
    return rows.map((row) => JSON.parse(String(row.data)) as Listing);
  }
  provider(id: string, user?: AppUser): Listing {
    const row = this.one("SELECT * FROM providers WHERE id=?", id);
    const knownPaused =
      row?.status === "paused" &&
      user?.role === "family" &&
      (this.one(
        "SELECT 1 FROM saves WHERE user_id=? AND provider_id=?",
        user.id,
        id,
      ) ||
        this.one(
          "SELECT 1 FROM requests WHERE family_id=? AND provider_id=?",
          user.id,
          id,
        ));
    if (
      !row ||
      (row.status !== "published" &&
        !knownPaused &&
        user?.role !== "owner" &&
        row.owner_id !== user?.id)
    )
      fail("That provider isn’t available here.", 404);
    return JSON.parse(String(row.data));
  }
  save(user: AppUser, id: string, saved: boolean) {
    this.require(user, "family");
    if (saved) {
      this.provider(id);
      this.db
        .prepare("INSERT OR IGNORE INTO saves VALUES (?,?)")
        .run(user.id, id);
    } else
      this.db
        .prepare("DELETE FROM saves WHERE user_id=? AND provider_id=?")
        .run(user.id, id);
  }
  saved(user: AppUser) {
    this.require(user, "family");
    return this.all(
      "SELECT p.data FROM saves s JOIN providers p ON p.id=s.provider_id WHERE s.user_id=?",
      user.id,
    ).map((row) => JSON.parse(String(row.data)) as Listing);
  }
  apply(user: AppUser, input: Record<string, unknown>) {
    this.require(user, "provider");
    if (this.one("SELECT id FROM providers WHERE owner_id=?", user.id))
      fail(
        "Your listing already exists. You can see its status in your provider area.",
        409,
      );
    if (!categories.includes(String(input.category)))
      fail("Choose a support category.");
    if (!["At home", "Delivered", "Online"].includes(String(input.mode)))
      fail("Choose how you offer support.");
    if (input.consent !== true)
      fail(
        "Confirm that you can submit this listing and accept the proposed referral terms.",
      );
    const name = textField(input.name, "your business name", 2, 80);
    const listing: Listing = {
      id: `${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 50)}-${randomBytes(3).toString("hex")}`,
      name,
      category: String(input.category),
      summary: textField(input.summary, "a short introduction", 10, 140),
      description: textField(
        input.description,
        "your service description",
        20,
        1500,
      ),
      suburbs: textField(input.suburbs, "the suburbs you cover", 2, 200)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 20),
      mode: input.mode as Listing["mode"],
      price: textField(input.price, "your pricing", 2, 140),
      availability: textField(
        input.availability,
        "your availability information",
        2,
        180,
      ),
      included: textField(input.included, "what’s included", 5, 600)
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8),
      status: "pending",
      demo: this.preview,
      updatedAt: now(),
      feeBps: 1000,
      feeCap: 5000,
    };
    // Clinical/community listings stay free; no referral commission is agreed for them.
    if (
      ["counselling", "lactation", "sleep", "community"].includes(
        listing.category,
      )
    ) {
      listing.feeBps = 0;
      listing.feeCap = 0;
    }
    this.db
      .prepare("INSERT INTO providers VALUES (?,?,?,?)")
      .run(listing.id, user.id, listing.status, JSON.stringify(listing));
    return listing;
  }
  moderate(user: AppUser, id: string, input: Record<string, unknown>) {
    this.require(user, "owner");
    if (!["published", "paused"].includes(String(input.status)))
      fail("Choose publish or pause.");
    if (input.status === "published" && input.reviewed !== true)
      fail("Confirm that you have reviewed the listing with the provider.");
    const listing = this.provider(id, user);
    listing.status = input.status as Listing["status"];
    listing.updatedAt = now();
    this.db
      .prepare("UPDATE providers SET status=?,data=? WHERE id=?")
      .run(listing.status, JSON.stringify(listing), id);
    return listing;
  }
  updateListing(user: AppUser, id: string, input: Record<string, unknown>) {
    this.require(user, "provider");
    const row = this.one("SELECT owner_id FROM providers WHERE id=?", id);
    if (!row || row.owner_id !== user.id)
      fail("That listing isn’t available in your account.", 404);
    const listing = this.provider(id, user);
    listing.availability = textField(
      input.availability,
      "your availability information",
      2,
      180,
    );
    listing.price = textField(input.price, "your pricing", 2, 140);
    listing.updatedAt = now();
    this.db
      .prepare("UPDATE providers SET data=? WHERE id=?")
      .run(JSON.stringify(listing), id);
    return listing;
  }
  request(user: AppUser, input: Record<string, unknown>) {
    this.require(user, "family");
    const provider = this.provider(
      textField(input.providerId, "a provider", 1, 100),
    );
    if (input.consent !== true)
      fail("Please confirm what you’re sharing with this provider.");
    const key = textField(input.key, "a request reference", 16, 80);
    const data = {
      providerName: provider.name,
      category: provider.category,
      familyName: user.name,
      suburb: textField(input.suburb, "your suburb", 2, 80),
      timing: textField(input.timing, "when you need support", 2, 100),
      message: textField(input.message, "a short request", 10, 1500),
    };
    if (
      provider.mode !== "Online" &&
      !provider.suburbs.some(
        (s) => s.toLowerCase() === data.suburb.toLowerCase(),
      )
    )
      fail("Choose a suburb this provider covers.");
    const fingerprint = hash(
      JSON.stringify({ providerId: provider.id, ...data }),
    );
    return this.tx(() => {
      const existing = this.one(
        "SELECT id,fingerprint FROM requests WHERE family_id=? AND request_key=?",
        user.id,
        key,
      );
      if (existing) {
        if (existing.fingerprint !== fingerprint)
          fail(
            "That request reference has already been used. Refresh and try again.",
            409,
          );
        return this.getRequest(user, String(existing.id));
      }
      const active = this.one(
        "SELECT id FROM requests WHERE family_id=? AND provider_id=? AND status IN ('requested','offered','confirmed','delivered','disputed')",
        user.id,
        provider.id,
      );
      if (active)
        fail(
          "You already have an open request with this provider. Continue it in Requests.",
          409,
        );
      const id = randomUUID(),
        timestamp = now();
      this.db
        .prepare("INSERT INTO requests VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)")
        .run(
          id,
          user.id,
          provider.id,
          "requested",
          JSON.stringify(data),
          key,
          fingerprint,
          timestamp,
          timestamp,
          null,
          null,
          provider.feeBps,
          provider.feeCap,
        );
      this.event(id, user.name, data.message, user.id);
      return this.getRequest(user, id);
    });
  }
  requestRow(user: AppUser, id: string) {
    const row = this.one(
      "SELECT r.*,p.owner_id FROM requests r JOIN providers p ON p.id=r.provider_id WHERE r.id=?",
      id,
    );
    if (
      !row ||
      (user.role !== "owner" &&
        row.family_id !== user.id &&
        row.owner_id !== user.id)
    )
      fail("That request isn’t available in this account.", 404);
    return row;
  }
  getRequest(user: AppUser, id: string): SupportRequest {
    const row = this.requestRow(user, id),
      data = JSON.parse(String(row.data));
    const referral = this.one(
      "SELECT amount,state FROM referrals WHERE request_id=?",
      id,
    );
    return {
      ...data,
      id,
      providerId: String(row.provider_id),
      status: row.status as RequestStatus,
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
      quoteCents: row.quote === null ? null : Number(row.quote),
      arrangement: row.arrangement as string | null,
      feeCents:
        referral && referral.state !== "void" ? Number(referral.amount) : null,
      unreadCount: Number(
        this.one(
          "SELECT COUNT(*) AS count FROM events WHERE request_id=? AND author_id IS NOT NULL AND author_id!=? AND rowid>COALESCE((SELECT e.rowid FROM request_reads rr JOIN events e ON e.id=rr.event_id WHERE rr.user_id=? AND rr.request_id=?),0)",
          id,
          user.id,
          user.id,
          id,
        )?.count || 0,
      ),
      events: this.all(
        "SELECT id,author,author_id AS authorId,message,created_at AS createdAt FROM events WHERE request_id=? ORDER BY rowid",
        id,
      ) as SupportRequest["events"],
    };
  }
  markRead(user: AppUser, id: string, eventId: unknown) {
    this.requestRow(user, id);
    const event = this.one(
      "SELECT rowid FROM events WHERE id=? AND request_id=?",
      textField(eventId, "the viewed message", 1, 100),
      id,
    );
    if (!event) fail("That message isn’t part of this request.", 400);
    // Only acknowledge messages actually displayed; an older tab cannot undo a newer read.
    this.db
      .prepare(
        "INSERT INTO request_reads VALUES (?,?,?) ON CONFLICT(user_id,request_id) DO UPDATE SET event_id=excluded.event_id WHERE (SELECT rowid FROM events WHERE id=request_reads.event_id) < ?",
      )
      .run(user.id, id, String(eventId), Number(event.rowid));
  }
  requests(user: AppUser) {
    const rows =
      user.role === "owner"
        ? this.all("SELECT id FROM requests ORDER BY updated_at DESC LIMIT 200")
        : user.role === "family"
          ? this.all(
              "SELECT id FROM requests WHERE family_id=? ORDER BY updated_at DESC LIMIT 200",
              user.id,
            )
          : this.all(
              "SELECT r.id FROM requests r JOIN providers p ON p.id=r.provider_id WHERE p.owner_id=? ORDER BY r.updated_at DESC LIMIT 200",
              user.id,
            );
    return rows.map((row) => this.getRequest(user, String(row.id)));
  }
  event(id: string, author: string, message: string, authorId: string) {
    this.db
      .prepare(
        "INSERT INTO events (id,request_id,author,message,created_at,author_id) VALUES (?,?,?,?,?,?)",
      )
      .run(randomUUID(), id, author, message, now(), authorId);
  }
  act(user: AppUser, id: string, input: Record<string, unknown>) {
    return this.tx(() => {
      const row = this.requestRow(user, id),
        status = String(row.status),
        action = input.action;
      let next = status,
        message = "";
      const isFamily = user.role === "family" && row.family_id === user.id;
      const isProvider = user.role === "provider" && row.owner_id === user.id;
      const allow = (condition: boolean) => {
        if (!condition)
          fail(
            "This request has changed or that action isn’t available. Refresh to see its current status.",
            409,
          );
      };
      if (action === "message") {
        allow(
          (isFamily || isProvider) &&
            !["cancelled", "declined", "completed"].includes(status),
        );
        message = textField(input.message, "a message", 1, 1500);
      } else if (action === "offer") {
        allow(isProvider && ["requested", "offered"].includes(status));
        const amount = input.quoteCents;
        if (
          typeof amount !== "number" ||
          !Number.isSafeInteger(amount) ||
          amount < 0 ||
          amount > 1000000
        )
          fail("Enter a total quote between $0 and $10,000.");
        const arrangement = textField(
          input.arrangement,
          "the proposed date, time and service",
          10,
          400,
        );
        const note = textField(
          input.message,
          "a reply for the family",
          5,
          1500,
        );
        this.db
          .prepare("UPDATE requests SET quote=?,arrangement=? WHERE id=?")
          .run(amount, arrangement, id);
        next = "offered";
        message = `Offer: AUD ${(amount / 100).toFixed(2)} total. ${arrangement}\n${note}`;
      } else if (action === "accept") {
        allow(isFamily && status === "offered");
        // The family must accept exactly the quote it saw, not a concurrently revised offer.
        allow(
          input.quoteCents === row.quote &&
            input.arrangement === row.arrangement,
        );
        next = "confirmed";
        message =
          row.quote === 0
            ? "The family accepted this free arrangement. No payment is required."
            : "The family accepted this arrangement. Payment is agreed directly with the provider.";
      } else if (action === "decline") {
        allow(isProvider && ["requested", "offered"].includes(status));
        next = "declined";
        message = textField(input.message, "a short explanation", 5, 1000);
      } else if (action === "cancel") {
        allow(
          (isFamily || isProvider) &&
            ["requested", "offered", "confirmed"].includes(status),
        );
        next = "cancelled";
        message = textField(input.message, "a cancellation note", 5, 1000);
      } else if (action === "delivered") {
        allow(isProvider && status === "confirmed" && input.paid === true);
        next = "delivered";
        message =
          row.quote === 0
            ? "The provider marked this free support delivered. The family can now confirm or raise an issue."
            : "The provider marked the support delivered and paid. The family can now confirm or raise an issue.";
      } else if (action === "complete") {
        allow(isFamily && status === "delivered" && input.paid === true);
        next = "completed";
        message =
          row.quote === 0
            ? "The family confirmed that the free support was received. No payment was required."
            : "The family confirmed that support was received and the provider was paid.";
        const fee = Math.min(
          Math.round((Number(row.quote) * Number(row.fee_bps)) / 10000),
          Number(row.fee_cap),
        );
        if (fee > 0)
          this.db
            .prepare(
              "INSERT OR IGNORE INTO referrals (request_id,family_id,provider_id,amount) VALUES (?,?,?,?)",
            )
            .run(id, String(row.family_id), String(row.provider_id), fee);
      } else if (action === "dispute") {
        allow(
          isFamily && ["confirmed", "delivered", "completed"].includes(status),
        );
        next = "disputed";
        message = `Review requested: ${textField(input.message, "what needs a review", 5, 1500)}`;
        this.db
          .prepare("UPDATE referrals SET state='void' WHERE request_id=?")
          .run(id);
      } else if (action === "resolve") {
        allow(user.role === "owner" && status === "disputed");
        next = "cancelled";
        message = `Owner closed this request without a referral fee: ${textField(input.message, "the resolution", 10, 1500)}`;
      } else fail("Choose a valid action.");
      this.db
        .prepare("UPDATE requests SET status=?,updated_at=? WHERE id=?")
        .run(next, now(), id);
      this.event(id, user.name, message, user.id);
      return this.getRequest(user, id);
    });
  }
  ledger(user: AppUser) {
    this.require(user, "owner");
    return this.all(
      "SELECT f.request_id AS requestId,f.amount,f.state,r.data FROM referrals f JOIN requests r ON r.id=f.request_id ORDER BY r.updated_at DESC",
    ).map((row) => ({
      requestId: String(row.requestId),
      amount: Number(row.amount),
      state: String(row.state),
      providerName: JSON.parse(String(row.data)).providerName as string,
    }));
  }
}
