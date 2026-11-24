import { createHmac, timingSafeEqual } from "node:crypto";
import { getDb } from "./db";

const cookieName = "vu_admin_session";
const sessionSeconds = 8 * 60 * 60;
const attemptWindowSeconds = 15 * 60;
const attemptLimit = 5;

export function adminConfigured() {
  return Boolean(
    process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 16 &&
    process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 32,
  );
}

function signature(expiresAt: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "")
    .update(`graduation-admin:${expiresAt}`)
    .digest("base64url");
}

export function hasAdminSession(request: Request) {
  if (!adminConfigured()) return false;
  const pair = request.headers.get("cookie")?.split(";").map(value => value.trim()).find(value => value.startsWith(`${cookieName}=`));
  const token = pair?.slice(cookieName.length + 1);
  if (!token) return false;
  const [expiresAt, supplied, extra] = token.split(".");
  if (extra || !/^\d{10}$/.test(expiresAt || "") || !supplied) return false;
  if (Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;
  const expected = Buffer.from(signature(expiresAt));
  const actual = Buffer.from(supplied);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function requestAddress(request: Request) {
  if (process.env.VERCEL) return request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (process.env.TRUST_PROXY === "1") return request.headers.get("x-real-ip") || "unknown";
  return "local";
}

async function consumeLoginAttempt(request: Request) {
  const secret = process.env.RATE_LIMIT_SECRET || "graduation-local-development";
  const bucket = createHmac("sha256", secret).update(`admin-login:${requestAddress(request)}`).digest("hex");
  const now = Math.floor(Date.now() / 1000);
  const result = await getDb().batch([
    {
      sql: `INSERT INTO rate_limits(bucket_key,hits,expires_at) VALUES(?,1,?)
            ON CONFLICT(bucket_key) DO UPDATE SET
              hits = CASE WHEN expires_at <= ? THEN 1 ELSE MIN(hits + 1, ?) END,
              expires_at = CASE WHEN expires_at <= ? THEN excluded.expires_at ELSE expires_at END`,
      args: [bucket, now + attemptWindowSeconds, now, attemptLimit + 1, now],
    },
    { sql: "SELECT hits, expires_at FROM rate_limits WHERE bucket_key = ?", args: [bucket] },
  ], "write");
  return { hits: Number(result[1].rows[0]?.hits ?? attemptLimit + 1), retryAfter: Math.max(1, Number(result[1].rows[0]?.expires_at ?? now + 60) - now) };
}

export async function createAdminSession(request: Request, password: unknown) {
  if (!adminConfigured()) return Response.json({ error: "Trang quản lý chưa được cấu hình." }, { status: 503 });
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  const expectedOrigin = process.env.SITE_ORIGIN || `${process.env.VERCEL ? "https:" : url.protocol}//${request.headers.get("host") || url.host}`;
  if (!origin || origin !== expectedOrigin) return Response.json({ error: "Nguồn gửi không hợp lệ." }, { status: 403 });

  const attempts = await consumeLoginAttempt(request);
  if (attempts.hits > attemptLimit) {
    return Response.json({ error: "Đã thử đăng nhập quá nhiều lần. Vui lòng đợi rồi thử lại." }, {
      status: 429,
      headers: { "Retry-After": String(attempts.retryAfter), "Cache-Control": "no-store" },
    });
  }
  const submitted = createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(typeof password === "string" ? password : "").digest();
  const expected = createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(process.env.ADMIN_PASSWORD!).digest();
  if (!timingSafeEqual(submitted, expected)) {
    return Response.json({ error: "Mật khẩu chưa đúng." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const expiresAt = String(Math.floor(Date.now() / 1000) + sessionSeconds);
  const secure = process.env.VERCEL || url.protocol === "https:" || (process.env.TRUST_PROXY === "1" && request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() === "https") ? "; Secure" : "";
  return Response.json({ authenticated: true }, {
    headers: {
      "Set-Cookie": `${cookieName}=${expiresAt}.${signature(expiresAt)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionSeconds}${secure}`,
      "Cache-Control": "no-store",
    },
  });
}

export function clearAdminSession(request: Request) {
  const secure = process.env.VERCEL || new URL(request.url).protocol === "https:" || (process.env.TRUST_PROXY === "1" && request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() === "https") ? "; Secure" : "";
  return Response.json({ authenticated: false }, {
    headers: { "Set-Cookie": `${cookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`, "Cache-Control": "no-store" },
  });
}
