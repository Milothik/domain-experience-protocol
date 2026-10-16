import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const dir=process.argv.find(x=>x.startsWith('--dir='))?.slice(6)??'diagnostic-20261016',manifest=JSON.parse(fs.readFileSync(dir+'/manifest.json'));
const reproduce=process.argv.includes('--reproduce'),materializationFile=dir+(reproduce?'/reproduction-materialization.json':'/materialization.json');
const hash=x=>'sha256:'+createHash('sha256').update(x).digest('hex');
if(fs.readFileSync(dir+'/manifest.sha256','utf8').trim()!==hash(fs.readFileSync(dir+'/manifest.json')))throw Error('Manifest changed');
function extract(raw){let start=raw.indexOf('{'),quoted=false,escaped=false,depth=0;for(let i=start;i<raw.length;i++){let ch=raw[i];if(quoted){if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch==='"')quoted=false;}else if(ch==='"')quoted=true;else if(ch==='{')depth++;else if(ch==='}'&&!--depth)return JSON.parse(raw.slice(start,i+1));}throw Error('Incomplete JSON');}
const records=[];
const prior=!reproduce&&fs.existsSync(materializationFile)?JSON.parse(fs.readFileSync(materializationFile)):[];
for(const a of manifest.allocation){
 const responsePath=dir+'/'+a.id+'-response.txt';if(!fs.existsSync(responsePath))continue;
 const raw=fs.readFileSync(responsePath,'utf8');let output,error;
 try{output=extract(raw);if(!Array.isArray(output.solutions))throw Error('No solution array');}catch(e){error=e.message;}
 for(const task of manifest.tasks){const previous=prior.find(r=>r.batch===a.id&&r.taskId===task.id);if(previous){if(previous.responseSha256!==hash(raw))throw Error('Archived response changed');records.push(previous);continue;}let record={batch:a.id,provider:a.provider,condition:a.condition,taskId:task.id,responseSha256:hash(raw),status:'not-materialized'};
  try{if(error)throw Error(error);const matches=output.solutions.filter(x=>x.taskId===task.id);if(matches.length!==1)throw Error('Missing or duplicate task output');const s=matches[0];if(!Array.isArray(s.edits)||!s.edits.length||s.edits.length>10)throw Error('Invalid edits');let content=fs.readFileSync('participation/baseline/'+task.target,'utf8');if(hash(content)!==manifest.sourceHashes[task.target]){const windows=content.replaceAll('\r\n','\n').replaceAll('\n','\r\n');if(hash(windows)!==manifest.sourceHashes[task.target])throw Error('Baseline changed');content=windows;}for(const edit of s.edits){if(typeof edit.old!=='string'||!edit.old||typeof edit.new!=='string')throw Error('Invalid edit strings');const count=content.split(edit.old).length-1;if(count!==1)throw Error('Exact old substring matches '+count+' times');content=content.replace(edit.old,()=>edit.new);}
   const run=dir+(reproduce?'/reproduction-runs/':'/runs/')+a.id+'-'+task.id;
   if(fs.existsSync(run))throw Error('Run directory already exists; preserve evidence');
   fs.cpSync('participation/baseline',run,{recursive:true});fs.writeFileSync(path.join(run,task.target),content);
   record={...record,status:'awaiting-source-review',directory:run,artifactSha256:hash(content)};
  }catch(e){record={...record,status:'artifact-unavailable',error:e.message};}
  records.push(record);
 }
}
fs.writeFileSync(materializationFile,JSON.stringify(records,null,2)+'\n');console.log(JSON.stringify(records.map(r=>({batch:r.batch,task:r.taskId,status:r.status,error:r.error}))));
