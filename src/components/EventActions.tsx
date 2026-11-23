"use client";

import { useEffect, useId, useRef, useState } from "react";
import { event } from "@/content/event";

export function CoffeeQr({ compact = false }: { compact?: boolean }) {
  const headingId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  return <>
    <button ref={trigger} type="button" className={compact ? "dock-button dock-coffee" : "button button-line"} aria-label="Mời Vũ cà phê" onClick={() => dialog.current?.showModal()}>
      {compact ? <><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8h13v6a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6ZM17 9h2a3 3 0 1 1 0 6h-2M8 3v2M13 3v2" /></svg><span className="dock-label">Mời Vũ cà phê</span></> : "Mời Vũ cà phê"}
    </button>
    <dialog ref={dialog} aria-labelledby={headingId} onClose={() => trigger.current?.focus()}>
      <div className="qr-dialog">
        <form method="dialog"><button className="dialog-close" aria-label="Đóng mã QR">×</button></form>
        <h2 id={headingId}>Mời Vũ một ly cà phê</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/payments/vu-coffee-vietqr.png" alt="Mã VietQR mời Vũ cà phê" />
        <p>Vui lòng kiểm tra tên người nhận trong ứng dụng ngân hàng trước khi chuyển.</p>
        <a className="button button-dark" href="/payments/vu-coffee-vietqr.png" download>Tải mã QR</a>
      </div>
    </dialog>
    <noscript>{compact ? <>
      <style>{".dock-coffee{display:none}"}</style>
      <a className="dock-button dock-coffee-static" href="/payments/vu-coffee-vietqr.png" aria-label="Mở mã QR cà phê">QR</a>
    </> : <p><a href="/payments/vu-coffee-vietqr.png">Mở ảnh mã QR</a></p>}</noscript>
  </>;
}

export function Countdown() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    function update() {
      setDays(Math.max(0, Math.ceil((Date.parse(event.countdown) - Date.now()) / 86_400_000)));
    }
    const initial = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 60_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);

  if (!days) return null;
  return <p className="countdown">Còn <strong>{days} ngày</strong> đến ngày dự kiến</p>;
}

export function CopyAddress() {
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(event.address);
      setMessage("Đã sao chép địa chỉ.");
    } catch {
      setMessage("Bạn có thể chọn và sao chép địa chỉ ở phía trên.");
    }
  }
  return <><button className="button button-line" type="button" onClick={copy}>Sao chép địa chỉ</button><span role="status">{message}</span></>;
}

export function SmsLink({ children, message }: { children: string; message: string }) {
  function open(eventClick: React.MouseEvent<HTMLAnchorElement>) {
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    eventClick.currentTarget.href = `sms:${event.tel}${ios ? "&" : "?"}body=${encodeURIComponent(message)}`;
  }
  return <a className="button button-dark" href={`sms:${event.tel}`} onClick={open}>{children}</a>;
}

export function MapPreview() {
  const query = encodeURIComponent(event.venue + ", " + event.address);
  return <div className="venue-map">
    <iframe title="Bản đồ Trung tâm Hội nghị tỉnh Gia Lai"
      src={`https://www.google.com/maps?q=${query}&output=embed&hl=vi`}
      loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
    <a className="map-external" href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer">Mở bản đồ lớn trên Google Maps ↗</a>
  </div>;
}
