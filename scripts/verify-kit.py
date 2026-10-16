"""Verify hashes and run the shipped suite in a clean temporary extraction, offline."""
from pathlib import Path
from zipfile import ZipFile
from tempfile import TemporaryDirectory
import hashlib, json, subprocess, re
from datetime import datetime, timezone

root = Path(__file__).resolve().parent.parent
archive = root / 'web/kit.zip'
with TemporaryDirectory(prefix='dxp-clean-kit-') as directory:
    with ZipFile(archive) as z:
        manifest = json.loads(z.read('KIT_MANIFEST.json'))
        assert set(z.namelist()) == set(manifest['files']) | {'KIT_MANIFEST.json'}
        for name, meta in manifest['files'].items():
            data = z.read(name)
            assert len(data) == meta['bytes']
            assert hashlib.sha256(data).hexdigest() == meta['sha256']
        z.extractall(directory)
    result = subprocess.run(['node', 'scripts/test-all.mjs'], cwd=directory, capture_output=True, text=True)
    output = result.stdout + result.stderr
    # TAP or Node's default human-readable reporter.
    def count(key):
        found = re.search(r'(?:#|ℹ) ' + key + r' (\d+)', output)
        return int(found.group(1)) if found else None
    passed, failed = count('pass'), count('fail')
    report = {'checkedAt': datetime.now(timezone.utc).isoformat(), 'archive': 'kit.zip',
              'archiveSha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
              'manifestFilesVerified': len(manifest['files']), 'cleanExtraction': True,
              'command': 'node scripts/test-all.mjs', 'networkOrDependencyInstallRequired': False,
              'exitCode': result.returncode, 'passed': passed, 'failed': failed,
              'scope': 'Engineering checks of this exact ZIP; not scientific validation or a full security audit.'}
    (root / 'web/kit-tests.tap').write_text(output)
    (root / 'web/kit-verification.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report))
    if result.returncode or not passed or failed != 0:
        print(output[-5000:])
        raise SystemExit(1)
