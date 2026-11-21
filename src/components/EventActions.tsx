"use client";

import { useRef } from "react";

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
