# Checkpoint triển khai

Mục tiêu: thiệp mời tốt nghiệp tiếng Việt cho Phan Nguyên Vũ, Preview riêng trong Vercel team nguyen-vus-projects-0643d880.

Repo: nvu-1801/phan-nguyen-vu-graduation-2026. Nguồn main, mốc bàn giao d718e4442b50ef7c0c9143f804aa76c18026554a. Nhánh làm việc: preview/graduation-2026. Shell kiểm thử: /workspace/scratch/b57532a0abb7/graduation-work.

Đã đọc AGENTS.md, toàn bộ ba tài liệu bàn giao và ba snapshot UI/motion. Đã thêm db/migrations/0001_initial.sql, scripts/migrate-local.mjs và tests/db/migration.test.mjs. Node v24.22.3. Lệnh node --test tests/db/migration.test.mjs: 1 đạt, 0 lỗi, kiểm tra migration chạy lại, lưu RSVP qua lần mở mới, defaults consent/pending, ràng buộc key/trạng thái và mở bản sao DB thử. DB thử được dọn sau test.

Quota: không có get_usage_limits được cấp. Thử account/rateLimits/read qua Codex app-server không thu được số liệu. Không xác minh được quota thật.

GitHub connector đọc được commit và tài liệu. Shell git ls-remote yêu cầu xác thực, gh auth status chưa đăng nhập. GitHub Contents API trả body rỗng cho JPEG lớn, blob connector lỗi giải mã JPEG thành UTF-8. Chưa xem hai chân dung, chưa xác minh byte/hash ảnh trong shell. Tìm thấy trang chính thức FPT Quy Nhơn (https://daihoc.fpt.edu.vn/en/quy-nhon/) nhưng chưa xác minh quyền tái sử dụng ảnh. Vercel team đọc được, tìm dự án theo repo và tên graduation đều trả 0. Chưa có cấu hình DB SQLite-compatible bền vững dành riêng cho Preview được xác minh.

Tiếp theo: checkout repo private bằng Git xác thực, xác minh asset theo manifest và xem ảnh thật, rồi implement UI, tích hợp motion kit, RSVP/consent/wishes/moderation, migrator remote, CI và test theo plan. Preview chỉ sau khi có build/test đạt, project đúng scope và DB riêng đã migrate. Chưa build ứng dụng, kiểm tra viewport hoặc deploy. Không có tiến trình build/deploy cần theo dõi.
