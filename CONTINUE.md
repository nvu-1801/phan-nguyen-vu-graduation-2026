# Graduation 2026 · Checkpoint

Mục tiêu là thiệp mời tốt nghiệp của Phan Nguyên Vũ chạy trên Vercel Preview riêng. Nhánh thực hiện `preview/graduation-2026`, tiếp nối commit `0581d38d8c88cfa23fe35512550dd5519d5f7b74`.

## Ứng dụng

- Next.js App Router và TypeScript, giao diện tiếng Việt với vé mời, đếm ngược, tải lịch, thư, RSVP, sổ lưu bút, QR và liên kết Google Maps.
- Tích hợp camera/progress từ motion kit vào hai postcard, với poster HTML khi tắt motion hoặc WebGL hỏng.
- SQLite/libSQL, migration bổ sung lời nhắn RSVP riêng tư, validation/consent, idempotency, rate limit, phân trang, health và CLI kiểm duyệt.
- CI checkout đầy đủ, xử lý ảnh gốc, build và Playwright. QR đã đối chiếu SHA-256. Trình kết nối GitHub xác minh được blob của hai JPEG nhưng không chuyển được byte gốc vào shell. CI kiểm tra SHA-256 từng ảnh, sinh WebP bỏ EXIF rồi kiểm tra tải ảnh trên trình duyệt. Chưa kiểm tra crop/mặt/mũ, tách nền hoặc ảnh campus.
- Lint, TypeScript, production build với chế độ fallback cục bộ, 1 test SQLite và 9 bài Playwright đã qua. Test ảnh thật/WebGL fallback chờ checkout đầy đủ. Axe tại 390px không có vi phạm serious/critical.
- Không đọc được quota Codex thực và chưa quét QR bằng ứng dụng ngân hàng thật.

## Phát hành

- Project Vercel `phan-nguyen-vu-graduation-2026` đã tạo trong `nguyen-vus-projects-0643d880`, bật Vercel Authentication cho Preview và thiết lập biến rate-limit chỉ cho Preview. Project chưa liên kết GitHub để tránh một lượt triển khai main ngoài phạm vi.
- Thiếu DB libSQL Preview và thông tin xác thực. Vercel Marketplace yêu cầu đăng nhập để cấp Turso. Cần gắn một DB Preview riêng, chạy migration, kiểm tra CI ở SHA đầu nhánh, rồi triển khai Preview và xác minh dữ liệu vẫn còn sau redeploy.
- Không có URL website Preview hoặc Production ở thời điểm checkpoint.
