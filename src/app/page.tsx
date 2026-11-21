import { CoffeeQr, Countdown } from "@/components/EventActions";
import { Guestbook } from "@/components/Guestbook";
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
          <p className="school">{event.school}</p>
          <h1 id="hero-title">Lễ tốt nghiệp<br />của <em>Vũ</em></h1>
          <p className="invitation">Mình mời bạn đến dự lễ tốt nghiệp. Mình muốn được gặp lại bạn, nói một lời cảm ơn và chụp chung một tấm ảnh.</p>
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
          <figure className="event-picture"><Portrait id="9505" /><figcaption>Kỷ niệm tốt nghiệp tại Đại học FPT Quy Nhơn</figcaption></figure>
          <div className="event-copy">
            <h2 id="event-title">Ngày và địa điểm</h2>
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

      <section id="thu-moi" className="letter-section" aria-labelledby="letter-title">
        <div className="wrap letter-inner">
          <div><p className="school">Thư mời</p><h2 id="letter-title">Gửi bạn</h2></div>
          <div className="letter-copy">
            <p>Ngày đầu vào đại học, mình cứ nghĩ những năm phía trước còn dài. Vậy mà giờ đã tới lúc mặc áo tốt nghiệp và hẹn mọi người đến chụp ảnh.</p>
            <p>Khi nghĩ về những năm ở Quy Nhơn, mình nhớ cả những lúc chẳng có gì đặc biệt: một buổi trò chuyện, một lần được hỏi han, hay đơn giản là có người ngồi nghe mình kể chuyện. Cảm ơn bạn vì đã có mặt trong những ngày như thế.</p>
            <p>Nếu thu xếp được, đến gặp mình hôm ấy nhé. Còn nếu ở xa, nhắn cho mình vài dòng cũng vui rồi.</p>
            <p className="signature">Vũ</p>
          </div>
        </div>
      </section>

      <section id="xac-nhan" className="response-section" aria-labelledby="rsvp-title">
        <div className="wrap response-inner">
          <h2 id="rsvp-title">Bạn đến được không?</h2>
          {online ? <>
            <Guestbook kind="rsvp" />
            <div id="loi-chuc" className="wishes">
              <h3>Gửi lời chúc</h3>
              <Guestbook kind="wish" />
            </div>
          </> : <>
            <p>Bạn nhắn mình để xác nhận tham dự hoặc gửi lời chúc nếu không thể đến nhé.</p>
            <div className="actions">
              <a className="button button-dark" href={`sms:${event.tel}`}>Nhắn tin cho Vũ</a>
              <a className="button button-line" href={`tel:${event.tel}`}>Gọi {event.phone}</a>
            </div>
          </>}
        </div>
      </section>
    </main>

    <footer className="closing">
      <div className="wrap closing-inner">
        <div><p className="signature">Hẹn gặp bạn,</p><p>{event.name}</p></div>
        <div className="coffee-note"><p>Sau buổi lễ, nếu có dịp, mình hẹn bạn một ly cà phê.</p><CoffeeQr /></div>
      </div>
    </footer>
  </>;
}
