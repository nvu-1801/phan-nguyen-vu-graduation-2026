import { adminConfigured, clearAdminSession, createAdminSession, hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  if (!adminConfigured()) return Response.json({ configured: false, authenticated: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  return Response.json({ configured: true, authenticated: hasAdminSession(request) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!/^application\/json\b/i.test(request.headers.get("content-type") || "")) {
    return Response.json({ error: "Yêu cầu chưa hợp lệ." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  if (!request.body) return Response.json({ error: "Thiếu nội dung gửi." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 1024) {
        await reader.cancel();
        return Response.json({ error: "Yêu cầu quá dài." }, { status: 413, headers: { "Cache-Control": "no-store" } });
      }
      chunks.push(part.value);
    }
  } finally {
    reader.releaseLock();
  }
  let body: { password?: unknown } | null = null;
  try { body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks))) as { password?: unknown }; }
  catch { return Response.json({ error: "Yêu cầu chưa hợp lệ." }, { status: 400, headers: { "Cache-Control": "no-store" } }); }
  try {
    const response = await createAdminSession(request, body?.password);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return Response.json({ error: "Đăng nhập tạm thời không khả dụng." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

export function DELETE(request: Request) {
  return clearAdminSession(request);
}
