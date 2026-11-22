# Kế hoạch cải thiện UI, nội dung và section

Ngày: 22/11/2026. Lưu ý cập nhật: người dùng đã thay hướng kem/đỏ rượu bằng xanh sáng nhẹ, yêu cầu lấy ảnh nền từ web mẫu và tăng animation cuộn. Bản redesign xanh đã triển khai local; các mục kem/đỏ bên dưới là lịch sử kế hoạch, không còn là chỉ dẫn màu hiện hành. Xem CONTINUE.md.

## 1. Phạm vi đã chốt

- Người dùng chọn: nền kem + đỏ rượu, thanh lịch.
- Tiếp tục repo thực tại `D:\backup\Portfolio 3D\graduation-2026`, branch main, base `c8bfb7fedbdaa0e46c2808fffdeba7307a16a6c8`.
- Website là thiệp mời cá nhân của Phan Nguyên Vũ. Mục tiêu khách biết ai mời, ngày/địa điểm, cách xác nhận hoặc gửi lời chúc.
- Bảo toàn các sửa local về VPS, SQLite, origin/proxy, ảnh Windows, tests. Không reset/ghi đè hoặc thay bằng scaffold ở folder khác.
- Người dùng tự deploy VPS sau. Không tự push, merge hoặc deploy.
- Không bịa giờ lễ, lịch trình, thành tích, ký ức cá nhân, khách mời hay lời chúc. Ngày 20/12/2026 vẫn mang nhãn dự kiến; giờ tổ chức chưa cập nhật.

## 2. Kiểm tra UI hiện tại

Bằng chứng: source page.tsx, globals.css, Guestbook, EventActions, PhotoStage/Scene; ảnh mobile `docs/local-mobile.png`; screenshot desktop `docs/audit-desktop.png`.
Đo desktop 1440×1000 với reduced motion: toàn trang 4960px; không tràn ngang. Hero 683px, thông tin lễ 892px, ảnh 742px, thư 548px, phản hồi 1205px, bản đồ 684px. Đây là baseline bố cục, không phải kết quả performance.

| Ưu tiên | Phát hiện | Hướng xử lý |
|---|---|---|
| P1 | Ngày và địa điểm lặp ở hero, vé mời, địa điểm cuối trang; khối lịch quá cao | Hero chỉ nhắc ngày ngắn. Gộp chi tiết, lịch và bản đồ vào một section |
| P1 | RSVP chia cột bên trong cột cạnh chân dung; form desktop còn khoảng 300px | Form một cột rộng 440–560px; tách public list khỏi form; bỏ ảnh thứ ba tại RSVP |
| P1 | Lựa chọn attendance=no ghi “Gửi lời chúc từ xa” nhưng chỉ lưu RSVP, lời nhắn vẫn riêng tư | Đổi thành “Mình chưa thể đến”; hướng dẫn gửi lời chúc riêng sau receipt |
| P1 | Hai form và hai public list dồn trong cùng một section dài | Tách Xác nhận và Lời chúc; giữ consent riêng cho từng loại dữ liệu |
| P1 | Màu xanh/gradient chưa khớp hướng thiết kế vừa chốt | Chuyển toàn bộ token sang kem/đỏ rượu, gồm dialog, form, focus, ảnh OG và fallback/scene |
| P2 | Cùng hai ảnh lặp ở hero, story, RSVP; ảnh thứ ba làm hành trình dài | Hero dùng cutout 9516; story dùng hai ảnh gốc có chủ đích; RSVP không lặp chân dung |
| P2 | Hero/thư/ảnh đều nhắc chụp ảnh và gặp nhau, nội dung thiếu phân vai | Hero: lời mời; thư: cảm ơn; ảnh: kỷ niệm; sự kiện: thông tin; form: hành động |
| P2 | CSS có nhiều khai báo selector chồng nhau, nhiều màu hardcode | Gom theo component, bỏ override cũ sau khi thay, dùng semantic tokens thống nhất |
| P2 | Bản đồ là iframe ngoài, không có trạng thái tải/thất bại rõ ràng | Preview tĩnh có địa chỉ và nút “Tải bản đồ”; iframe là tùy chọn, link chỉ đường luôn dùng được |
| P2 | Trạng thái thành công/lỗi form dùng chung một dòng và form reset ngay | Success receipt riêng, giữ nội dung khi lỗi; phân biệt success/error, focus thông báo phù hợp |
| P3 | Khối cà phê dùng câu hẹn uống cà phê nhưng nút mở QR chuyển khoản | Viết rõ đây là món quà tùy chọn, không gợi hiểu nhầm về cuộc hẹn đã được tổ chức |

Lưu ý screenshot desktop chụp không cuộn trước nên có ảnh lazy và iframe chưa tải. Không kết luận asset hỏng chỉ từ vùng trắng. Pha nghiệm thu phải cuộn tới từng ảnh, chờ decode rồi chụp lại.

## 3. Hệ hình ảnh và chữ

- Canvas `#F6F0E6`; surface `#FFFCF6`; ink `#292322`; muted `#6C5B56`.
- Accent đỏ rượu `#722F3E`; hover `#562130`; line `#D8C9BC`; điểm nhấn vàng trầm `#AC8052` chỉ dùng trang trí.
- Kiểm tra contrast thực tế cho mọi text/button/focus; màu này là bộ token khởi điểm, chưa tuyên bố đạt WCAG.
- Giữ font self-host Be Vietnam Pro cho nội dung, Playfair Display cho heading. Serif tiết chế, tránh mọi heading đều quá lớn.
- Desktop container 1120–1160px; text dài tối đa 52–60ch. Mobile gutter 20px, body tối thiểu 16px, line-height 1.65–1.8; nút tối thiểu 44px.
- H1 tên Vũ có xuống dòng có chủ ý khi cần; hero có lời mời ngắn đủ nổi bật. Ảnh đầy đủ đầu/mũ, không méo, không viền sáng giả hoặc hiệu ứng che mặt.
- Chất giấy qua màu, đường kẻ và bố cục. Tránh thêm texture lớn, họa tiết lễ cưới, confetti, chữ chạy hoặc nhạc tự động.

## 4. Cấu trúc trang đích

Header → Hero → Thư ngắn → Hẹn gặp [thông tin + bản đồ] → Hai tấm ảnh → Xác nhận → Lời chúc → Kết & cà phê.

### Header
Tên Vũ/wordmark nhỏ; link “Buổi lễ”, “Lời chúc”, “Xác nhận”. Mobile vẫn truy cập các đích chính, không tạo hamburger nếu ba link có thể bố trí rõ. Giữ skip link. Nếu sticky, đo scroll-margin và chiều cao header thực tế.

### Hero — mở lời
Eyebrow: “THIỆP MỜI TỐT NGHIỆP · 2026”
Tên: “Phan Nguyên Vũ”
Dòng mời: “Hẹn bạn trong ngày mình tốt nghiệp.”
Body: “Mình rất vui nếu có bạn cùng chung vui trong ngày này. Đến gặp nhau và chụp cùng mình một tấm ảnh nhé.”
Thông tin ngắn: “Đại học FPT Quy Nhơn · 20.12.2026 — dự kiến”.
CTA chính: “Mình sẽ đến” → #xac-nhan. CTA phụ: “Xem thông tin buổi lễ” → #dia-diem.
Bố cục desktop text/ảnh cân bằng; mobile thấy tên, ngày và CTA sớm, tiếp đến chân dung. Khung ảnh hình học nhẹ; đỏ rượu làm điểm nhấn, không phủ màu ảnh.

### Thư — lý do mời
Heading: “Gửi bạn một lời mời”
Copy đề xuất:
“Ngày tốt nghiệp là dịp để mình nhìn lại một chặng đường và nói lời cảm ơn đến những người mình trân quý.
Mình muốn mời bạn đến chung vui. Nếu hôm ấy bạn chưa thể đến, một lời nhắn từ bạn cũng là món quà mình rất quý.
Hẹn gặp bạn nhé!
Vũ”
Không kể thêm ký ức/quan hệ mà người dùng chưa cung cấp. Trình bày như thư ngắn; không dựng section khoảng trống quá lớn.

### Hẹn gặp — một nguồn thông tin
Heading: “Hẹn gặp bạn tại buổi lễ”
Ngày: “Chủ nhật, 20/12/2026 — dự kiến”. Giờ: “Giờ tổ chức sẽ được cập nhật”.
Địa điểm/địa chỉ từ event.ts, không viết trùng trong JSX.
Nút: “Chỉ đường”, “Lưu lịch dự kiến”, “Sao chép địa chỉ”.
Gộp map và chi tiết cạnh nhau desktop, xếp dọc mobile. Không giữ một section bản đồ thứ hai ở cuối trang. Bỏ lịch 20/12 cỡ lớn chiếm nguyên hàng và countdown không thiết yếu.
Preview bản đồ có nội dung hữu ích khi mạng ngoài không tải; nút mở Maps hoạt động cả khi JS tắt. File lịch all-day vẫn ghi dự kiến.

### Ảnh — nhịp nghỉ ngắn
Heading: “Để dành một tấm ảnh có bạn”
Caption: “Hai tấm hình trước ngày gặp nhau. Hôm ấy, mình mong sẽ có thêm một tấm chụp cùng bạn.”
Giữ hai ảnh thật, crop đã kiểm tra, không tái tạo chân dung bằng AI. Không thêm timeline năm học/giải thưởng giả.
Mobile dùng hai postcard HTML, bố cục cân đối. Desktop có thể nâng cấp nghiêng/chuyển lớp rất nhẹ bằng scene hiện có sau khi bản tĩnh đạt yêu cầu. Không buộc cuộn qua một stage dài. Nội dung/alt/caption không phụ thuộc WebGL. Reduced motion và WebGL lỗi dùng cùng bố cục tĩnh.

### Xác nhận — một thao tác rõ
Heading: “Bạn có thể đến chung vui không?”
Subcopy: “Cho mình biết để mình mong bạn nhé.”
Lựa chọn: “Mình sẽ đến” / “Mình chưa thể đến”. Tên; lời nhắn riêng tùy chọn; consent công khai mặc định bỏ chọn.
Chú thích: “Lời nhắn ở đây chỉ gửi riêng cho Vũ. Bạn vẫn có thể xác nhận mà không công khai tên.”
Nút “Gửi xác nhận”. Success: “Mình đã nhận được phản hồi của bạn. Cảm ơn bạn nhé!” + link lịch/địa điểm hoặc gửi lời chúc.
Không dùng localStorage thay DB. Giữ idempotency, rate limit, validation và no-JS notice. Trường hợp DB chưa được cấu hình vẫn có lựa chọn liên hệ trực tiếp, không báo nhận thành công giả.
Danh sách công khai thành một khối phụ gọn dưới form hoặc disclosure dễ mở; không chen cạnh ô nhập trong cột hẹp. Counts ghi rõ phạm vi “Phản hồi được chia sẻ công khai”.

### Lời chúc — section độc lập
Heading: “Một lời nhắn cho Vũ”
Body: “Bạn muốn nhắn mình điều gì trước chặng đường mới?”
Tường lời chúc dạng card đọc được, không carousel tự chạy. Form gửi đặt cạnh tường trên desktop nếu đủ rộng, xếp dọc mobile. Có thể dùng nút mở form inline, không giấu nội dung bằng modal bắt buộc.
Empty: “Chưa có lời chúc được chia sẻ. Bạn có muốn để lại vài dòng cho Vũ?”
Checkbox: “Mình đồng ý chia sẻ tên và lời chúc sau khi được duyệt.”
Success khi consent=true: “Vũ đã nhận được lời chúc. Nội dung sẽ hiển thị sau khi được duyệt.”
Success khi consent=false: “Vũ đã nhận được lời nhắn riêng của bạn.” Không hứa công khai dữ liệu không có consent.
Giữ loading, lỗi/thử lại, phân trang, plain-text chống XSS, pending không public.

### Kết và món quà tùy chọn
Câu kết: “Cảm ơn vì đã dành một chỗ cho Vũ trong ngày này.”
Tên/chữ ký và liên kết gọi điện hiển thị rõ. Cà phê phụ nhỏ:
“Nếu bạn muốn gửi một món quà nhỏ, có thể mời Vũ một ly cà phê. Một lời chúc thôi cũng đã rất quý.”
Nút “Mời Vũ một ly cà phê” mở QR gốc. Giữ Escape, focus trap/return và tải ảnh. Không sửa QR, không bịa ngân hàng/người nhận. Giữ hướng dẫn kiểm tra tên người nhận trước khi chuyển.

## 5. Thứ tự triển khai

### A — Content và bố cục tĩnh (ưu tiên đầu)
1. Tách copy tập trung vào src/content/copy.ts; event.ts là nguồn duy nhất về ngày/trường/địa điểm/liên hệ.
2. Tách section component Hero, Letter, EventDetails, PhotoStory, RsvpSection, WishesSection, Closing; page chỉ kết hợp section.
3. Gộp địa điểm và bản đồ; bỏ countdown/khối lịch lớn, ảnh RSVP lặp. Giữ anchor cũ bằng alias nếu đổi id.
4. Viết lại nội dung theo mục 4, sửa nhãn attendance=no, kiểm tra receipt theo consent.
5. Thay tokens; sắp CSS theo component, loại override dư. Cập nhật OG/favicon để khớp màu mới.

Điều kiện qua: nội dung đủ, đúng nghĩa; toàn trang không JS vẫn có thông tin và link chính; không thay API/schema để phục vụ trang trí.

### B — Luồng phản hồi và trạng thái
1. Tách form và danh sách công khai để không bị grid lồng quá hẹp.
2. Mỗi form có error/success rõ, pending, kiểm tra độ dài, focus thông báo; giữ dữ liệu khi lỗi.
3. Wishes receipt đúng consent, RSVP riêng tư và công khai phân biệt rõ.
4. Bản đồ tải theo thao tác, có fallback địa chỉ và link. QR giữ nguyên.

Điều kiện qua: gửi thật qua SQLite; retry không duplicate; không lộ dữ liệu riêng; layout có list dài/tên dài vẫn tốt.

### C — Polish và chuyển động
1. Chỉnh nhịp khoảng trắng, typography, crop ảnh và trạng thái hover/focus.
2. Bổ sung chuyển động ảnh nhẹ nếu cải thiện cảm giác; mobile và reduced motion mặc định tĩnh.
3. Khi bỏ/đổi motion, cập nhật tests để kiểm tra yêu cầu sản phẩm mới; giữ kiểm tra fallback/không leak, không chỉ xóa test đang fail.

### D — Nghiệm thu và bàn giao local
Chạy lint, typecheck, DB tests, production build, browser/API tests; kiểm tra regressions VPS SITE_ORIGIN/TRUST_PROXY. Chụp ảnh ở 360/390/768/1440, cuộn từng ảnh chờ decode, xem trực quan cả desktop/mobile. Cập nhật CONTINUE với lệnh/kết quả thật và tài liệu VPS nếu thay cấu hình.

## 6. Tiêu chí nghiệm thu

- Có thể nhận ra ai mời, ngày dự kiến và CTA ngay đầu trang; tên không bị tràn/mất dấu.
- Mỗi section có một mục đích; chỉ một section thông tin/địa điểm; form không nằm trong grid lồng hẹp.
- Mobile 360/390 không tràn ngang, nút >=44px; desktop form 440–560px khi đủ không gian.
- Mục tiêu giảm chiều dài trang khoảng 20% so với baseline khi cùng viewport/chế độ motion; không ép con số bằng cách giảm cỡ chữ hoặc bỏ nội dung cần thiết.
- Headings có thứ tự, label đầy đủ, keyboard/focus rõ, axe không serious/critical trong scope; kiểm tra contrast thực tế.
- JS off, reduced motion, WebGL fail, tải map thất bại đều có nội dung và đường tiếp tục.
- Consent=false không public, lời chúc pending/rejected không public; receipt đúng điều khách vừa gửi.
- API, migration/persistence, concurrent retry, 409/413/429, lỗi DB và proxy origin/IP giữ test ý nghĩa.
- Không coi test cũ xanh là bằng chứng redesign hoàn tất; phải chạy lại sau thay đổi.
- Không claim Lighthouse/FPS, QR đã quét hay VPS đã chạy khi chưa thực đo.

## 7. Bước tiếp tục cụ thể

Bắt đầu pha A trên repo graduation-2026, bảo toàn mọi thay đổi local. Đọc kế hoạch này + CONTINUE, chụp baseline nếu server thay đổi. Triển khai content/bố cục/token trước, tiếp đến form/list/state, cuối cùng motion. Không cần xin lại màu vì người dùng đã chọn kem + đỏ rượu. Kết thúc bằng bản production local và bằng chứng kiểm tra; để người dùng tự deploy VPS.
