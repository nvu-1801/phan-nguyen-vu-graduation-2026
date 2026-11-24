"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

type Wish = { id: string; name: string; message: string; publicConsent: boolean; status: "pending" | "approved" | "rejected"; createdAt: string };
type Rsvp = { id: string; name: string; attendance: "yes" | "no"; message: string | null; publicConsent: boolean; createdAt: string };
type Filter = "all" | "pending" | "approved" | "rejected";
type Visibility = "all" | "public" | "private";
type Attendance = "all" | "yes" | "no";
type View = "wishes" | "rsvps";

const statusLabels: Record<Wish["status"], string> = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Đã từ chối" };

function formatDate(value: string) {
  return new Date(`${value.replace(" ", "T")}Z`).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" });
}

function RsvpList({ onExpired }: { onExpired: () => void }) {
  const [visibility, setVisibility] = useState<Visibility>("all");
  const [attendance, setAttendance] = useState<Attendance>("all");
  const [items, setItems] = useState<Rsvp[]>([]);
  const [counts, setCounts] = useState<{ yes: number; no: number } | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (access: Visibility, going: Attendance, after: string | null = null) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ consent: access, attendance: going });
      if (after) params.set("cursor", after);
      const response = await fetch(`/api/admin/rsvps?${params}`, { cache: "no-store" });
      if (response.status === 401) { onExpired(); return; }
      const data = await response.json() as { error?: string; items?: Rsvp[]; counts?: { yes: number; no: number }; nextCursor?: string | null };
      if (!response.ok) throw new Error(data.error || "Chưa tải được xác nhận tham dự.");
      const next = data.items ?? [];
      setItems(previous => after ? [...previous, ...next] : next);
      setCounts(data.counts ?? null);
      setCursor(data.nextCursor ?? null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Chưa tải được xác nhận tham dự.");
    } finally {
      setLoading(false);
    }
  }, [onExpired]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => void load(visibility, attendance));
    return () => cancelAnimationFrame(frame);
  }, [attendance, load, visibility]);

  function pickVisibility(next: Visibility) {
    setVisibility(next);
    setItems([]);
    setCursor(null);
  }

  function pickAttendance(next: Attendance) {
    setAttendance(next);
    setItems([]);
    setCursor(null);
  }

  return <>
    <div className="admin-filters" role="group" aria-label="Lọc theo trạng thái tham dự">
      {(["all", "yes", "no"] as const).map(value => <button key={value} type="button" aria-pressed={attendance === value} onClick={() => pickAttendance(value)}>{value === "all" ? "Tất cả phản hồi" : value === "yes" ? "Sẽ đến" : "Chưa thể đến"}</button>)}
    </div>
    <div className="admin-filters admin-visibility-filters" role="group" aria-label="Lọc theo quyền riêng tư">
      {(["all", "public", "private"] as const).map(value => <button key={value} type="button" aria-pressed={visibility === value} onClick={() => pickVisibility(value)}>{value === "all" ? "Công khai và riêng tư" : value === "public" ? "Đồng ý công khai" : "Chỉ Vũ đọc"}</button>)}
    </div>
    {counts && <p className="admin-counts" role="status">{counts.yes} sẽ đến · {counts.no} chưa thể đến</p>}
    {error && <p className="admin-error" role="alert">{error} <button className="text-button" type="button" onClick={() => void load(visibility, attendance)}>Thử lại</button></p>}
    {loading && <p className="admin-muted" role="status">Đang tải xác nhận tham dự…</p>}
    {!loading && !error && items.length === 0 && <p className="admin-empty">Chưa có xác nhận tham dự trong mục này.</p>}
    <div className="admin-wishes">{items.map(rsvp => <article key={rsvp.id} className="admin-wish">
      <header><div><h3>{rsvp.name}</h3><time dateTime={new Date(`${rsvp.createdAt.replace(" ", "T")}Z`).toISOString()}>{formatDate(rsvp.createdAt)}</time></div><div className="admin-badges"><span className={rsvp.attendance === "yes" ? "is-public" : "is-private"}>{rsvp.attendance === "yes" ? "Sẽ đến" : "Chưa thể đến"}</span><span className={rsvp.publicConsent ? "is-public" : "is-private"}>{rsvp.publicConsent ? "Đồng ý công khai" : "Riêng tư"}</span></div></header>
      {rsvp.message ? <p className="admin-rsvp-message">{rsvp.message}</p> : <p className="admin-rsvp-message admin-muted">Không kèm lời nhắn.</p>}
    </article>)}</div>
    {cursor && <button type="button" className="button button-line admin-more" disabled={loading} onClick={() => void load(visibility, attendance, cursor)}>Xem thêm xác nhận</button>}
  </>;
}

export function AdminPanel() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [view, setView] = useState<View>("wishes");
  const [filter, setFilter] = useState<Filter>("all");
  const [visibility, setVisibility] = useState<Visibility>("all");
  const [items, setItems] = useState<Wish[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadWishes = useCallback(async (status: Filter, after: string | null = null, access: Visibility = "all") => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ status, visibility: access });
      if (after) params.set("cursor", after);
      const response = await fetch(`/api/admin/wishes?${params}`, { cache: "no-store" });
      if (response.status === 401) { setAuthenticated(false); setItems([]); return; }
      const data = await response.json() as { error?: string; items?: Wish[]; nextCursor?: string | null };
      if (!response.ok) throw new Error(data.error || "Chưa tải được lời chúc.");
      const next = data.items ?? [];
      setItems(previous => after ? [...previous, ...next] : next);
      setCursor(data.nextCursor ?? null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Chưa tải được lời chúc.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void fetch("/api/admin/session", { cache: "no-store" }).then(async response => {
      const data = await response.json().catch(() => ({})) as { configured?: boolean; authenticated?: boolean };
      if (!active) return;
      setConfigured(Boolean(data.configured));
      setAuthenticated(Boolean(data.authenticated));
      if (data.authenticated) await loadWishes(filter, null, visibility);
    }).catch(() => { if (active) { setConfigured(true); setError("Không kết nối được với trang quản lý."); } });
    return () => { active = false; };
  }, [filter, loadWishes, visibility]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => ({})) as { error?: string; authenticated?: boolean };
      if (!response.ok) throw new Error(data.error || "Chưa đăng nhập được.");
      setPassword("");
      setAuthenticated(Boolean(data.authenticated));
      setNotice("Đã đăng nhập an toàn.");
      await loadWishes(filter, null, visibility);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Chưa đăng nhập được.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => undefined);
    setAuthenticated(false);
    setItems([]);
    setCursor(null);
    setNotice("Đã đăng xuất.");
  }

  const expireSession = useCallback(() => {
    setAuthenticated(false);
    setItems([]);
  }, []);

  function selectFilter(next: Filter) {
    setFilter(next);
    setItems([]);
    setCursor(null);
  }

  function selectVisibility(next: Visibility) {
    setVisibility(next);
    setItems([]);
    setCursor(null);
  }

  return <div className="admin-shell">
    <Link className="admin-back" href="/#loi-chuc">← Về thiệp mời</Link>
    <header className="admin-heading">
      <p className="eyebrow">KHU VỰC RIÊNG CỦA VŨ</p>
      <h1>Lời chúc<br /><em>gửi đến mình.</em></h1>
      <p>Đây là nơi xem những lời bạn bè gửi, kể cả lời nhắn chỉ dành riêng cho Vũ.</p>
    </header>

    {configured === null ? <p className="admin-card" role="status">Đang kiểm tra cấu hình…</p> : !configured ? <section className="admin-card admin-config" role="status">
      <h2>Trang quản lý chưa được bật</h2>
      <p>Hãy thêm <code>ADMIN_PASSWORD</code> (ít nhất 16 ký tự) và <code>ADMIN_SESSION_SECRET</code> (ít nhất 32 ký tự) vào biến môi trường server, rồi khởi động lại ứng dụng.</p>
    </section> : !authenticated ? <form className="admin-card admin-login" onSubmit={login}>
      <h2>Đăng nhập để xem lời chúc</h2>
      <label>Mật khẩu quản lý<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required minLength={1} /></label>
      <button className="button button-dark" type="submit" disabled={loading}>{loading ? "Đang kiểm tra…" : "Đăng nhập"}</button>
      {error && <p className="admin-error" role="alert">{error}</p>}
    </form> : <section className="admin-list" aria-labelledby="admin-list-title">
      <div className="admin-list-heading"><div><h2 id="admin-list-title">{view === "wishes" ? "Lời nhắn của bạn bè" : "Xác nhận tham dự"}</h2><p>{view === "wishes" ? "Riêng tư chỉ Vũ đọc được. Lời công khai cần có sự đồng ý và được duyệt." : "Bao gồm cả phản hồi không đồng ý công khai. Lời nhắn RSVP luôn chỉ Vũ đọc được."}</p></div><button type="button" className="button button-line" onClick={logout}>Đăng xuất</button></div>
      <div className="admin-tabs" role="group" aria-label="Chọn loại dữ liệu">
        <button type="button" aria-pressed={view === "wishes"} onClick={() => setView("wishes")}>Lời chúc</button>
        <button type="button" aria-pressed={view === "rsvps"} onClick={() => setView("rsvps")}>Xác nhận tham dự</button>
      </div>
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      {view === "wishes" ? <>
        <div className="admin-filters" role="group" aria-label="Lọc theo trạng thái duyệt">
          {(["all", "pending", "approved", "rejected"] as const).map(value => <button key={value} type="button" aria-pressed={filter === value} onClick={() => selectFilter(value)}>{value === "all" ? "Tất cả" : statusLabels[value]}</button>)}
        </div>
        <div className="admin-filters admin-visibility-filters" role="group" aria-label="Lọc theo quyền riêng tư">
          {(["all", "public", "private"] as const).map(value => <button key={value} type="button" aria-pressed={visibility === value} onClick={() => selectVisibility(value)}>{value === "all" ? "Công khai và riêng tư" : value === "public" ? "Đồng ý công khai" : "Chỉ Vũ đọc"}</button>)}
        </div>
        {error && <p className="admin-error" role="alert">{error} <button className="text-button" type="button" onClick={() => void loadWishes(filter, null, visibility)}>Thử lại</button></p>}
        {loading && <p className="admin-muted" role="status">Đang tải lời chúc…</p>}
        {!loading && !error && items.length === 0 && <p className="admin-empty">Chưa có lời chúc trong mục này.</p>}
        <div className="admin-wishes">{items.map(wish => <article key={wish.id} className="admin-wish">
          <header><div><h3>{wish.name}</h3><time dateTime={new Date(`${wish.createdAt.replace(" ", "T")}Z`).toISOString()}>{formatDate(wish.createdAt)}</time></div><div className="admin-badges"><span>{statusLabels[wish.status]}</span><span className={wish.publicConsent ? "is-public" : "is-private"}>{wish.publicConsent ? "Đồng ý công khai" : "Riêng tư"}</span></div></header>
          <p>{wish.message}</p>
        </article>)}</div>
        {cursor && <button type="button" className="button button-line admin-more" disabled={loading} onClick={() => void loadWishes(filter, cursor, visibility)}>Xem thêm lời chúc</button>}
      </> : <RsvpList onExpired={expireSession} />}
    </section>}
    {error && !authenticated && configured && <p className="admin-error" role="alert">{error}</p>}
  </div>;
}
