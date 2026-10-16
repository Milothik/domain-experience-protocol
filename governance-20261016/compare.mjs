import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as old from './core-before.mjs';
import * as current from '../web/core.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root));
const snapshot=JSON.parse(read('work/repository.json'));
await current.validateRepository(snapshot);
const observed=snapshot.commits.find(c=>c.experience.projectTask?.completedAt&&c.experience.lessons.some(l=>l.type==='observation'));
const base=current.clone(observed.experience);base.lessons=[base.lessons.find(l=>l.type==='observation')];
// Controlled adversarial transformations of an observed record, not agent runs.
base.lessons[0]={...base.lessons[0],subject:'governance-fixture',predicate:'setting',value:'A'};
const opts={domain:base.domain,scope:base.scope,classification:'shareable',excludeConflicts:true};
let repo;const rows=[];
const add=async(e,branch='main',parents=[])=>{const x=await current.commit(repo,e,{branch,parents,timestamp:'2026-10-16T20:55:00.000Z',message:'Explicit governance fixture, not a model observation'});repo=x.repo;return x.commit.commitId;};
const seed=async(e=base)=>{repo=current.emptyRepository();await add(current.clone(e));};
// Strong flat control: same HEAD records and rules. No ancestry or DXP hashes used for selection.
function flat(records,options){
 const blocked=new Set(records.filter(e=>e.validity==='quarantined').map(e=>e.experienceId));
 let lessons=records.filter(e=>e.validity==='active'&&!e.demo&&e.domain===options.domain&&e.classification===options.classification&&!blocked.has(e.experienceId)).flatMap(e=>e.lessons.filter(l=>current.scopeMatch(l.scope,options.scope)&&!['hypothesis','intuition','disputed'].includes(l.type)));
 lessons=lessons.filter(l=>l.type==='negative'||!lessons.some(r=>r.type!=='negative'&&r.subject===l.subject&&r.predicate===l.predicate&&current.scopeMatch(l.scope,r.scope)&&r.value!==l.value));
 return lessons.map(l=>l.value).sort();
}
async function check(id,expected,extra={}){
 await current.validateRepository(repo);const before=JSON.stringify(repo),options={...opts,...extra};
 const values=mod=>mod.contextPacket(repo,options).lessons.map(l=>l.value).sort();
 const heads=[...new Set(Object.values(repo.refs))].map(id=>current.getCommit(repo,id).experience);
 const a=values(old),b=values(current),f=flat(heads,options),equal=x=>JSON.stringify(x)===JSON.stringify([...expected].sort());
 rows.push({id,expected:expected.sort(),before:a,repaired:b,flat:f,beforePass:equal(a),repairedPass:equal(b),flatPass:equal(f),immutable:JSON.stringify(repo)===before});
}
await seed();await check('valid-record',['A']);
await seed({...current.clone(base),classification:'local'});await check('local-record',[]);
await seed();let e=current.clone(base);e.experienceId+=':local';e.classification='local';e.lessons[0].value='PRIVATE';await add(e,'local');await check('mixed-private-public',['A']);
await seed();e=current.clone(base);e.lessons[0].value='B';await add(e,'other',[repo.refs.main]);await check('cross-head-contradiction',[]);await check('conflict-before-truncation',[],{maxLessons:1});
await seed();e=current.clone(base);e.lessons[0].scope.apiVersion+='-other';e.lessons[0].value='B';await add(e,'other');await check('other-scope',['A']);
await seed();e=current.clone(base);e.experienceId+=':failure';e.lessons[0].type='negative';e.lessons[0].value='FAILED';await add(e,'failure');await check('negative-evidence-retained',['A','FAILED']);
await seed();repo=current.branch(repo,'main','alias');e=current.clone(base);e.validity='quarantined';await add(e,'main',[repo.refs.main]);await check('quarantine-alias',[]);
repo.refs.alias=repo.refs.main;e=current.clone(base);await add(e,'main',[repo.refs.main]);repo.refs.alias=repo.refs.main;await check('explicit-restoration',['A']);
await seed({...current.clone(base),validity:'superseded'});await check('superseded',[]);
e=current.clone(base);e.lessons[0].type='hypothesis';await seed(e);await check('hypothesis-default',[]);
e=current.clone(base);e.lessons[0].type='disputed';await seed(e);await check('already-disputed',[]);
const report={id:'governance-comparison-20261016',class:'deterministic-engineering-not-agent-utility',capturedAt:new Date().toISOString(),sourceExperienceCommit:observed.commitId,sourceKernelSha256:createHash('sha256').update(read('governance-20261016/core-before.mjs')).digest('hex'),currentKernelSha256:createHash('sha256').update(read('web/core.mjs')).digest('hex'),policy:opts,rows,summary:{cases:rows.length,beforePassed:rows.filter(r=>r.beforePass).length,repairedPassed:rows.filter(r=>r.repairedPass).length,flatPassed:rows.filter(r=>r.flatPass).length,modelTrials:0},limits:['Constructed policy cases derived from one observed project record; not independent task clusters.','Flat and DXP share rules and facts, so a tie shows these selection rules do not require versioned history.','No factual, identity, expiry or universal security guarantee.','Original day0 audit and historical baselines are preserved.']};
const out=process.argv[2];if(!out)throw Error('Supply a new output path');if(fs.existsSync(new URL(out,root)))throw Error('Refusing to overwrite evidence');fs.writeFileSync(new URL(out,root),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));
