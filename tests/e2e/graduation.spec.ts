import { expect, test, type APIRequestContext } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";

const photosRequired = process.env.GRADUATION_ALLOW_MISSING_PHOTOS !== "1";
const origin = "http://127.0.0.1:3217";
const fixture = "test-results/fixture/graduation.db";
function post(request: APIRequestContext, path: string, data: object, key = randomUUID(), site = origin) {
  return request.post(path, { headers: { Origin: site, "Idempotency-Key": key }, data });
}

for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1440, 900]]) {
  test(`invitation works at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Lễ tốt nghiệp của Vũ" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Xác nhận tham dự" })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    if (photosRequired) await expect.poll(() => page.locator(".hero-frame img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(page.locator("canvas")).toHaveCount(0);
    await page.screenshot({ path: info.outputPath(`graduation-${width}.png`), fullPage: true });
    expect(errors).toEqual([]);
    if (width === 390) {
      const result = await new AxeBuilder({ page }).analyze();
      expect(result.violations.filter(v => v.impact === "serious" || v.impact === "critical")).toEqual([]);
    }
  });
}

test("the invitation and location work with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: origin });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await page.getByRole("link", { name: "Ngày và địa điểm" }).click();
    await expect(page).toHaveURL(/#dia-diem$/);
    await expect(page.locator(".event-facts").getByText("Trung tâm Hội nghị tỉnh Gia Lai")).toBeVisible();
    await expect(page.locator("#xac-nhan noscript p").first()).toHaveText("Vui lòng bật JavaScript để gửi phản hồi.");
    await expect(page.getByRole("button", { name: "Gửi xác nhận" })).toBeDisabled();
  } finally { await context.close(); }
});

test("QR opens, closes with Escape and returns focus", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Mời Vũ cà phê" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.getByRole("img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("both portraits and the calendar are served", async ({ page, request }) => {
  test.skip(!photosRequired, "Originals are available in full repository checkouts.");
  await page.goto("/");
  const images = page.locator("main figure img");
  await expect(images).toHaveCount(2);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  }
  const calendar = await request.get("/tot-nghiep-vu.ics");
  expect(calendar.ok()).toBeTruthy();
  expect(await calendar.text()).toContain("DTSTART;VALUE=DATE:20261220");
});

test("RSVP confirms through the form and stores private data, with concurrent retries returning the same receipt", async ({ page, request }) => {
  await page.goto("/");
  const form = page.locator(".guest-form").filter({ has: page.getByRole("button", { name: "Gửi xác nhận" }) });
  await form.getByLabel("Tên của bạn").fill("Khách riêng tư");
  await form.getByRole("button", { name: "Gửi xác nhận" }).click();
  await expect(form.getByRole("status")).toHaveText("Vũ đã nhận được phản hồi của bạn.");
  const payload = { name: "Khách công khai", attendance: "no", publicConsent: true };
  const key = randomUUID();
  const responses = await Promise.all(Array.from({ length: 4 }, () => post(request, "/api/rsvps", payload, key)));
  expect(responses.map(response => response.status()).sort()).toEqual([200, 200, 200, 201]);
  expect(new Set((await Promise.all(responses.map(response => response.json()))).map(result => result.id)).size).toBe(1);
  expect((await post(request, "/api/rsvps", { ...payload, attendance: "yes" }, key)).status()).toBe(409);
  const guests = await (await request.get("/api/guests?attendance=no")).json();
  expect(guests.items.map((entry: { name: string }) => entry.name)).toEqual(["Khách công khai"]);
  expect(guests.counts).toEqual({ yes: 0, no: 1 });
  expect((await request.get("/api/guests?attendance=yes")).ok()).toBe(true);
  const db = new DatabaseSync(fixture, { readOnly: true });
  try { expect(db.prepare("SELECT public_consent FROM rsvps WHERE guest_name = ?").get("Khách riêng tư")?.public_consent).toBe(0); }
  finally { db.close(); }
});

test("wishes require approval and consent and are rendered as plain text", async ({ page, request }) => {
  const message = '<img src=x onerror="alert(1)"> Chúc mừng Vũ!';
  const approved = await post(request, "/api/wishes", { name: "Công khai", message, publicConsent: true });
  const privateWish = await post(request, "/api/wishes", { name: "Riêng tư", message });
  const rejected = await post(request, "/api/wishes", { name: "Bị từ chối", message, publicConsent: true });
  const ids = await Promise.all([approved, privateWish, rejected].map(async response => {
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.status).toBe("pending");
    return body.id;
  }));
  expect((await (await request.get("/api/wishes")).json()).items).toEqual([]);
  const db = new DatabaseSync(fixture);
  try {
    db.prepare("UPDATE wishes SET status='approved' WHERE id IN (?,?)").run(ids[0], ids[1]);
    db.prepare("UPDATE wishes SET status='rejected' WHERE id = ?").run(ids[2]);
  } finally { db.close(); }
  await page.goto("/");
  await expect(page.getByText(message, { exact: true })).toBeVisible();
  await expect(page.locator("#loi-chuc .public-entries img")).toHaveCount(0);
  await expect(page.getByText("Riêng tư", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Bị từ chối", { exact: true })).toHaveCount(0);
});

test("additional writes are throttled and bad origins, payloads and cursors are rejected", async ({ request }) => {
  const payload = { name: "Khách", attendance: "yes" };
  expect((await post(request, "/api/rsvps", payload, undefined, "https://example.org")).status()).toBe(403);
  expect((await post(request, "/api/rsvps", { ...payload, name: "x".repeat(8100), message: "x".repeat(200) })).status()).toBe(413);
  expect((await post(request, "/api/rsvps", { ...payload, name: " " })).status()).toBe(400);
  expect((await post(request, "/api/rsvps", { ...payload, website: "bot" })).status()).toBe(400);
  const db = new DatabaseSync(fixture);
  try { db.exec("DELETE FROM rate_limits"); } finally { db.close(); }
  for (let i = 0; i < 5; i++) expect((await post(request, "/api/rsvps", payload)).status()).toBe(201);
  const limited = await post(request, "/api/rsvps", payload);
  expect(limited.status()).toBe(429);
  expect(Number(limited.headers()["retry-after"])).toBeGreaterThan(0);
  expect((await request.get("/api/guests?cursor=oops")).status()).toBe(400);
});

test("deployed invitation without a database gives working contact links", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", req => requests.push(req.url()));
  await page.goto("http://127.0.0.1:3218/");
  await expect(page.getByRole("link", { name: "Nhắn tin cho Vũ" })).toHaveAttribute("href", /^sms:/);
  await expect(page.getByRole("link", { name: /^Gọi / })).toHaveAttribute("href", /^tel:/);
  await expect(page.locator("main form")).toHaveCount(0);
  expect(requests.some(url => /\/api\/(guests|wishes|rsvps)$/.test(url))).toBe(false);
});
