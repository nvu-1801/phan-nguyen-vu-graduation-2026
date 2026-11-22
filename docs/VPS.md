# Chạy production trên VPS

Ứng dụng gồm cả frontend và API Next.js trong **một container**, dùng SQLite/libSQL file trong volume. Không cần thêm MySQL/Postgres hoặc container database. Đã kiểm chứng Linux container trên Docker Desktop; chưa triển khai tới VPS/domain thật.

## Chạy thử đúng bản production ở local

```sh
npm ci
npm run docker:local
```

Mở http://localhost:3020. Lệnh tự tạo `.env.docker.local` với secret ngẫu nhiên nếu chưa có, build image và chờ healthcheck. Không ghi đè cấu hình đã có. DB nằm trong volume riêng `graduation-local_graduation-data`, tách DB development và database test.

```sh
npm run docker:logs
npm run docker:smoke
npm run docker:stop
```

Smoke test cần Node 24 và Chromium Playwright (`npx playwright install chromium` lần đầu). Nó chỉ chạy trên project Docker local đã cố định, gửi fixture rồi xóa theo ID; không trỏ tới production. Kiểm tra UI → API → SQLite, consent, moderation, idempotency, origin, ảnh và persistence sau khi recreate container. Không chạy smoke ghi dữ liệu vào VPS production.

## Chuẩn bị VPS

Dùng Linux với Docker Engine + Compose plugin, Nginx và tên miền đã trỏ tới VPS. Mở HTTP/HTTPS cho Nginx; ứng dụng bind **127.0.0.1**, không mở cổng Node ra Internet. Build cần Internet để tải Node/dependency/font packages. Khuyến nghị có ít nhất 2 GB RAM khi build; có thể build image ở máy khác rồi chuyển nếu VPS thiếu RAM.

```sh
git clone https://github.com/nvu-1801/phan-nguyen-vu-graduation-2026.git
cd phan-nguyen-vu-graduation-2026
cp deploy/production.env.example .env.production
chmod 600 .env.production
openssl rand -hex 32
```

Repo private: dùng SSH hoặc đăng nhập Git bằng tài khoản được cấp quyền. Không ghi token vào URL hay tài liệu. Sửa `.env.production`: thay cả SITE_ORIGIN và NEXT_PUBLIC_SITE_URL bằng origin HTTPS thật **không có dấu `/` cuối**; thay RATE_LIMIT_SECRET bằng kết quả ngẫu nhiên vừa sinh. Giữ APP_PORT=3000, APP_ENV_FILE=.env.production và TRUST_PROXY=1 khi dùng Nginx bên dưới. Không bật VERCEL. DATABASE_URL local được Compose đặt tới volume; không cần Turso token.

## Build và khởi động

```sh
docker compose --env-file .env.production up -d --build --wait
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs --tail=80
curl --fail http://127.0.0.1:3000/api/health
```

Health trả `{"status":"ok"}` sau khi migration hoàn tất. Container tự migrate idempotently rồi chạy standalone server bằng user `node` (UID 1000), init và healthcheck. Image runtime chỉ có bundle/dependency cần chạy, ảnh public, migrations và script kiểm duyệt; không mang ảnh gốc, source TSX hay dev tool vào runtime. Volume tên theo Compose project; giữ nguyên tên project/thư mục khi cập nhật để không vô tình dùng volume mới.

Nếu thay domain phải build lại vì URL public được đưa vào build. SITE_ORIGIN runtime cũng phải khớp để form qua HTTPS được chấp nhận. Compose cố ý từ chối khởi động nếu thiếu SITE_ORIGIN/RATE_LIMIT_SECRET.

## Nginx và HTTPS

Copy `deploy/nginx.conf.example` vào site của Nginx, thay `invite.example.com` bằng domain thật. Kiểm tra `sudo nginx -t`, enable site rồi reload. Cấu hình dùng `proxy_pass http://127.0.0.1:3000`, ghi đè Host, X-Real-IP và X-Forwarded-Proto. TRUST_PROXY=1 chỉ dùng khi proxy tin cậy ghi đè header và client không truy cập Node trực tiếp.

Cài TLS bằng Certbot theo hệ điều hành VPS, ví dụ khi đã có Certbot Nginx plugin:

```sh
sudo certbot --nginx -d invite.example.com
curl --fail https://invite.example.com/api/health
```

Nginx template kiểm tra được cú pháp trong container, nhưng TLS/DNS/firewall và lệnh hệ thống vẫn cần chạy trên VPS thật. Không coi local Docker healthy là đã deploy HTTPS.

## Xác minh sau mở domain

- Ảnh/OG/font/lịch không 404, mobile không tràn ngang.
- Gửi một RSVP không công khai; xác minh không hiện public.
- Gửi lời chúc có đồng ý công khai; xác minh chưa hiện trước khi duyệt.
- Duyệt và kiểm tra chỉ nội dung có consent mới hiện. Tránh dùng fixture giả trên production; dùng phản hồi thật hoặc xóa dữ liệu kiểm tra theo đúng ID.
- Restart/recreate container, xác minh dữ liệu vẫn còn và health OK.
- Quét QR bằng điện thoại, kiểm tra tên người nhận. Ngày lễ vẫn ghi dự kiến, giờ chưa cập nhật.

```sh
docker compose --env-file .env.production exec invitation node scripts/moderate.mjs pending
docker compose --env-file .env.production exec invitation node scripts/moderate.mjs approve ID
docker compose --env-file .env.production exec invitation node scripts/moderate.mjs reject ID
docker compose --env-file .env.production exec invitation node scripts/moderate.mjs cleanup
```

## Sao lưu và cập nhật

Backup phải nhất quán: dừng app rồi copy toàn bộ thư mục data, sau đó bật lại. Dùng thư mục backup mới theo ngày/lần phát hành.

```sh
mkdir -p backups/before-release
docker compose --env-file .env.production stop invitation
docker compose --env-file .env.production cp invitation:/app/data/. ./backups/before-release
docker compose --env-file .env.production up -d --wait
```

Giữ bản sao ngoài VPS. Trước cập nhật, backup, ghi commit/image hiện tại, rồi `git pull --ff-only` và chạy lại lệnh up --build --wait. Không dùng `down -v`; lệnh đó xóa volume. Rollback code/image không tự rollback schema. Restore DB chỉ thực hiện có chủ đích khi app đã dừng và đã backup DB hiện tại, vì restore sẽ thay dữ liệu phát sinh sau snapshot.

Bằng chứng kiểm chứng local và các giới hạn còn lại: `docs/PRODUCTION_VERIFICATION.md`.
