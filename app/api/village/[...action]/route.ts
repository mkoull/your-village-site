import { resolve } from "node:path";
import { VillageStore } from "@/lib/app-store";
import { handleApp } from "@/lib/app-api";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const globalStore = globalThis as typeof globalThis & { villageAppStore?: VillageStore };
async function handle(request: Request, context: { params: Promise<{ action: string[] }> }) {
  // Preview sign-in and SQLite are deliberately unavailable on ephemeral Vercel deployments.
  const configured = process.env.VILLAGE_APP_MODE;
  const mode = process.env.VERCEL ? "off" : configured === "preview" || configured === "pilot" ? configured : "off";
  const path = mode === "preview" ? resolve(process.cwd(), ".village-data", "preview.sqlite") : process.env.VILLAGE_DB_PATH;
  return handleApp(request, (await context.params).action, () => {
    if (!path) throw new Error("Database path missing");
    if (!globalStore.villageAppStore) globalStore.villageAppStore = new VillageStore(path, mode === "preview");
    return globalStore.villageAppStore;
  }, { mode, origin: process.env.VILLAGE_APP_ORIGIN });
}
export const GET = handle;
export const POST = handle;
