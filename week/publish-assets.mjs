import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const root=new URL('../',import.meta.url);
for(const [from,to] of [['week/PROTOCOL.md','web/week-protocol.md'],['week/CONTINUATION.md','web/week-continuation.md'],['week/state.json','web/week-state.json'],['week/evidence/day0-audit-original.json','web/week-audit.json'],['week/review-manifest.json','web/week-review.json']])fs.copyFileSync(new URL(from,root),new URL(to,root));
execFileSync('python3',['-c',`from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path.cwd()
with ZipFile(root/'web/week-evidence.zip','w',ZIP_DEFLATED) as z:
 for p in sorted((root/'week').rglob('*')):
  if p.is_file(): z.write(p,p.relative_to(root))
 for name in ['web/core.mjs','web/work-repository.json','AGENTS.md']:
  z.write(root/name,name)
with ZipFile(root/'web/week-evidence.zip') as z:
 assert z.testzip() is None
print('Weekly evidence archive verified')
`],{cwd:root,stdio:'inherit'});
