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

## Vercel Preview

Gắn DB libSQL dành riêng cho Preview, ví dụ Turso Cloud. Đặt `DATABASE_URL` và `DATABASE_AUTH_TOKEN` ở môi trường Preview hoặc dùng `TURSO_DATABASE_URL` và `TURSO_AUTH_TOKEN` do tích hợp Turso cung cấp. Đặt `RATE_LIMIT_SECRET` dưới dạng biến nhạy cảm ở Preview. Có thể đặt `NEXT_PUBLIC_SITE_URL` nếu dùng URL chuẩn riêng.

Nạp biến bằng kênh bảo mật rồi chạy `npm run db:migrate` trên DB Preview trước khi tạo deployment. Deploy đúng SHA đã qua CI của `preview/graduation-2026` bằng một luồng deploy, với Vercel Authentication. Xác minh HTTPS, health, ảnh, luồng gửi nhận và dữ liệu còn sau redeploy. Dọn dữ liệu thử theo đúng ID thử nghiệm. Thư mục SQLite trên Vercel không phải nơi lưu dữ liệu của ứng dụng.

Ảnh và nội dung sự kiện chưa xác nhận chính thức được ghi trong kế hoạch. Việc mở quyền truy cập và phát hành Production cần quyết định riêng.
