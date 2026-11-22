import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const manifest = [];
await mkdir(new URL('../public/images/backgrounds/', import.meta.url), {recursive:true});
for (const name of ['fpt','venue','cafe']) {
  const source = `assets/backgrounds/${name}.jpg`;
  const bytes = await readFile(new URL(`../${source}`, import.meta.url));
  for (const width of [800,1600]) {
    const file = `public/images/backgrounds/${name}-${width}.webp`;
    const result = await sharp(bytes).rotate().resize({width,withoutEnlargement:true}).webp({quality:80}).toBuffer({resolveWithObject:true});
    await writeFile(new URL(`../${file}`, import.meta.url),result.data);
    manifest.push({file,width:result.info.width,height:result.info.height,bytes:result.data.length,sha256:hash(result.data),original:source,originalSha256:hash(bytes),source:`https://heejoon-graduation-2026.vercel.app/images/${name}.jpg`});
  }
}
await writeFile(new URL('../docs/reference/background-manifest.json',import.meta.url),JSON.stringify(manifest,null,2)+'\n');
