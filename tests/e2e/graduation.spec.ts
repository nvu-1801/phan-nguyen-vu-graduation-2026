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

// External Google UI is not owned by this app. Keep app accessibility/screenshots
// deterministic while verifying the real embed URL/title and always-visible Maps link.
test.beforeEach(async ({ page }) => {
  await page.route(/^https:\/\/www\.google\.com\/maps\?/, route => route.fulfill({
    contentType: "text/html", body: '<!doctype html><html lang="vi"><head><title>Bản đồ</title></head><body><main aria-label="Bản đồ tham khảo"><p>Trung tâm Hội nghị tỉnh Gia Lai</p></main></body></html>',
  }));
});

for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1440, 900]]) {
  test(`invitation works at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Phan Nguyên Vũ" })).toBeVisible();
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
    await expect(page.getByRole("link", {name: "Mở mã QR cà phê"})).toHaveAttribute("href", "/payments/vu-coffee-vietqr.png");
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
  await expect(images).toHaveCount(3);
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
  await expect(page.getByRole("link", { name: "Mình sẽ đến" })).toHaveAttribute("href", /^sms:/);
  await expect(page.locator(".contact-card").getByRole("link", { name: /^Gọi / })).toHaveAttribute("href", /^tel:/);
  await expect(page.locator("main form")).toHaveCount(0);
  expect(requests.some(url => /\/api\/(guests|wishes|rsvps)$/.test(url))).toBe(false);
});

test("loads the Three.js scene on scroll at phone width", async ({ page }) => {
  test.skip(!photosRequired, "Original photos are required for the scene.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".story").scrollIntoViewIfNeeded();
  await expect(page.locator(".photo-stage-live canvas")).toBeVisible({ timeout: 15000 });
  await page.mouse.wheel(0, 220);
  await page.mouse.wheel(0, -220);
  await expect(page.locator(".photo-stage-live canvas")).toBeVisible();
});

test("VPS accepts its configured HTTPS origin and rate limits each proxy IP separately", async ({ request }) => {
  const submit = (ip: string, site = "https://invite.example.com") => request.post("http://127.0.0.1:3219/api/rsvps", {
    headers: { Origin: site, "Idempotency-Key": randomUUID(), "X-Real-IP": ip },
    data: { name: "VPS fixture", attendance: "yes", publicConsent: false },
  });
  for (let i = 0; i < 5; i++) expect((await submit("192.0.2.1")).status()).toBe(201);
  expect((await submit("192.0.2.1")).status()).toBe(429);
  expect((await submit("192.0.2.2")).status()).toBe(201);
  expect((await submit("192.0.2.3", "https://untrusted.example.com")).status()).toBe(403);
});

test("scroll choreography reverses, survives resize and clears with reduced motion", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion-ready", "true");
  const portrait = page.locator(".hero-frame");
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, 0); });
  await expect.poll(() => portrait.evaluate(el => Number(new DOMMatrix(getComputedStyle(el).transform).m42))).toBeLessThan(2);
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect.poll(() => portrait.evaluate(el => Number(new DOMMatrix(getComputedStyle(el).transform).m42))).toBeGreaterThan(10);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => portrait.evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).m42))).toBeLessThan(2);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".campus-window").scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveAttribute("data-motion-ready", "true");
  await expect(portrait).not.toHaveAttribute("style", /transform/);
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("background photographs load locally and the map is embedded directly", async ({ page, request }) => {
  await page.goto("/");
  const map = page.locator(".venue-map iframe");
  await expect(map).toHaveCount(1);
  await expect(map).toHaveAttribute("title", "Bản đồ Trung tâm Hội nghị tỉnh Gia Lai");
  await expect(map).toHaveAttribute("src", /^https:\/\/www\.google\.com\/maps\?.*output=embed&hl=vi$/);
  await expect(map).toHaveAttribute("loading", "lazy");
  await expect(page.getByRole("button", { name: "Hiển thị bản đồ" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Mở bản đồ lớn trên Google Maps" })).toHaveAttribute("href", /^https:\/\/www\.google\.com\/maps\/search/);
  for (const name of ["fpt", "venue", "cafe"]) {
    const response = await request.get(`/images/backgrounds/${name}-800.webp`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/webp");
  }
});

test("wish suggestions are editable drafts and never submit on selection", async ({ page }) => {
  let writes = 0;
  page.on("request", req => { if (req.method() === "POST" && req.url().includes("/api/wishes")) writes++; });
  await page.goto("/");
  const form = page.locator("#loi-chuc .guest-form");
  await form.locator("summary").click();
  await form.getByRole("button", { name: "Dùng gợi ý: Chân thành", exact: true }).click();
  const message = form.getByLabel("Lời chúc của bạn");
  await expect(message).toHaveValue(/Chúc mừng Vũ đã đi hết một chặng đường/);
  await expect(message).toBeFocused();
  await message.fill("Lời của riêng mình.");
  await form.getByRole("button", { name: "Dùng gợi ý: Ngắn mà thật lòng", exact: true }).click();
  await expect(message).toHaveValue(/^Lời của riêng mình\.\n\nChúc mừng Vũ tốt nghiệp!/);
  await expect(form.getByRole("checkbox")).not.toBeChecked();
  expect(writes).toBe(0);
});

test("suggested wishes remain available without a database", async ({ page }) => {
  await page.goto("http://127.0.0.1:3218/");
  await expect(page.locator("#loi-chuc .wish-idea")).toHaveCount(10);
  const links = page.locator("#loi-chuc .wish-idea a");
  await expect(links).toHaveCount(10);
  for (const link of await links.all()) await expect(link).toHaveAttribute("href", /^sms:/);
  await expect(page.getByText("không phải lời chúc của khách đã gửi", { exact: false })).toBeVisible();
});

test("admin signs in and sees private wishes, RSVP messages and exports CSV", async ({ page, request }) => {
  const stamp = Date.now();
  const rsvpName = `RSVP riêng ${stamp}`;
  const rsvpMessage = `Lời nhắn RSVP riêng ${stamp}`;
  const formulaName = `Công thức ${stamp}`;
  const formulaMessage = `=HYPERLINK("https://example.com","x")`;
  const wishName = `Wish riêng ${stamp}`;
  const wishMessage = `Lời chúc riêng ${stamp}`;
  const db = new DatabaseSync(fixture);
  try {
    const insertRsvp = db.prepare("INSERT INTO rsvps (id,guest_name,attendance,public_consent,idempotency_key,request_hash,message) VALUES (?,?,?,?,?,?,?)");
    insertRsvp.run(randomUUID(), rsvpName, "no", 0, randomUUID(), "test", rsvpMessage);
    insertRsvp.run(randomUUID(), formulaName, "yes", 1, randomUUID(), "test", formulaMessage);
    db.prepare("INSERT INTO wishes (id,guest_name,message,public_consent,idempotency_key,request_hash) VALUES (?,?,?,?,?,?)")
      .run(randomUUID(), wishName, wishMessage, 0, randomUUID(), "test");
  } finally { db.close(); }
  expect((await request.get("/api/admin/rsvps")).status()).toBe(401);
  expect((await request.get("/api/admin/rsvps/export")).status()).toBe(401);

  await page.goto("/admin");
  await page.getByLabel("Mật khẩu quản lý").fill("graduation-test-admin");
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  await expect(page.getByRole("heading", { name: "Lời nhắn của bạn bè" })).toBeVisible();
  await expect(page.getByText(wishMessage)).toBeVisible();

  await page.getByRole("button", { name: "Xác nhận tham dự", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Xác nhận tham dự", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: rsvpName, exact: true })).toBeVisible();
  await expect(page.getByText(rsvpMessage, { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Xuất CSV" })).toHaveAttribute("href", "/api/admin/rsvps/export?consent=all&attendance=all");

  const csv = await page.evaluate(async () => {
    const response = await fetch("/api/admin/rsvps/export?consent=all&attendance=all", { cache: "no-store" });
    const buffer = await response.arrayBuffer();
    return {
      status: response.status,
      type: response.headers.get("content-type") || "",
      bom: Array.from(new Uint8Array(buffer).slice(0, 3)),
      body: new TextDecoder("utf-8").decode(buffer),
    };
  });
  expect(csv.status).toBe(200);
  expect(csv.type).toContain("text/csv");
  expect(csv.bom).toEqual([0xEF, 0xBB, 0xBF]);
  expect(csv.body).toContain("Tên,Tham dự,Lời nhắn,Đồng ý công khai,Thời gian gửi");
  expect(csv.body).toContain(rsvpName);
  expect(csv.body).toContain(rsvpMessage);
  expect(csv.body).toContain(formulaName);
  expect(csv.body).toContain("'=HYPERLINK");
  expect(csv.body).not.toContain(`\n${formulaMessage}`);
});

test("admin approves or rejects wishes and private wishes stay private", async ({ page, request }) => {
  const stamp = Date.now();
  const names = {
    approved: `Duyệt công khai ${stamp}`,
    rejected: `Từ chối công khai ${stamp}`,
    privateWish: `Duyệt riêng tư ${stamp}`,
  };
  const ids = { approved: randomUUID(), rejected: randomUUID(), privateWish: randomUUID() };
  const db = new DatabaseSync(fixture);
  try {
    const insert = db.prepare("INSERT INTO wishes (id,guest_name,message,public_consent,idempotency_key,request_hash) VALUES (?,?,?,?,?,?)");
    insert.run(ids.approved, names.approved, "Lời chúc sẽ được duyệt công khai.", 1, randomUUID(), "test");
    insert.run(ids.rejected, names.rejected, "Lời chúc sẽ bị từ chối.", 1, randomUUID(), "test");
    insert.run(ids.privateWish, names.privateWish, "Lời chúc riêng được duyệt.", 0, randomUUID(), "test");
  } finally { db.close(); }

  expect((await request.patch(`/api/admin/wishes/${ids.approved}`, { headers: { Origin: origin }, data: { action: "approve" } })).status()).toBe(401);
  expect((await request.patch(`/api/admin/wishes/${ids.approved}`, { headers: { Origin: "https://evil.example" }, data: { action: "approve" } })).status()).toBe(403);

  await page.goto("/admin");
  await page.getByLabel("Mật khẩu quản lý").fill("graduation-test-admin");
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  await expect(page.getByRole("heading", { name: "Lời nhắn của bạn bè" })).toBeVisible();

  const card = (name: string) => page.locator(".admin-wish").filter({ has: page.getByRole("heading", { name, exact: true }) });

  await card(names.approved).getByRole("button", { name: "Duyệt", exact: true }).click();
  await expect(card(names.approved).getByText("Duyệt lời chúc này?")).toBeVisible();
  await card(names.approved).getByRole("button", { name: "Xác nhận duyệt" }).click();
  await expect(card(names.approved).getByText("Đã duyệt")).toBeVisible();

  await card(names.rejected).getByRole("button", { name: "Từ chối", exact: true }).click();
  await card(names.rejected).getByRole("button", { name: "Xác nhận từ chối" }).click();
  await expect(card(names.rejected).getByText("Đã từ chối")).toBeVisible();

  await expect(card(names.privateWish).getByText(/duyệt cũng không hiện/)).toBeVisible();
  await card(names.privateWish).getByRole("button", { name: "Duyệt", exact: true }).click();
  await expect(card(names.privateWish).getByText(/vẫn không hiện công khai/)).toBeVisible();
  await card(names.privateWish).getByRole("button", { name: "Xác nhận duyệt" }).click();
  await expect(card(names.privateWish).getByText("Đã duyệt")).toBeVisible();

  const publicItems = (await (await request.get("/api/wishes")).json()).items as { name: string }[];
  expect(publicItems.some(item => item.name === names.approved)).toBe(true);
  expect(publicItems.some(item => item.name === names.rejected)).toBe(false);
  expect(publicItems.some(item => item.name === names.privateWish)).toBe(false);

  const conflict = await page.evaluate(async id => {
    const response = await fetch(`/api/admin/wishes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject" }),
    });
    return response.status;
  }, ids.approved);
  expect(conflict).toBe(409);
});

for (const width of [390, 1440]) {
  test(`floating contact actions stay usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const dock = page.getByRole("navigation", { name: "Liên hệ nhanh" });
    await expect(dock).toBeVisible();
    await expect(dock.getByRole("link", { name: "Gọi Vũ: 0343 628 267" })).toHaveAttribute("href", "tel:+84343628267");
    await expect(dock.getByRole("link", { name: "Nhắn Zalo cho Vũ" })).toHaveAttribute("href", "https://zalo.me/0343628267");
    const initial = (await dock.boundingBox())!;
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const final = (await dock.boundingBox())!;
    expect(Math.abs(initial.y-final.y)).toBeLessThan(1);
    expect(final.x).toBeGreaterThanOrEqual(0);
    expect(final.x+final.width).toBeLessThanOrEqual(width);
    expect(final.y+final.height).toBeLessThanOrEqual(844);
    for (const control of await dock.locator(".dock-button").all()) {
      const box = (await control.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    await dock.getByRole("button", { name: "Mời Vũ cà phê" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dock.getByRole("button", { name: "Mời Vũ cà phê" })).toBeFocused();
    await dock.getByRole("link", { name: "Về đầu trang", exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(120);
  });
}

test("photo scene keeps its poster during cold load and initializes when entered mid-scroll", async ({ page }) => {
  test.skip(!photosRequired, "Original photos are required.");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.route("**/images/vu-*-960.webp", async route => {
    await new Promise(resolve => setTimeout(resolve, 600));
    await route.continue();
  });
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const stage=document.querySelector(".photo-stage")!;
    window.scrollTo(0, stage.getBoundingClientRect().top+window.scrollY-200);
  });
  const stage=page.locator(".photo-stage");
  const canvas=page.locator(".photo-canvas canvas");
  await expect(stage.locator(".photo-poster")).toHaveCSS("opacity", "1");
  await expect(stage).toHaveClass(/photo-stage-live/, {timeout:15000});
  await expect(canvas).toBeVisible();
  const before=await stage.boundingBox();
  await page.mouse.wheel(0,200);
  await page.mouse.wheel(0,-200);
  await expect(canvas).toBeVisible();
  await page.setViewportSize({width:390,height:844});
  await expect(canvas).toBeVisible();
  expect(before!.height).toBeGreaterThan(0);
  await canvas.evaluate((el:HTMLCanvasElement)=>el.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext());
  await expect(stage).not.toHaveClass(/photo-stage-live/);
  await expect(stage.locator(".photo-poster")).toHaveCSS("opacity","1");
});
