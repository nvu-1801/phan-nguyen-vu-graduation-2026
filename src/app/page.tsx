import { CoffeeQr } from "@/components/EventActions";
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
          <a href="#xac-nhan" className="nav-rsvp">Xác nhận</a>
        </nav>
      </div>
    </header>

    <main id="noi-dung">
      <section className="wrap hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="school">{event.school}</p>
          <h1 id="hero-title">Lễ tốt nghiệp<br />của <em>Vũ</em></h1>
          <p className="invitation">Mình mời bạn đến dự lễ tốt nghiệp và chụp cùng mình một tấm ảnh nhé!</p>
          <div className="hero-date">
            <time dateTime="2026-12-20">20.12.2026</time>
            <span>Chủ nhật · Dự kiến</span>
          </div>
          <a className="button button-dark" href="#xac-nhan">Xác nhận tham dự <span className="arrow" aria-hidden="true" /></a>
        </div>
        <figure className="hero-frame"><Portrait id="9516" hero /></figure>
      </section>

      <section id="dia-diem" className="event-section" aria-labelledby="event-title">
        <div className="wrap event-inner">
          <figure className="event-picture"><Portrait id="9505" /></figure>
          <div className="event-copy">
            <h2 id="event-title">Ngày và địa điểm</h2>
            <dl className="event-facts">
              <div><dt>Ngày</dt><dd><time dateTime="2026-12-20">Chủ nhật, 20/12/2026</time><small>Ngày dự kiến. Giờ tổ chức sẽ được cập nhật.</small></dd></div>
              <div><dt>Địa điểm</dt><dd>{event.venue}<small>{event.address}</small></dd></div>
            </dl>
            <div className="actions">
              <a className="button button-dark" href={mapsUrl} target="_blank" rel="noreferrer">Mở Google Maps</a>
              <a className="button button-line" href="/tot-nghiep-vu.ics" download>Lưu vào lịch</a>
            </div>
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
            <p>Nhắn cho mình biết bạn có đến được không nhé. Bạn cũng có thể gửi lời chúc qua tin nhắn.</p>
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
        <CoffeeQr />
      </div>
    </footer>
  </>;
}
