# Phan Nguyên Vũ — Graduation 2026

Ngày soạn: 19/11/2026. Đây là đặc tả để bàn giao cho chat web thực thi, chưa phải website đã implement.

## 1. Mục tiêu và phạm vi đã chốt

Website thiệp mời tốt nghiệp tiếng Việt của **Phan Nguyên Vũ**, tham khảo https://heejoon-graduation-2026.vercel.app/ và thêm một đoạn scroll 3D nhẹ. Dùng hai ảnh người dùng cung cấp; nội dung viết mới; cùng trường và địa điểm với mẫu. DB thuộc hệ SQLite. Mã nguồn nằm trong tài khoản GitHub **nvu-1801**, deploy Vercel.

Quy trình: soạn docs trước → người dùng cho phép chuẩn bị/push bộ bàn giao → chat web có quyền truy cập repo chạy build theo docs lúc 03:00 ngày 20/11/2026, giờ Việt Nam (Asia/Ho_Chi_Minh, UTC+7). Đây là giờ bắt đầu dự kiến, không phải cam kết deadline hoàn thành. Không tự tạo lịch ở bước lập kế hoạch. Chat không mặc nhiên chạy sau khi đóng phiên; cần nền tảng thực thi lịch có môi trường code, GitHub và Vercel thực sự.

## 2. Bằng chứng và điều chưa có

Đã đọc HTML công khai web mẫu ngày 19/11/2026, lưu ở `docs/graduation-reference.html` trong workspace gốc. Quan sát được Next.js, các section hero, lễ, thư mời, RSVP, danh sách phản hồi, cà phê, lời chúc, bản đồ, kết. HTML công khai không cung cấp toàn bộ source/backend gốc; phải tự viết ứng dụng mới. Không đưa ảnh, QR, dữ liệu khách hay branding HeeJoon vào sản phẩm của Vũ.

Thông tin từ mẫu, dùng theo chỉ dẫn của người dùng, chưa phải xác nhận chính thức của trường:

| Trường dữ liệu | Giá trị |
|---|---|
| Tên | Phan Nguyên Vũ |
| Trường | Đại học FPT — Quy Nhơn |
| Năm | 2026 |
| Ngày dự kiến | Chủ nhật, 20/12/2026 |
| Giờ tổ chức | Chưa cập nhật, không tự điền |
| Địa điểm | Trung tâm Hội nghị tỉnh Gia Lai |
| Địa chỉ | 01 Nguyễn Tất Thành, phường Quy Nhơn, tỉnh Gia Lai, Việt Nam |
| Địa phương | Quy Nhơn, Gia Lai |
| Múi giờ | Asia/Ho_Chi_Minh |

Không tự suy ra chuyên ngành, khóa học, thành tích, số năm học, số điện thoại, tài khoản ngân hàng. Không sao chép lời chúc/khách mời trên mẫu. Countdown đến `2026-12-20T00:00:00+07:00`, ghi rõ là đếm đến ngày, không phải giờ khai mạc; về 0 sau mốc, không hiển thị số âm. File lịch chỉ tạo sự kiện cả ngày, nhãn “dự kiến”, cho đến khi có giờ chính thức.

Workspace gốc `D:\backup\Portfolio 3D` có Next.js, React, Three, GSAP, motion kit và tài liệu. `git status`, `git branch`, `git log` trả **not a git repository** ngày soạn. Không có remote/branch/commit local để báo cáo. Không thay landing portfolio hiện tại; chuẩn bị ứng dụng riêng `phan-nguyen-vu-graduation-2026` (tên repo đề xuất, cần kiểm tra trùng khi tạo).

## 3. Hướng thiết kế

Thiệp tốt nghiệp mang cảm giác editorial: nền than `#10100F`, giấy kem `#F4EEDF`, chữ sáng `#FAF7EF`, cam `#ED6A2D`, đường kẻ mảnh. Đây là token đề xuất cho brand riêng của Vũ. Font sans hỗ trợ tiếng Việt cho điều hướng/nội dung; serif hỗ trợ đầy đủ tiếng Việt cho lời mời. Self-host font khi có thể, hệ thống fallback nếu tải thất bại.

Hero desktop chia chữ 55% / ảnh 45%, tên hiển thị nhiều dòng có chủ ý, không ép một dòng. Mobile xếp dọc, CTA thấy sớm, không cắt mặt/mũ. Khoảng trắng lớn, ảnh thật là trọng tâm, chữ rõ và tương phản. Không thêm dashboard vào trang mời. Menu sticky gọn, skip link, điều hướng anchor chuẩn `#dia-diem` (bỏ phần hostname thừa trong link người dùng gửi).

| Thứ tự | Section / hành vi |
|---|---|
| 1 | Hero: tên, trường, ảnh, “Hẹn bạn trong ngày mình tốt nghiệp.”, CTA xác nhận và địa điểm |
| 2 | Vé mời: ngày dự kiến, trường, địa điểm, countdown và tải lịch |
| 3 | Hành trình: hai ảnh dạng postcard trong một đoạn scroll 3D ngắn |
| 4 | Thư mời riêng cho Vũ trên nền giấy |
| 5 | RSVP: đến / gửi lời chúc từ xa, tên, lời nhắn tùy chọn, đồng ý công khai riêng |
| 6 | Danh sách phản hồi công khai: chỉ người đồng ý, phân trang, empty/loading/error |
| 7 | Tường lời chúc và form gửi: chỉ hiển thị lời đã duyệt và được đồng ý công khai |
| 8 | Bản đồ, mở Google Maps, sao chép địa chỉ có thông báo kết quả |
| 9 | Lời cảm ơn và chữ ký Phan Nguyên Vũ |

Khối cà phê/QR của mẫu để **tắt mặc định**, vì chưa có thông tin của Vũ. Không dùng QR của bạn học, không chế QR. Không nhạc tự phát, không confetti lặp vô hạn, không giả số lượng người tham gia.

## 4. Content mới để implement

- Eyebrow: “THIỆP MỜI TỐT NGHIỆP · 2026”.
- Hero: “PHAN NGUYÊN VŨ” / “Hẹn bạn trong ngày mình tốt nghiệp.”
- Hero body: “Một cột mốc mới, và một cuộc hẹn với những người mình trân quý. Mời bạn đến chung vui, chụp cùng mình một tấm hình và giữ lại chút thanh xuân này.”
- CTA: “Mình sẽ đến” và “Xem địa điểm”.
- Hành trình, chương 1: “Những ngày đã qua” — “Có những ngày rất bình thường, đến khi nhìn lại mới biết đó là kỷ niệm.”
- Hành trình, chương 2: “Ngày mình gặp nhau” — “Tấm ảnh đẹp nhất hôm ấy sẽ là tấm ảnh có thêm bạn.”
- Thư: “Chào bạn, mình là Vũ. Ngày tốt nghiệp sắp tới là dịp để mình nhìn lại một chặng đường và nói lời cảm ơn đến những người đã ở bên. Mình muốn mời bạn đến chung vui, gặp nhau một chút, kể nhau nghe vài câu chuyện và chụp những tấm hình thật vui. Nếu chưa thể đến, một lời nhắn từ bạn cũng là món quà mình rất quý. Hẹn gặp bạn trong ngày đặc biệt này nhé!”
- RSVP heading: “Giữ cho mình một cuộc hẹn nhé?”
- Wishes heading: “Một lời nhắn, một kỷ niệm.”
- Empty wishes: “Trang giấy còn trống. Bạn muốn gửi lời chúc đầu tiên chứ?”
- Closing: “Cảm ơn vì đã là một phần trong hành trình của Vũ.”

## 5. Motion và skill phải dùng

Repo nguồn: https://github.com/nvu-1801/ui-motion-skills, commit đã tra `48377973bd111a14f1fd5542bfecea1cf48ba5d1`. Đã đọc `AGENTS.md`, `CATALOG.md` và ba skill; bản đọc lưu trong `skills/` cạnh tài liệu này. Chỉ mang những skill liên quan sang repo đích, không cài toàn bộ catalog hoặc dịch vụ không cần thiết. Đọc lại AGENTS ở repo đích nếu có. Khi sửa backend/pipeline, chọn thêm `backend-nextjs`, `backend-api-contracts`, `github-actions`, `release-deploy` từ đúng repo và ghi ref.

- `ui-design`: content hierarchy → semantic tokens → responsive typography và crop.
- `scroll-storytelling`: native scroll, sticky, một progress chuẩn hóa, cleanup; cuộn thuận/ngược và resize cùng trạng thái.
- `web-3d-scenes`: một writer cho camera, HTML cho chữ/CTA, giới hạn DPR, dispose, poster fallback.

Ưu tiên tái sử dụng `src/motion-kit/` có sẵn cùng `docs/INTEGRATION.md`, `ARCHITECTURE.md`, `MOTION_PATTERNS.md` của workspace gốc. Đây là nguồn local cần đóng gói trước khi chat web chạy; không được nói chat web có thể truy cập ổ D:.

Scene mới là hai khung ảnh postcard có chiều sâu, không phải cảnh laptop của demo cũ. Tạo `GraduationPhotoScene` và preset `graduation`; chỉ tái sử dụng camera/progress/fallback cần thiết. Cảnh procedural, không cần GLB/Blender/dịch vụ tạo ảnh. Không kéo thêm thư viện animation thứ hai.

| Progress | Biến đổi đề xuất |
|---|---|
| 0 | Postcard 9516 phía trước, nghiêng Y khoảng -6°, ảnh 9505 ở sau |
| 0.5 | Camera dịch nhẹ, hai postcard tách lớp, ảnh phụ vào trung tâm |
| 1 | Hai ảnh cân bằng, camera trở về gần chính diện, dẫn xuống thư mời |

Desktop stage khoảng 100svh trong section tối đa 180–220svh. Mobile tối đa 120–150svh, biên độ nhỏ; có thể dùng hai ảnh tĩnh nếu chậm. Hero không chờ WebGL, Canvas lazy-load khi gần viewport; DPR mobile tối đa 1.5, desktop tối đa 2; dừng khi ngoài viewport/tab ẩn. Reduced motion hoặc WebGL fail → poster HTML, không scroll pin dài. Không hijack scroll. Giữ ảnh có alt và nội dung trong HTML, Canvas `aria-hidden` khi chỉ trang trí. Không để mặc định opacity:0 khiến nội dung mất khi JS tắt.

## 6. Assets và source phải đóng gói ở bước được phép push

| Nguồn máy người dùng | Đích trong repo đích |
|---|---|
| `D:\backup\LePhucTotNghiep\drive-download-20261119T082646Z-1-001\tot nghiep FPT9516.jpg` | `assets/originals/vu-9516.jpg` |
| `D:\backup\LePhucTotNghiep\drive-download-20261119T082646Z-1-001\tot nghiep FPT9505.jpg` | `assets/originals/vu-9505.jpg` |
| workspace `src/motion-kit/` | `vendor/motion-kit/`, chuyển vào src khi tích hợp |
| workspace docs tích hợp/kiến trúc/pattern | `docs/motion-kit/` |
| docs hiện tại | `docs/graduation/` |

Đã xác minh ảnh tồn tại: 9516 = 10,242,827 bytes; 9505 = 8,831,397 bytes. Chưa copy/resize/crop/đánh giá bố cục ảnh ở pha lập kế hoạch. Không đưa ảnh 9511 vào vì chưa được yêu cầu.

Khi đóng gói: xem cả hai ảnh, sửa EXIF orientation, xuất WebP 640/960/1440/1920 theo crop đã xem; bỏ EXIF/GPS ở ảnh public; giữ ảnh gốc riêng để reprocess, không nằm trong public. WebP hero mục tiêu <=350 KB, ảnh phụ <=300 KB (mục tiêu cần đo, không tuyên bố đã đạt). Không crop mất mặt/mũ. Thêm OG 1200×630 và favicon riêng. Ghi manifest đường dẫn, kích thước, dung lượng, SHA256 và nguồn; tránh LFS nếu runner web không hỗ trợ pull LFS. Không copy node_modules, .next, test-results, tsbuildinfo, .env hoặc DB thật.

## 7. Stack và cây source đích

Next.js App Router + TypeScript + React; CSS Modules/tokens; GSAP + ScrollTrigger; Three/R3F cho đúng một scene. Đọc package-lock nguồn, kiểm tra compatibility và phiên bản còn được hỗ trợ ở ngày thực thi, pin lockfile; không sao chép version từ tài liệu cũ một cách mù quáng. Node chọn một LTS được Next và Vercel hỗ trợ, pin đồng nhất CI/Vercel/local. `@libsql/client`, Zod cho DB và validation. Không cần CMS ngoài hoặc admin dashboard lớn trong MVP.

```text
src/app/layout.tsx, page.tsx, globals.css, error.tsx, not-found.tsx
src/app/api/rsvps/route.ts
src/app/api/wishes/route.ts
src/app/api/guests/route.ts
src/app/api/health/route.ts
src/components/{Header,Hero,EventTicket,Countdown,InvitationLetter}.tsx
src/components/{RsvpForm,GuestList,Wishes,Location,Closing}.tsx
src/components/motion/{GraduationPhotoScene,PhotoPlanes,MotionFallback}.tsx
src/content/{event,copy}.ts
src/lib/server/{db,rsvp,wishes,validation,rate-limit}.ts
src/motion-kit/...
public/images/{hero,story,og}/...
db/migrations/0001_initial.sql
scripts/{migrate,seed,moderate,process-images}.ts
tests/{api,db,e2e}/...
.github/workflows/ci.yml
.env.example, .gitignore, package.json, package-lock.json
README.md, docs/graduation/*, CONTINUE.md
```

Event/copy tập trung trong content, DB chỉ lưu phản hồi động. Server Components cho nội dung; client islands cho form/countdown/motion. DB module server-only, route Node runtime; không dùng Edge cho driver native/local.

## 8. SQLite và Vercel — quyết định hạ tầng

Local: SQLite file `file:./data/graduation.db`, không commit. Production Vercel: đề xuất Turso/libSQL remote tương thích SQLite qua `@libsql/client`, vì function filesystem không phải persistent volume để giữ RSVP. Không dùng `/tmp/*.db` làm DB production, không đồng bộ DB bằng commit Git. libSQL là fork tương thích SQLite, không giả định là SQLite nguyên bản chạy trên đĩa Vercel. Nếu người dùng bắt buộc SQLite nguyên bản, cần backend có persistent disk riêng; frontend vẫn trên Vercel. Chốt provider và có credentials trước khi chạy phần ghi dữ liệu production; không tự chuyển Postgres.

Env server: `DATABASE_URL`, `DATABASE_AUTH_TOKEN` (remote), `RATE_LIMIT_SECRET`; `NEXT_PUBLIC_SITE_URL` cho canonical. Không biến DB token thành NEXT_PUBLIC. `.env.example` chỉ chứa placeholder. Preview dùng DB riêng, tuyệt đối không chạy E2E ghi vào production.

Schema migration khởi điểm:

```sql
CREATE TABLE rsvps (
  id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL CHECK(length(guest_name) BETWEEN 1 AND 80),
  attendance TEXT NOT NULL CHECK(attendance IN ('yes','no')),
  public_consent INTEGER NOT NULL DEFAULT 0 CHECK(public_consent IN (0,1)),
  idempotency_key TEXT NOT NULL UNIQUE,
  request_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE wishes (
  id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL CHECK(length(guest_name) BETWEEN 1 AND 80),
  message TEXT NOT NULL CHECK(length(message) BETWEEN 1 AND 1000),
  public_consent INTEGER NOT NULL DEFAULT 0 CHECK(public_consent IN (0,1)),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  idempotency_key TEXT NOT NULL UNIQUE,
  request_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX wishes_public ON wishes(status, public_consent, created_at);
CREATE INDEX rsvps_public ON rsvps(public_consent, created_at);
CREATE TABLE rate_limits (
  bucket_key TEXT PRIMARY KEY,
  hits INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
```

Migration runner có bảng version riêng, chạy một lần có kiểm soát, transaction khi hỗ trợ; không migrate trong mọi request. Seed local chỉ dữ liệu fixture, không đẩy fixture lên production. Test apply mới, apply lại, rollback bằng backup/restore trong DB thử. Moderation MVP bằng script server có credentials, không thêm endpoint duyệt public.

## 9. API và hành vi sản phẩm

- `POST /api/rsvps`: `{name, attendance:'yes'|'no', publicConsent:boolean}` + `Idempotency-Key`; 201 trả id và receipt tối thiểu. Không yêu cầu SĐT/email. Consent mặc định false, không chặn gửi khi từ chối công khai.
- `POST /api/wishes`: `{name,message,publicConsent}`; 201 trả `status:'pending'`, UI nói “Đã nhận lời chúc, đang chờ duyệt”. Không giả đã công khai.
- Key retry cùng payload trả cùng kết quả, không tăng counts; cùng key khác payload → 409. Hash payload canonical, transaction/unique xử lý concurrent retries. Đổi ý RSVP ở MVP: hướng dẫn gửi liên hệ khi có kênh đã cấu hình; không cho sửa theo id đoán được, không hứa hỗ trợ update chưa làm.
- `GET /api/guests?cursor=&attendance=`: chỉ publicConsent=true, page size max 20; counts công khai có cùng phạm vi consent; không trả IP/hash/key.
- `GET /api/wishes?cursor=`: chỉ approved + consent, max 20. Mọi UI có loading/empty/error/retry, submit disabled khi in-flight, focus/error `aria-live`.
- Validate server, trim, giới hạn body 8 KB và độ dài; 400 invalid, 409 conflict, 413 oversized, 429 + Retry-After, 503 DB unavailable. Prepared statements; message render plain text, không dangerouslySetInnerHTML.
- Chống spam: honeypot, kiểm tra Origin cùng site cho mutation, rate limit dùng DB atomic/bucket TTL (không Map RAM trên serverless); hash IP từ header được nền tảng tin cậy với secret, không trả/log IP thô. Giới hạn đề xuất 5 writes/10 phút/IP, có thể cấu hình. Cleanup buckets hết hạn bằng script; DB fail không báo submit thành công.
- Health trả trạng thái tối thiểu, không lộ env/schema/error nội bộ. Log có request id và lỗi đã lọc, không log lời chúc riêng/secret.

## 10. Pipeline và tiêu chí nghiệm thu

CI pull request/push: checkout đúng SHA → Node pinned → npm ci → lint → typecheck → unit/integration với SQLite test → production build → Playwright trên build production → artifacts khi fail. Cache npm theo lockfile; tối thiểu quyền `contents: read`; không dùng production secret cho PR ngoài. Chọn lệnh test theo test runner thật đã cài; các script trong đặc tả phải được implement, không coi đã tồn tại.

Vercel Git Integration: feature branch → Preview → kiểm tra → main → Production sau khi được phép. Không chạy cả Git Integration và workflow deploy trùng nhau. Migrations chạy theo release job được kiểm soát với DB đúng môi trường, trước deploy app yêu cầu schema mới; giữ schema tương thích để rollback app không mất dữ liệu. Nếu migration fail, dừng release. Tắt auto-deploy trong pha repo docs nếu chưa muốn công bố.

Checklist bắt buộc trước công bố:

- Tên Vũ và event chính xác; không còn HeeJoon/Huy Dương/canonical mẫu/QR mẫu trong source sản phẩm.
- 360/390/768/1440px không tràn ngang, ảnh không méo; xem screenshot thực tế, tiếng Việt đủ dấu.
- Keyboard, label form, focus menu mobile, contrast và skip link; axe không có serious/critical trong scope kiểm tra.
- JS off vẫn thấy nội dung/địa điểm/CTA anchor; form nói rõ cần JS nếu không có progressive POST.
- Reduced motion, WebGL fail, cuộn thuận/ngược, resize, điều hướng unmount/remount không leak trigger/canvas.
- RSVP yes/no, retry/concurrent duplicate, 409, rate limit, consent false không lộ public; pending/rejected wishes không lộ; XSS payload hiện plain text.
- DB write/read còn sau lần gọi mới và redeploy preview; không seed production; dữ liệu test được cleanup theo id.
- Health OK, HTTPS, ảnh/OG/font không 404, console không lỗi ứng dụng. Lighthouse mobile mục tiêu performance >=85, accessibility >=95; ghi số thực đo và môi trường, không bịa FPS/điểm.
- CI xanh đúng SHA; báo URL preview/production, commit SHA, test thực chạy và giới hạn còn lại. Không ghi “xong” khi form chỉ lưu trong localStorage.

## 11. Các pha giao việc

| Pha | Deliverable / điều kiện qua pha |
|---|---|
| A — hiện tại | Docs, skill snapshots, prompt. Không tạo repo/push/deploy |
| B — sau khi người dùng cho phép | Tạo/kiểm tra repo nvu-1801, đóng gói 2 ảnh + motion source + docs; hashes, push bootstrap; cung cấp URL và SHA. Chưa cần build toàn app |
| C — chat web lúc 03:00 | Đọc docs, xác minh assets/source/credentials, skeleton và static UI trước, responsive QA |
| D | Scene ngắn + DB/API + integration tests; bỏ chi tiết trang trí nếu cần để bảo đảm tính đúng |
| E | CI → preview → kiểm thử thật → production trong phạm vi được phép, báo kết quả |

Không đặt giới hạn 3 giờ làm deadline: người dùng đã làm rõ muốn hẹn chat web lúc 3 giờ sáng. Chưa có task lịch được tạo trong phiên soạn docs. Nếu scheduler chỉ nhắc chứ không thực thi code, báo rõ và dùng prompt mở phiên có môi trường build; không hứa tự chạy nền.

## 12. Handoff và blocker

Trước B: chưa có repo đích, chưa đưa ảnh/motion source lên Git, chưa chốt DB provider/credentials/Vercel project. Các điều này không cản soạn docs nhưng có thể cản C–E. Không đưa tài khoản hoặc token vào tài liệu public. Chỉ deploy khi đã có scope cho phép từ người dùng; không yêu cầu lại nếu đã được cho phép trong phiên thực thi.

Agent dài hạn kiểm tra quota thật lúc đầu, trước pha lớn và khoảng 15 phút. Còn dưới 5% ở cửa sổ áp dụng → hoàn tất thao tác nhỏ an toàn, viết CONTINUE.md với objective, path/repo/branch/SHA, files đổi, lệnh và kết quả thật, blockers, process ids và bước tiếp theo; không push/deploy cho kịp quota. Nếu không có tool quota, ghi không xác minh được và tiếp tục phần được phép.

## Nguồn

- Web mẫu: https://heejoon-graduation-2026.vercel.app/ — HTML đã tải, không có source/backend gốc.
- Skill: https://github.com/nvu-1801/ui-motion-skills/tree/48377973bd111a14f1fd5542bfecea1cf48ba5d1
- Vercel filesystem: https://vercel.com/docs/functions/runtimes#file-system-support
- libSQL tương thích SQLite: https://docs.turso.tech/libsql

Chưa chạy build/test của website mới vì chưa implement. Các kết quả test trong README portfolio thuộc dự án cũ, không phải bằng chứng cho website tốt nghiệp.

## Cập nhật người dùng — QR cà phê và liên hệ (19/11/2026)

Cập nhật này thay thế mọi chỉ dẫn trước đó về tắt khối cà phê hoặc chưa có số điện thoại.

- Người dùng đã cung cấp QR ngân hàng để bạn bè mời cà phê: `assets/payments/vu-coffee-vietqr.png`.
- Số liên hệ: **0343628267**, hiển thị **0343 628 267**, liên kết `tel:+84343628267`. Không tự suy ra Zalo hoặc kênh khác.
- Bật section cà phê tùy chọn: “Mời Vũ một ly cà phê” / “Một lời chúc hay một ly cà phê đều là món quà mình trân quý. Cảm ơn bạn đã tiếp năng lượng cho chặng đường mới!” Không bắt buộc RSVP, không khóa lời chúc sau thanh toán.
- QR phải dùng nguyên ảnh cung cấp, không tạo lại bằng AI, không crop vùng mã/quiet zone, không bo góc phủ mã hoặc overlay logo; giữ tỷ lệ, nền sáng, kích thước đủ đọc trên mobile, cho tải ảnh gốc và xem lớn. Khi mở modal cần focus trap, Escape và trả focus về nút mở.
- Chưa xác minh payload ngân hàng/tên người nhận/số tài khoản. Không tự điền ngân hàng, tài khoản, số tiền hoặc xác nhận đã nhận tiền. UI ghi “Vui lòng kiểm tra tên người nhận trong ứng dụng ngân hàng trước khi chuyển.” Không tự động mở giao dịch hoặc yêu cầu số tiền.
- Kiểm thử QR bằng điện thoại/ứng dụng phù hợp nếu có thiết bị; nếu chưa quét thử phải báo rõ, không tuyên bố đã xác minh chuyển khoản.
- Repo bootstrap là private. Người dùng cung cấp QR và SĐT cho website mời bạn bè; đưa hai thông tin này vào UI theo yêu cầu, không đưa secret hoặc dữ liệu khách lên public.
