"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { WishIdeas } from "./WishIdeas";
import { event } from "@/content/event";

type Entry = { id: string; name: string; attendance: "yes" | "no" | null; message: string | null; createdAt: string };
type Page = { items: Entry[]; nextCursor: string | null; counts?: { yes: number; no: number } };

function EntryList({ revision }: { revision: number }) {
  const [items, setItems] = useState<Entry[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [counts, setCounts] = useState<Page["counts"]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const activeRequest = useRef<AbortController | null>(null);

  const load = useCallback(async (after: string | null = null) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/entries" + (after ? "?cursor=" + encodeURIComponent(after) : ""), { signal: controller.signal });
      if (!response.ok) throw new Error();
      const page = await response.json() as Page;
      if (controller.signal.aborted) return;
      setItems(old => after ? [...old, ...page.items.filter(item => !old.some(entry => entry.id === item.id))] : page.items);
      setCursor(page.nextCursor);
      setCounts(page.counts);
    } catch {
      if (!controller.signal.aborted) setError("Không tải được sổ lưu bút.");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => void load());
    return () => { cancelAnimationFrame(frame); activeRequest.current?.abort(); };
  }, [load, revision]);

  return <section className="entry-list" aria-labelledby="entry-list-title">
    <div className="entry-list-heading">
      <div>
        <p className="eyebrow">SỔ LƯU BÚT</p>
        <h3 id="entry-list-title">Những người đã ghé qua</h3>
      </div>
      {counts && <p className="entry-counts">{counts.yes} sẽ đến · {counts.no} chưa thể đến</p>}
    </div>
    <p className="entry-list-note">Chỉ hiện khi khách đồng ý chia sẻ công khai.</p>
    {items.length > 0 && <ul className="entry-rows">{items.map(entry => <li key={entry.id} className="entry-row">
      <div className="entry-person">
        <span className="entry-avatar" aria-hidden="true">{entry.name.trim().charAt(0).toUpperCase()}</span>
        <div>
          <strong className="entry-name">{entry.name}</strong>
          {entry.attendance && <span className={`entry-badge ${entry.attendance}`}>{entry.attendance === "yes" ? "Sẽ đến" : "Chưa thể đến"}</span>}
        </div>
      </div>
      <p className="entry-message">{entry.message ?? "Chưa có lời chúc công khai."}</p>
    </li>)}</ul>}
    {loading && <p className="entry-status" role="status">Đang tải sổ lưu bút…</p>}
    {error && <p className="entry-status" role="status">{error} <button className="text-button" type="button" onClick={() => void load()}>Thử lại</button></p>}
    {!loading && !error && items.length === 0 && <p className="entry-empty">Trang giấy còn trống. Bạn muốn để lại vài dòng cho Vũ chứ?</p>}
    {!loading && !error && cursor && <button type="button" className="text-button entry-more" onClick={() => void load(cursor)}>Xem thêm</button>}
  </section>;
}

export function ResponseBook() {
  const [revision, setRevision] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);
  const messageInput = useRef<HTMLTextAreaElement>(null);
  const busy = useRef(false);
  const receipt = useRef<{ payload: string; key: string } | null>(null);
  useEffect(() => { const id = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(id); }, []);

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy.current) return;
    const form = e.currentTarget;
    const values = new FormData(form);
    const message = String(values.get("message") || "").trim();
    const attendance = values.get("attendance") === "no" ? "no" : "yes";
    const payload = JSON.stringify({
      name: String(values.get("name")).trim(),
      attendance,
      message,
      publicAttendance: values.get("publicAttendance") === "on",
      publicWish: values.get("publicWish") === "on",
      website: String(values.get("website") || ""),
    });
    if (receipt.current?.payload !== payload) receipt.current = { payload, key: crypto.randomUUID() };
    busy.current = true;
    setPending(true);
    setFeedback("");
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": receipt.current.key },
        body: payload,
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(error?.error || "Chưa gửi được. Bạn thử lại nhé.");
      }
      form.reset();
      receipt.current = null;
      setFeedback(message ? "Đã gửi lời chúc. Cảm ơn bạn!" : "Vũ đã nhận được phản hồi của bạn.");
      setRevision(previous => previous + 1);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Chưa gửi được. Bạn thử lại nhé.");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return <div className="response-book">
    <form id="loi-chuc" className="guest-form entry-form" onSubmit={send}>
      <fieldset disabled={!ready || pending}>
        <legend className="sr-only">Xác nhận tham dự và gửi lời chúc</legend>
        <div className="attendance-cards" role="group" aria-label="Bạn có thể đến chung vui không?">
          <label><input type="radio" name="attendance" value="yes" defaultChecked required /><span><strong>Mình sẽ đến</strong><small>Mình giữ một chỗ cho bạn.</small></span></label>
          <label><input type="radio" name="attendance" value="no" required /><span><strong>Mình chưa thể đến</strong><small>Một lời nhắn cũng rất quý.</small></span></label>
        </div>
        <label>Tên của bạn<input name="name" autoComplete="name" required maxLength={80} placeholder="Tên của bạn" /></label>
        <WishIdeas onChoose={message => {
          const input = messageInput.current;
          if (!input) return;
          input.value = input.value.trim() ? `${input.value}\n\n${message}`.slice(0, 1000) : message;
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }} />
        <label>Lời chúc dành cho Vũ (không bắt buộc)<textarea ref={messageInput} name="message" rows={4} maxLength={1000} placeholder="Một lời chúc, một kỷ niệm…" /></label>
        <div hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="checkbox"><input type="checkbox" name="publicAttendance" /><span>Cho phép hiển thị tên và trạng thái tham dự.<small>Bỏ chọn nghĩa là chỉ Vũ đọc được phản hồi này.</small></span></label>
        <label className="checkbox"><input type="checkbox" name="publicWish" /><span>Đồng ý công khai tên và lời chúc.<small>Bỏ chọn nghĩa là riêng tư; chỉ Vũ đọc được lời nhắn này.</small></span></label>
        <button type="submit" className="button button-dark">{pending ? "Đang gửi…" : "Gửi phản hồi"}</button>
      </fieldset>
      <p role="status" className="form-feedback">{feedback}</p>
      <noscript><p>Vui lòng bật JavaScript để gửi phản hồi.</p></noscript>
      <p className="form-note">Cần đổi lịch? <a href={`tel:${event.tel}`}>Liên hệ Vũ</a>.</p>
    </form>
    <EntryList revision={revision} />
  </div>;
}
