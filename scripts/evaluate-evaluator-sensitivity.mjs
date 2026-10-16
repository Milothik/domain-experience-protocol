import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const dir=process.argv.find(x=>x.startsWith('--dir='))?.slice(6)??'evaluator-sensitivity-20261016';
const source='diagnostic-20261016-v2';
const hash=data=>'sha256:'+createHash('sha256').update(data).digest('hex');
const plan=JSON.parse(fs.readFileSync(dir+'/plan.json'));
const rows=JSON.parse(fs.readFileSync(dir+'/materialization.json'));
const manifest=JSON.parse(fs.readFileSync(source+'/manifest.json'));
const protocol=JSON.parse(fs.readFileSync('participation/protocol.json'));
const reviews=JSON.parse(fs.readFileSync(dir+'/reviewed-artifacts.json'));
if(fs.existsSync(dir+'/evaluation.json'))throw Error('Evaluation exists; preserve it.');
const verifyOriginals=()=>{
 for(const [file,expected]of Object.entries(plan.sourceHashes))
  if(hash(fs.readFileSync(source+'/'+file))!==expected)throw Error('Original changed: '+file);
};
verifyOriginals();
const results=[];
for(const row of rows){
 if(row.status!=='awaiting-source-review')throw Error('Artifact unavailable');
 const task=manifest.tasks.find(t=>t.id===row.taskId);
 const artifact=fs.readFileSync(path.join(row.directory,task.target));
 if(hash(artifact)!==row.artifactSha256||!reviews.some(r=>r.batch===row.batch&&r.sha256===hash(artifact)))throw Error('Artifact lacks matching review');
 for(const [file,expected]of Object.entries(protocol.initialFiles)){
  if(file===task.target)continue;
  const data=fs.readFileSync(path.join(row.directory,file));
  if(hash(data)!==expected&&hash(data.toString('utf8').replaceAll('\r\n','\n'))!==expected)throw Error('Immutable baseline changed: '+file);
 }
 const acceptance='acceptance-'+row.taskId+'.mjs';
 if(hash(fs.readFileSync(path.join(row.directory,acceptance)))!==task.acceptanceSha256)throw Error('Acceptance changed');
 const startedAt=new Date().toISOString();
 const run=spawnSync(process.execPath,[acceptance],{cwd:path.resolve(row.directory),encoding:'utf8',timeout:60000,maxBuffer:2_000_000,env:Object.fromEntries(['PATH','Path','SystemRoot','TEMP','TMP'].filter(k=>process.env[k]).map(k=>[k,process.env[k]]))});
 const log=(run.stdout??'')+(run.stderr??'');
 fs.writeFileSync(dir+'/'+row.batch+'-P06.tap',log);
 const count=key=>Number(run.stdout?.match(new RegExp('# '+key+' (\\d+)'))?.[1]??0);
 results.push({...row,startedAt,finishedAt:new Date().toISOString(),executionAttempted:true,exitCode:run.status,error:run.error?.message??null,testCasesPassed:count('pass'),testCasesFailed:count('fail'),passed:run.status===0&&count('pass')>0&&count('fail')===0,immutableChecks:true,logSha256:hash(log)});
 verifyOriginals();
}
fs.writeFileSync(dir+'/evaluation.json',JSON.stringify({classification:plan.classification,newModelCalls:0,originalScoresRewritten:false,originalsUnchanged:true,results},null,2)+'\n');
console.log(JSON.stringify(results.map(r=>({batch:r.batch,condition:r.condition,passed:r.passed,testCasesPassed:r.testCasesPassed,testCasesFailed:r.testCasesFailed,exitCode:r.exitCode})),null,2));
