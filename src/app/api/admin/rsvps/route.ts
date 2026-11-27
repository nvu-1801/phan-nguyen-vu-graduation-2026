import { hasAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const pageSize = 50;

export async function GET(request: Request) {
  if (!hasAdminSession(request)) return Response.json({ error: "Cần đăng nhập để xem xác nhận tham dự." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  const params = new URL(request.url).searchParams;
  const cursor = params.get("cursor");
  const consent = params.get("consent") || "all";
  const attendance = params.get("attendance") || "all";
  if (cursor !== null && (!/^\d{1,15}$/.test(cursor) || Number(cursor) < 1)) {
    return Response.json({ error: "Trang dữ liệu chưa hợp lệ." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  if (!(["all", "public", "private"] as const).includes(consent as "all" | "public" | "private")) {
    return Response.json({ error: "Bộ lọc quyền riêng tư chưa hợp lệ." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  if (!(["all", "yes", "no"] as const).includes(attendance as "all" | "yes" | "no")) {
    return Response.json({ error: "Bộ lọc tham dự chưa hợp lệ." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const conditions: string[] = [];
    const args: (string | number)[] = [];
    if (consent !== "all") { conditions.push("r.public_consent = ?"); args.push(consent === "public" ? 1 : 0); }
    if (attendance !== "all") { conditions.push("r.attendance = ?"); args.push(attendance); }
    if (cursor) { conditions.push("r.rowid < ?"); args.push(Number(cursor)); }
    const result = await getDb().batch([
      {
        sql: `SELECT r.rowid AS row_id, r.id, r.guest_name AS name, r.attendance, COALESCE(r.message, w.message) AS message, r.public_consent, r.created_at FROM rsvps r LEFT JOIN wishes w ON w.entry_id = r.entry_id${conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""} ORDER BY r.rowid DESC LIMIT ?`,
        args: [...args, pageSize + 1],
      },
      { sql: "SELECT attendance, COUNT(*) AS amount FROM rsvps GROUP BY attendance", args: [] },
    ], "read");
    const rows = result[0].rows.slice(0, pageSize);
    const counts = { yes: 0, no: 0 };
    for (const row of result[1].rows) {
      if (row.attendance === "yes") counts.yes = Number(row.amount);
      if (row.attendance === "no") counts.no = Number(row.amount);
    }
    return Response.json({
      items: rows.map(row => ({
        id: row.id,
        name: row.name,
        attendance: row.attendance,
        message: row.message,
        publicConsent: Number(row.public_consent) === 1,
        createdAt: row.created_at,
      })),
      counts,
      nextCursor: result[0].rows.length > pageSize ? String(rows.at(-1)?.row_id) : null,
    }, { headers: { "Cache-Control": "no-store, private", "Vary": "Cookie" } });
  } catch {
    return Response.json({ error: "Chưa tải được xác nhận tham dự. Bạn thử lại sau nhé." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
