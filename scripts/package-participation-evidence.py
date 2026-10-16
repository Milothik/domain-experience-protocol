from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json,re,hashlib
root=Path(__file__).resolve().parent.parent
project=root.parent.parent
source=root/'participation';target=root/'public'/'participation'
target.mkdir(parents=True,exist_ok=True)
def clean(s):
    parts=re.split(r'[\\/]',str(project))
    pattern=r'(?:/|\\+)'.join(re.escape(x) for x in parts)
    return re.sub(pattern,lambda m:'/workspace',s,flags=re.I)
def scrub(x):
    if isinstance(x,str):return clean(x)
    if isinstance(x,list):return [scrub(i) for i in x]
    if isinstance(x,dict):return {k:scrub(v) for k,v in x.items()}
    return x
for file in source.rglob('*'):
    if not file.is_file() or 'dist' in file.relative_to(source).parts:continue
    rel=file.relative_to(source)
    if file.name in ['protocol.json','protocol.sha256','snapshot.json']:
        data=file.read_bytes()
    elif file.suffix=='.json':
        data=(json.dumps(scrub(json.loads(file.read_text(encoding='utf-8-sig'))),ensure_ascii=False,indent=2)+'\n').encode()
    else:data=clean(file.read_text(encoding='utf-8-sig')).encode()
    out=target/rel;out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(data)
assert 'sha256:'+hashlib.sha256((target/'protocol.json').read_bytes()).hexdigest()==(target/'protocol.sha256').read_text().strip()
manifest={p.relative_to(target).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in target.rglob('*') if p.is_file() and p.name!='PUBLIC_MANIFEST.json'}
(target/'PUBLIC_MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
archive=root/'web'/'participation-evidence.zip'
with ZipFile(archive,'w',ZIP_DEFLATED) as z:
    for p in target.rglob('*'):
        if p.is_file():z.write(p,p.relative_to(target).as_posix())
with ZipFile(archive) as z:assert z.testzip() is None
print(json.dumps({'files':len(manifest)+1,'archiveBytes':archive.stat().st_size,'protocolUnchanged':True}))
