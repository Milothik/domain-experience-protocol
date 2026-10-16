import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const source='diagnostic-20261016-v2';
const output=process.argv.find(x=>x.startsWith('--dir='))?.slice(6)??'evaluator-sensitivity-20261016';
const hash=data=>'sha256:'+createHash('sha256').update(data).digest('hex');
if(fs.existsSync(output+'/plan.json'))throw Error('Audit already materialized; preserve it.');
fs.mkdirSync(output,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(source+'/manifest.json'));
const baseline=fs.readFileSync('participation/baseline/worker/index.js','utf8');
if(hash(baseline)!==manifest.sourceHashes['worker/index.js'])throw Error('Baseline hash mismatch');
const originals=Object.fromEntries(['manifest.json','evaluation.json','materialization.json','B3-response.txt','B5-response.txt'].map(name=>[name,hash(fs.readFileSync(source+'/'+name))]));
const plan={recordedAt:new Date().toISOString(),classification:'post-hoc-engineering-sensitivity-audit',prediction:'A leading-indentation-only anchor adjustment can separate materialization failure from functional failure.',intervention:'Remove only initial ASCII spaces/tabs from old; retain new byte-for-byte. Do not normalize anything inside an anchor.',newModelCalls:0,originalScoresRewritten:false,sourceHashes:originals};
fs.writeFileSync(output+'/plan.json',JSON.stringify(plan,null,2)+'\n');
const rows=[];
for(const batch of ['B3','B5']){
 const raw=fs.readFileSync(source+'/'+batch+'-response.txt','utf8');
 const solution=JSON.parse(raw).solutions.find(s=>s.taskId==='P06');
 if(!solution||solution.edits.length!==1)throw Error('Expected one reviewed P06 edit');
 const {old:anchor,new:replacement}=solution.edits[0];
 const adjusted=anchor.replace(/^[ \t]+/,'');
 const beforeMatches=baseline.split(anchor).length-1;
 const adjustedMatches=baseline.split(adjusted).length-1;
 const row={batch,taskId:'P06',condition:manifest.allocation.find(a=>a.id===batch).condition,originalMatches:beforeMatches,removedPrefixCharacters:anchor.length-adjusted.length,adjustedMatches,replacementSha256:hash(replacement),replacementEdited:false};
 if(beforeMatches===0&&adjustedMatches===1&&adjusted!==anchor){
  const directory=output+'/runs/'+batch+'-P06';
  fs.cpSync('participation/baseline',directory,{recursive:true});
  const artifact=baseline.replace(adjusted,()=>replacement);
  fs.writeFileSync(path.join(directory,'worker/index.js'),artifact);
  row.directory=directory;row.artifactSha256=hash(artifact);row.status='awaiting-source-review';
 }else row.status='no-exact-bounded-intervention';
 rows.push(row);
}
for(const [name,expected]of Object.entries(originals))if(hash(fs.readFileSync(source+'/'+name))!==expected)throw Error('Original changed');
fs.writeFileSync(output+'/materialization.json',JSON.stringify(rows,null,2)+'\n');
console.log(JSON.stringify(rows,null,2));
