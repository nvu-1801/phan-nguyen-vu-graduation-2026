# Nhạc nền thiệp mời

## Bản nhạc

| Trường | Giá trị |
|---|---|
| Tên | Graduation Background Music |
| Tác giả | MaksymMalko |
| Nguồn | https://pixabay.com/music/modern-classical-graduation-background-music-334864/ |
| File gốc trên Pixabay | `https://cdn.pixabay.com/download/audio/2025/04/30/audio_99799c61c8.mp3?filename=maksymmalko-graduation-background-music-334864.mp3` |
| Giấy phép | [Pixabay Content License](https://pixabay.com/service/license-summary/) |
| Ngày phát hành trên Pixabay | 30/04/2025 |
| Thời lượng | 1:22 |
| Nhạc cụ | Guitar mộc, piano, dàn dây |
| Tải về | 28/11/2026 |
| File trong repo | `public/audio/graduation-background-music.mp3` |
| Dung lượng | 2.627.291 bytes |
| SHA-256 | `4b9dc84dbe0b5163b8bb291dcfd253ed152f7ca60c1c3aef4bad904a017d8388` |

Pixabay ghi bản nhạc này đã đăng ký Content ID. Giấy phép cho phép dùng miễn phí
trong website; nếu sau này dùng lại trong video đăng YouTube, hệ thống Content ID
có thể nhận diện và gắn claim. Điều đó không ảnh hưởng tới việc nhúng trên website.

Ghi công hiển thị ở cuối trang: “Nhạc nền: Graduation Background Music —
MaksymMalko · Pixabay”.

## Hành vi trên website

- **Không tự phát.** Trình duyệt chỉ phát sau khi khách bấm nút loa ở cụm nút nổi.
- Nút có `aria-pressed` và nhãn đổi giữa “Bật nhạc nền” / “Tắt nhạc nền”.
- Nhạc lặp vô hạn, âm lượng mục tiêu 0.32, tăng/giảm dần trong 0.9 giây.
- Lựa chọn được lưu trong `localStorage` (`vu-graduation-music`). Lần sau mở lại,
  nhạc chỉ tiếp tục **sau thao tác chạm phím/chuột đầu tiên**, đúng chính sách
  autoplay của trình duyệt.
- Tự tạm dừng khi tab bị ẩn và phát lại khi quay lại tab nếu khách vẫn bật.
- Nếu tệp lỗi hoặc trình duyệt chặn, nút trở về trạng thái tắt và có thông báo
  ẩn (`role="status"`) cho trình đọc màn hình.
- Tôn trọng `prefers-reduced-motion`: hiệu ứng sóng nhạc đứng yên, không ảnh
  hưởng tới việc phát nhạc.

## Kiểm tra

```sh
npm run lint
npm run typecheck
npm run build
npm run test:browser -- -g "background music"
```
