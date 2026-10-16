# DXP · Domain Experience Protocol

Repositorio de referencia de DXP: núcleo de experiencias versionadas, CLI, Experience Atlas, API HTTP/MCP y evidencias reproducibles. Versión del software: **0.6.0**, experimental; contrato Experience **0.1**. La transferencia útil entre modelos sigue sin validarse.

## Empezar desde GitHub

Node.js 22+ para trabajar con DCE; el núcleo DXP también admite Node 18+.

```sh
git clone --recurse-submodules https://github.com/Milothik/domain-experience-protocol.git
cd domain-experience-protocol
npm test
npm --prefix references/dce ci
npm --prefix references/dce run build
npm run test:dce
```

`npm test` comprueba DXP sin instalar dependencias. La conexión ejecutable con [Domain Context Engine (DCE)](https://github.com/Milothik/domain-context-engine) vive en `references/dce`, fijada al commit `81426cceecc631b488422c96f7ee46c751c02136`. DCE prepara el contexto de una tarea; DXP conserva su ejecución y solo devuelve experiencias al contexto con aprobación explícita. Consulta [integración DCE](DCE.md) y [arquitectura, deuda y límites de escalado](docs/ARCHITECTURE.md).

La CI ejecuta las pruebas de ambos proyectos y el recorrido integrado sin llamadas a modelos. Los resultados nuevos se escriben en `results/dce-latest/`, sin sobrescribir capturas históricas. Clonar este repositorio no configura ni publica un servicio alojado.

La importación inicial contiene exclusivamente el inventario público revisado de DXP; [procedencia](docs/import-provenance.json) conserva los hashes originales. Los documentos siguientes incluyen el historial y los límites de las distintas ediciones. DCE conserva su licencia MIT en su propio repositorio; esta publicación no añade una licencia nueva a DXP ni a materiales de terceros.

## Experience Atlas

**Conservar el camino. No solo la llegada.**

Edición original del Atlas: experimental 0.2 · 15 de octubre de 2026; continuaciones posteriores documentadas más abajo. Idea: Ángel / Milothik. Diseño e implementación de referencia: Codex, a partir de los documentos Meta IA DXP.txt, Grok DXP.txt, Gemini DXP.txt, GPT DXP.txt y la auditoría DXP versionado de experiencias agénticas.md.

DXP — Domain Experience Protocol — estudia si una experiencia de resolución puede ser un artefacto interoperable: con objetivo, ámbito, alternativas, decisiones observables, acciones, resultados, fallos, evidencia e historia. Atlas convierte esa propuesta en un primer objeto utilizable y contrastable.

## Empezar con la edición 0.6 · correcciones GAMC

La entrada del sitio guía una experiencia observada en cuatro pasos: verla, entender lo ocurrido, comprobar evidencia y explorar su historia. Atlas, Comparar, Laboratorio y Protocolo están en «Explorar más».

Después de extraer `kit.zip`, con Node 18 o posterior y sin instalar dependencias:

```bash
node scripts/test-all.mjs
```

El lanzador reconstruye `dist/` antes de probar el worker. La descarga incluye `participation/catalog.json`, su snapshot y los datos de campaña requeridos. No hace falta recrear carpetas. Para abrir solo la interfaz local, sirve `web/` como se indica abajo; las API públicas pertenecen al sitio alojado.

`kit-files.json` enumera exactamente los archivos destinados a publicarse, con sus rutas de origen y destino. `KIT_MANIFEST.json` dentro del ZIP permite verificar sus hashes. La política excluye por defecto cualquier archivo nuevo, sesiones, credenciales, dependencias y directorios Git. La configuración pública de despliegue y los registros incluidos son deliberados; el ZIP no equivale a una copia privada completa del espacio de trabajo. Consulta `PUBLIC_RELEASE.md` y `web/gamc-review.md` para el alcance de las correcciones.


## Abrir y enseñar

Abre **DXP_Atlas.html** en un navegador moderno. Es una edición autónoma: interfaz, ejemplos y núcleo están embebidos. Los enlaces a originales requieren conexión. Los archivos descargables del contrato se generan dentro de esa edición. Para trabajar desde el código modular:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory web
```

Abre http://127.0.0.1:4173. El módulo de hashing requiere un contexto seguro: HTTPS, localhost o un navegador que considere seguro el archivo local. Si abrir el HTML directamente no funciona en tu navegador, usa el servidor local.

Ruta de presentación de cinco minutos:

1. **Visión**: enunciar la pregunta sobre heredar experiencia sin heredar ciegamente conclusiones. «Presentar la idea» elimina navegación; Esc sale.
2. **Atlas**: mostrar el intento con veinte workers, su fallo y la revisión con cuatro. Abrir Trayectoria, Evidencia e Historia.
3. **Comparar**: Basic frente a Pro. Ambas ramas conservan condiciones diferentes. Integrar con nota explícita y mostrar los dos padres.
4. **Laboratorio**: ejecutar semilla 17; activar ámbito v3 desconocido. DXP se abstiene cuando no puede aplicar una experiencia.
5. **Protocolo / Fuentes**: separar software implementado de hipótesis por demostrar y antecedentes reales.

## Usar con tu propia experiencia

«Registrar experiencia» crea un registro propio. Completa el ámbito, una observación, alternativas, decisión, acción, resultado, una evidencia y una lección. El estado de confianza se declara; el registro no prueba la conclusión. La edición inicial almacena datos en el navegador, sin cuenta externa ni envío a modelos.

Una revisión añade un paso y evidencia; la lección actual reemplaza la lección de la revisión anterior **en el nuevo snapshot**, mientras la revisión anterior permanece accesible. Una revisión de un ejemplo conserva `demo: true` para no convertir una historia inventada en ejecución real.

Exporta el repositorio para respaldarlo o importarlo en otro navegador. «Exportar» dentro de una experiencia incluye sus ancestros y un ref `export/head`; ambos tipos de archivo son importables. La importación verifica hashes, referencias y orden del DAG. Si una rama importada colisiona con una local, la interfaz crea un nombre `import/<hash>`. La CLI rechaza colisiones para exigir una decisión explícita.

No borres los datos del navegador sin exportar si quieres conservarlos. La clasificación `local` es descriptiva: el export incluye esos registros. SHA-256 protege integridad, no cifrado ni confidencialidad.

## Núcleo y CLI

Node 18+; sin instalación de dependencias.

```powershell
node cli.mjs init --store repository.json
node cli.mjs log --store repository.json
node cli.mjs diff concurrency/main concurrency/pro --store repository.json
node cli.mjs merge concurrency/main concurrency/pro --branch integration/plans --note "Conservar las reglas condicionadas al plan" --store repository.json
node cli.mjs verify --store repository.json
node cli.mjs export --store repository.json --out export.json
node cli.mjs benchmark --seed 17 --unknown --out benchmark.json
node tests/kernel.test.mjs
```

Para registrar tu primer objeto:

```powershell
node cli.mjs init --empty --store my-repository.json
node cli.mjs commit examples/experience-template.json --branch work/main --message "Primera experiencia declarada" --store my-repository.json
node cli.mjs context examples/context-options.json --store my-repository.json --out context.json
```

Edita el template antes de registrar: su contenido de ejemplo es ilustrativo y se marca `demo: true`. Para una experiencia realmente observada, reemplaza contenido y evidencia y cambia explícitamente `demo` a `false`. El compilador de contexto excluye demostraciones, intuiciones, disputas y cuarentena. Siempre entrega `reviewRequired: true` y `trust: unverified-data`.

Importar un módulo:

```javascript
import { commit, validateRepository, contextPacket } from './web/core.mjs';
const result = await commit(repository, experience, {
  branch: 'work/main', parents: [currentHead], message: 'Nueva observación'
});
await validateRepository(result.repo);
const packet = contextPacket(result.repo, {
  domain: 'software',
  scope: {provider:'North', plan:'basic', apiVersion:'v1', environment:'sandbox'}
});
```

El productor y consumidor pueden intercambiar estos JSON sin compartir un SDK de modelo. Ese intercambio demuestra portabilidad de datos, **no** transferencia útil entre modelos. En el navegador también hay una API de lectura `DXP.snapshot()`, `DXP.query(options)`, `DXP.context(options)` y `DXP.benchmark(options)`.

## Qué incluye la edición

| Archivo | Uso |
|---|---|
| DXP_Atlas.html | Demostración autónoma y repositorio de navegador |
| web/index.html + app.mjs + styles.css | Aplicación modular para servir o alojar |
| web/core.mjs | Operaciones de referencia compartidas por navegador y Node |
| web/seeds.mjs | Seis revisiones ilustrativas y dos revisiones documentales reales; sin llamadas a modelos consumidores |
| cli.mjs | CLI local; escritura atómica y lock de archivo |
| SPEC.md | Contrato normativo candidato y limitaciones |
| RESEARCH.md | Hipótesis y diseño de evaluación |
| SOURCES.md | Fuentes, matriz editorial y límites de las investigaciones |
| PRESENTATION.md | Guion completo de presentación |
| experience.schema.json | JSON Schema de Experience 0.1 |
| examples/ | Template, corpus inicial y opciones de contexto |
| results/ | Ejecuciones sintéticas reproducibles y verificación |
| tests/kernel.test.mjs | Pruebas de invariantes y comportamiento |

## Alcance técnico

Commits como snapshots JSON, SHA-256 sobre serialización propia de claves ordenadas, ramas como punteros, integración de dos revisiones y reversión no destructiva. Diff de campos y claves tipadas; no motor NLP. El almacenamiento de navegador admite un único escritor por copia: detecta cambios de otra pestaña antes de guardar. La CLI usa un lock y un reemplazo de archivo, adecuados para un laboratorio en un equipo, no para un servicio distribuido.

El sitio actual ofrece una API HTTP y participación durable. `runner/` conserva un piloto local con dos modelos y sus limitaciones; no acredita transferencia útil. No implementa firmas de identidad, IAM de experiencias, cifrado, redacción automática, detección general de inyecciones ni invalidación causal en cascada.

El benchmark es un mundo construido donde el selector exacto recibe condiciones y etiquetas de confianza dadas. Sus resultados no prueban H1–H6, no miden ahorro de tokens reales y no establecen superioridad frente a productos de memoria. Consulta RESEARCH.md antes de citarlo.

## Criterio de éxito de este primer release

Una experiencia puede viajar entre dos entornos, conservar su historia, detectar manipulación, mantener conclusiones de ámbitos diferentes e integrar una revisión sin borrar la evidencia del fallo. La utilidad científica deberá venir de experimentos con tareas nuevas y agentes reales.


## Continuación 0.2: DCE explicado y ejecutado

Consulta [DCE.md](DCE.md) para conocer el proyecto, su repositorio público y el adaptador implementado. La nueva página DCE muestra productor, consumidor y fallo de continuidad sobre el motor real y los fixtures públicos. Las capturas no prueban mejora en modelos: se usa offline-preview. [CLAUDE_REVIEW.md](CLAUDE_REVIEW.md) documenta lo adoptado, corregido y pendiente del quinto informe.

El kit incluye web/dce-adapter.mjs, scripts/run-dce.mjs, tests/dce-adapter.test.mjs y results/dce/. La página permite añadir esas tres ejecuciones al repositorio del navegador y exportarlas como JSON.


## Diario de construcción

La ruta Diario incorpora las experiencias reales de esta sesión, procedencia de cinco investigaciones, cobertura parcial de conversaciones y comprobaciones sobre registros del trabajo. WORK_DIARY.md detalla la metodología y scripts/work-task.mjs conserva declaración y cierre de cada tarea. AGENTS.md mantiene este flujo para la continuidad del proyecto. Las atribuciones de modelos no están atestadas y no se afirma archivar tres chats completos.


## Registro público0.3

La ruta /community recibe experiencias de agentes mediante una API pública y almacenamiento compartido. AGENT_GUIDE.md describe el contrato. /api/evaluation recalcula señales de informes recibidos; no certifica ejecuciones ni identidades declaradas. El piloto inicial de dos consumidores no observó mejora de aciertos. PUBLIC_RELEASE.md conserva estado, hallazgos y límites.


## Campaña real 0.4 · 15 octubre 2026

Se completaron 18 tareas de código en contextos nuevos y copias por carpeta: 6/6 en cada condición (sin memoria, nota y acceso DXP). Protocolo y tests congelados antes de lanzar consumidores. Cero agentes DXP declararon consultar su interfaz; cinco con nota la leyeron. No se demuestra beneficio de consulta. El aislamiento fue procedimental sobre host compartido y no hay telemetría completa: la campaña estrictamente controlada queda sin acreditar.

Integradas seis mejoras, 35 pruebas pasan. Protocolo, parches y evidencias: [campaña](campaign.html), [documentación](CAMPAIGN.md), [resultados](campaign-results.json). Los informes originales de investigación no cuentan como ejecuciones.


## Continuación con proveedores · 16 octubre 2026

La suite actual pasa 65/65; cinco defectos reproducidos fueron corregidos. La comparación de desarrollo entre tres condiciones y dos proveedores está en web/diagnostic.html y diagnostic-20261016/report.json. No acredita ventaja DXP ni versión interna del proveedor. Consulte transport-deviations.json antes de interpretar sus cuentas.

Para reevaluar las salidas archivadas en una extracción nueva (sin llamadas a modelos):

```bash
node scripts/materialize-diagnostic.mjs --reproduce
node scripts/evaluate-diagnostic.mjs --reproduce
```

Eso reproduce aceptación de artefactos guardados; no reproduce estocásticamente una inferencia comercial. No vuelva a ejecutar prepare-diagnostic.mjs sobre el diagnóstico congelado. La fuente inicial y los evaluadores se conservan en participation/baseline. El siguiente requisito es un canal de entrada/salida que preserve bytes y versiones de modelo identificables antes de una campaña confirmatoria.


Repetición íntegra v2: gemini dxp: 6/6; grok note: 6/6; gemini none: 5/6; grok dxp: 6/6; gemini note: 5/6; grok none: 6/6. Entrada exacta comprobada en seis lotes; salida protegida, sin reparaciones. La primera matriz sigue disponible. Para reevaluar v2 en una extracción nueva, añadir `--dir=diagnostic-20261016-v2` a los comandos de materialización y evaluación anteriores. Seis conversaciones, no 36 muestras independientes; cero ensayos confirmatorios añadidos. No se acredita ventaja de versionado.
