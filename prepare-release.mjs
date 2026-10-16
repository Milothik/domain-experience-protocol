import fs from 'node:fs';
import path from 'node:path';
import {seedRepository} from './web/seeds.mjs';
import {clone,validateRepository,runBenchmark} from './web/core.mjs';
const root=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const dir=path.resolve(root);
const write=(name,value)=>{const p=path.join(dir,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof value==='string'?value:JSON.stringify(value,null,2)+'\n','utf8');};
const read=name=>fs.readFileSync(path.join(dir,name),'utf8');
const str={type:'string',minLength:1,pattern:'\\S'},arr={type:'array',items:str};
const scope={type:'object',required:['provider','environment','apiVersion','plan'],properties:Object.fromEntries(['provider','environment','apiVersion','plan'].map(k=>[k,str]))};
const refs={type:'array',minItems:1,items:str};
const schema={
  $schema:'https://json-schema.org/draft/2020-12/schema',
  title:'DXP Experience 0.1',description:'Candidate local contract; schema validation does not establish truth or evidence authenticity.',type:'object',
  required:['schemaVersion','experienceId','title','domain','goal','actor','scope','constraints','trace','outcome','lessons','evidence','validity','classification','demo'],
  properties:{schemaVersion:{const:'0.1'},experienceId:str,title:str,domain:str,goal:str,actor:{type:'object',required:['agentId','runtime'],properties:{agentId:str,runtime:str,model:{type:'string'},identityStatus:{type:'string'}}},scope,constraints:arr,
    trace:{type:'array',minItems:1,items:{type:'object',required:['step','observation','alternatives','selected','rationaleSummary','action','result','uncertainty','pivot','evidenceRefs'],properties:{step:{type:'integer',minimum:1},observation:str,alternatives:arr,selected:str,rationaleSummary:str,action:str,result:str,uncertainty:str,pivot:{type:'boolean'},evidenceRefs:refs}}},
    outcome:{type:'object',required:['status','summary'],properties:{status:{enum:['success','failure','partial','incomplete']},summary:str}},
    lessons:{type:'array',minItems:1,items:{type:'object',required:['subject','predicate','value','claim','type','scope','evidenceRefs'],properties:{subject:str,predicate:str,value:{type:['string','number']},claim:str,type:{enum:['observation','hypothesis','intuition','negative','disputed']},scope,evidenceRefs:refs}}},
    evidence:{type:'array',minItems:1,items:{type:'object',required:['id','label','content','kind'],properties:{id:str,label:str,content:str,kind:{enum:['illustrative','declared','observed']}}}},validity:{enum:['active','superseded','quarantined']},classification:{enum:['local','shareable']},demo:{type:'boolean'}
  }
};
write('experience.schema.json',schema);write('web/experience.schema.json',schema);
const repo=await seedRepository();await validateRepository(repo);write('examples/repository-demo.json',repo);
const template=clone(repo.commits[1].experience);template.experienceId='exp:replace-before-use';template.title='Ejemplo de formato: sustituir por tu experiencia';template.actor={agentId:'replace-author',runtime:'manual',identityStatus:'declared'};template.demo=true;write('examples/experience-template.json',template);
write('examples/context-options.json',{domain:'software',scope:template.scope});
for(const name of ['SPEC.md','RESEARCH.md','SOURCES.md','PRESENTATION.md','README.md','DCE.md','CLAUDE_REVIEW.md','WORK_DIARY.md'])write('web/'+name,read(name));
const run=runBenchmark({seed:17});const unknown=runBenchmark({seed:17,unknown:true});write('results/benchmark-seed17.json',run);write('results/benchmark-seed17-unknown.json',unknown);
write('results/summary.json',{release:'0.2',deterministic:true,benchmark:{kind:run.kind,seed:17,count:120,totals:run.totals},unknown:{totals:unknown.totals},limitations:['No models or tokens','Oracle trust labels','Constructed exact-match scopes','Does not validate H1-H6']});
const assetNames=['SPEC.md','RESEARCH.md','SOURCES.md','PRESENTATION.md','README.md','DCE.md','CLAUDE_REVIEW.md','WORK_DIARY.md','experience.schema.json'];
const assets=Object.fromEntries(assetNames.map(n=>[n,read(n)]));
const removeModules=s=>s.replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'');
const js=[removeModules(read('web/core.mjs')),removeModules(read('web/seeds.mjs')),removeModules(read('web/dce-evidence.mjs')),removeModules(read('web/dce-page.mjs')),removeModules(read('web/work-evidence.mjs')),removeModules(read('web/work-page.mjs')),removeModules(read('web/start-page.mjs')),removeModules(read('web/app.mjs'))].join('\n');
const assetsScript=`const offlineAssets=${JSON.stringify(assets).replace(/</g,'\\u003c')};\ndocument.addEventListener('click',ev=>{const a=ev.target.closest('a[download]');if(!a)return;const name=a.getAttribute('href');if(offlineAssets[name]){ev.preventDefault();ev.stopImmediatePropagation();download(name,offlineAssets[name],name.endsWith('.json')?'application/json':'text/markdown');}else if(name==='kit.zip'){ev.preventDefault();ev.stopImmediatePropagation();download('DXP_Atlas.html','<!doctype html>\\n'+document.documentElement.outerHTML,'text/html');}},true);\ndocument.querySelectorAll('a[href="kit.zip"]').forEach(a=>a.textContent='Exportar atlas HTML ↙');\n`;
let html=read('web/index.html').replace('<link rel="stylesheet" href="styles.css">',`<style>${read('web/styles.css')}</style>`).replace('<script type="module" src="app.mjs"></script>',`<script type="module">globalThis.__DXP_OFFLINE=true;\n${js.replace(/<\/script/gi,'<\\/script')}\n${assetsScript}</script>`);
write('DXP_Atlas.html',html);write('web/DXP_Atlas.html',html);
process.stdout.write(JSON.stringify({commits:repo.commits.length,scopeCases:run.count,offlineBytes:Buffer.byteLength(html),schemaGenerated:true})+'\n');
