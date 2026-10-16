"""Publish an additive audit, never overwrite the original diagnostic results."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json, re, shutil
root = Path(__file__).resolve().parent.parent
name = 'evaluator-sensitivity-20261016'
source = root / name
public = root / 'public' / name
public.mkdir(parents=True, exist_ok=True)
for file in source.iterdir():
    if not file.is_file():
        continue
    if file.suffix not in {'.json', '.md', '.tap'}:
        raise ValueError('Unexpected audit file: ' + file.name)
    text = file.read_text(encoding='utf-8')
    if file.suffix == '.tap':
        text = text.replace(root.as_posix(), '<workspace>').replace(str(root), '<workspace>')
    (public / file.name).write_text(text, encoding='utf-8')
with ZipFile(root / 'web/evaluator-sensitivity-evidence.zip', 'w', ZIP_DEFLATED) as z:
    for file in sorted(public.iterdir()):
        z.write(file, arcname=name + '/' + file.name)
shutil.copyfile(source / 'README.md', root / 'web/EVALUATOR_SENSITIVITY.md')
summary = json.loads((source / 'replay.json').read_text())
summary.update({'classification':'post-hoc-engineering-sensitivity-audit', 'verdict':'not-validated', 'originalScoresRewritten':False, 'report':'/EVALUATOR_SENSITIVITY.md', 'evidence':'/evaluator-sensitivity-evidence.zip'})
(root / 'web/evaluator-sensitivity.json').write_text(json.dumps(summary, indent=2) + '\n')
paragraph = '''

## Sensibilidad del aplicador · 16 octubre 2026

Auditoría posterior, sin nuevas llamadas a modelos: los dos P06 indisponibles de Gemini tenían espacios iniciales en old que impedían la coincidencia literal. Quitando exclusivamente ese prefijo en copias, sin editar new, la nota plana pasa 12/12; sin memoria falla por sintaxis antes de ejecutar pruebas. La repetición conserva hashes y desenlaces. La diferencia estricta DXP 6/6 frente a nota 5/6 incluye por tanto un fallo de aplicabilidad, no una ventaja funcional demostrada. Las puntuaciones originales permanecen intactas; DXP sigue no validado y se añaden cero ensayos confirmatorios. [Método y reproducción](EVALUATOR_SENSITIVITY.md) · [Evidencia](evaluator-sensitivity-evidence.zip).
'''
for doc in ['WORK_DIARY.md', 'CONTINUATION_AUDIT.md']:
    file = root / doc
    text = file.read_text(encoding='utf-8')
    if '## Sensibilidad del aplicador' not in text:
        file.write_text(text + paragraph, encoding='utf-8')
    shutil.copyfile(file, root / 'web' / doc)
page = root / 'web/diagnostic.html'
html = page.read_text(encoding='utf-8')
if 'id="anchor-audit"' not in html:
    insert = '<section id="anchor-audit" class="notice"><h2>La diferencia depende también del aplicador</h2><p>Una auditoría posterior aplica los dos P06 ausentes quitando solo los espacios iniciales del ancla de búsqueda, sin editar la solución: <strong>la nota plana pasa 12/12</strong>; sin memoria falla por sintaxis antes de ejecutar pruebas. Esto limita la interpretación de DXP 6/6 frente a nota 5/6: incluye un fallo de aplicabilidad del parche y no demuestra ventaja funcional. Se conservan las puntuaciones originales. Sin llamadas nuevas a modelos ni ensayos confirmatorios.</p><p><a href="/EVALUATOR_SENSITIVITY.md">Método y reproducción</a> · <a href="/evaluator-sensitivity.json">Resultados del anexo</a> · <a href="/evaluator-sensitivity-evidence.zip">Evidencia</a></p></section>'
    html = html.replace('<div class="scroll">', insert + '<div class="scroll">', 1)
    page.write_text(html, encoding='utf-8')
policy = json.loads((root / 'kit-files.json').read_text())
for file in public.iterdir():
    policy['files'][name+'/'+file.name]='public/'+name+'/'+file.name
for file in ['audit-evaluator-sensitivity.mjs','evaluate-evaluator-sensitivity.mjs','replay-evaluator-sensitivity.mjs','package-evaluator-sensitivity.py']:
    policy['files']['scripts/'+file]='scripts/'+file
for file in ['evaluator-sensitivity-start.json','evaluator-sensitivity-finish.json','publish-sensitivity-start.json']:
    if (root / 'work/inputs' / file).is_file():
        policy['files']['work/inputs/'+file]='work/inputs/'+file
policy['files']['EVALUATOR_SENSITIVITY.md']='web/EVALUATOR_SENSITIVITY.md'
(root / 'kit-files.json').write_text(json.dumps(policy, indent=2) + '\n')
print(json.dumps({'publicAuditFiles':len(list(public.iterdir())), 'originalResultsRewritten':False}))
