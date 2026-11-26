"use client";
import { wishIdeas } from "@/content/copy";
import { SmsLink } from "./EventActions";

export function WishIdeas({ onChoose }: { onChoose?: (message: string) => void }) {
  return <details className="wish-ideas" open={!onChoose}>
    <summary>Bạn chưa biết viết gì? Mình có vài gợi ý nhỏ.</summary>
    <p className="wish-ideas-note">Đây là gợi ý để bạn bắt đầu, không phải lời chúc của khách đã gửi. Bạn có thể sửa thành lời của riêng mình.</p>
    <div className="wish-ideas-grid">{wishIdeas.map(idea => <div className="wish-idea" key={idea.label}>
      <h4>{idea.label}</h4><p>{idea.message}</p>
      {onChoose ? <button className="wish-idea-button" type="button" onClick={() => onChoose(idea.message)}><span className="wish-idea-icon" aria-hidden="true">✦</span><span>Dùng gợi ý: {idea.label}</span><span className="wish-idea-add" aria-hidden="true">＋</span></button> : <SmsLink message={idea.message}>Nhắn lời này cho Vũ</SmsLink>}
    </div>)}</div>
  </details>;
}
