import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {emptyRepository,commit,validateRepository,clone,getCommit,contextPacket} from '../web/core.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const store=path.join(root,'work/repository.json');
const [command,inputPath]=process.argv.slice(2);
const json=p=>JSON.parse(fs.readFileSync(path.resolve(p),'utf8'));
const scope={provider:'Codex',environment:'DXP-site-project',apiVersion:'atlas-0.2',plan:'project-build'};
const now=()=>new Date().toISOString();
async function write(fn){fs.mkdirSync(path.dirname(store),{recursive:true});const lock=store+'.lock';fs.mkdirSync(lock);try{const repo=fs.existsSync(store)?json(store):emptyRepository();await validateRepository(repo);const next=await fn(repo);await validateRepository(next);fs.writeFileSync(store+'.tmp',JSON.stringify(next,null,2)+'\n');fs.renameSync(store+'.tmp',store);return next;}finally{fs.rmdirSync(lock);}}
function initial(x){return {schemaVersion:'0.1',experienceId:'exp:work:'+x.taskId,title:x.title,domain:x.domain??'software',goal:x.goal,
  actor:{agentId:'codex:dxp-build',runtime:'ChatGPT Work / project execution',model:'not-attested',identityStatus:'declared'},scope:clone(x.scope??scope),
  constraints:['Observed project work; not a controlled model experiment.','Reported reasons are concise public decision summaries.'],
  trace:[{step:1,observation:x.observation,alternatives:x.alternatives??['Proceed without recorded context','Use scoped prior experiences'],selected:x.selected??'Record a falsifiable task expectation',rationaleSummary:x.rationaleSummary??'Make intended outcome and source use reviewable.',action:x.action??'Plan the task and its check before execution.',result:'Pending observation',uncertainty:x.uncertainty??'Outcome not yet observed.',pivot:false,evidenceRefs:['ev:start']}],
  outcome:{status:'incomplete',summary:'Task opened; result not yet observed.'},
  lessons:[{subject:x.taskId,predicate:'expected-result',value:x.prediction??'not-preregistered',claim:x.prediction??'No prospective prediction recorded.',type:'hypothesis',scope:clone(x.scope??scope),evidenceRefs:['ev:start']}],
  evidence:[{id:'ev:start',label:'Task declaration',kind:'declared',content:JSON.stringify(x)}],validity:'active',classification:x.classification??'shareable',demo:false,
  projectTask:{taskId:x.taskId,recordingMode:x.recordingMode??'prospective',openedAt:now(),completedAt:null,hypothesisRefs:x.hypothesisRefs??[],usedExperienceCommits:x.usedExperienceCommits??[],prediction:x.prediction??null,control:x.control??null}};}
try{
 if(command==='start'||command==='record'){
  const x=json(inputPath);if(!/^[A-Za-z0-9][A-Za-z0-9._-]{0,55}$/.test(x.taskId))throw Error('Invalid taskId');
  const next=await write(async repo=>{const branch='work/'+x.taskId;if(repo.refs[branch])throw Error('Task exists; use finish for a revision.');let e=initial(x);if(command==='record')e=complete(e,x);return (await commit(repo,e,{branch,message:x.title})).repo;});
  console.log(JSON.stringify({taskId:x.taskId,commit:next.refs['work/'+x.taskId]}));
 }else if(command==='finish'){
  const x=json(inputPath);const next=await write(async repo=>{const branch='work/'+x.taskId,previous=getCommit(repo,branch);return (await commit(repo,complete(previous.experience,x),{branch,parents:[previous.commitId],message:x.message??'Observed task result'})).repo;});console.log(JSON.stringify({taskId:x.taskId,commit:next.refs['work/'+x.taskId]}));
 }else if(command==='context'){const x=json(inputPath),repo=json(store);await validateRepository(repo);console.log(JSON.stringify(contextPacket(repo,{scope:x.scope??scope,domain:x.domain??'software'}),null,2));}
 else if(command==='verify'){const repo=json(store);await validateRepository(repo);console.log(JSON.stringify({valid:true,commits:repo.commits.length,tasks:Object.keys(repo.refs).length}));}
 else throw Error('Use start TASK.json, finish RESULT.json, record RETROSPECTIVE.json, context OPTIONS.json or verify.');
}catch(error){console.error(error.message);process.exitCode=1;}
function complete(previous,x){const e=clone(previous),id='ev:result:'+e.trace.length;e.evidence.push({id,label:x.evidenceLabel??'Observed task result',kind:'observed',content:JSON.stringify(x.evidence??{result:x.result})});e.trace.push({step:e.trace.length+1,observation:x.observation??previous.trace[0].observation,alternatives:x.alternatives??previous.trace[0].alternatives,selected:x.selected??'Record the observed outcome',rationaleSummary:x.rationaleSummary??'Evaluate the task expectation against available evidence.',action:x.action??'Execute and inspect the recorded check.',result:x.result,uncertainty:x.uncertainty??'Single project observation; no causal control.',pivot:x.pivot??false,evidenceRefs:[id]});e.outcome={status:x.status??'success',summary:x.result};e.lessons=[{subject:x.taskId,predicate:x.predicate??'project-observation',value:x.value??x.result,claim:x.lesson??x.result,type:x.lessonType??(x.status==='failure'?'negative':'observation'),scope:e.scope,evidenceRefs:[id]}];e.projectTask={...e.projectTask,completedAt:now(),resultClass:x.resultClass??'engineering-observation',verdict:x.verdict??'not-a-scientific-test',causalClaim:false};return e;}
