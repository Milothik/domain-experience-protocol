from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import json,hashlib,shutil,re
root=Path(__file__).resolve().parent.parent
p=root/'participation'
for name in ['join.mjs','join.py']:
    shutil.copy2(root/'scripts'/name,root/'web'/name)
    shutil.copy2(root/'scripts'/name,p/'baseline'/name)
(p/'baseline'/'.gitignore').write_text('.dxp-session.json\n*session*.json\nmemory-material.json\nresult.json\ndist/\n',encoding='utf-8')
(p/'baseline'/'README.md').write_text('DXP diagnostic tasks P01-P06. These tasks are currently unresolved in this baseline. Read https://dxp-experience-atlas.milothik.chatgpt.site/participation-guide.md before registration. Do not edit acceptance tests or inspect other conditions. Unit fixtures are synthetic test inputs, not observed experience records. The Site does not enforce local isolation or execute submitted patches.\n',encoding='utf-8')
archive=root/'web'/'participation-baseline.zip'
files=sorted(x for x in (p/'baseline').rglob('*') if x.is_file() and 'dist' not in x.relative_to(p/'baseline').parts)
with ZipFile(archive,'w',ZIP_DEFLATED) as z:
    for file in files:
        info=ZipInfo(file.relative_to(p/'baseline').as_posix(),date_time=(2026,10,15,0,0,0));info.compress_type=ZIP_DEFLATED;info.create_system=3;info.external_attr=0o100644 << 16
        z.writestr(info,file.read_bytes())
with ZipFile(archive) as z:assert z.testzip() is None
catalog=json.loads((p/'catalog.json').read_text(encoding='utf-8'))
catalog['baseline']['archiveSha256']='sha256:'+hashlib.sha256(archive.read_bytes()).hexdigest()
for target in [p/'catalog.json',root/'web'/'participation-tasks.json']:
    target.write_text(json.dumps(catalog,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
protocol=(p/'protocol.json').read_bytes()
assert 'sha256:'+hashlib.sha256(protocol).hexdigest()==(p/'protocol.sha256').read_text().strip()
print(json.dumps({'archive':'participation-baseline.zip','bytes':archive.stat().st_size,'files':len(files),'archiveSha256':catalog['baseline']['archiveSha256'],'protocolUnchanged':True}))
