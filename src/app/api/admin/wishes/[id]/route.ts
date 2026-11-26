import { randomUUID } from "node:crypto";
import { z } from "zod";
import { hasAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxBytes = 2048;
const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const bodySchema = z.strictObject({ action: z.enum(["approve", "reject"]) });

const headers = { "Cache-Control": "no-store, private", "Vary": "Cookie" };

function noStore(status: number, error: string) {
  return Response.json({ error }, { status, headers });
}

async function readAction(request: Request) {
  if (!/^application\/json\b/i.test(request.headers.get("content-type") || "")) {
    throw new Error("Nội dung gửi cần ở dạng JSON.");
  }
  if (Number(request.headers.get("content-length")) > maxBytes || !request.body) {
    throw new Error("Nội dung gửi không hợp lệ.");
  }
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0;
  let body = "";
  try {
    for (;;) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > maxBytes) throw new Error("Nội dung gửi quá dài.");
      body += decoder.decode(part.value, { stream: true });
    }
    return JSON.parse(body + decoder.decode()) as unknown;
  } catch {
    throw new Error("Nội dung gửi không hợp lệ.");
  } finally {
    reader.releaseLock();
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  const protocol = process.env.VERCEL ? "https:" : url.protocol;
  const expectedOrigin = process.env.SITE_ORIGIN || `${protocol}//${request.headers.get("host") || url.host}`;
  if (!origin || origin !== expectedOrigin) return noStore(403, "Nguồn gửi không hợp lệ.");

  if (!hasAdminSession(request)) return noStore(401, "Cần đăng nhập để duyệt lời chúc.");

  const { id } = await context.params;
  if (!idPattern.test(id)) return noStore(400, "Lời chúc chưa hợp lệ.");

  let action: "approve" | "reject";
  try {
    const parsed = bodySchema.safeParse(await readAction(request));
    if (!parsed.success) return noStore(400, "Thao tác chưa hợp lệ.");
    action = parsed.data.action;
  } catch (error) {
    return noStore(400, error instanceof Error ? error.message : "Nội dung gửi không hợp lệ.");
  }

  const status = action === "approve" ? "approved" : "rejected";
  const moderatedAt = new Date().toISOString();
  const requestId = randomUUID();
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "UPDATE wishes SET status = ?, moderated_at = ?, moderated_by = 'admin' WHERE id = ? AND status = 'pending'",
      args: [status, moderatedAt, id],
    });
    if (!result.rowsAffected) {
      const existing = await db.execute({ sql: "SELECT status FROM wishes WHERE id = ?", args: [id] });
      const current = existing.rows[0]?.status;
      return current ? noStore(409, "Lời chúc này đã được xử lý trước đó.") : noStore(404, "Không tìm thấy lời chúc.");
    }
    // Duyệt không tự mở công khai: lời chúc vẫn cần public_consent riêng.
    return Response.json({ id, status, moderatedAt }, { headers });
  } catch {
    console.error("Graduation wish moderation failed", { requestId });
    return Response.json({ error: "Chưa cập nhật được lời chúc. Bạn thử lại sau nhé." }, { status: 503, headers });
  }
}
