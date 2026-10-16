import test from 'node:test';import assert from 'node:assert/strict';
await import('./scripts/build-worker.mjs');const {default:worker}=await import('./dist/server/index.js');
import {clone,commit,query,contextPacket,emptyRepository} from './web/core.mjs';
import {scope,experience,repository,database,request} from './fixture.mjs';
await import('./tests/dce-adapter.test.mjs');await import('./tests/public-api.test.mjs');await import('./tests/routing.test.mjs');
test('T1 query scope, heads, demos, validity and immutability',async()=>{const repo=await repository(),before=JSON.stringify(repo);assert.equal(query(repo).length,4);assert.equal(query(repo,{headsOnly:true}).length,3);assert.equal(query(repo,{includeDemo:false}).length,3);const found=query(repo,{headsOnly:true,includeDemo:false,validity:'active',domain:'software',outcome:'success',text:'revised'});assert.equal(found.length,1);assert.equal(found[0].experience.experienceId,'a');assert.equal(query(repo,{validity:'superseded'}).length,1);assert.throws(()=>query(repo,{validity:'anything'}));assert.equal(JSON.stringify(repo),before);});
