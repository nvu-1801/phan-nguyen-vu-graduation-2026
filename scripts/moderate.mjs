import { createClient } from "@libsql/client";

const [action, id] = process.argv.slice(2);
if (!["pending", "approve", "reject", "cleanup"].includes(action) ||
    (["approve", "reject"].includes(action) && !/^[0-9a-f-]{36}$/i.test(id || ""))) {
  throw new Error("Usage: npm run moderate -- pending | approve <id> | reject <id> | cleanup");
}
const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || "file:./data/graduation.db";
if (!url.startsWith("file:") && !(process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN)) throw new Error("A remote auth token is required.");
const db = createClient({ url, authToken: (process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN) });
try {
  if (action === "pending") {
    const result = await db.execute("SELECT id, guest_name, message, public_consent, created_at FROM wishes WHERE status='pending' ORDER BY created_at, id");
    console.log(JSON.stringify(result.rows, null, 2));
  } else if (action === "cleanup") {
    const result = await db.execute({ sql: "DELETE FROM rate_limits WHERE expires_at <= ?", args: [Math.floor(Date.now() / 1000)] });
    console.log("Expired buckets removed:", result.rowsAffected);
  } else {
    const status = action === "approve" ? "approved" : "rejected";
    const result = await db.execute({ sql: "UPDATE wishes SET status = ? WHERE id = ?", args: [status, id] });
    if (!result.rowsAffected) throw new Error("Wish not found.");
    console.log("Wish updated.");
  }
} finally {
  db.close();
}
