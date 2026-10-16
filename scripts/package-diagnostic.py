from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json, hashlib, sys

root = Path(__file__).resolve().parent.parent
folder = root / 'public' / (sys.argv[1] if len(sys.argv)>1 else 'diagnostic-20261016')
manifest = json.loads((folder / 'PUBLIC_MANIFEST.json').read_text(encoding='utf-8'))
files = sorted(folder.iterdir())
assert {p.name for p in files} == set(manifest['files']) | {'PUBLIC_MANIFEST.json'}
for name, meta in manifest['files'].items():
    data = (folder / name).read_bytes()
    assert len(data) == meta['bytes']
    assert hashlib.sha256(data).hexdigest() == meta['sha256']
target = root / 'web/diagnostic-evidence.zip'
with ZipFile(target, 'w', ZIP_DEFLATED) as z:
    for p in files:
        z.write(p, folder.name + '/' + p.name)
    for p in ['CONTINUATION_AUDIT.md', 'scripts/prepare-diagnostic.mjs', 'scripts/materialize-diagnostic.mjs', 'scripts/evaluate-diagnostic.mjs', 'scripts/publish-diagnostic.mjs']:
        z.write(root / p, p)
with ZipFile(target) as z:
    assert z.testzip() is None
print(json.dumps({'files':len(files)+5,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}))
