from pathlib import Path
from zipfile import ZipFile
import re,json
root=Path(__file__).resolve().parent.parent
results=[]
for name in ['campaign-evidence.zip','participation-baseline.zip','participation-evidence.zip','kit.zip']:
    path=root/'web'/name
    with ZipFile(path) as z:
        assert z.testzip() is None
        violations=[]
        for entry in z.infolist():
            if '.git' in Path(entry.filename).parts:violations.append(entry.filename)
            if Path(entry.filename).suffix in ['.json','.mjs','.js','.md','.html','.py','.patch','.tap','.sha256']:
                text=z.read(entry).decode('utf-8-sig')
                if re.search(r'C:(?:\\)+Users|C:/'+ 'Users',text,re.I):violations.append(entry.filename)
                if re.search('olf'+'aria',text,re.I):violations.append(entry.filename)
        assert not violations,str(violations)
        results.append({'archive':name,'files':len(z.infolist()),'noLocalUserPaths':True,'excludedReferences':0})
print(json.dumps(results))

