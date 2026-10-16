import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const source='evaluator-sensitivity-20261016';
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'dxp-anchor-replay-'));
const expected=JSON.parse(fs.readFileSync(source+'/evaluation.json'));
try{
 for(const script of ['audit-evaluator-sensitivity','evaluate-evaluator-sensitivity']){
  if(script.startsWith('evaluate-'))fs.copyFileSync(source+'/reviewed-artifacts.json',temporary+'/reviewed-artifacts.json');
  const r=spawnSync(process.execPath,['scripts/'+script+'.mjs','--dir='+temporary],{encoding:'utf8',timeout:60000});
  if(r.status!==0)throw Error(script+': '+r.stderr);
 }
 const observed=JSON.parse(fs.readFileSync(temporary+'/evaluation.json'));
 const fields=['batch','condition','artifactSha256','replacementSha256','passed','exitCode','testCasesPassed','testCasesFailed'];
 const compact=data=>data.results.map(r=>Object.fromEntries(fields.map(k=>[k,r[k]])));
 const same=JSON.stringify(compact(expected))===JSON.stringify(compact(observed));
 const report={checkedAt:new Date().toISOString(),freshCopies:true,originalsUnchanged:observed.originalsUnchanged,newModelCalls:0,sameArtifactHashesAndOutcomes:same,results:compact(observed)};
 const destination=process.argv.find(x=>x.startsWith('--report='))?.slice(9)??source+'/replay.json';
 fs.writeFileSync(destination,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report));
 if(!same)process.exitCode=1;
}finally{fs.rmSync(temporary,{recursive:true,force:true});}
