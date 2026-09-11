import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", process.env.PORT || "3101"], { stdio: "inherit", windowsHide: true, env: { ...process.env, VILLAGE_APP_MODE: "preview", VILLAGE_APP_ORIGIN: "" } });
child.on("exit", code => process.exit(code || 0));
