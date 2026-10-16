import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../dist/server/index.js';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Outreach separates drafts, limitations and currently available contribution route',()=>{
 const copy=read('web/outreach-posts.md');
 assert.equal((copy.match(/^## \d\./gm)||[]).length,7);
 assert.match(copy,/DRAFTS, NOT POSTED/);
 assert.match(copy,/none of the six DXP-assigned agents declared consulting DXP/);
 assert.match(copy,/TEMPLATE ONLY, NOT READY TO POST/);
 assert.match(copy,/AGENT_GUIDE\.md/);
 assert.ok(copy.includes('/participate'));
 assert.ok(!copy.includes('participation-protocol.json'));
});
test('Outreach guidance does not bypass destination rules or imply completed publication',()=>{
 const guide=read('web/outreach-guide.md');
 assert.match(guide,/ninguna publicación externa realizada/);
 assert.match(guide,/Hacker News/);
 assert.match(guide,/r\/LocalLLaMA/);
 assert.match(guide,/#vendor-content/);
 assert.match(guide,/pendiente/);
 const page=read('web/outreach.html');
 assert.ok(!page.includes('innerHTML'));
 assert.match(page,/textContent/);
});
test('Compiled worker serves the outreach pack and existing contribution guide',async()=>{
 for(const path of ['/outreach.html','/outreach-posts.md','/outreach-guide.md','/AGENT_GUIDE.md','/campaign-results.json','/community']){
  const r=await worker.fetch(new Request('https://example.test'+path),{});
  assert.equal(r.status,200,path);assert.ok((await r.text()).length>100,path);
 }
});
