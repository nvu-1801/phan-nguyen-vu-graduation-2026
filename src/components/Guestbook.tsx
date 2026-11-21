"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { event } from "@/content/event";

type Entry = { id: string; name: string; attendance?: "yes" | "no"; message?: string };
type Page = { items: Entry[]; nextCursor: string | null; counts?: { yes: number; no: number } };
type Kind = "rsvp" | "wish";

function PublicEntries({ kind, revision }: { kind: Kind; revision: number }) {
  const [items, setItems] = useState<Entry[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [counts, setCounts] = useState<Page["counts"]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const activeRequest = useRef<AbortController | null>(null);
  const endpoint = kind === "rsvp" ? "/api/guests" : "/api/wishes";

  const load = useCallback(async (after: string | null = null) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(endpoint + (after ? "?cursor=" + encodeURIComponent(after) : ""), { signal: controller.signal });
      if (!response.ok) throw new Error();
      const page = await response.json() as Page;
      if (controller.signal.aborted) return;
      setItems(old => after ? [...old, ...page.items.filter(item => !old.some(entry => entry.id === item.id))] : page.items);
      setCursor(page.nextCursor);
      setCounts(page.counts);
    } catch {
      if (!controller.signal.aborted) setError("Không tải được danh sách.");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => void load());
    return () => { cancelAnimationFrame(frame); activeRequest.current?.abort(); };
  }, [load, revision]);

  return <div className="public-entries">
    <h3>{kind === "rsvp" ? "Phản hồi công khai" : "Tường lời chúc"}</h3>
    {counts && <p className="entry-counts">{counts.yes} sẽ đến · {counts.no} gửi lời chúc từ xa</p>}
    {items.length > 0 && <ul>{items.map(entry => <li key={entry.id}>
      <strong>{entry.name}</strong>
      <span>{entry.message ?? (entry.attendance === "yes" ? "Sẽ đến" : "Gửi lời chúc từ xa")}</span>
    </li>)}</ul>}
    {loading && <p role="status">Đang tải…</p>}
    {error && <p role="status">{error} <button className="text-button" type="button" onClick={() => void load()}>Thử lại</button></p>}
    {!loading && !error && items.length === 0 && <p>{kind === "rsvp"
      ? "Chưa có phản hồi được chia sẻ công khai."
      : "Chưa có lời chúc công khai."}</p>}
    {!loading && !error && cursor && <button type="button" className="text-button" onClick={() => void load(cursor)}>Xem thêm</button>}
  </div>;
}

export function Guestbook({ kind }: { kind: Kind }) {
  const isRsvp = kind === "rsvp";
  const [revision, setRevision] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);
  const busy = useRef(false);
  const receipt = useRef<{ payload: string; key: string } | null>(null);
  useEffect(() => { const id = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(id); }, []);

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy.current) return;
    const form = e.currentTarget;
    const values = new FormData(form);
    const payload = JSON.stringify({
      name: String(values.get("name")).trim(),
      message: String(values.get("message")).trim(),
      publicConsent: values.get("consent") === "on",
      website: String(values.get("website") || ""),
      ...(isRsvp ? { attendance: values.get("attendance") } : {}),
    });
    if (receipt.current?.payload !== payload) receipt.current = { payload, key: crypto.randomUUID() };
    busy.current = true;
    setPending(true);
    setFeedback("");
    try {
      const response = await fetch(isRsvp ? "/api/rsvps" : "/api/wishes", {
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
      setFeedback(isRsvp ? "Vũ đã nhận được phản hồi của bạn." : "Đã nhận lời chúc, đang chờ duyệt.");
      setRevision(previous => previous + 1);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Chưa gửi được. Bạn thử lại nhé.");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return <div className="guestbook-grid">
    <form onSubmit={send} className="guest-form">
      <fieldset disabled={!ready || pending}>
        <legend className="sr-only">{isRsvp ? "Xác nhận tham dự" : "Gửi lời chúc"}</legend>
        {isRsvp && <div className="choices" role="group" aria-label="Bạn có tham dự được không?">
          <label><input type="radio" name="attendance" value="yes" defaultChecked required /> Mình sẽ đến</label>
          <label><input type="radio" name="attendance" value="no" required /> Gửi lời chúc từ xa</label>
        </div>}
        <label>Tên của bạn<input name="name" autoComplete="name" required maxLength={80} placeholder="Tên của bạn" /></label>
        <label>{isRsvp ? "Lời nhắn riêng (không bắt buộc)" : "Lời chúc của bạn"}<textarea name="message" rows={4} required={!isRsvp} maxLength={1000} placeholder={isRsvp ? "Lời nhắn cho Vũ" : "Lời chúc"} /></label>
        <div hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="checkbox"><input type="checkbox" name="consent" />{isRsvp
          ? "Cho phép hiển thị tên và trạng thái tham dự."
          : "Cho phép hiển thị tên và lời chúc sau khi duyệt."}</label>
        <button type="submit" className="button button-dark">{pending ? "Đang gửi…" : isRsvp ? "Gửi xác nhận" : "Gửi lời chúc"}</button>
      </fieldset>
      <p role="status" className="form-feedback">{feedback}</p>
      <noscript><p>Vui lòng bật JavaScript để gửi phản hồi.</p></noscript>
      {isRsvp && <p className="form-note">Cần đổi lịch? <a href={`tel:${event.tel}`}>Liên hệ Vũ</a>.</p>}
    </form>
    <PublicEntries kind={kind} revision={revision} />
  </div>;
}
