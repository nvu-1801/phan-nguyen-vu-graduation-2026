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

### Cấu hình `/admin`

`/admin` chỉ bật khi có đủ hai biến trong `.env.production` (Compose chuyển chúng vào container qua `env_file`):

- `ADMIN_PASSWORD`: mật khẩu riêng dài tối thiểu 16 ký tự, lưu trong password manager.
- `ADMIN_SESSION_SECRET`: chuỗi ngẫu nhiên riêng, tối thiểu 32 ký tự, sinh bằng `openssl rand -hex 32`; dùng để ký cookie phiên.

Bỏ comment hai dòng mẫu trong `.env.production` rồi điền giá trị thật trên VPS. Không dùng lại `RATE_LIMIT_SECRET` cho `ADMIN_SESSION_SECRET`, không gửi các giá trị này vào chat/log và không chụp màn hình file env. Nếu thiếu một trong hai, trang vẫn tải nhưng đăng nhập trả `503` và không đọc được dữ liệu. Sau khi thêm hoặc đổi biến, chạy `up -d --wait` để container được tạo lại với cấu hình mới; volume dữ liệu vẫn giữ nguyên. Đăng nhập sai quá 5 lần trong 15 phút từ cùng một IP sẽ bị `429`, nên cần `TRUST_PROXY=1` khi đứng sau Nginx để rate limit dùng đúng IP khách.

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
- `https://YOUR_DOMAIN/admin` đăng nhập được bằng `ADMIN_PASSWORD`; sai mật khẩu bị từ chối và không lộ danh sách. Danh sách có cả lời chúc riêng tư và mục "Xác nhận tham dự" hiển thị cả phản hồi không đồng ý công khai cùng lời nhắn RSVP.
- Gửi một RSVP không công khai; xác minh không hiện public.
- Gửi lời chúc có đồng ý công khai; xác minh chưa hiện trước khi duyệt.
- Duyệt ngay trong `/admin` bằng nút **Duyệt** / **Từ chối** (có bước xác nhận), rồi tải lại thiệp để kiểm tra chỉ nội dung có consent mới hiện. Tránh dùng fixture giả trên production; dùng phản hồi thật hoặc xóa dữ liệu kiểm tra theo đúng ID.
- Restart/recreate container, xác minh dữ liệu vẫn còn và health OK.
- Quét QR bằng điện thoại, kiểm tra tên người nhận. Ngày lễ vẫn ghi dự kiến, giờ chưa cập nhật.

Duyệt bằng web là cách chính. Khi không mở được trình duyệt, dùng CLI trong container:

```sh
docker compose --env-file .env.production exec invitation node scripts/moderate.mjs pending
docker compose --env-file .env.production exec invitation node scripts/moderate.mjs approve ID
docker compose --env-file .env.production exec invitation node scripts/moderate.mjs reject ID
docker compose --env-file .env.production exec invitation node scripts/moderate.mjs cleanup
```

Cả hai cách đều ghi `moderated_at` và `moderated_by`; chỉ lời đang `pending` mới chuyển được trạng thái.

## Tự động deploy trên VPS (cách đang dùng)

VPS không mở SSH ra Internet — cổng 22 bị `connection refused` từ GitHub runner và từ máy ngoài — nên GitHub Actions không thể SSH vào. Cách chạy hiện tại: VPS tự kiểm tra `origin/main` mỗi 2 phút bằng systemd timer. Push lên `main` → CI xanh → tối đa khoảng 2 phút sau VPS pull, backup SQLite, rebuild và health check. Không cần mở SSH inbound.

Cài một lần trên VPS:

```sh
cd ~/apps/phan-nguyen-vu-graduation-2026
chmod +x scripts/vps-auto-deploy.sh
sudo cp deploy/graduation-deploy.service deploy/graduation-deploy.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now graduation-deploy.timer
systemctl list-timers graduation-deploy.timer
```

Chạy thử và kiểm tra:

```sh
sudo systemctl start graduation-deploy.service
journalctl -u graduation-deploy.service -n 60 --no-pager
git rev-parse --short HEAD
curl --fail http://127.0.0.1:3000/api/health
```

Script `scripts/vps-auto-deploy.sh` chỉ deploy khi `origin/main` khác HEAD hiện tại hoặc SHA đã deploy (`.deploy-state`) khác HEAD — nhờ vậy nó vẫn rebuild sau khi ai đó `git pull` tay mà chưa build lại. Script đặt `core.fileMode=false` để thay đổi quyền file trên server (ví dụ `chmod +x`) không bị coi là sửa nội dung; nội dung tracked bị sửa vẫn bị từ chối. Script dừng container để copy SQLite vào `backups/auto-*` (giữ 10 bản); fast-forward; `docker compose up -d --build --wait`; kiểm tra `/api/health`. Nếu bước sau lỗi, trap bật lại container cũ để site không chết và ghi `.deploy-failed`; lần thử tiếp theo chờ 15 phút (`COOLDOWN_SECONDS`). Log nằm trong journald.

Điều kiện: user `vu` phải `git fetch` được repo private (credential đã có sẵn trên VPS) và chạy được `docker compose`. Nếu `git fetch` lỗi, xem `journalctl` rồi cấu hình lại credential; không dán token vào chat hay file trong repo.

## Tùy chọn: deploy bằng SSH từ GitHub Actions

Chỉ dùng khi VPS thật sự mở SSH ra Internet (hoặc allowlist dải IP runner). Workflow `.github/workflows/deploy.yml` hiện chỉ chạy tay bằng `workflow_dispatch` và cần biến `DEPLOY_ENABLED=true`; nó không còn tự chạy sau CI để tránh run đỏ khi SSH đóng. Workflow pull `main`, backup SQLite, rebuild Compose và kiểm tra `/api/health`; không sửa `.env.production` và dừng nếu VPS có file tracked bị chỉnh tay.

### 1. Tạo SSH key riêng cho deploy

Nên tạo trên máy local (Windows/macOS/Linux), chỉ đưa **public key** lên VPS:

```sh
ssh-keygen -t ed25519 -a 100 -C "gha-deploy" -f ~/.ssh/gha_graduation -N ""
```

### 2. Thêm public key vào VPS

Trên VPS, thêm nội dung file `gha_graduation.pub`:

```sh
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "ssh-ed25519 AAAA... gha-deploy" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Thử từ máy local:

```sh
ssh -i ~/.ssh/gha_graduation vu@phannguyenvu.duckdns.org \
  'cd ~/apps/phan-nguyen-vu-graduation-2026 && git rev-parse --short HEAD'
```

### 3. Cấu hình GitHub

Repo → Settings → Secrets and variables → Actions.

| Loại | Tên | Giá trị |
| --- | --- | --- |
| Secret | `VPS_SSH_KEY` | Toàn bộ nội dung **private key** `gha_graduation` |
| Variable | `VPS_HOST` | `phannguyenvu.duckdns.org` |
| Variable | `VPS_USER` | `vu` |
| Variable | `VPS_PORT` | `22` |
| Variable | `VPS_APP_DIR` | `/home/vu/apps/phan-nguyen-vu-graduation-2026` |
| Variable | `DEPLOY_ENABLED` | `true` (đặt sau khi đã thêm secret) |

Có thể dùng `gh` từ máy local:

```sh
gh secret set VPS_SSH_KEY < ~/.ssh/gha_graduation
gh variable set VPS_HOST --body phannguyenvu.duckdns.org
gh variable set VPS_USER --body vu
gh variable set VPS_PORT --body 22
gh variable set VPS_APP_DIR --body /home/vu/apps/phan-nguyen-vu-graduation-2026
gh variable set DEPLOY_ENABLED --body true
```

Không commit private key, không dán vào chat/log. Repo phải để VPS tự `git fetch` được (SSH hoặc credential helper còn hiệu lực).

### 4. Chạy thử

```sh
gh workflow run deploy.yml
gh run watch
```

Workflow không tự chạy sau CI. Kiểm tra lại trên VPS:

```sh
docker compose --env-file .env.production ps
curl --fail http://127.0.0.1:3000/api/health
curl --fail https://phannguyenvu.duckdns.org/api/health
```

Workflow giữ 10 bản backup gần nhất trong `backups/auto-*`; vẫn nên copy định kỳ ra ngoài VPS. Nếu deploy lỗi giữa chừng, container cũ vẫn còn (Compose chỉ thay khi build xong); sửa lỗi rồi chạy lại workflow.

## Sao lưu và cập nhật

Backup phải nhất quán: dừng app rồi copy toàn bộ thư mục data, sau đó bật lại. Dùng thư mục backup mới theo ngày/lần phát hành.

```sh
mkdir -p backups/before-release
docker compose --env-file .env.production stop invitation
docker compose --env-file .env.production cp invitation:/app/data/. ./backups/before-release
docker compose --env-file .env.production up -d --wait
```

### Backup hằng ngày tự động

`scripts/vps-backup.sh` dừng container trong vài giây, copy SQLite vào `backups/daily-*`, bật lại và kiểm tra health; giữ 14 bản gần nhất (`DAILY_KEEP`). Cài một lần:

```sh
cd ~/apps/phan-nguyen-vu-graduation-2026
sudo cp deploy/graduation-backup.service deploy/graduation-backup.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now graduation-backup.timer
systemctl list-timers graduation-backup.timer
```

Chạy thử và xem log:

```sh
sudo systemctl start graduation-backup.service
sudo journalctl -u graduation-backup.service -n 40 --no-pager
ls -1dt backups/daily-* | head -3
```

Timer chạy 03:30 hằng ngày theo múi giờ VPS, `Persistent=true` nên nếu VPS tắt lúc 03:30 thì lần bật sau sẽ chạy bù. Lần đầu bật timer sẽ chạy bù ngay, nên có thể thấy hai bản backup liên tiếp nếu bạn vừa `systemctl start` — bình thường.

Kiểm tra một bản backup đọc được (dùng Node 24 có sẵn SQLite, mount read-only):

```sh
docker run --rm -v "$PWD/backups/daily-YYYYMMDD-HHMMSS:/data:ro" node:24-bookworm-slim \
  node -e "const {DatabaseSync}=require('node:sqlite');const db=new DatabaseSync('/data/graduation.db');console.log(db.prepare('PRAGMA integrity_check').get());console.log(db.prepare('SELECT count(*) AS n FROM rsvps').get());"
```

Copy ra ngoài VPS (tùy chọn): cài `rclone`, cấu hình remote, rồi đặt biến cho service:

```sh
sudo systemctl edit graduation-backup.service
# [Service]
# Environment=BACKUP_REMOTE=gdrive:graduation-backups
sudo systemctl daemon-reload
```

Khi có `BACKUP_REMOTE` và `rclone`, script tự copy thư mục backup mới lên remote; nếu copy lỗi thì bản local vẫn giữ và log ghi rõ. Chưa cấu hình remote nào trong phiên này.

### Giám sát uptime

`.github/workflows/uptime.yml` chạy mỗi 30 phút, kiểm tra `/api/health` trả `{"status":"ok"}` và trang chủ còn chứa tên Vũ; run fail sẽ khiến GitHub gửi email cho chủ repo. Có thể chạy tay bằng `gh workflow run uptime.yml`.

Giữ bản sao ngoài VPS. Trước cập nhật, backup, ghi commit/image hiện tại, rồi `git pull --ff-only` và chạy lại lệnh up --build --wait. Migration mới (ví dụ bản schema 3 thêm cột `moderated_at`/`moderated_by`) tự chạy khi container khởi động; `/api/health` trả 503 nếu DB chưa đạt phiên bản yêu cầu, nên kiểm tra health sau mỗi lần cập nhật. Không dùng `down -v`; lệnh đó xóa volume. Rollback code/image không tự rollback schema. Restore DB chỉ thực hiện có chủ đích khi app đã dừng và đã backup DB hiện tại, vì restore sẽ thay dữ liệu phát sinh sau snapshot.

Sao lưu `.env.production` riêng, mã hóa, tách khỏi bản backup database công khai: file chứa mật khẩu admin và secret ký phiên. Không đưa file này vào Git, ảnh chụp màn hình hay báo cáo.

Bằng chứng kiểm chứng local và các giới hạn còn lại: `docs/PRODUCTION_VERIFICATION.md`.
