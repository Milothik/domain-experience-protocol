# DCE y DXP: contexto de tarea y experiencia de ejecución

Edición DXP Atlas 0.2 · 15 de octubre de 2026. Documento de implementación, con alcance experimental explícito.

## Qué es Domain Context Engine

Domain Context Engine (DCE) es una arquitectura de referencia ejecutable en TypeScript para transformar conocimiento estructurado de un proyecto en contexto específico de una tarea. El repositorio público es [Milothik/domain-context-engine](https://github.com/Milothik/domain-context-engine). La revisión inspeccionada y ejecutada es [81426cceecc631b488422c96f7ee46c751c02136](https://github.com/Milothik/domain-context-engine/commit/81426cceecc631b488422c96f7ee46c751c02136), paquete 0.2.0, arquitectura v2 y contexto por defecto schemaVersion 2.0. Su código se distribuye bajo MIT y requiere Node 22 o posterior.

DCE responde a un problema concreto: pasar todo el conocimiento de un proyecto a un generador puede introducir ruido, inconsistencias y contexto innecesario. Recuperar documentos parecidos tampoco garantiza que se preserven las restricciones que afectan a la tarea. DCE separa la recuperación, la decisión y la compilación antes de generar.

La **Domain Encyclopedia** representa entidades: personaje, estación, producto, regla o cualquier tipo definido por el dominio. Cada entidad puede tener atributos, relaciones, reglas y procedencia. DCE no impone una ontología universal. El adaptador del proyecto debe definir qué datos son fiables y qué relaciones tienen consecuencias materiales.

**Candidate Discovery** encuentra candidatos mediante coincidencia léxica y recorrido acotado de un grafo de relaciones. **DecisionProvider** selecciona cuáles afectan a la ejecución. El proveedor determinista y el proveedor HTTP de decisiones son sustituibles. Sus motivos y valores de confianza son declaraciones del proveedor; no son probabilidades calibradas ni acceso al razonamiento interno.

**ContextCompiler** prepara un TaskContext JSON con entidades seleccionadas, restricciones, requisitos de salida, continuidad y avisos sobre conocimiento retenido o excluido. La validación del motor comprueba contratos, restricciones obligatorias y overrides. Una validación correcta no establece la verdad del contenido.

**GenerationProvider** produce una salida usando ese contexto; **OutputAdapter** la adapta y **ProjectAdapter** añade validación propia del dominio y deriva cambios de continuidad. **StateStore** aplica esos cambios con control de versión. Si la salida ya se generó y validó pero falla el commit de continuidad, StateCommitError conserva la salida y el contexto para reconciliar el fallo sin regenerar a ciegas.

El ejemplo público de cómic utiliza datos sintéticos y un generador offline-preview que devuelve JSON. No genera imágenes ni incorpora canon privado. La implementación de referencia no incluye persistencia durable, ingestión/OCR ni servicios de generación de medios listos para producción.

Fuentes de la definición:

- [README fijado a la revisión](https://github.com/Milothik/domain-context-engine/blob/81426cceecc631b488422c96f7ee46c751c02136/README.md)
- [Arquitectura v2](https://github.com/Milothik/domain-context-engine/blob/81426cceecc631b488422c96f7ee46c751c02136/ARCHITECTURE.md)
- [Contratos públicos](https://github.com/Milothik/domain-context-engine/blob/81426cceecc631b488422c96f7ee46c751c02136/src/core/contracts.ts)
- [Motor run()](https://github.com/Milothik/domain-context-engine/blob/81426cceecc631b488422c96f7ee46c751c02136/src/core/engine.ts)

## Qué es DXP y cómo se relaciona

Domain Experience Protocol (DXP) es una propuesta de contrato para experiencias de resolución: objetivo, condiciones, observaciones, decisiones declaradas, acciones, resultados, fallos, evidencia e historia. Experience Atlas implementa un núcleo local con snapshots inmutables, hashes, ramas, comparación tipada, integración conservadora, reversión e intercambio JSON.

DCE organiza qué conocimiento entra en una tarea. DXP registra qué ocurrió durante una ejecución y cómo evoluciona una conclusión. Una enciclopedia de dominio y un repositorio de experiencias tienen objetos y responsabilidades distintos. Ninguno sustituye a la validación del dominio o a la revisión de evidencias.

| Elemento | DCE | DXP en esta edición |
|---|---|---|
| Conocimiento | Entidades y relaciones del dominio | Referencia a contexto y revisión usados |
| Tarea | Task | Objetivo del episodio |
| Decisión | Decision[], incluidas razones declaradas | Evidencia conservada en la captura |
| Contexto | TaskContext validado | Artefacto de entrada conservado |
| Resultado | Salida adaptada y validada | Outcome de la ejecución |
| Continuidad | StateStore con versión | Lección sobre éxito o fallo de commit |
| Reutilización | Entidad explícitamente admitida para nueva tarea | Commit con ámbito y revisión requerida |

## Adaptador implementado

`web/dce-adapter.mjs` tiene tres operaciones públicas:

1. `captureDceRun(run, options, task, metadata)` invoca una vez el motor suministrado por el llamador. Observa límites de las operaciones de descubrimiento, decisión, compilación, generación, adaptación y commit. Devuelve el resultado o error, una captura y una experiencia estructuralmente válida. No captura todas las instrucciones internas del motor ni infiere causas ocultas. Si falla una validación entre operaciones, la etapa registrada es la última frontera observada.
2. `recordDceRun(repository, capture, options)` guarda la experiencia con el núcleo de commits DXP. El llamador define rama y padres. Una ejecución nueva puede ser un episodio nuevo; no se inventa parentesco entre tareas distintas.
3. `dceEntitiesFromRepository(repository, options)` verifica hashes y DAG y crea entidades DCE únicamente para lecciones de HEAD activos, bajo ámbito exacto, no demo, con tipo observation/negative y commit explícitamente aprobado. Sin aprobación devuelve cero entidades.

La entidad de consumo es un **dato revisado**, con un campo que conserva esa limitación. No añade mustPreserve ni avoid. La procedencia user-canon permite incluir un dato aprobado por la política del proyecto en el compilador de DCE; no declara que el claim esté científicamente probado. La confianza de la importación es 0, no una puntuación de veracidad inventada.

La captura conserva contexto y salida, que pueden ser privados en un proyecto propio. Su clasificación por defecto es local. El código no serializa objetos de configuración del proveedor ni sus credenciales, pero el operador sigue siendo responsable de revisar el contenido observado antes de exportarlo. No hay redacción automática ni cifrado.

## Prueba de integración ejecutada

El script `scripts/run-dce.mjs` utiliza el run() real de DCE y sus fixtures públicos. Se ejecutaron tres casos:

- Productor: DCE seleccionó tres entidades y produjo un TaskContext 2.0. La ejecución se registró como commit DXP.
- Consumidor: tras admitir explícitamente el commit bajo una política de prueba, se creó una entidad DXPExperience y DCE la incluyó en otro contexto validado.
- Fallo de continuidad: se inyectó un conflicto en StateStore después de generar. DCE lanzó StateCommitError; el adaptador conservó la salida, registró el fallo y no repitió la generación.

Las tres experiencias están en `results/dce/repository.json`; productor, consumidor y fallo tienen capturas completas. La revisión del software está fijada en `summary.json`. En este ejemplo `demo:false` significa **ejecución real del motor sobre fixtures sintéticos**, no ensayo con un modelo ni observación del mundo exterior.

El recorrido prueba compatibilidad de contratos, captura, persistencia del registro y admisión en contexto. No mide mejora del consumidor. La lección transferida es una observación básica de ejecución; estudiar reutilización de estrategias más ricas requiere contenido revisado y evaluación propia.

## Reproducir

Obtén DCE de su repositorio, fija el commit y ejecuta `npm ci` y `npm run build` dentro de DCE. Desde el proyecto Atlas:

```sh
node scripts/run-dce.mjs ../dce 81426cceecc631b488422c96f7ee46c751c02136
node --test tests/kernel.test.mjs tests/dce-adapter.test.mjs
```

La ruta es un ejemplo; usa la ubicación real de tu checkout DCE. El script no necesita una clave de modelo ni llama a un proveedor externo. Los resultados conservan fecha, revisión, contexto, salida y errores observados.

## Siguiente criterio de avance

Capturar episodios reales de tareas separadas y manualmente revisadas; admitir lecciones con alcance verificable; comparar DXP frente a los mismos objetos en memoria plana con procedencia y en Git. Igualar presupuesto, contenido y curación. Medir éxito, transferencia negativa, obsolescencia, coste de revisión y tiempo para localizar el origen de una conclusión equivocada.

El adaptador implementado permite construir ese experimento. No demuestra por sí mismo ninguna hipótesis de utilidad.
