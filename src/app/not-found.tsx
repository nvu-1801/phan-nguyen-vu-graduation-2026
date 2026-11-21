import Link from "next/link";

export default function NotFound() {
  return <main className="wrap status-page">
    <h1>Không tìm thấy trang</h1>
    <Link className="button button-accent" href="/">Về thiệp mời</Link>
  </main>;
}
