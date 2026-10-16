import test from 'node:test';import assert from 'node:assert/strict';
await import('./scripts/build-worker.mjs');const {default:worker}=await import('./dist/server/index.js');
import {clone,commit,branch,validateRepository,diff,contextPacket,emptyRepository} from './web/core.mjs';
import {scope,experience,database,request} from './fixture.mjs';
await import('./tests/dce-adapter.test.mjs');await import('./tests/public-api.test.mjs');await import('./tests/routing.test.mjs');
test('P05 branch segments have one validation rule',async()=>{let repo=(await commit(emptyRepository(),experience(),{branch:'valid',message:'Fixture'})).repo;for(const name of ['work//a','work/../a','work/.','work/','work/./a']){assert.throws(()=>branch(repo,'valid',name));await assert.rejects(commit(emptyRepository(),experience(),{branch:name,message:'Fixture'}));const bad=clone(repo);bad.refs={[name]:repo.refs.valid};await assert.rejects(validateRepository(bad));}assert(branch(repo,'valid','work/task-1').refs['work/task-1']);await validateRepository(repo);});
