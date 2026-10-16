# Registro de fuentes · DXP Atlas 0.1

Fecha de consulta: 2026-10-14. Este registro distingue material aportado, fuentes primarias y decisiones propias. No reivindica una revisión exhaustiva ni originalidad demostrada.

## Documentos aportados

| ID | Documento | Uso en esta edición | Precaución |
|---|---|---|---|
| S1 | Meta IA DXP.txt | Tupla de experiencia, valor de fallos, riesgos y experimentos | Resumen secundario, cifras de seguridad no adoptadas sin revisión |
| S2 | Grok DXP.txt | Primitivas, marco de viabilidad y métricas | Ausencia de equivalentes no tratada como prueba de novedad |
| S3 | Gemini DXP.txt | Ámbitos, mantenimiento de verdad y dependencia | Fórmulas dañadas y garantías fuertes convertidas en propuestas |
| S4 | GPT DXP.txt | Distinción DCE/DXP, DAG, baselines y síntesis crítica | Citas de la sesión original no son referencias resolubles de esta edición |

Los cuatro archivos fueron inspeccionados. No se copian en el kit para evitar confundir documentación previa con esta implementación. Continúan siendo material fuente aportado por el autor del proyecto.

## Fuentes primarias consultadas

**P1 · Anthropic. Redesigning source control at Anthropic. 13 de octubre de 2026.**
https://www.anthropic.com/engineering/redesigning-source-control

Describe Scion como respuesta a una carga extraordinaria de source control. Permite fundamentar el detonante arquitectónico. No formula un protocolo de experiencias y mantiene la pertinencia de Git para la mayoría de repositorios. La edición evita trasladar resultados de infraestructura a eficacia de DXP.

**P2 · Shinn et al. Reflexion: Language Agents with Verbal Reinforcement Learning. 2023.**
https://arxiv.org/abs/2303.11366

Antecedente de feedback lingüístico persistente en memoria episódica. Justifica investigar aprendizaje desde intentos previos; no ofrece evidencia sobre nuestro contrato, DAG o comparador.

**P3 · Zhao et al. ExpeL: LLM Agents Are Experiential Learners.**
https://andrewzh112.github.io/expel/

Página de los autores para extracción y reutilización de conocimiento desde experiencias. Fundamenta que aprendizaje experiencial no es una invención de DXP.

**P4 · Feng et al. Get Experience from Practice: LLM Agents with Record & Replay. 2025.**
https://arxiv.org/abs/2505.17716

AgentRR propone registrar interacciones, estructurar experiencia y aplicar comprobaciones para replay. Es un antecedente directo de repositorios de experiencias; impide reivindicar esa idea aislada como original.

**P5 · Wang, Mao, Fried y Neubig. Agent Workflow Memory. 2024.**
https://arxiv.org/abs/2409.07429

Procedimientos inducidos de experiencias y reutilización en navegación web. Sus métricas pertenecen a ese trabajo; Atlas no las reproduce ni las usa como métricas propias.

**P6 · W3C. PROV-O: The PROV Ontology. Recomendación de 2013.**
https://www.w3.org/TR/prov-o/

Modelo de entidades, actividades, agentes y derivación para procedencia interoperable. El mapeo de DXP se declara conceptual. No se afirma conformidad del JSON actual con PROV-O.

**P7 · Xiong et al. How Memory Management Impacts LLM Agents: An Empirical Study of Experience-Following Behavior. 2025; revisión v2, 10 de octubre de 2025.**
https://arxiv.org/abs/2505.16067

Estudia errores propagados y replay desalineado de experiencias. Justifica incluir transferencia negativa en evaluación. No establece que el filtro simple de Atlas resuelva el problema.

## Matriz de afirmaciones

| Afirmación | Soporte / clasificación | Uso permitido |
|---|---|---|
| El cambio de escala invita a revisar infraestructura agéntica | P1 | Motivación |
| Aprender desde experiencias previas tiene antecedentes | P2–P5 | Posición en el estado del arte |
| Compartir experiencias puede transferir errores | P7; riesgo en S1–S4 | Pregunta de evaluación |
| Procedencia y verdad son dimensiones diferentes | Modelo P6 + interpretación de diseño | Precaución explícita |
| El objeto DXP mejora modelos reales | Sin evidencia DXP | Hipótesis, no resultado |
| El comparador detecta significado de lenguaje natural | No implementado | No reivindicar |
| El núcleo conserva DAG e integridad | Implementación + pruebas | Resultado de software local |
| El microbenchmark favorece ámbito exacto | Funciones visibles + ejecuciones completas | Demostración sintética limitada |
| DXP es el primer sistema de este tipo | No demostrado | No reivindicar |

## Contenido de los documentos que no se convierte en garantía

Los documentos citan MATM, PACMI, MemCo, SSGM, CAVERT, ChronoMem, GCC, Letta y otras líneas de investigación. Esta edición no revalida exhaustivamente cada afirmación reciente ni depende de sus cifras para operar. Quedan como agenda bibliográfica. La especificación candidata no afirma implementar esos algoritmos.

Tampoco se adoptan valores de inmunidad, 0% de ataques, factores de reproducción, ahorros de tokens o equivalencia con modelos superiores. Una etiqueta trusted oracular no demuestra defensa. El rol propuesto de DCE no acredita la implementación actual de un adaptador; el repositorio de DCE está inspeccionado y su adaptador se ejecutó en esta edición.

Las seis hipótesis del release, el selector sintético, el kernel, la interfaz y la canonización son decisiones nuevas de esta edición. Se presentan como diseño propio apoyado en el material, no como conclusiones experimentales de terceros.


## Continuación: quinto informe y auditoría de una corrección

S5: DXP versionado de experiencias agénticas.md, aportado el 14-10-2026. Se incorpora como revisión secundaria crítica. Advierte de antecedentes próximos y propone baselines más exigentes. También contiene un error comprobado: descarta el Scion de Anthropic a partir de una búsqueda que reconoce no haber consultado anthropic.com. El artículo oficial P1 documenta ese sistema; no debe adoptarse la corrección negativa de S5. El Atlas conserva esta revisión como dos commits reales bajo research/scion: hipótesis pendiente y contraste con el original. No son ejecuciones de modelos consumidores ni validación de H1–H6.

P8 · AXTP: https://axtp.dev/ y https://github.com/edwrdsr/axtp . Se consultaron el sitio y el README del repositorio: definen intercambio de Experience Records, pools y operaciones de validación. La eficacia de sus afirmaciones de gobernanza no se auditó y no se traslada como garantía a DXP.

P9 · Shekar, H S y Krishnan. GitOfThoughts: Version-Controlled Reasoning and Agent Memory You Can Replay, Diff, and Merge. https://arxiv.org/abs/2606.14470 . Se recuperó el abstract primario. Sus autores reportan límites del beneficio en problemas nuevos en sus evaluaciones. No se generaliza ese resultado a todos los entornos ni se copian cifras no verificadas.

Cogit queda como candidato señalado por S5: su contenido primario no pudo recuperarse en esta continuación. No se marca como código auditado ni como equivalente probado. La afirmación de S5 de no haber localizado DCE tampoco prueba su inexistencia; no sustituye una inspección del repositorio del proyecto.

Consecuencia editorial: los dos baselines mínimos adicionales son un almacén plano con procedencia equivalente y un repositorio Git de los mismos objetos sin las reglas DXP. AXTP y GitOfThoughts son referencias para diseñar esos controles; no se afirma ejecutar sus implementaciones.


## DCE: fuente primaria e integración 0.2

P10 — Milothik. Domain Context Engine v0.2.0: https://github.com/Milothik/domain-context-engine . Revisión 81426cceecc631b488422c96f7ee46c751c02136, código MIT. Se inspeccionaron README, ARCHITECTURE.md, contracts.ts, engine.ts y ejemplos públicos; se ejecutaron el build, 41 pruebas y el benchmark offline de DCE. Ver DCE.md para enlaces fijados al commit. La prueba de integración es propia de Atlas: tres capturas bajo results/dce.

El no haber encontrado DCE en S5 se corrige con esta fuente. Las cifras de S5 marcadas verificar siguen pendientes; no se convierten en métricas propias. Ver CLAUDE_REVIEW.md.
