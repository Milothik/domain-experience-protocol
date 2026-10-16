"""Positive, negative and isolation controls for the development evaluator."""
import json,pathlib
from capsule import evaluate
ROOT=pathlib.Path(__file__).resolve().parent
tasks=json.loads((ROOT/'pilot/tasks.json').read_text())
solutions={
 'DEV-Q':"function solve(input){const ids=new Set(Object.values(input.refs));const heads=input.commits.filter(c=>ids.has(c.id));const blocked=new Set(heads.filter(c=>c.validity==='quarantined').map(c=>c.experienceId));return [...new Set(heads.filter(c=>c.validity==='active'&&!blocked.has(c.experienceId)).map(c=>c.id))].sort();}",
 'DEV-C':"function solve(input){const a=input.filter(l=>!['intuition','hypothesis','disputed'].includes(l.type));return a.filter(l=>l.type==='negative'||!a.some(r=>r.type!=='negative'&&r.subject===l.subject&&r.predicate===l.predicate&&r.scope===l.scope&&r.value!==l.value));}"}
checks=[]
for task in tasks:
 inputs=[t['input'] for t in task['tests']];expected=[t['expected'] for t in task['tests']]
 checks.append({'id':task['id']+'-known-correct','pass':evaluate(solutions[task['id']],inputs)==expected})
 checks.append({'id':task['id']+'-broken-baseline-rejected','pass':evaluate(task['initialCode'],inputs)!=expected})
checks.append({'id':'no-host-io','pass':evaluate("function solve(x){return [typeof process,typeof require,typeof fetch,typeof std,typeof os,typeof Python,typeof readFile,typeof load];}",[None])==[['undefined']*8]})
try:evaluate('function solve(x){while(true){}}',[None]);checks.append({'id':'infinite-loop-interrupted','pass':False})
except Exception as e:checks.append({'id':'infinite-loop-interrupted','pass':'interrupted' in str(e)})
checks.append({'id':'new-context-per-evaluation','pass':evaluate("globalThis.priorRun='canary';function solve(x){return true;}",[None])==[True] and evaluate("function solve(x){return typeof priorRun;}",[None])==['undefined']})
report={'kind':'evaluator-conformance-not-model-trials','checks':checks,'allPassed':all(c['pass'] for c in checks),'limits':'No OS isolation claim. QuickJS guest code has no Python callbacks or host I/O modules; finite negative tests are not a proof against engine vulnerabilities.'}
(ROOT/'evidence/capsule-checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2));assert report['allPassed']
