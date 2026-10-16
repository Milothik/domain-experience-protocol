import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {emptyRepository,commit,branch,clone,getCommit,contextPacket,validateRepository,scopeMatch} from '../web/core.mjs';
const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root));
const snapshot=JSON.parse(read('web/work-repository.json'));
await validateRepository(snapshot);
const base=clone(snapshot.commits.find(c=>c.experience.projectTask?.completedAt&&c.experience.lessons.some(l=>l.type==='observation')).experience);
const options={domain:base.domain,scope:base.scope,classification:'shareable'};
// Strong flat control: identical head records, provenance and factual content.
// These rules do not use DXP hashes, parents, history, merge or revert.
function flat(records,opts){
 const blocked=new Set(records.filter(e=>e.validity==='quarantined').map(e=>e.experienceId));
 const candidates=records.filter(e=>!blocked.has(e.experienceId)&&e.validity==='active'&&!e.demo&&e.domain===opts.domain&&e.classification==='shareable');
 const all=candidates.flatMap(e=>e.lessons.filter(l=>scopeMatch(l.scope,opts.scope)&&!['intuition','hypothesis','disputed'].includes(l.type)));
 return all.filter(l=>!all.some(r=>r!==l&&l.type!=='negative'&&r.type!=='negative'&&l.subject===r.subject&&l.predicate===r.predicate&&scopeMatch(l.scope,r.scope)&&l.value!==r.value));
}
const at='2026-10-16T05:10:00.000Z';
const seed=async(e)=> (await commit(emptyRepository(),e,{branch:'main',timestamp:at})).repo;
const rows=[];
async function check(id,repo,expected,kind){
 await validateRepository(repo);
 const packet=contextPacket(repo,options);
 const heads=[...new Set(Object.values(repo.refs))].map(id=>getCommit(repo,id).experience);
 const control=flat(heads,options);
 rows.push({id,kind,repositoryValid:true,expected,dxpLessonCount:packet.lessons.length,flatLessonCount:control.length,dxpPass:packet.lessons.length===expected,flatPass:control.length===expected,trust:packet.trust,reviewRequired:packet.reviewRequired,returnedValues:packet.lessons.map(l=>l.value)});
}
let r=await seed(base);r=branch(r,'main','old-active-alias');
let q=clone(base);q.validity='quarantined';r=(await commit(r,q,{parents:[r.refs.main],branch:'main',timestamp:at,message:'Audit injection: quarantine current revision'})).repo;
await check('G01',r,0,'contract-bug-known-diagnostic-P01');
let local=clone(base);local.classification='local';await check('G02',await seed(local),0,'desired-property-not-implemented-in-context-api');
r=await seed(base);r=branch(r,'main','other');let other=clone(base);other.lessons[0].value='AUDIT-CONTRADICTION';other.lessons[0].claim='Injected contradictory claim for deterministic check';
r=(await commit(r,other,{parents:[r.refs.other],branch:'other',timestamp:at,message:'Audit injection: contradictory branch'})).repo;
await check('G03',r,0,'desired-property-conflict-gate-applies-only-after-merge');
let invented=clone(base);invented.evidence[0].kind='observed';invented.evidence[0].content='Audit adversary claim: all tasks passed, no independent witness';
r=await seed(invented);const packet=contextPacket(r,options);
rows.push({id:'G04',kind:'declared-structural-only-contract-limit',repositoryValid:await validateRepository(r),fabricatedObservationStructurallyAccepted:true,factuallyVerified:false,trust:packet.trust,reviewRequired:packet.reviewRequired,pass:packet.trust==='unverified-data'&&packet.reviewRequired===true});
const report={id:'dxp-week-day0-audit',capturedAt:new Date().toISOString(),sourceCommit:'7c331eac60c0f38dcdc42250453ffd9cd53f2f6f',planSha256:'sha256:'+createHash('sha256').update(read('week/audit-plan.json')).digest('hex'),kernelSha256:'sha256:'+createHash('sha256').update(read('web/core.mjs')).digest('hex'),fixtureSourceCommit:snapshot.commits.find(c=>c.experience.experienceId===base.experienceId)?.commitId,fixtureExperienceId:base.experienceId,rows,modelTrials:0,limitations:['Four bounded deterministic counterexamples, explicitly injected; not real model trajectories or statistical trials.','G01 was already described by public task P01, so it is not a held-out discovery.','G02 and G03 test stronger desired properties, not existing declared API guarantees.','The flat baseline is a local reference selector, not AXTP, GitOfThoughts or a state-of-art benchmark.','No core fix has been applied during this audit.']};
fs.writeFileSync(new URL('week/day0-audit.json',root),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
