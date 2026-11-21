import { createClient, type Client } from "@libsql/client";

let client: Client | undefined;

export function getDb() {
  if (client) return client;
  const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || (process.env.VERCEL ? "" : "file:./data/graduation.db");
  const authToken = (process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN);
  if (!url || (process.env.VERCEL && (!/^(libsql|https):\/\//.test(url) || !authToken || !process.env.RATE_LIMIT_SECRET))) {
    throw new Error("Database configuration is missing");
  }
  client = createClient({ url, authToken, intMode: "number" });
  return client;
}
