export const event = {
  name: "Phan Nguyên Vũ",
  school: "Đại học FPT · Quy Nhơn",
  date: "Chủ nhật, 20.12.2026",
  countdown: "2026-12-20T00:00:00+07:00",
  venue: "Trung tâm Hội nghị tỉnh Gia Lai",
  address: "01 Nguyễn Tất Thành, phường Quy Nhơn, tỉnh Gia Lai",
  phone: "0343 628 267",
  tel: "+84343628267",
} as const;

export const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(event.venue + ", " + event.address);
