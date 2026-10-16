import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const protocol=JSON.parse(fs.readFileSync(path.join(here,'protocol.json')));
const locations=JSON.parse(fs.readFileSync(path.join(here,'run-locations.json')));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
// This is a read-only source audit; acceptance is run independently by the coordinator.
const runs=locations.map(run=>{
 const target=protocol.tasks.find(t=>t.id===run.taskId).target;
 const read=p=>fs.readFileSync(path.join(run.directory,p));
 const immutableChecks=Object.entries(protocol.initialFiles).filter(([p])=>p!==target).map(([p,sha])=>({path:p,unchanged:hash(read(p))===sha}));
 immutableChecks.push({path:'acceptance.mjs',unchanged:hash(read('acceptance.mjs'))===run.acceptanceSha256});
 const instructions=fs.readFileSync(path.join(run.directory,'AGENTS.md'),'utf8');
 immutableChecks.push({path:'AGENTS.md',unchanged:run.instructions.startsWith(instructions.trimEnd())});
 if(run.condition==='dxp')immutableChecks.push({path:'memory/repository.json',unchanged:hash(JSON.stringify(JSON.parse(read('memory/repository.json'))))===protocol.frozenExperienceHash});
 if(run.condition==='note')immutableChecks.push({path:'NOTE.md',unchanged:read('NOTE.md').equals(fs.readFileSync(path.join(here,'equivalent-note.md')))});
 const reportPath=path.join(run.directory,'REPORT.json');
 const report=fs.existsSync(reportPath)?JSON.parse(fs.readFileSync(reportPath)):null;
 const {directory,...publicRun}=run;
 return {...publicRun,target,immutableChecks,immutablePassed:immutableChecks.every(x=>x.unchanged),targetSha256:hash(read(target)),report,observedReportModifiedAt:fs.existsSync(reportPath)?fs.statSync(reportPath).mtime.toISOString():null};
});
fs.writeFileSync(path.join(here,'source-audit.json'),JSON.stringify({auditedAt:new Date().toISOString(),runs},null,2)+'\n');
console.log(JSON.stringify(runs.map(x=>({run:x.runId,hasReport:!!x.report,immutable:x.immutablePassed})),null,2));
