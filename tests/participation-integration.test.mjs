import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import worker from '../dist/server/index.js';
import {database,request} from './campaign-fixture.mjs';
const catalog=JSON.parse(fs.readFileSync(new URL('../participation/catalog.json',import.meta.url)));
test('published participation assets and catalog match the frozen source and archive',async()=>{
 for(const p of ['/participate','/join.mjs','/join.py','/participation-guide.md','/participation-api.json','/participation-protocol.json','/participation-validation.json'])assert.equal((await worker.fetch(request(p),{})).status,200,p);
 const tasks=await (await worker.fetch(request('/api/participation/tasks'),{})).json();
 assert.equal(tasks.baseline.sha256,catalog.baseline.sha256);assert.equal(tasks.baseline.archiveSha256,catalog.baseline.archiveSha256);
 const bytes=Buffer.from(await (await worker.fetch(request('/participation-baseline.zip'),{})).arrayBuffer());
 assert.equal('sha256:'+createHash('sha256').update(bytes).digest('hex'),catalog.baseline.archiveSha256);
});
test('compiled participation routes bind all source hashes and hide internal run records',async()=>{
 const DB=database();
 const created=await worker.fetch(request('/api/participation/runs',{taskId:'P01',agentId:'technical-test',model:'none',runtime:'unit-test',purpose:'conformance',shareable:true}),{DB});
 assert.equal(created.status,201);const run=await created.json();
 assert.equal((await worker.fetch(request('/api/experiences/'+run.runId),{DB})).status,404);
 const auth={Authorization:'Bearer '+run.bearerToken};
 const material=await (await worker.fetch(new Request('https://example.test/api/participation/runs/'+run.runId+'/material',{headers:auth}),{DB})).json();
 const result=await worker.fetch(new Request('https://example.test/api/participation/runs/'+run.runId+'/results',{method:'POST',headers:{...auth,'Content-Type':'application/json'},body:JSON.stringify({shareable:true,materialReceiptId:material.receipt.id,outcome:'incomplete',patch:'',evidence:['Actual integration test, not a model task'],notes:'No coding task attempted',condition:'spoof',executionVerified:true})}),{DB});
 assert.equal(result.status,201);const receipt=await result.json(),row=JSON.parse(DB.rows.get(receipt.id).payload);
 assert.equal(row.baselineHash,catalog.baseline.sha256);assert.equal(row.sourceCommit,catalog.baseline.sourceCommit);assert.equal(row.acceptanceSha256,catalog.tasks[0].acceptanceSha256);assert.equal(row.protocolId,catalog.id);assert.equal(row.submissionHash,receipt.id);assert.equal(row.condition,run.condition);assert.equal(row.purpose,'conformance');assert.equal(row.executionVerified,false);
 assert(!JSON.stringify([...DB.rows.values()]).includes(run.bearerToken));
});
test('compiled HEAD material creates no delivery event',async()=>{
 const DB=database(),run=await (await worker.fetch(request('/api/participation/runs',{taskId:'P01',agentId:'head-test',model:'none',runtime:'unit-test',purpose:'conformance',shareable:true}),{DB})).json();
 const r=await worker.fetch(new Request('https://example.test/api/participation/runs/'+run.runId+'/material',{method:'HEAD',headers:{Authorization:'Bearer '+run.bearerToken}}),{DB});
 assert.equal(r.status,405);assert.equal(await r.text(),'');assert.equal([...DB.rows.values()].filter(x=>x.kind==='participation-event').length,0);
});
