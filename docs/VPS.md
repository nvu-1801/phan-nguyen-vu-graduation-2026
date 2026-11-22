# Chạy trên VPS bằng Docker + Nginx

Chưa deploy trong phiên local này. Dùng domain của bạn và HTTPS trước khi chia sẻ.

1. Cài Docker Engine + Compose và Nginx trên VPS. Copy repo đầy đủ (có ảnh gốc), không copy node_modules, .next hoặc dữ liệu test.
2. Tạo `.env.production` chỉ trên VPS:

```dotenv
SITE_ORIGIN=https://invite.example.com
NEXT_PUBLIC_SITE_URL=https://invite.example.com
RATE_LIMIT_SECRET=REPLACE_WITH_RANDOM_SECRET
```

Sinh secret bằng `openssl rand -hex 32`. Thay domain bằng domain thật. Không commit file env. Compose dùng SQLite trong volume `graduation-data`, không cần Turso. Container tự chạy migration trước khi start; không bật VERCEL.

3. Chạy `docker compose --env-file .env.production up -d --build`. Kiểm tra `docker compose logs --tail=80` và `curl --fail http://127.0.0.1:3000/api/health`.
4. Nginx trong server block của domain (sau đó cài HTTPS bằng Certbot):

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Giữ cổng Node chỉ bind 127.0.0.1 như compose. `TRUST_PROXY=1` chỉ dùng khi Nginx ghi đè X-Real-IP; tránh để client truy cập trực tiếp Node. SITE_ORIGIN phải đúng origin HTTPS để form qua reverse proxy được chấp nhận.

5. Gửi RSVP thử cả đồng ý/không đồng ý công khai, gửi lời chúc, kiểm tra pending trước khi duyệt. Duyệt bằng `docker compose exec invitation npm run moderate -- pending` rồi `docker compose exec invitation npm run moderate -- approve ID`.
6. Restart container, xác minh phản hồi vẫn còn. Quét QR bằng điện thoại và kiểm tra người nhận trước khi chia sẻ. Giờ lễ hiện chưa có, ngày đang ghi dự kiến.

Sao lưu SQLite: dừng app trước khi copy để có snapshot nhất quán:

```sh
docker compose stop invitation
docker compose cp invitation:/app/data ./backup-data
docker compose start invitation
```

Giữ backup ngoài VPS và trước mỗi release. Không chạy `docker compose down -v` vì sẽ xóa volume. Khi cập nhật, giữ volume và backup; rollback mã nguồn không tự rollback schema. Docker build và Nginx cần kiểm tra thực tế trên VPS; chưa được chạy trên máy Windows này.
