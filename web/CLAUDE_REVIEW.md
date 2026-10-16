# Revisión de la investigación de Claude e incorporación a DXP

15 de octubre de 2026 · revisión editorial y técnica del archivo «DXP versionado de experiencias agénticas.md». El original se conserva intacto. Este documento distingue lo adoptado, lo corregido y lo que requiere verificación adicional.

## Conclusión

El informe fortalece el criterio de investigación: versionar memoria o compartir experiencias tiene antecedentes y no basta para reivindicar originalidad. La contribución candidata de DXP debe especificar qué semántica aporta al comparar, fusionar, retractar y auditar experiencias, y medir su valor frente a controles competitivos.

Contiene dos conclusiones documentales que hay que corregir. DCE sí tiene un repositorio público ejecutable. Scion sí es el sistema interno de control de versiones de Anthropic descrito en el artículo oficial del 13 de octubre de 2026. El informe localizó un proyecto distinto, GoogleCloudPlatform/scion, y reconoció no haber explorado directamente anthropic.com. No podemos tratar esa ausencia de búsqueda como refutación.

## Matriz de revisión

| Afirmación o propuesta de Claude | Evaluación | Cambio en DXP |
|---|---|---|
| No se encontró documentación pública de DCE | Ausencia en su búsqueda, corregida por fuente primaria | Página DCE con repo, revisión, arquitectura, contratos y motor |
| Scion no es un VCS de Anthropic | Incorrecta respecto al detonante de este proyecto | Se conserva la atribución respaldada por Anthropic y se distinguen homónimos |
| DXP no tiene evidencia experimental propia de utilidad | Se mantiene | Se separan software funcional y prueba de integración de resultados científicos |
| Memoria compartida/versionada tiene antecedentes | Se adopta, sin afirmar exhaustividad | AXTP y GitOfThoughts se mantienen como controles conceptuales cercanos |
| Observado y declarado deben diferenciarse | Se adopta | Razones DCE permanecen declaraciones del proveedor; resultados y eventos se registran por separado |
| Utilidad depende de productor, consumidor, rol y ámbito | Hipótesis plausible, no propiedad probada de nuestro formato | Captura identificadores de proveedores y contexto; evaluación segmentada pendiente |
| Fallos necesitan anotación | Se adopta con causa raíz desconocida permitida | Se registra etapa observada, error y resultado preservado; no se inventa una causa |
| Fusión por tipo con divergencia explícita | Dirección de diseño | Núcleo actual compara claves y conserva disputed; no se anuncia comprensión semántica general |
| Ventanas de validez y dependencias | Extensión pendiente | Ámbito exacto y vigencia actual; intervalos y revocación causal no implementados |
| Firmas, atestaciones, ACL y cuarentena | Agenda de producción | No se presentan como capacidades del núcleo local |
| Cifras marcadas [verificar] | Pendientes de lectura del original | Se excluyen de resultados y promesas de esta edición |

## Las dos correcciones y sus fuentes

**DCE.** [Repositorio público](https://github.com/Milothik/domain-context-engine), paquete 0.2.0. [README](https://github.com/Milothik/domain-context-engine/blob/81426cceecc631b488422c96f7ee46c751c02136/README.md), [arquitectura](https://github.com/Milothik/domain-context-engine/blob/81426cceecc631b488422c96f7ee46c751c02136/ARCHITECTURE.md) y [motor](https://github.com/Milothik/domain-context-engine/blob/81426cceecc631b488422c96f7ee46c751c02136/src/core/engine.ts) inspeccionados. Además se ejecutó el motor con su fixture público y se añadieron pruebas de integración a DXP. No se afirma que DCE implementara DXP antes de este adaptador.

**Scion.** [Redesigning source control at Anthropic](https://www.anthropic.com/engineering/redesigning-source-control), publicado el 13 de octubre de 2026, describe el sistema interno de control de versiones Scion y la herramienta de revisión Antique. El [proyecto Scion de GoogleCloudPlatform](https://github.com/GoogleCloudPlatform/scion) es un proyecto homónimo de orquestación de agentes. La existencia de uno no excluye al otro. La corrección documental ya conservada en research/scion sigue siendo válida.

## Qué aportan las siete hipótesis

Claude propone H1 valor del versionado; H2 capas de abstracción; H3 fusión tipada; H4 fallos anotados; H5 verificación externa; H6 obsolescencia; H7 condiciones de utilidad. El Atlas anterior tenía seis hipótesis con su propia numeración. No conviene equiparar sus IDs sin comparar contenido.

La aportación adicional sobre **cobertura** merece un eje propio: ¿las condiciones declaradas predicen cuándo una experiencia beneficia al consumidor? Debemos variar la distancia entre tareas de construcción y de evaluación, incluyendo casi duplicados, tareas relacionadas y tareas nuevas. Mediremos la diferencia de éxito frente al mejor control en cada grupo y la capacidad del ámbito declarado para identificar transferencias negativas. Un ámbito que no predice utilidad refutaría esa parte del diseño.

Las pruebas actuales no responden H1-H7. Verifican contratos e invariantes del software; el laboratorio de concurrencia sigue siendo un mundo determinista con etiquetas oraculares. La prueba DCE usa el motor real pero un proveedor de vista previa y datos sintéticos.

## Qué no se ha revalidado en esta continuación

Las cifras de MemCollab, MATM, LLMA-Mem, EDV, benchmarks de proveedores y auditorías de LoCoMo citadas por el informe no se han contrastado íntegramente con sus tablas originales. Permanecen material secundario pendiente. Tampoco se establecen conclusiones jurídicas sobre patentes, equivalencia legal o libertad de operación a partir del informe.

La ausencia de un sistema idéntico en una búsqueda no demuestra originalidad. Harán falta comparación formal, revisión de especificaciones y una suite de conformidad propia. No se afirma que fusión por claves sea una solución general a conflictos de significado.

## Cambios realizados tras la revisión

Página dedicada a DCE; enlaces fijados a una revisión; adaptador productor/consumidor; capturas de tres ejecuciones; revisión del contrato y del guion; resultados descargables y documentación del criterio de evaluación. El núcleo DCE se mantiene separado y no se ha modificado su repositorio público.

La siguiente pregunta tiene una forma ejecutable: con las mismas experiencias y evidencia, ¿DXP ayuda más que memoria plana y Git, o su valor aparece principalmente al auditar y recuperar errores? Ambas respuestas son resultados publicables si la evaluación es controlada.
