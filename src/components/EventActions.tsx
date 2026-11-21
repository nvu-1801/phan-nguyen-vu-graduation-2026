"use client";

import { useEffect, useRef, useState } from "react";
import { event } from "@/content/event";

export function CoffeeQr() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  return <>
    <button ref={trigger} type="button" className="button button-line" onClick={() => dialog.current?.showModal()}>
      Mời Vũ cà phê
    </button>
    <dialog ref={dialog} aria-labelledby="qr-heading" onClose={() => trigger.current?.focus()}>
      <div className="qr-dialog">
        <form method="dialog"><button className="dialog-close" aria-label="Đóng mã QR">×</button></form>
        <h2 id="qr-heading">Mời Vũ một ly cà phê</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/payments/vu-coffee-vietqr.png" alt="Mã VietQR mời Vũ cà phê" />
        <p>Vui lòng kiểm tra tên người nhận trong ứng dụng ngân hàng trước khi chuyển.</p>
        <a className="button button-dark" href="/payments/vu-coffee-vietqr.png" download>Tải mã QR</a>
      </div>
    </dialog>
    <noscript><p><a href="/payments/vu-coffee-vietqr.png">Mở ảnh mã QR</a></p></noscript>
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
  const [expanded, setExpanded] = useState(false);
  const query = encodeURIComponent(event.venue + ", " + event.address);
  return <div className="map-details">
    <button className="button button-line" type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "Ẩn bản đồ" : "Xem bản đồ"}</button>
    {expanded && <iframe title="Bản đồ địa điểm tổ chức lễ tốt nghiệp" src={`https://maps.google.com/maps?q=${query}&output=embed`} loading="lazy" />}
  </div>;
}
