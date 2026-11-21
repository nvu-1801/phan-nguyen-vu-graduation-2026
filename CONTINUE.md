# Graduation 2026 · Checkpoint

Mục tiêu là thiệp mời tốt nghiệp của Phan Nguyên Vũ chạy trên Vercel Preview riêng. Nhánh thực hiện `preview/graduation-2026`, tiếp nối commit `0581d38d8c88cfa23fe35512550dd5519d5f7b74`.

## Kế hoạch chỉnh giao diện

1. Bố cục thiệp giữ ảnh chân dung làm trọng tâm. Dùng nền giấy ấm và đỏ nâu lấy từ dải khăn trong ảnh. Phần mở đầu có một lời mời, ngày dự kiến và một nút xác nhận.
2. Gộp ngày, địa chỉ, bản đồ và lịch vào một mục. Giữ cả hai ảnh thật, bỏ khối cuộn 3D, đếm ngược và các đoạn dẫn lặp. Đưa QR cà phê xuống chân trang.
3. Khi Vercel chưa có DB, dùng nút nhắn tin và gọi điện. Khi có DB đúng cấu hình, hiển thị lại form và danh sách phản hồi. Backend SQLite/libSQL, migration và kiểm duyệt tiếp tục dùng được.
4. Chạy CI trên nhánh Preview trước khi cập nhật main. Deploy Production từ SHA đã kiểm thử, xác minh trang mở được, ảnh tải và các nút liên hệ có đúng đích.

## Hạ tầng

Project Vercel: `phan-nguyen-vu-graduation-2026` trong `nguyen-vus-projects-0643d880`. Phát hành giao diện với lựa chọn liên hệ trực tiếp theo yêu cầu. Webform cần DB SQLite-compatible có lưu trữ lâu dài. Cấu hình kết nối và migration ở README.
