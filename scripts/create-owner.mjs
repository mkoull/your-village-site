// Operator-only bootstrap. Read credentials from environment, never command arguments or logs.
import { randomUUID } from "node:crypto";
import { VillageStore, emailField, passwordHash, textField } from "../lib/app-store.ts";
if (process.env.VILLAGE_APP_MODE !== "pilot" || !process.env.VILLAGE_DB_PATH || process.env.VERCEL) throw new Error("Configure a persistent pilot database before creating its owner.");
const name = textField(process.env.VILLAGE_OWNER_NAME, "the owner name", 2, 80);
const email = emailField(process.env.VILLAGE_OWNER_EMAIL);
const digest = await passwordHash(process.env.VILLAGE_OWNER_PASSWORD);
const store = new VillageStore(process.env.VILLAGE_DB_PATH);
try {
  if (store.one("SELECT id FROM users WHERE role='owner' OR email=?", email)) throw new Error("An owner or that email already exists; no account was changed.");
  store.db.prepare("INSERT INTO users VALUES (?,?,?,?,?)").run(randomUUID(), name, email, digest, "owner");
  console.log("Owner account created. Clear the bootstrap credential environment variables before starting the server.");
} finally { store.db.close(); }
