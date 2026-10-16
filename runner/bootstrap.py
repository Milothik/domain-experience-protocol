"""Restore the pinned offline runtime; no accounts, paid API or arbitrary install scripts."""
import argparse,hashlib,json,pathlib,subprocess,sys,urllib.request
ROOT=pathlib.Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--runtime',type=pathlib.Path,default=ROOT.parent.parent/'dxp-runtime');args=parser.parse_args()
runtime=args.runtime.resolve();(runtime/'models').mkdir(parents=True,exist_ok=True)
manifest=json.loads((ROOT/'pilot/manifest.json').read_text())
subprocess.run([sys.executable,'-m','pip','install','--target',str(runtime/'python'),'-r',str(ROOT/'requirements.txt'),'--extra-index-url','https://abetlen.github.io/llama-cpp-python/whl/cpu','--only-binary=:all:'],check=True)
for m in manifest['models']:
 p=runtime/'models'/m['local']
 def digest(p):
  h=hashlib.sha256()
  with p.open('rb') as f:
   for b in iter(lambda:f.read(8388608),b''):h.update(b)
  return 'sha256:'+h.hexdigest()
 if p.exists() and digest(p)==m['sha256']:print(m['family']+' already verified');continue
 url='https://huggingface.co/'+m['id']+'/resolve/'+m['revision']+'/'+m['filename'];temporary=p.with_suffix('.download')
 with urllib.request.urlopen(url,timeout=60) as response,temporary.open('wb') as target:
  while True:
   chunk=response.read(8388608)
   if not chunk:break
   target.write(chunk)
 if digest(temporary)!=m['sha256']:raise RuntimeError('Downloaded model hash mismatch: '+m['id'])
 temporary.replace(p);print(m['family']+' downloaded and verified')
print('Runtime ready. Set PYTHONPATH to '+str(runtime/'python')+' for runner commands.')
