"use client";

import { BackgroundMusic } from "./BackgroundMusic";
import { CoffeeQr } from "./EventActions";
import { IconPhone, IconUp } from "./Icons";
import { event } from "@/content/event";

export function FloatingActions() {
  return <div className="floating-dock">
    <BackgroundMusic />
    <nav className="floating-actions" aria-label="Liên hệ nhanh">
      <a className="dock-button dock-top" href="#noi-dung" aria-label="Về đầu trang"><IconUp size={21} /><span className="dock-label">Về đầu trang</span></a>
      <a className="dock-button dock-phone" href={`tel:${event.tel}`} aria-label={`Gọi Vũ: ${event.phone}`}><IconPhone size={21} /><span className="dock-label">Gọi {event.phone}</span></a>
      <a className="dock-button dock-zalo" href={event.zalo} target="_blank" rel="noopener noreferrer" aria-label="Nhắn Zalo cho Vũ"><span className="zalo-mark" aria-hidden="true">Zalo</span><span className="dock-label">Nhắn Zalo cho Vũ</span></a>
      <CoffeeQr compact />
    </nav>
  </div>;
}
