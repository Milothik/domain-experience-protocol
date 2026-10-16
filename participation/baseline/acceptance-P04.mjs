import test from 'node:test';import assert from 'node:assert/strict';
await import('./scripts/build-worker.mjs');const {default:worker}=await import('./dist/server/index.js');
import {clone,commit,branch,validateRepository,diff,contextPacket,emptyRepository} from './web/core.mjs';
import {scope,experience,database,request} from './fixture.mjs';
await import('./tests/dce-adapter.test.mjs');await import('./tests/public-api.test.mjs');await import('./tests/routing.test.mjs');
test('P04 individual receipts cannot receive POST',async()=>{const DB=database(),e=experience('new');const r=await worker.fetch(request('/api/experiences/some-id',e),{DB});assert.equal(r.status,405);assert.equal(r.headers.get('Allow'),'GET, HEAD');assert.equal(DB.rows.size,0);assert.equal(DB.quotas.size,0);assert.equal((await worker.fetch(request('/api/experiences',e),{DB})).status,201);});
