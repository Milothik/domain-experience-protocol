import pathlib,shutil
from zipfile import ZipFile,ZIP_DEFLATED
ROOT=pathlib.Path(__file__).resolve().parent
WEB=ROOT.parent/'web'
for source,target in [('report.json','runner-report.json'),('pilot/manifest.json','runner-manifest.json'),('pilot/results-summary.json','runner-results.json'),('evidence/capsule-checks.json','runner-isolation.json'),('README.md','runner-guide.md')]:shutil.copyfile(ROOT/source,WEB/target)
with ZipFile(WEB/'runner-evidence.zip','w',ZIP_DEFLATED) as z:
 for p in sorted(ROOT.rglob('*')):
  if p.is_file() and '__pycache__' not in p.parts and p.suffix!='.pyc':z.write(p,p.relative_to(ROOT.parent))
with ZipFile(WEB/'runner-evidence.zip') as z:assert z.testzip() is None
print('Runner assets and complete developmental evidence archive verified')
