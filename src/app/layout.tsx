import type { Metadata } from "next";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
const description = "Hẹn bạn trong ngày mình tốt nghiệp. Thiệp mời tốt nghiệp của Phan Nguyên Vũ tại Đại học FPT Quy Nhơn.";

export const metadata: Metadata = {
  title: "Phan Nguyên Vũ · Tốt nghiệp 2026",
  description,
  metadataBase: new URL(siteUrl || "http://localhost:3000"),
  openGraph: { title: "Phan Nguyên Vũ · Tốt nghiệp 2026", description, locale: "vi_VN", type: "website", images: ["/images/graduation-og.png"] },
  icons: { icon: "/images/graduation-icon.png" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
