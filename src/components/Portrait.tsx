import { photosAvailable } from "@/content/photos.generated";

export function Portrait({ id, hero = false }: { id: "9516" | "9505"; hero?: boolean }) {
  if (!photosAvailable) return <div className="portrait-placeholder" aria-hidden="true">
    <span>Vũ</span>
  </div>;
  /* Originals are processed at build time. The photograph keeps its full composition. */
  /* eslint-disable-next-line @next/next/no-img-element */
  return <img className="portrait" src={`/images/vu-${id}-960.webp`}
    srcSet={[640, 960, 1440, 1920].map(width => `/images/vu-${id}-${width}.webp ${width}w`).join(", ")}
    sizes={hero ? "(min-width: 860px) 37vw, 88vw" : "(min-width: 860px) 27vw, 80vw"}
    alt={id === "9516" ? "Phan Nguyên Vũ trong trang phục tốt nghiệp" : "Ảnh kỷ niệm tốt nghiệp của Phan Nguyên Vũ"}
    loading={hero ? "eager" : "lazy"} fetchPriority={hero ? "high" : "auto"} decoding="async" />;
}
