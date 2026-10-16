import test from 'node:test';import assert from 'node:assert/strict';
await import('./scripts/build-worker.mjs');const {default:worker}=await import('./dist/server/index.js');
import {clone,commit,branch,validateRepository,diff,contextPacket,emptyRepository} from './web/core.mjs';
import {scope,experience,database,request} from './fixture.mjs';
await import('./tests/dce-adapter.test.mjs');await import('./tests/public-api.test.mjs');await import('./tests/routing.test.mjs');
test('P02 metadata differences are visible without mutation',()=>{const a=experience(),b=clone(a);b.demo=false;b.domain='research';b.experienceId='changed';const before=JSON.stringify([a,b]),d=diff(a,b);for(const field of ['demo','domain','experienceId'])assert(d.changes.some(x=>x.field===field));assert.equal(d.changes.length,3);assert.equal(diff(a,a).changes.length,0);assert.equal(JSON.stringify([a,b]),before);});
