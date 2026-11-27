import { createClient } from "@libsql/client";

if (!process.argv.includes("--yes")) {
  console.error("Refusing to delete every RSVP and wish without --yes.");
  console.error("Usage: node scripts/clear-data.mjs --yes");
  process.exit(1);
}
if (process.env.VERCEL) {
  console.error("This command only targets a self-hosted database.");
  process.exit(1);
}
const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;
if (!url) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}
if (!url.startsWith("file:") && !authToken) {
  console.error("A remote database needs DATABASE_AUTH_TOKEN.");
  process.exit(1);
}

const db = createClient({ url, authToken });
try {
  const before = await db.batch([
    "SELECT COUNT(*) AS n FROM rsvps",
    "SELECT COUNT(*) AS n FROM wishes",
    "SELECT COUNT(*) AS n FROM rate_limits",
  ], "read");
  console.log(`Before: ${before[0].rows[0].n} RSVPs, ${before[1].rows[0].n} wishes, ${before[2].rows[0].n} rate-limit buckets`);
  const result = await db.batch(["DELETE FROM wishes", "DELETE FROM rsvps", "DELETE FROM rate_limits"], "write");
  const after = await db.batch([
    "SELECT COUNT(*) AS n FROM rsvps",
    "SELECT COUNT(*) AS n FROM wishes",
    "SELECT COUNT(*) AS n FROM rate_limits",
  ], "read");
  console.log(`Deleted rows: ${result.map(step => step.rowsAffected).join(", ")}`);
  console.log(`After: ${after[0].rows[0].n} RSVPs, ${after[1].rows[0].n} wishes, ${after[2].rows[0].n} rate-limit buckets`);
  console.log("Cleared rsvps, wishes and rate limits.");
} finally {
  db.close();
}
