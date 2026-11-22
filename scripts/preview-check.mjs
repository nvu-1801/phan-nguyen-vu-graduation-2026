import { chromium } from '@playwright/test';
const browser = await chromium.launch();
for (const width of [390,1440]) {
  const page = await browser.newPage({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'});
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:3010');
  await page.evaluate(async()=>{await document.fonts.ready;for(const image of document.querySelectorAll('main img')){image.loading='eager';await image.decode().catch(()=>{})}});
  await page.screenshot({path:`docs/blue-preview-${width}.png`,fullPage:true});
  await page.close();
}
await browser.close();
