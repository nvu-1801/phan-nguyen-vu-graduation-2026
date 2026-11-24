# Phan Nguyên Vũ · Graduation 2026

Thiệp mời tốt nghiệp tiếng Việt, viết bằng Next.js và SQLite. Xem [kế hoạch](docs/graduation/IMPLEMENTATION_PLAN.md), [manifest nguồn](docs/graduation/SOURCE_MANIFEST.md) và [trạng thái triển khai](CONTINUE.md).

## Chạy trên máy

Dùng Node phiên bản trong `.node-version` và checkout đầy đủ repo riêng tư để có ảnh gốc.

```sh
npm ci
npm run db:migrate
npm run dev
```

Mở http://localhost:3000. DB mặc định là `data/graduation.db`. Build xuất ảnh WebP bỏ metadata từ hai JPEG, kiểm tra SHA-256 của JPEG và sao chép nguyên byte ảnh QR. Các ảnh công khai sinh vào `public/images` và `public/payments`.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

Playwright khởi tạo file SQLite riêng trong thư mục kết quả và chạy trên bản build production. Dữ liệu này được tạo lại mỗi lần chạy.

## Kiểm duyệt

```sh
npm run moderate -- pending
npm run moderate -- approve <id>
npm run moderate -- reject <id>
npm run moderate -- cleanup
```

Dùng cấu hình DB đúng môi trường khi chạy. Chỉ lời chúc đã duyệt và có consent mới xuất hiện. RSVP công khai chỉ hiện tên và trạng thái khi khách đồng ý, lời nhắn RSVP luôn riêng tư.

## Quản lý lời chúc

Mở `/admin` để xem lời chúc và xác nhận tham dự, kể cả nội dung riêng tư. Cấu hình `ADMIN_PASSWORD` (tối thiểu 16 ký tự) và `ADMIN_SESSION_SECRET` (tối thiểu 32 ký tự ngẫu nhiên) trong môi trường server. Không đưa hai giá trị này vào Git. Phiên đăng nhập dùng cookie HttpOnly và tự hết hạn sau 8 giờ. Bản hiện tại chỉ xem; duyệt/từ chối vẫn dùng lệnh `npm run moderate` ở trên.

## Vercel

Có thể phát hành thiệp mời và liên hệ trực tiếp khi chưa cấu hình DB. Trang sẽ hiển thị nút SMS/gọi điện trong mục xác nhận. Khi kết nối DB, website hiển thị form RSVP và lời chúc như ở bản chạy cục bộ.

Để dùng form trên Vercel, đặt `DATABASE_URL` và `DATABASE_AUTH_TOKEN` (hoặc `TURSO_DATABASE_URL` và `TURSO_AUTH_TOKEN`) cho môi trường tương ứng. Tách DB Preview và Production. Đặt `RATE_LIMIT_SECRET` dưới dạng biến nhạy cảm. Có thể đặt `NEXT_PUBLIC_SITE_URL` cho URL chuẩn.

Nạp các biến bằng kênh bảo mật và chạy `npm run db:migrate` trên DB được chọn. Redeploy, kiểm tra health và dữ liệu gửi qua form. Thư mục SQLite trên máy chạy Vercel không phải là nơi lưu dữ liệu của ứng dụng.

## VPS

Xem [hướng dẫn Docker, Nginx, SQLite và backup](docs/VPS.md). Template `deploy/production.env.example` có sẵn chỗ điền `ADMIN_PASSWORD`/`ADMIN_SESSION_SECRET` (bỏ comment khi cấu hình). Không deploy tự động trong phiên này.

## Production local bằng Docker

`npm run docker:local` chạy cả FE/API + SQLite volume tại http://localhost:3020. `npm run docker:smoke` kiểm tra ghi/đọc, quyền riêng tư và persistence sau recreate container. Xem [hướng dẫn VPS](docs/VPS.md) và [kết quả production](docs/PRODUCTION_VERIFICATION.md).
