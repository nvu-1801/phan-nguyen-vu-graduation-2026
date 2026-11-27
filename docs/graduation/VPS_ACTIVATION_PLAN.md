# Kế hoạch bật đủ chức năng trên VPS

## Mục tiêu

Chạy website, RSVP, lưu lời chúc, khu vực xem lời chúc riêng tư và phần công khai đã duyệt trên VPS hiện có. Dùng Docker Compose + SQLite trên volume của VPS. Không chuyển sang Supabase/Postgres: backend hiện dùng `@libsql/client` và SQLite-compatible database; Supabase sẽ cần đổi driver/schema và kiểm thử lại.

## Trạng thái cần biết khi tiếp tục

- Production URL Vercel trước đây trả `503` ở `/api/health`; cần kiểm tra lại trạng thái hiện tại trước khi kết luận. Health route yêu cầu DB truy cập được và migration schema phiên bản 2 trở lên.
- Thiếu `ADMIN_PASSWORD`/`ADMIN_SESSION_SECRET` khiến đăng nhập admin chưa cấu hình, nhưng không phải nguyên nhân trực tiếp khiến health trả `503`.
- VPS Compose đã gắn volume `graduation-data` vào `/app/data`; `DATABASE_URL` được đặt trong Compose thành `file:/app/data/graduation.db`. Không đặt database vào filesystem của container hoặc chạy `docker compose down -v`.
- Container tự chạy migration idempotent khi khởi động. VPS env mẫu hiện có domain, rate-limit secret và proxy; cần bổ sung admin credentials khi chuẩn bị production.
- Lời chúc công khai ngay khi người gửi đồng ý; không cần duyệt. Admin web có nút xoá lời chúc khi cần; script CLI trong container vẫn là phương án dự phòng.

## Phase 1 — Chuẩn bị mã nguồn và cấu hình

1. Đồng bộ checkout an toàn với `main` mới nhất trước khi sửa. Workspace lúc bàn giao có HEAD `676ae03b8fb0030514687579475b071606732446`, các thay đổi liên quan admin/UI đang staged; GitHub `main` đã có commit `6afbaa5614fec85bebf41f650e0a2d9b29a61141`. Remote tracking trong checkout cũ có thể chưa cập nhật. Không reset/checkout đè các thay đổi staged; xác minh diff trước khi đồng bộ.
2. Cập nhật `deploy/production.env.example` để có tên biến admin và placeholder mô tả, không chứa giá trị thật. Bảo đảm README và `docs/VPS.md` hướng dẫn rõ cách cấu hình.
3. Trên VPS, giữ `.env.production` ngoài Git với quyền `600`. Dùng domain HTTPS thật cho `SITE_ORIGIN` và `NEXT_PUBLIC_SITE_URL`; giữ `TRUST_PROXY=1` khi Nginx là reverse proxy đáng tin cậy.
4. Tạo hai giá trị riêng cho `RATE_LIMIT_SECRET` và `ADMIN_SESSION_SECRET`, mỗi giá trị bằng `openssl rand -hex 32`. Chọn `ADMIN_PASSWORD` riêng dài tối thiểu 16 ký tự và cất trong password manager. Không gửi các giá trị vào chat/log, không chụp màn hình env.
5. Không cần `DATABASE_AUTH_TOKEN` trên VPS SQLite volume. Không bật `VERCEL` trong container.

## Phase 2 — Khởi động VPS

Chạy trên VPS, không phải trong Windows workspace:

```sh
docker compose --env-file .env.production config --quiet
docker compose --env-file .env.production up -d --build --wait
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs --tail=80
curl --fail http://127.0.0.1:3000/api/health
```

Sau khi Nginx/HTTPS đã trỏ đúng app, xác minh từ ngoài VPS:

```sh
curl --fail https://YOUR_DOMAIN/api/health
```

Health mong đợi `{"status":"ok"}`. Nếu `503`, kiểm tra log container, volume, biến `RATE_LIMIT_SECRET`, migration và kết nối database; không in secret ra terminal/chat.

## Phase 3 — Nghiệm thu tính năng bằng dữ liệu thật

1. Mở `https://YOUR_DOMAIN/admin`, đăng nhập; kiểm tra phiên dùng cookie bảo mật và danh sách có cả lời riêng tư.
2. Gửi một RSVP và xác nhận dữ liệu còn sau khi container được recreate nhưng volume được giữ nguyên.
3. Gửi một lời chúc riêng tư: thấy trong admin, không xuất hiện ở trang công khai.
4. Gửi một lời chúc đồng ý công khai: tải lại thiệp và xác minh lời chúc hiện ngay, không cần duyệt. Vào `/admin`, thử **Xoá lời chúc** (có xác nhận); xác nhận tham dự của người đó vẫn còn. Dự phòng bằng CLI:

   ```sh
   docker compose --env-file .env.production exec invitation node scripts/moderate.mjs pending
   docker compose --env-file .env.production exec invitation node scripts/moderate.mjs reject ID
   ```

5. Xác nhận lời chúc công khai chỉ xuất hiện sau khi vừa consent vừa approve; lời bị từ chối/riêng tư vẫn ẩn.
6. Không tạo nội dung giả trên production. Nếu cần kiểm tra submit, xóa đúng record thử sau khi xác nhận ID.

## Phase 4 — Vận hành và cải thiện admin

- Thiết lập backup SQLite định kỳ và một bản sao ngoài VPS; trước mỗi release, backup trước khi cập nhật image. Giữ nguyên Compose project/volume và tuyệt đối không dùng `down -v`.
- Nút xoá lời chúc trong `/admin` đã hoàn thành ngày 27/11/2026: `DELETE /api/admin/wishes/[id]` yêu cầu phiên admin + Origin, có bước xác nhận; xoá chỉ bỏ lời chúc, giữ RSVP. Bước duyệt đã bỏ — wish mới công khai ngay khi người gửi đồng ý.
- Nếu sau này chuyển provider, lập migration/export-import riêng, backup và đối chiếu số dòng trước/sau. Không cho Vercel và VPS ghi vào hai database production khác nhau cùng lúc.

## Tiêu chí hoàn tất

- `/api/health` trả 200 qua localhost và domain HTTPS.
- Admin login thành công; thiếu/sai password không mở dữ liệu.
- Form RSVP và lời chúc ghi xuống SQLite; dữ liệu tồn tại qua restart/recreate container.
- Consent và moderation được kiểm chứng: chỉ lời chúc có cả hai điều kiện mới public.
- `.env.production` có quyền hạn chế, không nằm trong Git/backup public; backup được xác nhận đọc được.
- Ghi lại domain, commit/image đang chạy và các bước kiểm tra thực tế; không tuyên bố VPS hoạt động chỉ dựa trên CI/local Docker.

## Tiến độ thực hiện — 24/11/2026

- Đã đồng bộ checkout với `main`: `origin/main` ở `6afbaa5614fec85bebf41f650e0a2d9b29a61141` (7 commit mới). Index của workspace trùng hoàn toàn với cây `origin/main` (các thay đổi admin/UI đã staged trước đó chính là nội dung đã có trên main), nên `git reset --soft origin/main` chỉ tiến HEAD và không làm mất nội dung. `CONTINUE.md` đang sửa và file kế hoạch chưa track vẫn được giữ.
- Đã bổ sung `ADMIN_PASSWORD`/`ADMIN_SESSION_SECRET` (dạng comment, không có giá trị thật) vào `deploy/production.env.example`; hướng dẫn cấu hình, xác minh `/admin` và backup `.env.production` riêng đã thêm vào `docs/VPS.md` và `README.md`.
- Đã xác minh: `docker compose config --quiet` với template mới, biến admin xuất hiện trong `environment` của service khi bỏ comment, `npm run lint`, `npm run typecheck`, `npm run build` (Node 24) và `git diff --check` đều đạt. Chưa chạy lại toàn bộ Playwright vì thay đổi chỉ là tài liệu/template env.
- Phase 2–3 vẫn cần người dùng thực thi trên VPS; phiên này không có SSH/domain/credential nên không thay đổi gì trên máy chủ. Không có công cụ quota trong phiên; không thể đọc hạn mức Codex.

## Handoff cho agent tiếp theo

Đọc file này cùng `AGENTS.md`, `CONTINUE.md`, `docs/VPS.md`, `.env.example`, `deploy/production.env.example` và `src/app/api/health/route.ts`. Hoàn thiện tài liệu/template an toàn trước; sau đó chỉ hướng dẫn người dùng chạy lệnh trên VPS nếu chưa có SSH/access được cấp. Không yêu cầu họ dán secret. Người dùng chọn VPS, không chọn Supabase.
