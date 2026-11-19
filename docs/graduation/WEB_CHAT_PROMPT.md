# Prompt cho chat web thực thi

Dùng sau khi bộ bàn giao đã được push lên repo đích. Thay URL, branch, SHA bằng kết quả thật; không để placeholder trong task được lên lịch.

```text
Hãy build website thiệp mời tốt nghiệp của tôi, Phan Nguyên Vũ, dựa trên repo:
REPOSITORY_URL: <điền URL repo nvu-1801 đã push>
BOOTSTRAP_BRANCH: <branch thật>
BOOTSTRAP_SHA: <commit thật chứa docs, ảnh và motion source>

Đây là phiên thực thi dự kiến bắt đầu 03:00 ngày 20/11/2026 giờ Việt Nam (UTC+7), không phải giới hạn làm việc 3 giờ. Hãy thực hiện công việc trong môi trường code có quyền đọc repo, chạy lệnh, push GitHub và deploy Vercel. Nếu môi trường lịch không thực thi code, nói rõ giới hạn, không báo giả đã build/push.

Đọc AGENTS.md của repo và docs/graduation/IMPLEMENTATION_PLAN.md, SOURCE_MANIFEST.md, cùng skill snapshots ui-design, scroll-storytelling, web-3d-scenes trước khi sửa. Kiểm tra quota tài khoản thật nếu có get_usage_limits; không nhầm quota với context. Tuân thủ checkpoint dưới 5% như docs.

Yêu cầu: thiệp mời tiếng Việt phong cách nền than/giấy kem/cam, hai ảnh thật của Vũ, tên/trường/ngày dự kiến/địa điểm theo docs; một đoạn scroll 3D ngắn gồm 2 postcard, native scroll, reduced-motion/WebGL fallback. Tái sử dụng motion kit đã đóng gói; chữ và CTA là HTML. Không sử dụng branding, ảnh, QR, dữ liệu khách hoặc lời chúc của web mẫu. Tắt cà phê/QR khi chưa có thông tin thật.

Implement toàn bộ Next.js App Router/TypeScript, responsive UI, SQLite local, production SQLite-compatible libSQL remote nếu đã có provider/credentials được chốt, RSVP yes/no, consent public mặc định false, lời chúc pending/moderation, API validation/idempotency/rate limit bền vững, migrations, env example, CI, tests và README. Không dùng SQLite file trong /tmp làm DB production Vercel. Không thay bằng localStorage giả backend.

Repo hiện có thể mới là bootstrap. Xác minh hai ảnh có thật trong repo và motion source đọc được từ web runner. Nếu thiếu thì báo chính xác, đừng dùng đường dẫn D: hoặc ảnh mẫu thay thế. Pin dependency/Node tương thích và lockfile; không copy node_modules/.next/.env/DB thật.

Thực hiện static UI trước, sau đó motion và backend, kiểm thử, preview rồi production. Được phép commit/push code triển khai vào repo nvu-1801 được chỉ định và deploy Vercel cho website này khi quyền kết nối sẵn có. Không merge/push repo khác, không ghi đè lịch sử Git, không tạo dịch vụ trả phí hoặc xóa dữ liệu. Nếu chưa có secret/provider, hoàn tất UI, SQLite local, CI và phần chuẩn bị deploy; nêu rõ blocker thay vì giả production hoạt động. Không đưa secrets vào source hoặc log.

Chạy các kiểm tra cần thiết trong docs: lint/typecheck/build, API+SQLite tests, Playwright production với consent/idempotency/moderation, responsive screenshots, reduced motion và WebGL fallback. Chỉ công bố khi kiểm tra đạt và schema production sẵn sàng. Không seed fixture vào production hoặc dùng production DB cho test. Nếu thất bại thì sửa trong scope, không bỏ check cho xanh.

Kết thúc hãy báo bằng tiếng Việt: repo/branch/commit SHA thật, URL preview và production nếu có, kiểm tra thực chạy và kết quả, phần chưa xong/blocker. Cập nhật CONTINUE.md để tôi tiếp tục kiểm tra sau. Đừng dừng ở một bản kế hoạch thứ hai nếu có đủ môi trường thực thi và quyền cần thiết.
```

Lưu ý: quyền push/deploy trong prompt này chỉ có hiệu lực khi người dùng gửi prompt cho phiên thực thi; file này không tự cấp quyền để phiên lập kế hoạch hiện tại push/deploy.
