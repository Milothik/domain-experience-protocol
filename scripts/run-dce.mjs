import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {emptyRepository,validateRepository} from '../web/core.mjs';
import {captureDceRun,recordDceRun,dceEntitiesFromRepository,DCE_SOURCE} from '../web/dce-adapter.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dce=process.argv[2]?path.resolve(process.argv[2]):path.join(root,'references/dce');
const actualRevision=execFileSync('git',['rev-parse','HEAD'],{cwd:dce,encoding:'utf8'}).trim();
assert.equal(actualRevision,DCE_SOURCE.revision,'DCE checkout must match the revision pinned by the adapter.');
const core=await import(pathToFileURL(path.join(dce,'dist/index.js')));
const fixtures=await import(pathToFileURL(path.join(dce,'examples/run.mjs')));
const sourceRevision=process.argv[3]??DCE_SOURCE.revision;
assert.equal(sourceRevision,actualRevision,'Declared DCE revision must match the checkout.');
const out=path.join(root,'results/dce-latest');fs.mkdirSync(out,{recursive:true});
const write=(name,x)=>fs.writeFileSync(path.join(out,name),JSON.stringify(x,null,2)+'\n');
const scope={provider:'DCE',plan:'offline-preview',apiVersion:'0.2.0',environment:'weirdway-synthetic-fixture'};
const task=fixtures.read('weirdway/task.json');
const metadata={scope,domain:'software',source:{...DCE_SOURCE,revision:sourceRevision},
  experienceId:'exp:dce-offline-roundtrip',title:'DCE: una ejecución real del motor, con datos de ejemplo',
  agentId:'dce:deterministic-fixture',model:'none / offline-preview',demo:false,classification:'shareable'};
const first=await captureDceRun(core.run,fixtures.options(),task,metadata);
assert.equal(first.error,null);assert.equal(first.result.context.schemaVersion,'2.0');
let repo=(await recordDceRun(emptyRepository(),first,{branch:'dce/roundtrip'})).repo;
const head=repo.refs['dce/roundtrip'];
const noApproval=await dceEntitiesFromRepository(repo,{scope,domain:'software'});
assert.equal(noApproval.entities.length,0);
const imported=await dceEntitiesFromRepository(repo,{scope,domain:'software',approvedCommitIds:[head],reviewer:'fixture-runner:explicit-policy'});
assert.equal(imported.entities.length,1);
const options=fixtures.options();
options.encyclopedia=new core.MemoryEncyclopedia('synthetic-v1+dxp-reviewed',[
  ...options.encyclopedia.all(),...imported.entities]);
const consumerTask={...task,id:'page-2-with-dxp',entityIds:[...task.entityIds,imported.entities[0]['@id']]};
const second=await captureDceRun(core.run,options,consumerTask,{...metadata,experienceId:'exp:dce-consumer',title:'DCE consume una experiencia DXP bajo revisión explícita'});
assert.equal(second.error,null);
assert(second.result.context.entities.some(e=>e['@id']===imported.entities[0]['@id']));
repo=(await recordDceRun(repo,second,{branch:'dce/consumer'})).repo;
// Failure case from the real engine, preserving the successfully generated output.
let calls=0;
const failing=fixtures.options();const original=failing.generator;
failing.generator={id:original.id,async generate(c){calls++;return original.generate(c);}};
failing.project={...failing.project,async deriveState(output,c){return [{entityId:c.entities[0]['@id'],value:{capture:'test'},provenance:[{source:'roundtrip-test',type:'generated',confidence:1}]}];}};
failing.state={read:()=>Promise.resolve({version:0,facts:[]}),commit:async()=>{throw Error('Injected continuity version conflict');}};
const failure=await captureDceRun(core.run,failing,task,{...metadata,experienceId:'exp:dce-state-recovery',title:'DCE: conservar la salida ante un fallo de continuidad'});
assert.equal(failure.error?.name,'StateCommitError');assert.equal(calls,1);
assert.equal(failure.artifact.recoveryRequired,true);assert(failure.artifact.output);
repo=(await recordDceRun(repo,failure,{branch:'dce/recovery'})).repo;
await validateRepository(repo);
write('producer.json',first.artifact);write('consumer.json',second.artifact);write('failure.json',failure.artifact);
write('repository.json',repo);
const summary={executedAt:new Date().toISOString(),source:metadata.source,
  engine:'real DCE run()',fixture:'public synthetic WeirdWay example',modelCalls:0,
  producer:{task:task.id,contextSchema:first.result.context.schemaVersion,selectedEntities:first.result.context.entities.length,commit:head},
  consumer:{task:consumerTask.id,importedExperienceEntities:1,requiresExplicitReview:true,contextContainsDxp:true},
  failure:{type:failure.error.name,generationCalls:calls,outputPreserved:true,automaticRetry:false},
  repository:{commits:repo.commits.length,hashesVerified:true},
  limits:['Offline preview provider; no real image or language-model generation.','Synthetic source data; not actual WeirdWay canon.','Integration test, not an experiment proving improved task performance.','Review policy in this fixture is deterministic; no claim of independent verification.']};
write('summary.json',summary);console.log(JSON.stringify(summary,null,2));
