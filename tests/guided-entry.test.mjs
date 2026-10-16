import test from 'node:test';
import assert from 'node:assert/strict';
import {guidedRecord,startPage,GUIDE_STEPS} from '../web/start-page.mjs';
import {WORK_EVIDENCE} from '../web/work-evidence.mjs';
import {validateRepository} from '../web/core.mjs';
import worker from '../dist/server/index.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const helpers={heading:(a,b,c)=>`<h1>${b}</h1><p>${c}</p>`,esc,pretty:JSON.stringify,badge:(s,t)=>esc(t??s)};
test('guided entry uses a completed observed experience with verifiable before/after history',async()=>{
 await validateRepository(WORK_EVIDENCE.repository);
 const record=guidedRecord(WORK_EVIDENCE.repository);
 assert.equal(record.current.experience.demo,false);
 assert.equal(record.current.experience.outcome.status,'success');
 assert.equal(record.revisions.length,2);
 assert.deepEqual(record.current.parents,[record.revisions[0].commitId]);
 assert.equal(guidedRecord(WORK_EVIDENCE.repository,record.revisions[0].commitId).selected.experience.outcome.status,'incomplete');
 assert.equal(guidedRecord(WORK_EVIDENCE.repository,'unrelated-source').selected.commitId,record.current.commitId);
});
test('guided steps reveal the actual evidence and both revisions without mixing scientific claims',()=>{
 const pages=GUIDE_STEPS.map((label,step)=>startPage({...helpers,step}));
 assert.match(pages[0],/transferir experiencia entre modelos sigue sin validarse/);
 assert.match(pages[1],/B con hashes válidos/);
 assert.match(pages[2],/gamc-trust-after.tap/);
 assert.match(pages[2],/Las ocho pruebas/);
 assert.equal((pages[3].match(/data-action="guide-revision"/g)||[]).length,2);
 for(let i=0;i<4;i++)assert.match(pages[i],new RegExp('aria-current="step"'));
});
test('hosted entry keeps advanced tools in a disclosure and serves the correction evidence',async()=>{
 const html=await (await worker.fetch(new Request('https://example.test/'),{})).text();
 assert.match(html,/<summary>Explorar más<\/summary>/);
 assert.match(html,/href="#start"/);
 for(const path of ['/start-page.mjs','/gamc-review.json','/gamc-trust-after.tap'])assert.equal((await worker.fetch(new Request('https://example.test'+path),{})).status,200,path);
});
