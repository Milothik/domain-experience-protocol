import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyRepository,clone,commit,contextPacket,validateRepository} from '../web/core.mjs';
import {captureDceRun,recordDceRun,dceEntitiesFromRepository} from '../web/dce-adapter.mjs';
const scope={provider:'DCE',plan:'offline-preview',apiVersion:'0.2.0',environment:'test'};
const meta={scope,experienceId:'exp:test',domain:'software'};
const options=()=>({retriever:{retrieve:async()=>[]},decision:{select:async()=>[]},compiler:{compile:async()=>({entities:[]})},generator:{generate:async()=>({ok:true})},output:{adapt:async x=>x},state:{commit:async()=>{}}});
const task={id:'t1',prompt:'Test adapter'};
const run=async(o,t)=>{await o.retriever.retrieve(t);await o.decision.select({});const context=await o.compiler.compile({});const output=await o.output.adapt(await o.generator.generate(context));return {context,output,trace:{decisions:[]}};};
test('capture preserves observed data without serializing provider configuration',async()=>{const o=options();o.generator.secret='must-not-export';const c=await captureDceRun(run,o,task,meta);assert.equal(c.error,null);assert.equal(c.experience.outcome.status,'success');assert(!JSON.stringify(c.experience).includes('must-not-export'));});
test('failed generation is captured once with no inferred successful output',async()=>{let n=0;const o=options();o.generator.generate=async()=>{n++;throw Error('Unavailable');};const c=await captureDceRun(run,o,task,meta);assert.equal(n,1);assert.equal(c.artifact.failedStage,'generation');assert.equal(c.artifact.output,null);assert.equal(c.experience.lessons[0].type,'negative');});
test('unreviewed imports are empty; reviewed imports are data and never mandatory constraints',async()=>{const c=await captureDceRun(run,options(),task,meta);const r=(await recordDceRun(emptyRepository(),c,{branch:'test'})).repo;const opts={scope,domain:'software'};assert.equal((await dceEntitiesFromRepository(r,opts)).entities.length,0);await assert.rejects(dceEntitiesFromRepository(r,{...opts,approvedCommitIds:[r.refs.test]}),/reviewer/);const x=await dceEntitiesFromRepository(r,{...opts,approvedCommitIds:[r.refs.test],reviewer:'test-policy'});assert.equal(x.entities.length,1);assert.deepEqual(x.entities[0].rules,{mustPreserve:[],mayVary:[],avoid:[]});assert.equal((await dceEntitiesFromRepository(r,{...opts,scope:{...scope,apiVersion:'0.3'},approvedCommitIds:[r.refs.test],reviewer:'policy'})).entities.length,0);});
test('modified evidence fails integrity before any entity import',async()=>{const c=await captureDceRun(run,options(),task,meta);const r=(await recordDceRun(emptyRepository(),c,{branch:'test'})).repo;const bad=clone(r);bad.commits[0].experience.evidence[0].content='tampered';await assert.rejects(dceEntitiesFromRepository(bad,{scope,domain:'software',approvedCommitIds:[r.refs.test],reviewer:'policy'}),/Integridad/);});

test('empty supplied run cannot be recorded as a successful observed execution',async()=>{const c=await captureDceRun(async()=>({}),options(),task,meta);assert.equal(c.experience.outcome.status,'failure');assert.equal(c.artifact.events.some(x=>x.stage==='generation'),false);});

async function spoofedRepository(){
 const captured=await captureDceRun(run,options(),task,meta);
 const approved=await recordDceRun(emptyRepository(),captured,{branch:'A'});
 const malicious=clone(captured.experience);
 malicious.experienceId='exp:unapproved-B';
 malicious.lessons[0]={...malicious.lessons[0],claim:'UNAPPROVED B',commitId:approved.commit.commitId,evidenceKind:['forged']};
 const second=await commit(approved.repo,malicious,{branch:'B'});
 await validateRepository(second.repo); // Valid hashes do not authorize this lesson.
 return {repo:second.repo,a:approved.commit.commitId,b:second.commit.commitId};
}
test('lesson metadata cannot impersonate an approved source revision',async()=>{
 const {repo,a,b}=await spoofedRepository();
 const packet=contextPacket(repo,{scope,domain:'software'});
 const lesson=packet.lessons.find(l=>l.claim==='UNAPPROVED B');
 assert.equal(lesson.commitId,b);
 assert.notEqual(lesson.commitId,a);
 assert(!lesson.evidenceKind.includes('forged'));
});
test('approving A excludes a hash-valid B that claims to come from A',async()=>{
 const {repo,a}=await spoofedRepository();
 const imported=await dceEntitiesFromRepository(repo,{scope,domain:'software',approvedCommitIds:[a],reviewer:'regression-policy'});
 assert.equal(imported.entities.length,1);
 assert(!JSON.stringify(imported.entities).includes('UNAPPROVED B'));
 assert.equal(imported.excluded,1);
});
test('a source claiming another identity still requires approval of its actual revision',async()=>{
 const {repo,b}=await spoofedRepository();
 const imported=await dceEntitiesFromRepository(repo,{scope,domain:'software',approvedCommitIds:[b],reviewer:'regression-policy'});
 assert.equal(imported.entities.length,1);
 assert.equal(imported.entities[0].name,'UNAPPROVED B');
 assert.equal(imported.entities[0].attributes.sourceCommit,b);
});
