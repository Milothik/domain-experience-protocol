import test from 'node:test';import assert from 'node:assert/strict';
import {emptyRepository,commit,clone,contextPacket} from '../web/core.mjs';
import {dceEntitiesFromRepository} from '../web/dce-adapter.mjs';
import {scope,experience} from './campaign-fixture.mjs';
test('explicit sharing policy rejects local lessons, retains public data and validates options',async()=>{
 let repo=emptyRepository();for(const classification of ['local','shareable'])repo=(await commit(repo,experience(classification,{classification,demo:false}),{branch:classification})).repo;
 const opts={scope,domain:'software'};assert.equal(contextPacket(repo,opts).lessons.length,2);
 assert.equal(contextPacket(repo,{...opts,classification:'shareable'}).lessons.length,1);
 assert.throws(()=>contextPacket(repo,{...opts,classification:'public'}));assert.throws(()=>contextPacket(repo,{...opts,excludeConflicts:'yes'}));
 const imported=await dceEntitiesFromRepository(repo,{...opts,classification:'shareable',excludeConflicts:true,approvedCommitIds:Object.values(repo.refs),reviewer:'test'});assert.equal(imported.entities.length,1);assert.equal(imported.entities[0].attributes.sourceCommit,repo.refs.shareable);
});
test('conflicts are withheld before budget clipping, while failures and other scopes survive',async()=>{
 let repo=emptyRepository();for(const [branch,value,type,apiVersion] of [['a','A','observation','v1'],['b','B','observation','v1'],['negative','FAILED','negative','v1'],['other','C','observation','v2']]){
  const e=experience(branch,{demo:false});e.lessons[0]={...e.lessons[0],value,type,scope:{...scope,apiVersion}};repo=(await commit(repo,e,{branch})).repo;
 }
 const before=JSON.stringify(repo),opts={scope,domain:'software',classification:'shareable',excludeConflicts:true};
 assert.deepEqual(contextPacket(repo,opts).lessons.map(l=>l.value),['FAILED']);
 assert.equal(contextPacket(repo,{...opts,maxLessons:1}).lessons[0].value,'FAILED');
 assert.deepEqual(contextPacket(repo,{...opts,scope:{...scope,apiVersion:'v2'}}).lessons.map(l=>l.value),['C']);
 assert.equal(contextPacket(repo,{...opts,includeNegative:false}).lessons.length,0);assert.equal(JSON.stringify(repo),before);
});
