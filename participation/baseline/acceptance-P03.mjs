import test from 'node:test';import assert from 'node:assert/strict';
await import('./scripts/build-worker.mjs');const {default:worker}=await import('./dist/server/index.js');
import {clone,commit,branch,validateRepository,diff,contextPacket,emptyRepository} from './web/core.mjs';
import {scope,experience,database,request} from './fixture.mjs';
await import('./tests/dce-adapter.test.mjs');await import('./tests/public-api.test.mjs');await import('./tests/routing.test.mjs');
test('P03 malformed URL is a client error with no writes',async()=>{const DB=database();for(const p of ['/api/experiences/%ZZ','/api/experiences/%C3%28']){const r=await worker.fetch(request(p),{DB});assert.equal(r.status,400);assert((r.headers.get('content-type')??'').includes('json'));}assert.equal((await worker.fetch(request('/api/experiences/missing'),{DB})).status,404);assert.equal(DB.rows.size,0);assert.equal(DB.quotas.size,0);});
