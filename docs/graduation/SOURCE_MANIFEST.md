# Manifest bộ bàn giao

Ngày đóng gói: 19/11/2026. Repo: https://github.com/nvu-1801/phan-nguyen-vu-graduation-2026 — branch main.

## Đã đóng gói

- Hai ảnh JPEG gốc trong assets/originals, chưa chỉnh sửa/crop/resize. Không có ảnh 9511.
- Motion kit: vendor/motion-kit (18 files); dependency evidence: vendor/source-package.json và source-package-lock.json.
- Tài liệu tích hợp/kiến trúc/pattern: docs/motion-kit.
- Plan, prompt và 3 skill snapshots: docs/graduation.
- README, AGENTS, CONTINUE, env example và git ignore. Chưa implement app hoặc deploy.

| Asset | Bytes | SHA256 |
|---|---:|---|
| assets/originals/vu-9516.jpg | 10242827 | 96129681674fceac274cf3a66a19104921ba26e80e19bff51aff2ae9c75ac1ee |
| assets/originals/vu-9505.jpg | 8831397 | 52dc6b066862e1229d77dc7f2e713774487b3c5a639e946183babec6c5c696a9 |

assets/manifest.json có SHA256 và byte count cho từng file motion source và hai ảnh. Verify trước khi chỉnh sửa. Không cần truy cập ổ D: để implement trên chat web.

Skill nguồn: nvu-1801/ui-motion-skills, commit 48377973bd111a14f1fd5542bfecea1cf48ba5d1. Motion kit là source workspace local của người dùng, không gán nhầm là code tải từ repo skill. Workspace nguồn không có .git nên không có commit gốc.

Các đoạn ghi “chưa đóng gói/chưa copy” trong kế hoạch là lịch sử pha lập kế hoạch; manifest hiện tại cập nhật trạng thái sau khi người dùng cho phép bootstrap. Chưa có production DB/provider/credentials, website app, CI app, build/test app, Vercel project hoặc task lịch. Không báo bootstrap là sản phẩm hoàn chỉnh.

## Runner web cần làm

Đọc IMPLEMENTATION_PLAN.md và WEB_CHAT_PROMPT.md, xem cả hai ảnh, tạo app root package mới, tích hợp vendor/motion-kit cần thiết, xử lý derivatives public bỏ EXIF, implement UI và backend, kiểm thử rồi deploy theo quyền trong prompt người dùng gửi.
