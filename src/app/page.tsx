import { CoffeeQr, Countdown, CopyAddress, MapPreview, SmsLink } from "@/components/EventActions";
import { Guestbook } from "@/components/Guestbook";
import { PhotoStory } from "@/components/PhotoStory";
import { Portrait } from "@/components/Portrait";
import { event, mapsUrl } from "@/content/event";
import { databaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Invitation() {
  const online = databaseConfigured();
  return <>
    <a href="#noi-dung" className="skip">Chuyển đến nội dung</a>
    <header className="masthead">
      <div className="wrap header-inner">
        <a className="wordmark" href="#noi-dung">{event.name}</a>
        <nav aria-label="Thiệp mời">
          <a href="#dia-diem">Ngày và địa điểm</a>
          <a href="#thu-moi" className="nav-letter">Thư mời</a>
          <a href="#xac-nhan" className="nav-rsvp">Xác nhận</a>
        </nav>
      </div>
    </header>

    <main id="noi-dung">
      <section className="wrap hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="school">Thiệp mời tốt nghiệp</p>
          <h1 id="hero-title">{event.name}</h1>
          <p className="school-name">{event.school}</p>
          <p className="invitation">Mình mời bạn đến dự lễ tốt nghiệp. Hôm ấy, mình mong được chụp cùng bạn một tấm ảnh và nói lời cảm ơn mà nhiều khi mình vẫn chưa nói thành lời.</p>
          <div className="hero-date">
            <time dateTime="2026-12-20">20/12/2026</time>
            <span>Chủ nhật, dự kiến</span>
          </div>
          <a className="button button-dark" href="#xac-nhan">Xác nhận tham dự <span className="arrow" aria-hidden="true" /></a>
        </div>
        <figure className="hero-frame"><Portrait id="9516" hero /></figure>
      </section>

      <section id="dia-diem" className="event-section" aria-labelledby="event-title">
        <div className="wrap event-inner">
          
          <div className="event-copy">
            <h2 id="event-title">Thông tin buổi lễ</h2>
            <dl className="event-facts">
              <div><dt>Ngày</dt><dd><time dateTime="2026-12-20">Chủ nhật, 20/12/2026</time><small>Ngày dự kiến. Giờ tổ chức sẽ được cập nhật.</small></dd></div>
              <div><dt>Địa điểm</dt><dd>{event.venue}<small>{event.address}</small></dd></div>
            </dl>
            <Countdown />
            <div className="actions">
              <a className="button button-dark" href={mapsUrl} target="_blank" rel="noreferrer">Mở Google Maps</a>
              <a className="button button-line" href="/tot-nghiep-vu.ics" download>Lưu vào lịch</a>
            </div>
          </div>
        </div>
      </section>

      <PhotoStory />
      <section id="thu-moi" className="letter-section" aria-labelledby="letter-title">
        <div className="wrap letter-inner">
          <div><p className="school">Thư mời</p><h2 id="letter-title">Gửi bạn</h2></div>
          <div className="letter-copy">
            <p>Đến lúc chuẩn bị cho lễ tốt nghiệp, mình mới có dịp nghĩ lại về những năm ở Quy Nhơn. Có những chuyện khi ấy rất bình thường, như một lời hỏi thăm hay một lần ngồi nghe nhau kể chuyện, mà đến giờ mình vẫn nhớ.</p>
            <p>Mình muốn mời bạn đến chung vui. Sau buổi lễ, mình mong tụi mình có thể đứng lại một chút, hỏi nhau dạo này thế nào và chụp một tấm ảnh cùng nhau.</p>
            <p>Nếu hôm ấy bạn ở xa, vài dòng tin nhắn cũng đủ để mình biết bạn đang nghĩ đến mình. Cảm ơn bạn vì đã dành thời gian đọc thư này.</p>
            <p className="signature">Vũ</p>
          </div>
        </div>
      </section>

      <section id="xac-nhan" className="response-section" aria-labelledby="rsvp-title">
        <div className="wrap response-inner">
          <h2 id="rsvp-title">Bạn có thể đến dự không?</h2>
          {online ? <>
            <Guestbook kind="rsvp" />
            <div id="loi-chuc" className="wishes">
              <h3>Gửi lời chúc</h3>
              <Guestbook kind="wish" />
            </div>
          </> : <>
            <p>Bạn nhắn mình để xác nhận tham dự hoặc gửi lời chúc nếu không thể đến nhé.</p>
            <div className="actions">
              <SmsLink message="Vũ ơi, mình sẽ đến dự lễ tốt nghiệp của bạn.">Mình sẽ đến</SmsLink>
              <a className="button button-line" href="#loi-chuc">Mình gửi lời chúc từ xa</a>
              <a className="button button-line" href={`tel:${event.tel}`}>Gọi {event.phone}</a>
            </div>
          </>}
        </div>
      </section>
      {!online && <section id="loi-chuc" className="letter-section"><div className="wrap response-inner"><h2>Gửi Vũ vài dòng</h2><p>Nếu có điều gì bạn muốn nhắn mình trước ngày tốt nghiệp, mình rất vui được đọc.</p><SmsLink message="Vũ ơi, chúc mừng bạn tốt nghiệp! ">Gửi lời chúc</SmsLink></div></section>}
      <section id="duong-di" className="wrap response-inner">
        <h2>Đường đến buổi lễ</h2>
        <p>{event.venue}<br />{event.address}</p>
        <div className="actions"><a className="button button-dark" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.venue + ", " + event.address)}`} target="_blank" rel="noreferrer">Chỉ đường</a><CopyAddress /></div>
        <MapPreview />
      </section>
    </main>

    <footer className="closing">
      <div className="wrap closing-inner">
        <div><p className="signature">Cảm ơn bạn đã đọc đến đây. Hẹn gặp bạn ngày tốt nghiệp.</p><p>{event.name}</p></div>
        <div className="coffee-note"><p>Sau buổi lễ, nếu có dịp, mình hẹn bạn một ly cà phê.</p><CoffeeQr /></div>
      </div>
    </footer>
  </>;
}
