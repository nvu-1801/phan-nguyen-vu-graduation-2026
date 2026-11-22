import { databaseConfigured, getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  if (!databaseConfigured()) {
    return Response.json({ status: "unavailable", reason: "not_configured" }, { status: 503, headers });
  }
  try {
    const result = await getDb().execute("SELECT MAX(version) AS version FROM schema_migrations");
    const version = Number(result.rows[0]?.version ?? 0);
    if (!Number.isInteger(version) || version < 2) {
      return Response.json({ status: "unavailable", reason: "migration_required" }, { status: 503, headers });
    }
    return Response.json({ status: "ok" }, { headers });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503, headers });
  }
}
