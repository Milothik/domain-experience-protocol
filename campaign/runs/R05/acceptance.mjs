import test from 'node:test';import assert from 'node:assert/strict';
await import('./scripts/build-worker.mjs');const {default:worker}=await import('./dist/server/index.js');
import {clone,commit,query,contextPacket,emptyRepository} from './web/core.mjs';
import {scope,experience,repository,database,request} from './fixture.mjs';
await import('./tests/dce-adapter.test.mjs');await import('./tests/public-api.test.mjs');await import('./tests/routing.test.mjs');
test('T5 HEAD metadata and no body',async()=>{for(const p of ['/','/core.mjs','/.well-known/dxp.json','/api/evaluation','/not-existing']){const get=await worker.fetch(request(p),{}),head=await worker.fetch(request(p,undefined,'HEAD'),{});assert.equal(head.status,get.status,p);assert.deepEqual([...head.headers],[...get.headers],p);assert.equal(await head.text(),'',p);}const DB=database();assert.equal((await worker.fetch(request('/api/experiences',experience('write')),{DB})).status,201);assert.equal(DB.rows.size,1);});
