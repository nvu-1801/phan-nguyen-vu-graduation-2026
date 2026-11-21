import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const data = resolve("test-results/fixture");
const file = resolve(data, "graduation.db");
const env = { ...process.env };
if (process.argv.includes("--without-db")) {
  Object.assign(env, { VERCEL: "1", DATABASE_URL: "", DATABASE_AUTH_TOKEN: "", TURSO_DATABASE_URL: "", TURSO_AUTH_TOKEN: "", RATE_LIMIT_SECRET: "" });
} else {
  rmSync(data, { recursive: true, force: true });
  mkdirSync(data, { recursive: true });
  Object.assign(env, { DATABASE_URL: `file:${file}`, DATABASE_AUTH_TOKEN: "", RATE_LIMIT_SECRET: "graduation-e2e-only" });
  delete env.VERCEL;
  if (spawnSync(process.execPath, ["scripts/migrate.mjs"], { env, stdio: "inherit" }).status !== 0) process.exit(1);
}
const app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", process.argv[2]], { env, stdio: "inherit" });
app.on("exit", code => process.exit(code ?? 0));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => app.kill(signal));
