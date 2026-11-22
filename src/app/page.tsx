import { CoffeeQr, CopyAddress, MapPreview, SmsLink } from "@/components/EventActions";
import { copy, wishesForGuests } from "@/content/copy";
import { WishIdeas } from "@/components/WishIdeas";
import { Guestbook } from "@/components/Guestbook";
import { PhotoStory } from "@/components/PhotoStory";
import { ScrollEffects } from "@/components/ScrollEffects";
import Image from "next/image";
import { event, mapsUrl } from "@/content/event";
import { databaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Invitation() {
  const online = databaseConfigured();
  return <>
    <ScrollEffects />
    <a href="#noi-dung" className="skip">Chuyển đến nội dung</a>
    <header className="masthead"><div className="wrap header-inner">
      <a className="wordmark" href="#noi-dung">Vũ<span className="wordmark-star" aria-hidden="true">✳</span><span className="wordmark-year"> / 2026</span></a>
      <nav aria-label="Thiệp mời"><a href="#dia-diem">Ngày và địa điểm</a><a href="#loi-chuc" className="nav-letter">Lời chúc</a><a href="#xac-nhan" className="nav-rsvp">Xác nhận <span aria-hidden="true">↗</span></a></nav>
    </div></header>
    <main id="noi-dung">
      <section className="hero-surface" aria-labelledby="hero-title">
        <div className="hero-orbit" aria-hidden="true"><span /><span /></div>
        <div className="wrap hero">
          <div className="hero-copy">
            <p className="school"><span className="status-dot" /> THIỆP MỜI TỐT NGHIỆP · 2026</p>
            <h1 id="hero-title">Phan<br /><em>Nguyên Vũ</em></h1>
            <p className="hero-greeting">{copy.greeting}</p>
            <p className="hero-tagline">Một cột mốc mới.<br />Một ngày muốn có bạn.</p>
            <p className="invitation">{copy.hero}</p>
            <div className="hero-actions"><a className="button button-dark" href="#xac-nhan">Xác nhận tham dự <span aria-hidden="true">↗</span></a><a className="hero-wish" href="#dia-diem">Khám phá lời mời <span aria-hidden="true">↓</span></a></div>
            <div className="hero-meta"><span>{event.school}</span><span>20.12.2026 · Dự kiến</span></div>
          </div>
          <div className="hero-art">
            <div className="hero-year" aria-hidden="true">20<br />26</div>
            <figure className="hero-frame"><Image src="/images/portrait-9516-cutout.webp" alt="Phan Nguyên Vũ trong lễ phục tốt nghiệp" width={850} height={1364} unoptimized preload /></figure>
            <div className="photo-label"><span aria-hidden="true">✦</span><span>Hẹn gặp bạn<br /><strong>ngày mình tốt nghiệp</strong></span></div>
            <span className="hero-note">Một cuộc hẹn ở Quy Nhơn.</span>
          </div>
        </div>
        <div className="wrap hero-bottom"><span>CUỘN ĐỂ MỞ LỜI MỜI</span><span aria-hidden="true">↓</span><span>QUY NHƠN, VIỆT NAM</span></div>
      </section>

      <section className="campus" aria-labelledby="campus-title">
        <div className="wrap section-intro" data-reveal><p className="eyebrow">01 / NƠI BẮT ĐẦU</p><h2 id="campus-title">Một chặng đường.<br /><em>Nhiều điều để nhớ.</em></h2><p>{copy.campus}</p></div>
        <div className="wrap campus-window landscape"><div className="landscape-image campus-image" role="img" aria-label="Khuôn viên Đại học FPT Quy Nhơn" /><div className="landscape-caption"><span>ĐẠI HỌC FPT QUY NHƠN</span><span>Những ngày đã qua, những điều ở lại.</span></div></div>
      </section>

      <section id="dia-diem" className="event-section" aria-labelledby="event-title"><div className="wrap event-inner">
        <div className="event-heading" data-reveal><p className="eyebrow">02 / MỘT CUỘC HẸN</p><h2 id="event-title">Để dành cho mình<br /><em>ngày hôm ấy.</em></h2><p>{copy.event}</p></div>
        <div className="event-ticket"><div className="ticket-top"><span>LỜI MỜI DÀNH CHO BẠN</span><span aria-hidden="true">↗</span></div><div className="ticket-date"><strong>20</strong><div><span>THÁNG 12 · 2026</span><p>Chủ nhật</p><small>Ngày dự kiến</small></div></div>
          <dl className="event-facts"><div><dt>Trường</dt><dd>{event.school}</dd></div><div><dt>Địa điểm</dt><dd>{event.venue}<small>{event.address}</small></dd></div><div><dt>Thời gian</dt><dd>Giờ tổ chức sẽ được cập nhật</dd></div></dl>
          <div className="actions"><a className="button button-dark" href="#duong-di">Chỉ đường <span aria-hidden="true">↗</span></a><a className="button button-line" href="/tot-nghiep-vu.ics" download>Lưu vào lịch</a></div><div className="ticket-perforation" aria-hidden="true" /><p className="ticket-footer">MỘT TẤM HÌNH CÙNG BẠN, MỘT KỶ NIỆM CÙNG NHAU.</p>
        </div>
      </div></section>

      <PhotoStory />
      <section id="thu-moi" className="letter-section" aria-labelledby="letter-title"><div className="wrap letter-inner">
        <div data-reveal><p className="eyebrow">04 / VÀI DÒNG GỬI BẠN</p><h2 id="letter-title">Niềm vui sẽ đầy hơn<br /><em>khi có bạn.</em></h2><span className="letter-flower" aria-hidden="true">✳</span></div>
        <div className="letter-copy">{copy.letter.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p className="signature">Thân mến,<br />Vũ</p></div>
      </div></section>

      <section className="guest-wishes" aria-labelledby="guest-wishes-title"><div className="wrap">
        <div className="section-intro" data-reveal><p className="eyebrow">MỘT CHÚT TỐT LÀNH GỬI LẠI BẠN</p><h2 id="guest-wishes-title">Mình cũng có<br /><em>một lời chúc cho bạn.</em></h2><p>Ngày này mình nhận được nhiều lời chúc. Mình cũng muốn gửi bạn vài điều giản dị mà mình luôn thấy quý.</p></div>
        <div className="guest-wishes-grid">{wishesForGuests.map(wish => <article key={wish.title} data-reveal><h3>{wish.title}</h3><p>{wish.text}</p></article>)}</div>
      </div></section>

      <section id="xac-nhan" className="response-section" aria-labelledby="rsvp-title"><div className="wrap response-inner">
        <div className="response-heading" data-reveal><p className="eyebrow">05 / HẸN BẠN HÔM ẤY</p><h2 id="rsvp-title">Bạn có thể<br /><em>đến chung vui không?</em></h2><p>{copy.rsvp}</p></div>
        {online ? <Guestbook kind="rsvp" /> : <div className="contact-card"><p>Bạn nhắn mình để xác nhận tham dự nhé.</p><div className="actions"><SmsLink message="Vũ ơi, mình sẽ đến dự lễ tốt nghiệp của bạn.">Mình sẽ đến</SmsLink><a className="button button-line" href={`tel:${event.tel}`}>Gọi {event.phone}</a></div></div>}
      </div></section>

      <section id="loi-chuc" className="wishes-section" aria-labelledby="wishes-title"><div className="wrap response-inner">
        <div className="response-heading" data-reveal><p className="eyebrow">06 / LƯU LẠI MỘT CHÚT THƯƠNG</p><h2 id="wishes-title">Một lời nhắn.<br /><em>Một kỷ niệm.</em></h2><p>{copy.wishes}</p></div>
        {online ? <Guestbook kind="wish" /> : <div><SmsLink message="Vũ ơi, chúc mừng bạn tốt nghiệp! ">Gửi lời chúc</SmsLink><WishIdeas /></div>}
      </div></section>

      <section id="duong-di" className="venue" aria-labelledby="venue-heading"><div className="venue-photo landscape"><div className="landscape-image venue-image" role="img" aria-label="Ảnh trung tâm hội nghị, bảng tên cũ tỉnh Bình Định" /><div className="venue-photo-caption">Ảnh tham khảo địa điểm · bảng tên cũ trong ảnh</div></div><div className="wrap venue-grid">
        <div className="venue-copy" data-reveal><p className="eyebrow">07 / ĐƯỜNG ĐẾN CUỘC HẸN</p><h2 id="venue-heading">Hẹn gặp bạn<br /><em>tại đây.</em></h2><h3>{event.venue}</h3><p>{event.address}</p><a className="button button-dark venue-directions" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.venue + ", " + event.address)}`} target="_blank" rel="noreferrer">Chỉ đường đến lễ tốt nghiệp <span aria-hidden="true">↗</span></a><div className="venue-links"><a href={mapsUrl} target="_blank" rel="noreferrer">Mở Google Maps</a><CopyAddress /></div></div><MapPreview />
      </div></section>
    </main>
    <footer className="closing"><div className="wrap coffee-banner landscape"><div className="landscape-image coffee-image" aria-hidden="true" /><div className="coffee-copy"><p className="eyebrow">MỘT MÓN QUÀ NHỎ, NẾU BẠN MUỐN</p><h2>Một lời chúc thôi<br />cũng đã <em>rất quý.</em></h2><p>{copy.coffee}</p><CoffeeQr /></div></div><div className="wrap closing-message"><p>{copy.closing}</p></div><div className="wrap closing-inner"><p className="signature">Cảm ơn vì đã là một phần trong hành trình của Vũ.</p><a href={`tel:${event.tel}`}>{event.name} · {event.phone}</a><a href="#noi-dung">Về đầu trang ↑</a></div></footer>
  </>;
}
