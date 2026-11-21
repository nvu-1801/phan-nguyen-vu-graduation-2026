"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="wrap status-page">
    <h1>Chưa mở được thiệp mời</h1>
    <button className="button button-accent" type="button" onClick={reset}>Thử lại</button>
  </main>;
}
