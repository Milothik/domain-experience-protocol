from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json,re,hashlib
root=Path(__file__).resolve().parent.parent
project=root.parent.parent
source=root/'campaign'
target=root/'public'/'campaign'
target.mkdir(parents=True,exist_ok=True)
def clean(s):
    # Git and nested JSON can escape each separator more than once.
    parts=re.split(r'[\\/]',str(project))
    prefix=r'(?:/|\\+)'.join(re.escape(part) for part in parts)
    s=re.sub(prefix,lambda m:'/workspace',s,flags=re.I)
    return s
def scrub(x):
    if isinstance(x,str):return clean(x)
    if isinstance(x,list):return [scrub(v) for v in x]
    if isinstance(x,dict):return {k:scrub(v) for k,v in x.items()}
    return x
for p in source.rglob('*'):
    if not p.is_file():continue
    rel=p.relative_to(source)
    if p.name in ['protocol.json','protocol.sha256','frozen-experiences.json','equivalent-note.md']:
        data=p.read_bytes()
        assert str(project).encode() not in data
    elif p.suffix=='.json':
        data=(json.dumps(scrub(json.loads(p.read_text(encoding='utf-8-sig'))),ensure_ascii=False,indent=2)+'\n').encode()
    else:data=clean(p.read_text(encoding='utf-8-sig')).encode()
    out=target/rel;out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(data)
(target/'PUBLIC_README.md').write_text('Public evidence copy. Local machine paths are replaced by /workspace. Protocol, frozen experience and acceptance criteria are unchanged. Raw tool activity and solve-time telemetry were not available; reports are declarations. Separate agent contexts and folders do not establish sealed operating-system isolation. strictControlledCampaignComplete=false.\n',encoding='utf-8')
protocol=(target/'protocol.json').read_bytes()
assert hashlib.sha256(protocol).hexdigest()==(target/'protocol.sha256').read_text().strip()
manifest={str(p.relative_to(target)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in target.rglob('*') if p.is_file() and p.name!='PUBLIC_MANIFEST.json'}
(target/'PUBLIC_MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
archive=root/'web'/'campaign-evidence.zip'
with ZipFile(archive,'w',ZIP_DEFLATED) as z:
    for p in target.rglob('*'):
        if p.is_file():z.write(p,p.relative_to(target).as_posix())
with ZipFile(archive) as z:assert z.testzip() is None
print(json.dumps({'files':len(manifest)+1,'archiveBytes':archive.stat().st_size,'protocolHashVerified':True}))

