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
