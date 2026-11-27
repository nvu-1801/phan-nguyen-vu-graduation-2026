import { createHash, createHmac, randomUUID } from "node:crypto";
import { z } from "zod";
import { getDb } from "./db";

const common = {
  name: z.string().trim().min(1).max(80),
  publicConsent: z.boolean().default(false),
  website: z.literal("").optional(),
};
const rsvpSchema = z.strictObject({
  ...common,
  attendance: z.enum(["yes", "no"]),
  message: z.string().trim().max(1000).optional(),
});
const wishSchema = z.strictObject({ ...common, message: z.string().trim().min(1).max(1000) });
const maxBytes = 8192;
const windowSeconds = 600;
// Shared venue Wi-Fi puts many guests behind one IP, so the default is higher
// than the strict anti-spam minimum and stays configurable per deployment.
const configuredWriteLimit = Number(process.env.WRITE_LIMIT_PER_10_MIN);
const writeLimit = Number.isInteger(configuredWriteLimit) && configuredWriteLimit >= 1 && configuredWriteLimit <= 100
  ? configuredWriteLimit
  : 30;
const pageSize = 20;
type Kind = "rsvp" | "wish";

class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

function failure(error: unknown, requestId: string) {
  if (error instanceof ApiError) return Response.json({ error: error.message }, { status: error.status });
  console.error("Graduation database request failed", { requestId });
  return Response.json({ error: "Hệ thống đang bận. Bạn thử lại sau nhé.", requestId }, { status: 503 });
}

async function readBody(request: Request) {
  if (!/^application\/json\b/i.test(request.headers.get("content-type") || "")) {
    throw new ApiError(400, "Nội dung gửi cần ở dạng JSON.");
  }
  if (Number(request.headers.get("content-length")) > maxBytes) throw new ApiError(413, "Nội dung gửi quá dài.");
  if (!request.body) throw new ApiError(400, "Thiếu nội dung gửi.");
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0;
  let body = "";
  try {
    for (;;) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new ApiError(413, "Nội dung gửi quá dài.");
      }
      body += decoder.decode(part.value, { stream: true });
    }
    return JSON.parse(body + decoder.decode()) as unknown;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "Nội dung gửi không hợp lệ.");
  } finally {
    reader.releaseLock();
  }
}

function bucketFor(request: Request) {
  const secret = process.env.RATE_LIMIT_SECRET || "graduation-local-development";
  const ip = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    : process.env.TRUST_PROXY === "1" ? request.headers.get("x-real-ip") || "unknown" : "local";
  return createHmac("sha256", secret).update(ip).digest("hex");
}

export async function submit(request: Request, kind: Kind) {
  const requestId = randomUUID();
  try {
    const origin = request.headers.get("origin");
    const url = new URL(request.url);
    const host = request.headers.get("host") || url.host;
    const protocol = process.env.VERCEL ? "https:" : url.protocol;
    const expectedOrigin = process.env.SITE_ORIGIN || `${protocol}//${host}`;
    if (!origin || origin !== expectedOrigin) throw new ApiError(403, "Vui lòng gửi từ trang thiệp mời.");
    const key = request.headers.get("idempotency-key");
    if (!key || !/^[A-Za-z0-9_-]{16,100}$/.test(key)) throw new ApiError(400, "Mã gửi chưa hợp lệ.");
    const raw = await readBody(request);
    const parsed = (kind === "rsvp" ? rsvpSchema : wishSchema).safeParse(raw);
    if (!parsed.success) throw new ApiError(400, "Bạn kiểm tra lại tên và nội dung nhé.");
    const { name, publicConsent, message } = parsed.data;
    const attendance = "attendance" in parsed.data ? parsed.data.attendance : undefined;
    const digest = createHash("sha256").update(JSON.stringify([name, attendance, message || "", publicConsent])).digest("hex");
    const table = kind === "rsvp" ? "rsvps" : "wishes";
    const db = getDb();
    const now = Math.floor(Date.now() / 1000);
    const bucket = bucketFor(request);
    const id = randomUUID();

    // One write batch serializes duplicate submissions and rate-limit updates.
    const results = await db.batch([
      {
        sql: `INSERT INTO rate_limits(bucket_key,hits,expires_at)
              SELECT ?,1,? WHERE NOT EXISTS (SELECT 1 FROM ${table} WHERE idempotency_key = ?)
              ON CONFLICT(bucket_key) DO UPDATE SET
                hits = CASE WHEN expires_at <= ? THEN 1 ELSE MIN(hits + 1, ?) END,
                expires_at = CASE WHEN expires_at <= ? THEN excluded.expires_at ELSE expires_at END`,
        args: [bucket, now + windowSeconds, key, now, writeLimit + 1, now],
      },
      {
        sql: kind === "rsvp"
          ? "INSERT OR IGNORE INTO rsvps (id,guest_name,attendance,public_consent,idempotency_key,request_hash,message) SELECT ?,?,?,?,?,?,? WHERE (SELECT hits FROM rate_limits WHERE bucket_key = ?) <= ?"
          : "INSERT OR IGNORE INTO wishes (id,guest_name,message,public_consent,idempotency_key,request_hash) SELECT ?,?,?,?,?,? WHERE (SELECT hits FROM rate_limits WHERE bucket_key = ?) <= ?",
        args: kind === "rsvp"
          ? [id,name,attendance!,Number(publicConsent),key,digest,message || null,bucket,writeLimit]
          : [id,name,message!,Number(publicConsent),key,digest,bucket,writeLimit],
      },
      { sql: `SELECT id, request_hash FROM ${table} WHERE idempotency_key = ?`, args: [key] },
      { sql: "SELECT expires_at FROM rate_limits WHERE bucket_key = ?", args: [bucket] },
    ], "write");
    const saved = results[2].rows[0];
    if (!saved) return Response.json({ error: "Bạn đã gửi nhiều lần. Vui lòng thử lại sau." }, {
      status: 429,
      headers: { "Retry-After": String(Math.max(1, Number(results[3].rows[0]?.expires_at) - now)) },
    });
    if (saved.request_hash !== digest) throw new ApiError(409, "Yêu cầu gửi trước đó có nội dung khác.");
    const receipt = kind === "wish" ? { id: saved.id, status: "pending" } : { id: saved.id };
    return Response.json(receipt, { status: saved.id === id ? 201 : 200 });
  } catch (error) {
    return failure(error, requestId);
  }
}

export async function list(request: Request, kind: Kind) {
  try {
    const params = new URL(request.url).searchParams;
    const cursor = params.get("cursor");
    if (cursor !== null && (!/^\d{1,15}$/.test(cursor) || Number(cursor) < 1)) {
      throw new ApiError(400, "Trang dữ liệu chưa hợp lệ.");
    }
    const attendance = kind === "rsvp" ? params.get("attendance") : null;
    if (attendance !== null && attendance !== "yes" && attendance !== "no") {
      throw new ApiError(400, "Trạng thái tham dự chưa hợp lệ.");
    }
    const table = kind === "rsvp" ? "rsvps" : "wishes";
    const visibility = kind === "rsvp" ? "public_consent = 1" : "public_consent = 1 AND status = 'approved'";
    const columns = kind === "rsvp" ? "id, guest_name AS name, attendance" : "id, guest_name AS name, message";
    const conditions = [visibility];
    const args: (string | number)[] = [];
    if (attendance) { conditions.push("attendance = ?"); args.push(attendance); }
    if (cursor) { conditions.push("rowid < ?"); args.push(Number(cursor)); }
    const db = getDb();
    const results = await db.batch([
      { sql: `SELECT rowid AS row_id, ${columns} FROM ${table} WHERE ${conditions.join(" AND ")} ORDER BY rowid DESC LIMIT ?`, args: [...args, pageSize + 1] },
      ...(kind === "rsvp" ? ["SELECT attendance, COUNT(*) AS amount FROM rsvps WHERE public_consent = 1 GROUP BY attendance"] : []),
    ], "read");
    const rows = results[0].rows.slice(0, pageSize);
    const counts = kind === "rsvp" ? Object.fromEntries(results[1].rows.map(row => [row.attendance, row.amount])) : undefined;
    return Response.json({
      items: rows.map(row => kind === "rsvp"
        ? { id: row.id, name: row.name, attendance: row.attendance }
        : { id: row.id, name: row.name, message: row.message }),
      nextCursor: results[0].rows.length > pageSize ? String(rows.at(-1)?.row_id) : null,
      ...(counts ? { counts: { yes: 0, no: 0, ...counts } } : {}),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return failure(error, randomUUID());
  }
}
