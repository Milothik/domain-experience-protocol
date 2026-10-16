"""Package only the reviewed path mapping in kit-files.json; never sweep the workspace."""
from pathlib import Path, PurePosixPath
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import hashlib, json

root = Path(__file__).resolve().parent.parent
policy = json.loads((root / 'kit-files.json').read_text())
target = root / 'web/kit.zip'
entries = {}
for name, source in sorted(policy['files'].items()):
    for value in (name, source):
        path = PurePosixPath(value)
        if path.is_absolute() or '..' in path.parts or '\\' in value:
            raise ValueError('Unsafe package path: ' + value)
        if any(part in {'.git', 'node_modules', 'dist', '__pycache__', '.env', '.dxp-session.json'} for part in path.parts):
            raise ValueError('Forbidden package path: ' + value)
    path = root / source
    if path.is_symlink() or not path.is_file() or not path.resolve().is_relative_to(root):
        raise ValueError('Missing or unsafe source: ' + source)
    entries[name] = path.read_bytes()
manifest = {
    'format': 'dxp-public-kit-manifest', 'version': 1,
    'policy': 'Exact reviewed mapping in kit-files.json. New workspace files are excluded by default.',
    'intent': policy['intent'], 'excluded': policy['excluded'],
    'files': {name: {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
              for name, data in entries.items()}
}
manifest_bytes = (json.dumps(manifest, ensure_ascii=False, indent=2) + '\n').encode()
entries['KIT_MANIFEST.json'] = manifest_bytes
with ZipFile(target, 'w', ZIP_DEFLATED) as archive:
    for name, data in sorted(entries.items()):
        info = ZipInfo(name, date_time=(2026, 10, 16, 0, 0, 0))
        info.compress_type = ZIP_DEFLATED
        info.create_system = 3
        info.external_attr = 0o100644 << 16
        archive.writestr(info, data)
with ZipFile(target) as archive:
    assert archive.testzip() is None
(root / 'web/kit-manifest.json').write_bytes(manifest_bytes)
print(json.dumps({'archive': 'web/kit.zip', 'files': len(entries), 'bytes': target.stat().st_size,
                  'sha256': hashlib.sha256(target.read_bytes()).hexdigest(), 'verified': True}))
