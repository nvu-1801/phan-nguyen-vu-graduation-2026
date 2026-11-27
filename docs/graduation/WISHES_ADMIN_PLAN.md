# Kế hoạch lời chúc và trang quản lý

## Mục tiêu

- Khách có thể chọn một lời gợi ý, sửa thành câu của mình hoặc tự viết từ đầu.
- Khách chủ động chọn công khai tên và lời chúc; mặc định là riêng tư.
- Mục lời chúc công khai trên thiệp chỉ hiện bài đã đồng ý công khai.
- Trang `/admin` cho Vũ xem tất cả lời chúc, kể cả riêng tư, và xoá khi cần.

## Phạm vi bản đầu

1. Giữ lời nhắn riêng tư mặc định; giải thích lựa chọn ngay cạnh checkbox đồng ý công khai.
2. Hiển thị danh sách công khai với trạng thái đang tải, trống, lỗi, và nút tải thêm.
3. Tạo đăng nhập `/admin` bằng `ADMIN_PASSWORD`, phiên cookie HttpOnly ký bởi `ADMIN_SESSION_SECRET`, SameSite=Strict và thời hạn 8 giờ.
4. Giới hạn thử đăng nhập theo IP bằng bảng `rate_limits`; chỉ lưu HMAC của IP.
5. API admin trả danh sách tên, nội dung, thời điểm, đồng ý công khai, trạng thái duyệt và thời điểm xử lý; không trả IP, khóa idempotency hay request hash. Mutation duyệt/từ chối dùng phiên admin + kiểm tra Origin, chỉ chuyển từ `pending`.
6. Fail closed khi thiếu cấu hình admin; không ghi thông tin đăng nhập, lời riêng tư hoặc secret vào log.

## Cách xoá lời chúc

Lời chúc công khai ngay khi người gửi đồng ý; không có bước duyệt. Trang `/admin` có nút **Xoá lời chúc** với xác nhận lần hai, gọi `DELETE /api/admin/wishes/[id]`. Endpoint chỉ chấp nhận khi:

- Có cookie phiên admin hợp lệ (HttpOnly, SameSite=Strict, 8 giờ).
- Header `Origin` khớp `SITE_ORIGIN` (hoặc origin của request khi chạy local).
- Id là UUID hợp lệ; bản ghi không tồn tại trả `404`.

Xoá chỉ bỏ dòng trong bảng `wishes`, không xoá xác nhận tham dự của người đó. Lệnh `npm run moderate -- pending`, `approve <id>` và `reject <id>` vẫn dùng được như công cụ dự phòng để ẩn/đăng lại.

Đã kiểm thử: chưa đăng nhập trả 401, sai Origin trả 403, xoá xong bản ghi mất khỏi `/api/wishes` và khỏi DB; lời riêng tư không xuất hiện ở trang công khai; nội dung render dạng text.

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
