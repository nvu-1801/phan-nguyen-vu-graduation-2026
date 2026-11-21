import { createClient, type Client } from "@libsql/client";

let client: Client | undefined;

function remoteCredentials() {
  return {
    url: process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN,
  };
}

export function databaseConfigured() {
  if (!process.env.VERCEL) return true;
  const { url, authToken } = remoteCredentials();
  return Boolean(url && /^(libsql|https):\/\//.test(url) && authToken && process.env.RATE_LIMIT_SECRET);
}

export function getDb() {
  if (client) return client;
  const { url, authToken } = remoteCredentials();
  if (!databaseConfigured()) {
    throw new Error("Database configuration is missing");
  }
  client = createClient({ url: url || "file:./data/graduation.db", authToken, intMode: "number" });
  return client;
}
