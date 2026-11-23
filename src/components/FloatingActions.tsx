"use client";

import { CoffeeQr } from "./EventActions";
import { event } from "@/content/event";

export function ActionIcon({ kind }: { kind: "top" | "phone" | "coffee" }) {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "top" ? <><path d="m6 13 6-6 6 6M12 7v13M5 3h14" /></> : kind === "phone" ? <path d="M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c0 1-1 2-2 2C10 21 3 14 3 5c0-1 1-2 2-2Z" /> : <><path d="M4 8h13v6a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6ZM17 9h2a3 3 0 1 1 0 6h-2M8 3v2M13 3v2" /></>}
  </svg>;
}

export function FloatingActions() {
  return <nav className="floating-actions" aria-label="Liên hệ nhanh">
    <a className="dock-button dock-top" href="#noi-dung" aria-label="Về đầu trang"><ActionIcon kind="top" /><span className="dock-label">Về đầu trang</span></a>
    <a className="dock-button dock-phone" href={`tel:${event.tel}`} aria-label={`Gọi Vũ: ${event.phone}`}><ActionIcon kind="phone" /><span className="dock-label">Gọi {event.phone}</span></a>
    <a className="dock-button dock-zalo" href={event.zalo} target="_blank" rel="noopener noreferrer" aria-label="Nhắn Zalo cho Vũ"><span className="zalo-mark" aria-hidden="true">Zalo</span><span className="dock-label">Nhắn Zalo cho Vũ</span></a>
    <CoffeeQr compact />
  </nav>;
}
