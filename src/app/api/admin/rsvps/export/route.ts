import { hasAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const maxRows = 10000;

function csvCell(value: string) {
  // Spreadsheet apps execute cells starting with these characters as formulas.
  let text = /^[=+\-@\t]/.test(value) ? `'${value}` : value;
  text = text.replace(/\r\n?/g, "\n");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return Response.json({ error: "Cần đăng nhập để xuất xác nhận tham dự." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const params = new URL(request.url).searchParams;
  const consent = params.get("consent") || "all";
  const attendance = params.get("attendance") || "all";
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
    const result = await getDb().execute({
      sql: `SELECT r.guest_name AS name, r.attendance, COALESCE(r.message, w.message) AS message, r.public_consent, r.created_at FROM rsvps r LEFT JOIN wishes w ON w.entry_id = r.entry_id${conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""} ORDER BY r.guest_name COLLATE NOCASE, r.rowid LIMIT ?`,
      args: [...args, maxRows],
    });
    const lines = ["Tên,Tham dự,Lời nhắn,Đồng ý công khai,Thời gian gửi"];
    for (const row of result.rows) {
      lines.push([
        String(row.name ?? ""),
        row.attendance === "yes" ? "Sẽ đến" : "Chưa thể đến",
        String(row.message ?? ""),
        Number(row.public_consent) === 1 ? "Có" : "Không",
        String(row.created_at ?? ""),
      ].map(csvCell).join(","));
    }
    const filename = `xac-nhan-${new Date().toISOString().slice(0, 10)}.csv`;
    return new Response(`\uFEFF${lines.join("\r\n")}\r\n`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, private",
        "Vary": "Cookie",
      },
    });
  } catch {
    return Response.json({ error: "Chưa xuất được danh sách. Bạn thử lại sau nhé." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
