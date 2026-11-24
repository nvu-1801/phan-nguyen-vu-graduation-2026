# Kế hoạch lời chúc và trang quản lý

## Mục tiêu

- Khách có thể chọn một lời gợi ý, sửa thành câu của mình hoặc tự viết từ đầu.
- Khách chủ động chọn công khai tên và lời chúc sau khi Vũ duyệt; mặc định là riêng tư.
- Mục lời chúc công khai trên thiệp chỉ hiện bài đã đồng ý công khai và được duyệt.
- Trang `/admin` cho Vũ xem tất cả lời chúc, kể cả riêng tư, cùng trạng thái duyệt.

## Phạm vi bản đầu

1. Giữ lời nhắn riêng tư mặc định; giải thích lựa chọn ngay cạnh checkbox đồng ý công khai.
2. Hiển thị danh sách công khai với trạng thái đang tải, trống, lỗi, và nút tải thêm.
3. Tạo đăng nhập `/admin` bằng `ADMIN_PASSWORD`, phiên cookie HttpOnly ký bởi `ADMIN_SESSION_SECRET`, SameSite=Strict và thời hạn 8 giờ.
4. Giới hạn thử đăng nhập theo IP bằng bảng `rate_limits`; chỉ lưu HMAC của IP.
5. API admin chỉ đọc danh sách tên, nội dung, thời điểm, đồng ý công khai và trạng thái duyệt; không trả IP, khóa idempotency hay request hash.
6. Fail closed khi thiếu cấu hình admin; không ghi thông tin đăng nhập, lời riêng tư hoặc secret vào log.

## Cách duyệt lời chúc

Bản đầu chỉ xem dữ liệu. Lệnh `npm run moderate -- pending`, `approve <id>` và `reject <id>` hiện có vẫn là cơ chế duyệt. Trước khi bổ sung nút duyệt trên web, cần thêm xác nhận thao tác, kiểm tra CSRF, ghi nhận thời điểm/người duyệt và kiểm soát quyền. Không tự động công khai lời riêng tư kể cả khi Vũ duyệt.

## Cấu hình triển khai

Thêm hai biến bí mật vào môi trường server, không commit vào Git:

- `ADMIN_PASSWORD`: mật khẩu riêng, dài ít nhất 16 ký tự.
- `ADMIN_SESSION_SECRET`: chuỗi ngẫu nhiên riêng, ít nhất 32 ký tự; dùng ký cookie.

Sau khi thêm env trên Vercel hoặc VPS, restart/redeploy để có hiệu lực. Trang admin báo thiếu cấu hình mà không cho đăng nhập nếu chưa có đủ biến.

## Kiểm tra trước khi dùng

- Cookie không xuất hiện trong JavaScript và hết hạn sau 8 giờ.
- Sai mật khẩu bị giới hạn; lỗi DB hoặc thiếu secret không mở trang admin.
- Không đăng nhập thì API trả 401; danh sách admin không được cache.
- Lời riêng, đang chờ duyệt và bị từ chối không xuất hiện ở thiệp công khai.
- Màn hình quản lý dùng được ở điện thoại và desktop; tên/lời chúc hiển thị dạng text, không render HTML.
