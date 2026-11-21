"use client";

import { useEffect, useRef, useState } from "react";
import { event } from "@/content/event";

function timeRemaining() {
  const seconds = Math.max(0, Math.floor((Date.parse(event.countdown) - Date.now()) / 1000));
  return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
}

export function Countdown() {
  const [time, setTime] = useState<number[]>();
  useEffect(() => {
    const interval = window.setInterval(() => setTime(timeRemaining()), 1000);
    return () => clearInterval(interval);
  }, []);
  return <div className="countdown">
    {["Ngày", "Giờ", "Phút", "Giây"].map((unit, i) =>
      <div key={unit}><strong>{time ? String(time[i]).padStart(2, "0") : "··"}</strong><span>{unit}</span></div>)}
  </div>;
}

export function CopyAddress() {
  const [status, setStatus] = useState("");
  return <div className="copy-address">
    <button type="button" className="button button-line" onClick={async () => {
      try {
        await navigator.clipboard.writeText(event.address);
        setStatus("Đã sao chép địa chỉ.");
      } catch {
        setStatus("Chưa sao chép được. Bạn có thể chọn địa chỉ ở trên.");
      }
    }}>Sao chép địa chỉ</button>
    <span role="status">{status}</span>
  </div>;
}

export function CoffeeQr() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  return <>
    <button ref={trigger} type="button" className="button button-line" onClick={() => dialog.current?.showModal()}>
      Xem mã QR
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
