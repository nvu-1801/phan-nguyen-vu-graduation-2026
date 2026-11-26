import { hasAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const pageSize = 50;

export async function GET(request: Request) {
  if (!hasAdminSession(request)) return Response.json({ error: "Cần đăng nhập để xem lời chúc." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  const params = new URL(request.url).searchParams;
  const cursor = params.get("cursor");
  const status = params.get("status") || "all";
  const visibility = params.get("visibility") || "all";
  if (cursor !== null && (!/^\d{1,15}$/.test(cursor) || Number(cursor) < 1)) {
    return Response.json({ error: "Trang dữ liệu chưa hợp lệ." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  if (!(["all", "pending", "approved", "rejected"] as const).includes(status as "all" | "pending" | "approved" | "rejected")) {
    return Response.json({ error: "Bộ lọc chưa hợp lệ." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  if (!(["all", "public", "private"] as const).includes(visibility as "all" | "public" | "private")) {
    return Response.json({ error: "Bộ lọc quyền riêng tư chưa hợp lệ." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const conditions: string[] = [];
    const args: (string | number)[] = [];
    if (status !== "all") { conditions.push("status = ?"); args.push(status); }
    if (visibility !== "all") { conditions.push("public_consent = ?"); args.push(visibility === "public" ? 1 : 0); }
    if (cursor) { conditions.push("rowid < ?"); args.push(Number(cursor)); }
    const result = await getDb().execute({
      sql: `SELECT rowid AS row_id, id, guest_name AS name, message, public_consent, status, created_at, moderated_at FROM wishes${conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""} ORDER BY rowid DESC LIMIT ?`,
      args: [...args, pageSize + 1],
    });
    const rows = result.rows.slice(0, pageSize);
    return Response.json({
      items: rows.map(row => ({ id: row.id, name: row.name, message: row.message, publicConsent: Number(row.public_consent) === 1, status: row.status, createdAt: row.created_at, moderatedAt: row.moderated_at ?? null })),
      nextCursor: result.rows.length > pageSize ? String(rows.at(-1)?.row_id) : null,
    }, { headers: { "Cache-Control": "no-store, private", "Vary": "Cookie" } });
  } catch {
    return Response.json({ error: "Chưa tải được lời chúc. Bạn thử lại sau nhé." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
