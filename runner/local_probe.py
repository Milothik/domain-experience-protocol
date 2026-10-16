"""Unscored, offline inference and restricted-JS capability checks."""
import datetime, hashlib, importlib.metadata, json, os, pathlib, platform, sys, time
import quickjs
from llama_cpp import Llama
ROOT=pathlib.Path(__file__).resolve().parent
RUNTIME=pathlib.Path(os.environ.get('DXP_RUNTIME',ROOT.parent.parent/'dxp-runtime'))
MODELS=[{'id':'Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF','family':'qwen2','revision':'f86cb2c1fa58255f8052cc32aeede1b7482d4361','filename':'qwen2.5-coder-1.5b-instruct-q4_k_m.gguf','local':'qwen.gguf'},
 {'id':'HuggingFaceTB/SmolLM2-1.7B-Instruct-GGUF','family':'smollm2','revision':'2d4a76a30b4af41ecd395c35725ac11688d4cfe4','filename':'smollm2-1.7b-instruct-q4_k_m.gguf','local':'smol.gguf'}]
def sha(path):
 h=hashlib.sha256()
 with open(path,'rb') as f:
  for b in iter(lambda:f.read(8*1024*1024),b''):h.update(b)
 return 'sha256:'+h.hexdigest()
def main():
 checks=[];c=quickjs.Context();c.set_memory_limit(16*1024*1024);c.set_time_limit(.1);c.set_max_stack_size(256*1024)
 names=['process','require','fetch','std','os','Python','readFile','load','importScripts']
 result=json.loads(c.eval('JSON.stringify(['+','.join('typeof '+n for n in names)+'])'))
 checks.append({'id':'no-io-host-bridges','pass':all(v=='undefined' for v in result),'globals':dict(zip(names,result))})
 try:c.eval('while(true){}');checks.append({'id':'time-limit','pass':False})
 except quickjs.JSException as e:checks.append({'id':'time-limit','pass':'interrupted' in str(e)})
 fresh=quickjs.Context();fresh.eval('globalThis.privateCanary="different-run"');other=quickjs.Context();checks.append({'id':'fresh-context','pass':other.eval('typeof privateCanary')=='undefined'})
 report={'id':'dxp-local-runner-probe-20261016','startedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scoredTrials':0,'python':platform.python_version(),'llamaCppPython':importlib.metadata.version('llama-cpp-python'),'quickjs':importlib.metadata.version('quickjs'),'paidServicesPurchased':False,'isolation':{'type':'restricted-JavaScript-runtime','checks':checks,'osNamespacesAvailable':False,'hostFilesystemBridgeExposed':False,'limits':'Model tasks are pure JS functions. No arbitrary shell, Node modules or whole-repository execution; not an OS-container sandbox.'},'models':[]}
 for m in MODELS:
  p=RUNTIME/'models'/m['local'];record={**m,'bytes':p.stat().st_size,'sha256':sha(p)};t=time.perf_counter()
  llm=Llama(model_path=str(p),n_ctx=4096,n_threads=6,n_batch=256,n_gpu_layers=0,verbose=False,seed=16102026)
  record['loadSeconds']=time.perf_counter()-t;t=time.perf_counter()
  prompt='Return only the integer result of 37 + 58. No explanation.'
  r=llm.create_chat_completion(messages=[{'role':'user','content':prompt}],max_tokens=32,temperature=0,seed=16102026,model=m['id'])
  answer=r['choices'][0]['message']['content'];record.update({'inferenceSeconds':time.perf_counter()-t,'prompt':prompt,'answer':answer,'usage':r.get('usage'),'returnedModel':r.get('model'),'answerVerified':answer.strip().strip('` .\n')=='95','ggufArchitecture':llm.metadata.get('general.architecture'),'ggufName':llm.metadata.get('general.name'),'chatTemplatePresent':'tokenizer.chat_template' in llm.metadata})
  del llm;report['models'].append(record);print(json.dumps({'model':m['id'],'answer':answer,'verified':record['answerVerified'],'seconds':record['inferenceSeconds']}),flush=True)
 report['twoDistinctWeightFamiliesInvoked']=len({m['family'] for m in report['models'] if m['answerVerified']})==2
 report['completedAt']=datetime.datetime.now(datetime.timezone.utc).isoformat()
 (ROOT/'evidence'/'local-probe.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'runnerProbeVerified':report['twoDistinctWeightFamiliesInvoked'],'isolationChecksPassed':all(c['pass'] for c in checks)}),flush=True)
if __name__=='__main__':main()
