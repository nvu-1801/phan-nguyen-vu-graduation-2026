import { CoffeeQr, CopyAddress, Countdown } from "@/components/EventActions";
import { Guestbook } from "@/components/Guestbook";
import { Portrait } from "@/components/Portrait";
import { PhotoStory } from "@/components/PhotoStory";
import { event, mapsUrl } from "@/content/event";

export default function Invitation() {
  return <>
    <a href="#noi-dung" className="skip">Chuyển đến nội dung</a>
    <header className="masthead">
      <div className="wrap header-inner">
        <a href="#noi-dung" className="mark" aria-label="V. Phan Nguyên Vũ, đầu trang">V<span>.</span></a>
        <nav aria-label="Điều hướng thiệp mời">
          <a href="#thu-moi">Thư mời</a><a href="#dia-diem">Địa điểm</a><a className="nav-rsvp" href="#xac-nhan">Xác nhận <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
    <main id="noi-dung">
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="overline"><span className="dot" /> Thiệp mời tốt nghiệp · 2026</p>
          <h1 id="hero-title">Phan<br />Nguyên <em>Vũ</em><span>.</span></h1>
          <p className="hero-line">Hẹn bạn trong ngày mình tốt nghiệp.</p>
          <p className="body-copy">Một cột mốc mới, và một cuộc hẹn với những người mình trân quý. Mời bạn đến chung vui, chụp cùng mình một tấm hình và giữ lại chút thanh xuân này.</p>
          <div className="actions">
            <a className="button button-accent" href="#xac-nhan">Mình sẽ đến <span aria-hidden="true">↗</span></a>
            <a className="button button-outline" href="#dia-diem">Xem địa điểm</a>
          </div>
        </div>
        <figure className="hero-frame">
          <div className="hero-photo"><Portrait id="9516" hero /></div>
          <figcaption><span>{event.school}</span><span>20 / 12 / 2026</span></figcaption>
        </figure>
      </section>
      <section className="ticket-section" aria-labelledby="ticket-title">
        <div className="wrap ticket">
          <div className="ticket-info">
            <p className="overline">Hẹn gặp bạn</p>
            <h2 id="ticket-title">20<span>.</span>12<span>.</span>2026</h2>
            <p><strong>Chủ nhật · Ngày dự kiến</strong><br />{event.school}<br />{event.venue}</p>
            <a href="/tot-nghiep-vu.ics" download className="text-link">Thêm vào lịch <span aria-hidden="true">↓</span></a>
          </div>
          <div className="ticket-time">
            <p className="overline">Đếm ngược đến ngày tốt nghiệp</p>
            <Countdown />
            <p className="ticket-note">Giờ tổ chức sẽ được cập nhật.</p>
          </div>
        </div>
      </section>
      <PhotoStory />
      <section id="thu-moi" className="letter paper" aria-labelledby="letter-title">
        <div className="wrap letter-inner">
          <div>
            <p className="overline">Một lá thư từ Vũ</p>
            <h2 id="letter-title">Gửi <em>bạn,</em></h2>
          </div>
          <div className="letter-copy">
            <p>Chào bạn, mình là Vũ. Ngày tốt nghiệp sắp tới là dịp để mình nhìn lại một chặng đường và nói lời cảm ơn đến những người đã ở bên.</p>
            <p>Mình muốn mời bạn đến chung vui, gặp nhau một chút, kể nhau nghe vài câu chuyện và chụp những tấm hình thật vui. Nếu chưa thể đến, một lời nhắn từ bạn cũng là món quà mình rất quý.</p>
            <p>Hẹn gặp bạn trong ngày đặc biệt này nhé!</p>
            <p className="signature">{event.name}</p>
          </div>
        </div>
      </section>
      <section id="xac-nhan" className="paper guest-section" aria-labelledby="rsvp-title">
        <div className="wrap">
          <p className="overline">Xác nhận tham dự</p>
          <h2 id="rsvp-title">Giữ cho mình một <em>cuộc hẹn</em> nhé?</h2>
          <Guestbook kind="rsvp" />
        </div>
      </section>
      <section id="loi-chuc" className="paper guest-section wishes-section" aria-labelledby="wish-title">
        <div className="wrap">
          <p className="overline">Sổ lưu bút</p>
          <h2 id="wish-title">Một lời nhắn, <em>một kỷ niệm.</em></h2>
          <Guestbook kind="wish" />
        </div>
      </section>
      <section className="paper coffee" aria-labelledby="coffee-title">
        <div className="wrap coffee-inner">
          <div><h2 id="coffee-title">Mời Vũ một ly <em>cà phê</em></h2>
          <p>Một lời chúc hay một ly cà phê đều là món quà mình trân quý. Cảm ơn bạn đã tiếp năng lượng cho chặng đường mới!</p></div>
          <div><CoffeeQr /></div>
        </div>
      </section>
      <section id="dia-diem" className="location" aria-labelledby="location-title">
        <div className="wrap location-inner">
          <div><p className="overline"><span className="dot" /> Địa điểm dự kiến</p>
          <h2 id="location-title">{event.venue}</h2><p>{event.address}</p>
          <p>Liên hệ Vũ <a href={`tel:${event.tel}`}>{event.phone}</a></p></div>
          <div className="actions">
            <a className="button button-accent" href={mapsUrl} target="_blank" rel="noreferrer">Mở Google Maps <span aria-hidden="true">↗</span></a>
            <CopyAddress />
          </div>
        </div>
      </section>
    </main>
    <footer className="closing"><div className="wrap">
      <p>Cảm ơn vì đã là một phần trong hành trình của Vũ.</p>
      <span className="signature">{event.name}</span>
      <a href="#noi-dung" className="text-link">Về đầu trang <span aria-hidden="true">↑</span></a>
    </div></footer>
  </>;
}
