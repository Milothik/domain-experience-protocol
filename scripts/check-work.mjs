import fs from 'node:fs';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {clone,validateRepository,contextPacket,commit,history} from '../web/core.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=JSON.parse(fs.readFileSync(path.join(root,'work/repository.json'),'utf8'));
await validateRepository(repo);
fs.writeFileSync(path.join(root,'work/check-dataset.json'),JSON.stringify(repo,null,2)+'\n');
const scope=repo.commits[0].experience.scope;
const same=contextPacket(repo,{scope,domain:'software'});
const different=contextPacket(repo,{scope:{...scope,environment:'different-project'},domain:'software'});
assert(same.lessons.length>0);assert.equal(different.lessons.length,0);
const target=repo.commits.find(c=>c.experience.projectTask?.taskId==='git-compatibility');
const q=clone(target.experience);q.validity='quarantined';
const quarantined=(await commit(repo,q,{branch:'work/git-compatibility',parents:[target.commitId],message:'Test-only quarantine; no production mutation'})).repo;
const filtered=contextPacket(quarantined,{scope,domain:'software'});
assert(!filtered.lessons.some(l=>l.commitId===quarantined.refs['work/git-compatibility']));
const tampered=clone(repo);tampered.commits[0].experience.title='Altered evidence';
let rejected=false;try{await validateRepository(tampered);}catch{rejected=true;}assert(rejected);
const result={executedAt:new Date().toISOString(),dataset:'Real project-task observations in work/repository.json',
  design:'Engineering checks with matched data and explicit interventions; not model evaluation.',
  preregisteredScientificExperiment:false,modelCalls:0,
  checks:[
    {id:'scope',hypothesis:'Declared scope conditions should constrain retrieval.',observation:{sameScopeLessons:same.lessons.length,differentScopeLessons:different.lessons.length},expected:'Different environment returns zero lessons.',passed:true,limit:'Exact equality is implemented; semantic applicability and task utility untested.'},
    {id:'quarantine',hypothesis:'A quarantined experience should not be admitted by the context selector.',observation:{eligibleBefore:same.lessons.length,eligibleAfter:filtered.lessons.length,removedHead:true},expected:'Target HEAD is absent; raw history remains.',passed:true,limit:'Quarantine label assigned by the test, not an automatic poisoning detector.'},
    {id:'integrity',hypothesis:'An edit without a new commit should be detected.',observation:{tamperedRepositories:1,rejected:1},expected:'Validation rejects changed hashed content.',passed:true,limit:'Integrity does not establish author identity or truth.'}
  ],
  scientificHypothesesValidated:[],limitations:['One building session and one producer.','Retrospective tasks are not preregistered.','No randomized consumer, held-out model tasks, token measurements or quality comparison.']};
fs.writeFileSync(path.join(root,'work/checks.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
