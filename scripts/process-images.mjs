import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const output = new URL("../public/images/", import.meta.url);
const expected = {
  "9516": "96129681674fceac274cf3a66a19104921ba26e80e19bff51aff2ae9c75ac1ee",
  "9505": "52dc6b066862e1229d77dc7f2e713774487b3c5a639e946183babec6c5c696a9",
};
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const manifest = [];
await mkdir(output, { recursive: true });

for (const [id, checksum] of Object.entries(expected)) {
  const source = new URL(`../assets/originals/vu-${id}.jpg`, import.meta.url);
  let bytes;
  try {
    bytes = await readFile(source);
  } catch (error) {
    if (process.env.GRADUATION_ALLOW_MISSING_PHOTOS === "1" && error.code === "ENOENT") continue;
    throw error;
  }
  if (hash(bytes) !== checksum) throw new Error(`Original photo ${id} does not match the handoff manifest.`);
  for (const width of [640, 960, 1440, 1920]) {
    const filename = `vu-${id}-${width}.webp`;
    const maxBytes = id === "9516" ? 350000 : 300000;
    let file;
    for (let quality = 81; quality >= 39; quality -= 7) {
      file = await sharp(bytes).rotate().resize({ width, withoutEnlargement: true }).webp({ quality }).toBuffer({ resolveWithObject: true });
      if (file.data.length <= maxBytes) break;
    }
    if (file.data.length > maxBytes) throw new Error(`Portrait ${filename} exceeds the image budget.`);
    await writeFile(new URL(filename, output), file.data);
    manifest.push({ filename, source: `assets/originals/vu-${id}.jpg`, width: file.info.width, height: file.info.height, bytes: file.data.length, sha256: hash(file.data) });
  }
}
const qr = await readFile(new URL("../assets/payments/vu-coffee-vietqr.png", import.meta.url));
if (hash(qr) !== "6c1d757af4815ce7ca6b67dd5ab3ad4bc1bbe2677cca63c33dc85fdfb149483e") {
  throw new Error("The original QR does not match the handoff manifest.");
}
await mkdir(new URL("../public/payments/", import.meta.url), { recursive: true });
await writeFile(new URL("../public/payments/vu-coffee-vietqr.png", import.meta.url), qr);

const art = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#edf5fb"/>
  <path d="M78 111h550M78 518h550" stroke="#abc5d7" fill="none"/>
  <text x="82" y="170" fill="#23557a" font-size="25" font-family="sans-serif">Đại học FPT Quy Nhơn</text>
  <text x="76" y="275" fill="#162d45" font-size="67" font-family="serif">Lễ tốt nghiệp</text>
  <text x="76" y="365" fill="#23557a" font-size="74" font-family="serif" font-style="italic">của Vũ</text>
  <text x="82" y="445" fill="#162d45" font-size="30" font-family="sans-serif">20/12/2026</text>
</svg>`);
const layers = [];
if (manifest.length === 8) {
  const image = await sharp(await readFile(new URL("vu-9516-960.webp", output)))
    .resize(320, 480, { fit: "cover", position: "north" }).png().toBuffer();
  layers.push({ input: image, left: 784, top: 75 });
}
await sharp(art).composite(layers).png().toFile(new URL("graduation-og.png", output).pathname);
const icon = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="10" fill="#23557a"/><path fill="#edf5fb" d="M13 15h9l12 30 12-30h7L36 53h-6z"/><circle cx="50" cy="48" r="5" fill="#edf5fb"/></svg>`);
await sharp(icon).png().toFile(new URL("graduation-icon.png", output).pathname);
await writeFile(new URL("manifest.json", output), JSON.stringify(manifest, null, 2) + "\n");
await writeFile(new URL("../src/content/photos.generated.ts", import.meta.url), `export const photosAvailable = ${manifest.length === 8};\n`);
