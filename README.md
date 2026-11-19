# Phan Nguyên Vũ · Graduation 2026

Bootstrap để chat web triển khai website thiệp mời tốt nghiệp. **Chưa có ứng dụng hoàn chỉnh, chưa build/deploy.**

## Bắt đầu

1. Đọc [kế hoạch triển khai](docs/graduation/IMPLEMENTATION_PLAN.md).
2. Đọc [manifest bàn giao](docs/graduation/SOURCE_MANIFEST.md) và `assets/manifest.json`.
3. Dùng [prompt thực thi](docs/graduation/WEB_CHAT_PROMPT.md).

## Đã đóng gói

- Hai ảnh JPEG gốc của Phan Nguyên Vũ ở `assets/originals/`; chưa crop/resize, cần kiểm tra ảnh và bỏ EXIF trước khi xuất bản derivatives.
- Source motion kit tái sử dụng tại `vendor/motion-kit/`, tài liệu tại `docs/motion-kit/`.
- `vendor/source-package.json` và lockfile là bằng chứng dependency của workspace nguồn; không phải app package ở root. Agent triển khai phải tạo root package phù hợp.
- Ba skill UI/motion trong `docs/graduation/skills/`.
- Content, kiến trúc SQLite, API, pipeline, kiểm thử và Vercel trong kế hoạch.

DB production chưa được cấp: đề xuất libSQL từ xa tương thích SQLite để giữ dữ liệu trên Vercel; không dùng file SQLite tạm trên serverless. QR cà phê tắt cho đến khi có thông tin thật. Không đưa dữ liệu khách của web tham khảo vào ứng dụng.

Không có lịch tự động hoặc Vercel project được tạo trong bước bootstrap. Người dùng sẽ giao prompt cho phiên chat web có môi trường code và quyền GitHub/Vercel.
