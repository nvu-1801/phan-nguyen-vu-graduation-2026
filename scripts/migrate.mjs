import { createClient } from "@libsql/client";
import { mkdir, readdir, readFile } from "node:fs/promises";
import { dirname } from "node:path";

const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || (process.env.VERCEL ? "" : "file:./data/graduation.db");
const authToken = (process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN);
if (!url || (!url.startsWith("file:") && !authToken) || (process.env.VERCEL && url.startsWith("file:"))) {
  throw new Error("A valid migration database and remote credentials are required.");
}
if (url.startsWith("file:")) await mkdir(dirname(url.slice(5)), { recursive: true });
const db = createClient({ url, authToken });
try {
  await db.execute("CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY)");
  const directory = new URL("../db/migrations/", import.meta.url);
  const files = (await readdir(directory)).filter(file => /^\d{4}_.+\.sql$/.test(file)).sort();
  for (const file of files) {
    const version = Number(file.slice(0, 4));
    const tx = await db.transaction("write");
    try {
      const applied = await tx.execute({ sql: "SELECT version FROM schema_migrations WHERE version = ?", args: [version] });
      if (applied.rows.length === 0) {
        const sql = await readFile(new URL(file, directory), "utf8");
        for (const statement of sql.split(";").map(part => part.trim()).filter(Boolean)) await tx.execute(statement);
        await tx.execute({ sql: "INSERT INTO schema_migrations (version) VALUES (?)", args: [version] });
      }
      await tx.commit();
    } finally {
      tx.close();
    }
  }
  console.log("Graduation schema is up to date.");
} finally {
  db.close();
}
