import { chromium } from '@playwright/test';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://127.0.0.1:3011');
await page.evaluate(()=>document.fonts.ready);
await page.waitForFunction(()=>[...document.querySelectorAll('.hero-copy > *')].every(el=>Number(getComputedStyle(el).opacity) > .99));
await page.screenshot({path:'docs/blue-hero.png'});
await browser.close();
