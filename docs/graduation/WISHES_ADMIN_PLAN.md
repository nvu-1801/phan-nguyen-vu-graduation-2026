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
5. API admin trả danh sách tên, nội dung, thời điểm, đồng ý công khai, trạng thái duyệt và thời điểm xử lý; không trả IP, khóa idempotency hay request hash. Mutation duyệt/từ chối dùng phiên admin + kiểm tra Origin, chỉ chuyển từ `pending`.
6. Fail closed khi thiếu cấu hình admin; không ghi thông tin đăng nhập, lời riêng tư hoặc secret vào log.

## Cách duyệt lời chúc

Trang `/admin` đã có nút **Duyệt** / **Từ chối** cho từng lời chúc đang chờ. Luồng này yêu cầu bấm xác nhận lần hai, gọi `PATCH /api/admin/wishes/[id]` với `{ "action": "approve" | "reject" }`, và chỉ chấp nhận khi:

- Có cookie phiên admin hợp lệ (HttpOnly, SameSite=Strict, 8 giờ).
- Header `Origin` khớp `SITE_ORIGIN` (hoặc origin của request khi chạy local).
- Lời chúc đang ở trạng thái `pending`; bản ghi đã xử lý trả `409`.
- Nội dung gửi là JSON nhỏ, không phải HTML.

Mỗi lần cập nhật ghi `moderated_at` và `moderated_by` (`admin` cho web, `cli` cho script). Duyệt không đổi `public_consent`, nên lời riêng tư vẫn riêng tư. Lệnh `npm run moderate -- pending`, `approve <id>` và `reject <id>` vẫn dùng được như phương án dự phòng.

Đã kiểm thử: chưa đăng nhập trả 401, sai Origin trả 403, duyệt lại trả 409, lời đã từ chối và lời riêng tư không xuất hiện ở `/api/wishes`, nội dung render dạng text. Nếu sau này cần hoàn tác quyết định duyệt, phải thêm trạng thái/undo có kiểm toán riêng — hiện chưa có.

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
