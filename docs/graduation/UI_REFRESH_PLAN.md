# Graduation 2026 — Kế hoạch chỉnh giao diện

## Phạm vi

Dùng commit `517df3d` làm mốc nội dung. Giữ hai chân dung, thông tin buổi lễ, thư mời, phần kỷ niệm, QR cà phê, bản đồ và lịch. Giữ phương án SMS/gọi khi chưa có DB, cùng form RSVP và lời chúc khi có DB. Ngày 20/12/2026 vẫn là ngày dự kiến.

## Bố cục và nội dung

1. **Mở đầu.** Nền xanh nhạt, chữ xanh đậm, ảnh chân dung là điểm nhấn. Giữ một nút xác nhận tham dự. Bỏ dấu chấm giữa cụm chữ và dấu chấm dùng làm họa tiết.
2. **Ngày và địa điểm.** Gộp ngày, địa chỉ, đếm ngược theo ngày, liên kết bản đồ và tải lịch. Ghi rõ giờ tổ chức đang chờ cập nhật.
3. **Kỷ niệm và thư mời.** Dùng ảnh thứ hai và một đoạn thư ngôi thứ nhất. Lời mời nêu cụ thể mong muốn gặp lại, cảm ơn và chụp ảnh cùng khách. Bố cục ảnh tĩnh để giữ nhịp đọc.
4. **Xác nhận và lời chúc.** Giữ các mục riêng với form khi chưa có lỗi cấu hình và liên hệ trực tiếp qua SMS/gọi khi thiếu DB. Đặt QR ở cuối trang, mở khi người xem chọn.
5. **Thiết kế.** Nền xanh phấn, xanh hải quân cho chữ và CTA, thẻ trắng xanh, viền mảnh. Tách nội dung bằng khoảng trắng và cấp chữ. Giữ bố cục một cột trên điện thoại, hai cột ở màn hình rộng.

## Tiêu chí phát hành

Kiểm tra lint, TypeScript, SQLite và Playwright; rà ảnh, liên kết lịch/bản đồ, liên hệ, hộp thoại QR và trường hợp thiếu DB. Kiểm tra tại 360, 390, 768, 1440 px. Push main và xác minh URL Production sử dụng đúng commit.
