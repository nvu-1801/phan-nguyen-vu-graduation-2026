# Kế hoạch hoàn thiện — Phan Nguyên Vũ Graduation 2026

Ngày audit: 26/11/2026. Phạm vi: đưa ứng dụng từ trạng thái hiện tại đến bản dùng thật cho ngày 20/12/2026.

## 1. Trạng thái đã xác minh (26/11/2026)

| Hạng mục | Trạng thái | Bằng chứng |
|---|---|---|
| Mã nguồn local | Sạch, `main` = `origin/main` = `3c263e4` | `git status` trống, `git branch -vv` |
| CI GitHub | Xanh tại `3c263e4` (lint, typecheck, SQLite, build, Playwright, Docker smoke) | run `45417800003` |
| Domain HTTPS | Sống, `/api/health` → `{"status":"ok"}` | curl |
| Admin | `/admin` 200, `{"configured":true,"authenticated":false}` | curl |
| DB | SQLite trên volume, migrate idempotent khi container start | docs/VPS.md, docs/PRODUCTION_VERIFICATION.md |
| RSVP / lời chúc | API ghi DB, consent + duyệt, retry/idempotency, rate limit, chống XSS | bộ test Playwright + Docker smoke |
| 3D/scroll | Scene postcard lazy, reduced-motion, fallback WebGL | test e2e |
| Auto-deploy | Workflow có, **đang tắt** (`DEPLOY_ENABLED=false`, thiếu secret `VPS_SSH_KEY`) | `gh variable list`, `gh secret list` |
| VPS đang chạy | **Chậm 2 commit** so với `main` | HTML live chưa có section gộp `#xac-nhan`, chưa có 10 gợi ý lời chúc mới |

### Khác biệt VPS ↔ `main`

VPS đang phục vụ bản trước `74beab4`, tức là chưa có:

1. Section 05+06 gộp thành một `#xac-nhan` (RSVP + lời chúc) — hiện live vẫn tách rời.
2. 10 gợi ý lời chúc mới (Ấm áp / Biết ơn / Can đảm / Bình an).
3. Tab "Xác nhận tham dự" trong `/admin` đọc RSVP riêng tư.

Không có dữ liệu nào bị mất khi deploy: dữ liệu nằm trong volume, chỉ thay image.

## 2. Việc còn thiếu để coi là "done"

### P0 — Đưa bản mới lên VPS (chặn bởi quyền truy cập)

- Hiện không SSH được từ máy này tới `phannguyenvu.duckdns.org:22` (connection refused) và chưa có `VPS_SSH_KEY` trong GitHub Secrets.
- Hai cách, chọn một:
  - **A (khuyến nghị, một lần là tự động về sau):** tạo SSH key deploy, thêm public key vào VPS, đặt secret `VPS_SSH_KEY`, bật `DEPLOY_ENABLED=true`, chạy `gh workflow run deploy.yml`.
  - **B (thủ công trên VPS):** `git pull --ff-only && docker compose --env-file .env.production up -d --build --wait`.
- Nghiệm thu: HTML live có `#xac-nhan` gộp, 10 gợi ý mới, admin có tab RSVP; `/api/health` 200; RSVP cũ vẫn còn.

### P1 — Duyệt lời chúc ngay trên web — ĐÃ XONG 26/11/2026

Trước đây chỉ duyệt bằng CLI trong container. Nay Vũ duyệt được bằng điện thoại trong `/admin`.

- `PATCH /api/admin/wishes/[id]` với `action: "approve" | "reject"`; chặn bằng cookie phiên admin + `Origin` cùng site (kiểm tra Origin trước phiên), JSON ≤2 KB, chỉ `pending → approved|rejected`.
- Migration `0003_wish_moderation.sql` thêm `moderated_at`, `moderated_by`; CLI `npm run moderate` cũng ghi hai cột này.
- UI: nút Duyệt / Từ chối + bước xác nhận, disable khi đang gửi, tự gỡ khỏi tab "Chờ duyệt", hiện "Đã xử lý lúc …", nhắc rõ lời riêng tư vẫn riêng tư sau khi duyệt.
- Xác minh: 22/22 Playwright pass (53,7s), gồm 401, 403 sai Origin, 409 duyệt lại, lời bị từ chối/riêng tư không lọt `/api/wishes`; `npm run lint`, `npm run typecheck`, `npm run build` pass; test SQLite pass với 3 migration; ảnh chụp admin 1440/390 đã xem.
- `/api/health` giờ yêu cầu schema version ≥3, nên lần deploy kế tiếp bắt buộc container chạy migration trước khi healthy.

### P2 — Vận hành: backup, giám sát, danh sách khách

- **Backup:** cron trên VPS chạy `docker compose stop → cp volume → start` hằng ngày, giữ N bản, kèm script copy ra ngoài VPS. Kiểm tra restore một lần.
- **Uptime:** theo dõi `https://phannguyenvu.duckdns.org/api/health` mỗi 5 phút + cảnh báo (email/Telegram). Không thêm dịch vụ trả phí.
- **Danh sách khách:** nút "Xuất CSV" trong tab RSVP (client-side từ dữ liệu đã tải hoặc endpoint `?format=csv` có phiên) để Vũ điểm danh ngày 20/12.
- Nghiệm thu: xoá thử một bản backup đọc được; CSV mở đúng tiếng Việt trong Excel/Google Sheets; cảnh báo bắn khi health fail.

### P3 — Chốt nội dung cuối (chặn bởi thông tin từ Vũ)

- **Giờ khai mạc chính thức**: hiện `src/content/event.ts` chỉ có ngày, UI ghi "giờ đang chờ cập nhật". Khi có giờ: cập nhật event.ts, nhãn countdown, file `.ics` chuyển từ sự kiện cả ngày sang có giờ, và bỏ chữ "dự kiến" nếu trường đã xác nhận.
- Rà lần cuối copy Việt ngữ, tên trường/địa chỉ, học hàm không suy diễn.
- Kiểm tra QR ngân hàng bằng điện thoại thật (tên người nhận đúng) và bản đồ trên 4G.

### P4 — QA phát hành và bàn giao

- Lighthouse mobile trên bản production, ghi số thật (mục tiêu perf ≥85, a11y ≥95) vào docs.
- Chụp 360/390/768/1440 + axe serious/critical sau khi deploy bản mới.
- Kiểm tra thực tế trên điện thoại: form RSVP/lời chúc (bàn phím ảo, dock che form), QR, bản đồ, scene 3D không tụt khung hình.
- Cập nhật `CONTINUE.md`, `docs/VPS.md` (commit/image đang chạy) và checklist nghiệm thu.

## 3. Thứ tự thực hiện đề xuất

1. ~~**P1 (duyệt trên web)** — đã xong 26/11/2026.~~
2. **P2 (backup + uptime + CSV)** — làm được ngay, giảm rủi ro mất dữ liệu.
3. **P0 (deploy bản mới)** — cần user cấp SSH hoặc chạy 2 lệnh; deploy sau khi P2 xong để chỉ phải rebuild một lần.
4. **P3 (giờ khai mạc)** — chờ thông tin chính thức.
5. **P4 (QA cuối)** — sau deploy, trước 20/12.

## 4. Chặn cần quyết định

| # | Cần | Ảnh hưởng |
|---|---|---|
| 1 | Cách deploy: cấp SSH/secret hay tự chạy lệnh trên VPS | P0 không làm được nếu không có một trong hai |
| 2 | ~~Có làm P1 (duyệt trên web) không~~ — đã chốt, đã xong | Không còn chặn |
| 3 | Giờ khai mạc chính thức + xác nhận ngày/địa điểm | P3 và file lịch |
| 4 | Kênh nhận cảnh báo uptime (email/Telegram) | P2 |

## 5. Giới hạn — không tuyên bố

- Chưa xác minh VPS đang chạy đúng `3c263e4`; bằng chứng hiện tại cho thấy đang chạy bản cũ hơn.
- Chưa có SSH/secret deploy trong phiên này, nên mọi thay đổi VPS vẫn là việc của user hoặc phiên được cấp quyền.
- Chưa đo Lighthouse/FPS thật, chưa quét QR bằng máy thật, chưa kiểm tra bản đồ trên mạng di động.
- Không seed dữ liệu giả lên production; mọi fixture test chỉ ở DB local/test và xoá theo ID.
