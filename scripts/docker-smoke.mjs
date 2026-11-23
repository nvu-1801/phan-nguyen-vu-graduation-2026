import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

// Deliberately fixed to a separate LOCAL Compose project; never target production.
const origin = 'http://localhost:3020';
const compose = ['compose','--env-file','.env.docker.local','-p','graduation-local'];
function docker(args) {
  const result = spawnSync('docker', args, {encoding:'utf8',timeout:120000});
  if (result.status !== 0) throw new Error(`Docker command failed: ${result.stderr || result.stdout}`);
  return result.stdout;
}
const exec = args => docker([...compose,'exec','-T','invitation',...args]);
const query = async (sql, args=[]) => JSON.parse(exec(['node','--input-type=module','-e',
  `import {createClient} from '@libsql/client';const db=createClient({url:process.env.DATABASE_URL});try{console.log(JSON.stringify((await db.execute({sql:${JSON.stringify(sql)},args:${JSON.stringify(args)}})).rows))}finally{db.close()}`]));
// Drain every response, including image/error bodies. Checking only status left
// Undici streams paused while connections closed after a container restart.
async function request(path, options) {
  const response = await fetch(origin+path, options);
  const bytes = await response.arrayBuffer();
  return { status: response.status, json: async () => JSON.parse(Buffer.from(bytes).toString('utf8')) };
}
async function read(path) {
  for (let attempt=0; ; attempt++) {
    try { return await request(path, {headers:{Connection:'close'},signal:AbortSignal.timeout(10000)}); }
    catch(error) { if(attempt>=3) throw error; await new Promise(resolve=>setTimeout(resolve,250)); }
  }
}
async function get(path) {const res=await read(path);assert.equal(res.status,200,path);return res.json();}
async function post(path, data, key=randomUUID(), site=origin) {
  return request(path,{method:'POST',headers:{Origin:site,'Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify(data)});
}
const tag = `docker-${randomUUID().slice(0,8)}`;
const ids = {rsvps:[], wishes:[]};
const checks=[];
const ok = message => {checks.push(message);console.log('PASS',message);};
const browser = await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
  assert.equal((await get('/api/health')).status,'ok');
  assert.equal(exec(['id','-u']).trim(),'1000');
  ok('Linux container healthy, runs as non-root, migrations ready');
  const payload={name:`${tag}-public`,attendance:'yes',publicConsent:true};
  const key=randomUUID();
  const response=await post('/api/rsvps',payload,key);assert.equal(response.status,201);
  const receipt=await response.json();ids.rsvps.push(receipt.id);
  const retry=await post('/api/rsvps',payload,key);assert.equal(retry.status,200);assert.equal((await retry.json()).id,receipt.id);
  assert.equal((await post('/api/rsvps',{...payload,attendance:'no'},key)).status,409);
  assert.equal((await post('/api/rsvps',payload,randomUUID(),'https://foreign.example')).status,403);
  ok('Real HTTP RSVP, safe retries, conflict and origin protection');
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin);await page.getByRole('heading',{name:'Phan Nguyên Vũ',exact:true}).waitFor();
  const rsvp=page.locator('#xac-nhan .guest-form');
  await rsvp.getByLabel('Tên của bạn').fill(`${tag}-private`);
  await rsvp.getByLabel('Lời nhắn riêng (không bắt buộc)').fill('Local container persistence fixture.');
  const savedRsvp=page.waitForResponse(r=>r.url().endsWith('/api/rsvps')&&r.request().method()==='POST');
  await rsvp.getByRole('button',{name:'Gửi xác nhận',exact:true}).click();
  const privateReceipt=await savedRsvp;assert.equal(privateReceipt.status(),201);ids.rsvps.push((await privateReceipt.json()).id);
  const wish=page.locator('#loi-chuc .guest-form');
  await wish.getByLabel('Tên của bạn').fill(`${tag}-wish`);
  await wish.locator('summary').click();
  await wish.getByRole('button',{name:'Dùng gợi ý: Chân thành',exact:true}).click();
  await wish.getByRole('checkbox').check();
  const savedWish=page.waitForResponse(r=>r.url().endsWith('/api/wishes')&&r.request().method()==='POST');
  await wish.getByRole('button',{name:'Gửi lời chúc',exact:true}).click();
  const publicWish=await savedWish;assert.equal(publicWish.status(),201);ids.wishes.push((await publicWish.json()).id);
  const privateWish=await post('/api/wishes',{name:`${tag}-private-wish`,message:'Private fixture',publicConsent:false});
  assert.equal(privateWish.status,201);ids.wishes.push((await privateWish.json()).id);
  assert(!(await get('/api/guests')).items.some(x=>x.name===`${tag}-private`));
  assert(!(await get('/api/wishes')).items.some(x=>x.name===`${tag}-wish`));
  ok('Frontend submits RSVP and suggested wish to SQLite; private and pending data stay hidden');
  for(const id of ids.wishes) exec(['node','scripts/moderate.mjs','approve',id]);
  const publicList=await get('/api/wishes');
  assert(publicList.items.some(x=>x.id===ids.wishes[0]));assert(!publicList.items.some(x=>x.id===ids.wishes[1]));
  ok('Moderation works inside production image; consent remains enforced after approval');
  const before=docker([...compose,'ps','-q','invitation']).trim();
  docker([...compose,'up','-d','--force-recreate','--wait']);
  const after=docker([...compose,'ps','-q','invitation']).trim();assert.notEqual(before,after);
  assert.equal((await get('/api/health')).status,'ok');
  const persisted=await query('SELECT id FROM rsvps WHERE id IN (?,?)',ids.rsvps);assert.equal(persisted.length,2);
  assert((await get('/api/wishes')).items.some(x=>x.id===ids.wishes[0]));
  ok('Container recreated with new ID; SQLite data survives in persistent volume');
  await page.reload();await page.getByText(`${tag}-wish`,{exact:true}).waitFor();
  assert.equal(await page.getByText(`${tag}-private-wish`,{exact:true}).count(),0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
  for(const path of ['/images/backgrounds/fpt-800.webp','/images/portrait-9516-cutout.webp','/images/graduation-og.png','/tot-nghiep-vu.ics']) assert.equal((await read(path)).status,200,path);
  assert.deepEqual(errors,[]);
  await mkdir('test-results/docker',{recursive:true});
  await page.screenshot({path:'test-results/docker/mobile.png',fullPage:true});
  ok('Final production frontend, local assets/calendar and mobile layout work without application errors');
} finally {
  await browser.close();
  for(const [table,records] of Object.entries(ids)) for(const id of records) await query(`DELETE FROM ${table} WHERE id=?`,[id]);
  // Reset only this local bucket when nobody else has added a write during the check.
  exec(['node','--input-type=module','-e',`import {createClient} from '@libsql/client';import {createHmac} from 'node:crypto';const db=createClient({url:process.env.DATABASE_URL});try{await db.execute({sql:'DELETE FROM rate_limits WHERE bucket_key=? AND hits=4',args:[createHmac('sha256',process.env.RATE_LIMIT_SECRET).update('local').digest('hex')]})}finally{db.close()}`]);
  for(const [table,records] of Object.entries(ids)) for(const id of records) assert.equal((await query(`SELECT id FROM ${table} WHERE id=?`,[id])).length,0);
  console.log('Local smoke fixtures removed by exact IDs; volume and other data retained.');
}
await writeFile('test-results/docker/report.json',JSON.stringify({time:new Date().toISOString(),origin,checks,fixturesRemoved:true},null,2));
console.log(`Docker production smoke completed: ${checks.length} checks passed.`);
