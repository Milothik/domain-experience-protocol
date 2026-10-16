import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const dir=process.argv.find(x=>x.startsWith('--dir='))?.slice(6)??'diagnostic-20261016',hash=x=>'sha256:'+createHash('sha256').update(x).digest('hex');
const manifest=JSON.parse(fs.readFileSync(dir+'/manifest.json'));
const reproduce=process.argv.includes('--reproduce'),resultsFile=dir+(reproduce?'/reproduction-evaluation.json':'/evaluation.json');
const rows=JSON.parse(fs.readFileSync(dir+(reproduce?'/reproduction-materialization.json':'/materialization.json')));
const approvals=JSON.parse(fs.readFileSync(dir+'/reviewed-artifacts.json'));
const baselineProtocol=JSON.parse(fs.readFileSync('participation/protocol.json'));
const results=!reproduce&&fs.existsSync(resultsFile)?JSON.parse(fs.readFileSync(resultsFile)):[];
for(const row of rows){if(results.some(x=>x.batch===row.batch&&x.taskId===row.taskId))continue;
 if(row.status!=='awaiting-source-review'){results.push({...row,passed:false,executionAttempted:false,attribution:'Artifact unavailable; browser capture and model format cannot be separated.'});continue;}
 const artifact=fs.readFileSync(path.join(row.directory,manifest.tasks.find(t=>t.id===row.taskId).target));
 const approval=approvals.find(a=>a.batch===row.batch&&a.taskId===row.taskId&&a.sha256===hash(artifact));
 if(!approval)throw Error('Artifact lacks source review: '+row.directory);
 for(const [file,expected] of Object.entries(baselineProtocol.initialFiles)){if(file===manifest.tasks.find(t=>t.id===row.taskId).target)continue;const content=fs.readFileSync(path.join(row.directory,file));if(hash(content)!==expected&&hash(content.toString('utf8').replaceAll('\r\n','\n'))!==expected)throw Error('Immutable baseline changed beyond Windows line endings: '+file);}
 const acceptance='acceptance-'+row.taskId+'.mjs';if(hash(fs.readFileSync(path.join(row.directory,acceptance)))!==manifest.tasks.find(t=>t.id===row.taskId).acceptanceSha256)throw Error('Acceptance changed');
 const startedAt=new Date().toISOString(),start=performance.now();
 const r=spawnSync(process.execPath,[acceptance],{cwd:path.resolve(row.directory),encoding:'utf8',timeout:60000,maxBuffer:2_000_000,env:Object.fromEntries(['PATH','Path','SystemRoot','TEMP','TMP'].filter(k=>process.env[k]).map(k=>[k,process.env[k]]))});
 fs.writeFileSync(dir+'/'+(reproduce?'reproduction-':'')+row.batch+'-'+row.taskId+'.tap',(r.stdout??'')+(r.stderr??''));
 const count=key=>Number(r.stdout?.match(new RegExp('# '+key+' (\\d+)'))?.[1]??0);
 results.push({...row,startedAt,finishedAt:new Date().toISOString(),evaluationWallMs:performance.now()-start,executionAttempted:true,exitCode:r.status,error:r.error?.message??null,assertionsPassed:count('pass'),assertionsFailed:count('fail'),passed:r.status===0&&count('pass')>0&&count('fail')===0,immutableChecks:true});
 fs.writeFileSync(resultsFile,JSON.stringify(results,null,2)+'\n');
}
fs.writeFileSync(resultsFile,JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results.map(r=>({batch:r.batch,task:r.taskId,executed:r.executionAttempted,passed:r.passed,assertions:r.assertionsPassed,error:r.error}))));
