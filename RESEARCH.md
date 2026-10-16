# Programa DXP · Experimentos y condiciones de refutación

Edición 0.1 · 2026-10-14. Este documento es un protocolo candidato, no una preregistración publicada.

## Pregunta principal

¿Un consumidor distingue mejor experiencia aplicable, obsoleta, contradictoria y peligrosa cuando recibe objetos con ámbito, evidencia e historia que cuando recupera un pool plano? Los antecedentes hacen plausible estudiar la cuestión, no predeterminan el resultado.

## Qué se ejecuta en este release

E0 utiliza un mundo determinista de solicitudes a APIs ficticias. El pool contiene North/basic/v1 cap4, North/basic/v2 cap2, North/pro/v1 cap12, South/basic/v1 cap3 y una entrada North/basic/v2 cap64 con trusted=false. Cada tarea obtiene un ámbito y una carga de 20–99 solicitudes mediante un generador LCG de 32 bits con semilla conocida. Con unknown=true, cada quinta tarea es v3/cap1 sin experiencia correspondiente.

Las cuatro políticas:

| Política | Selector |
|---|---|
| none | Valor constante 16 |
| raw | Último registro del mismo proveedor; ignora versión, plan y confianza |
| flat | Último registro global |
| dxp | Último registro confiable con ámbito exacto; null si no existe |

El nombre raw es un ID técnico del selector; **no es recuperación de transcripts ni un RAG real**. flat tampoco es un resumen generado por LLM. Un caso es success si concurrencia ≤ cap, sin requisito de latencia. Abstenciones son no resueltas, no éxitos. Invocaciones = ceil(requests/concurrency) × (1 si success, 2 si fail); abstención produce 0. La fórmula es artificial.

La etiqueta trusted se entrega como verdad del generador. Los registros y capacidades se conocen de antemano. Este diseño favorece deliberadamente la coincidencia exacta para ilustrar el fallo de generalización. No debe usarse para anunciar porcentajes de mejora de DXP en agentes reales. No hay modelos, entrenamiento, tokens, firmas ni detección de ataques. DXP consume la información de scope que el escenario garantiza.

Reproducir:

```powershell
node cli.mjs benchmark --seed 17 --count 120 --out run.json
node cli.mjs benchmark --seed 17 --count 120 --unknown --out unknown.json
```

results/ contiene ambas ejecuciones completas. Repetir con los mismos argumentos produce los mismos objetos, incluidos todos los casos. La interfaz exporta JSON y CSV de todas las tareas.

## H1–H6: síntesis de esta edición

La numeración unifica propuestas de los cuatro documentos; no conserva la numeración inconsistente de los originales.

| ID | Predicción | Baseline / ablación | Refutación |
|---|---|---|---|
| H1 | DXP aumenta task success en tareas relacionadas nuevas | No memory, transcript, flat summary | Ninguna mejora sobre el baseline fuerte con presupuesto igual |
| H2 | Conservar fallos reduce repetición de errores | Solo éxitos vs éxitos+fallos | Sin reducción o éxito total empeora |
| H3 | Estructura retiene utilidad a menor coste total | Traza cruda, resumen, objeto DXP | Coste no baja o utilidad se pierde |
| H4 | Scope e historia reducen harmful transfer tras cambio | Pool plano, filtro por recencia, DXP sin historia | Recencia simple iguala o supera DXP |
| H5 | Procedencia y revisión limitan experiencia falsa | Retrieval por similitud, source gate, DXP completo | Fallos adversarios no bajan o utilidad útil queda excluida |
| H6 | A ayuda a B de otra familia | B sin memoria, B con experiencia propia, B con A | Beneficio solo intrafamilia o nulo frente al baseline |

Ninguna ha sido evaluada con agentes reales en Atlas.

## E1: transferencia y cambio de entorno

1. Crear 60 tareas productoras y 60 consumidoras disjuntas. Cada tarea posee contrato verificable y oráculo oculto al consumidor. Anotar las fronteras de ámbito antes de evaluar.
2. Productor A resuelve tareas con herramientas instrumentadas. Capturar observaciones, errores y decisiones declaradas, no razonamiento interno. Redactar secretos antes de persistir.
3. Curar tres memorias: transcripts completos, resúmenes planos y experiencias DXP. Añadir condición sin memoria. Mismo dataset, misma disponibilidad temporal y presupuesto de lectura.
4. Consumidor B resuelve tareas nuevas sin acceso a episodios consumidores previos. Presupuestar captura/curación/recuperación además de inferencia.
5. Cambiar una condición contractual en una partición predeterminada; conservar la antigua experiencia. Evitar que el selector DXP reciba una etiqueta oracular de obsolescencia inaccesible a baselines.
6. Comparar misma familia y familia distinta. Empezar con dos familias y luego ampliar a una matriz productor × consumidor.
7. Repetir al menos con cinco semillas de tareas/ejecución como piloto. El tamaño definitivo requiere análisis de potencia basado en la varianza observada; no se garantiza significación con una cifra arbitraria.

La evaluación debe usar contrafactuales pareados cuando sea posible. Emparejar el resultado de cada tarea en las distintas condiciones y reportar diferencias con intervalos de confianza, éxitos absolutos y fallos. Cero mejoras también se publican.

## E2: valor del fallo

Dos memorias con iguales tokens y curación: éxitos frente a éxitos más fracasos y correcciones. Medir repeated-error rate, success, pasos y coste. No atribuir causalidad solo porque la acción precedió al éxito; usar ablaciones específicas sobre la lección negativa.

## E3: conflictos

Construir pares anotados por humanos: misma regla/mismo ámbito, regla distinta/mismo ámbito, regla distinta/otro plan, cambios temporales y discrepancias de evidencia. Medir precision/recall del detector, retención de afirmaciones y harmful transfer. Comparar mantener ramas separadas, merge tipado y síntesis lingüística. Una fusión que parezca elegante pero empeore transferencia es un resultado negativo relevante.

## E4: confianza y dependencia

Sembrar registros falsos, fuentes copiadas y una nota adversaria ficticia. No realizar exfiltración real. El detector no debe recibir la etiqueta trusted del generador salvo en una condición explícitamente oracular. Medir adopción adversaria, falsos rechazos y beneficio del control de fuente. Separar firmas válidas de claims verdaderos.

## Métricas y contabilidad

Task Success Rate; Δ éxito respecto a baseline; errores conocidos repetidos; tareas empeoradas por memoria; soporte documental; evaluación de ámbito; adopción de claims falsos; llamadas de herramientas; tokens de captura, compilación y consumo; coste en dinero; latencia; revisión humana. Cada métrica necesita denominador, criterio de éxito y tratamiento de abstenciones.

## Resultado que justificaría continuar

Al menos una mejora útil y reproducible sobre un baseline competitivo, sin coste oculto o pérdida de fiabilidad, y un análisis de cuándo falla. La interoperabilidad sintáctica ya se puede demostrar intercambiando JSON; el aprendizaje colectivo requiere evidencia adicional.

## Decisión de publicación

Publicar dataset saneado, contratos, harness, modelos/versiones, parámetros, seeds, todos los resultados, exclusiones y scripts. No reemplazar resultados fallidos por una ejecución escogida. No llamar «preregistrado» a este documento hasta registrarlo en un servicio o repositorio con fecha verificable y antes de ver los resultados confirmatorios.


## Baselines cercanos y utilidad marginal del versionado

La auditoría S5 exige distinguir el valor de la memoria del valor añadido por DXP. El piloto debe añadir (A) objetos y evidencia idénticos en un almacén plano con procedencia, y (B) los mismos objetos en Git sin filtros o integración DXP. Se comparan con (C) DXP completo y sus ablaciones: sin historia, sin ámbito, sin fallos, sin revisión. No se deben etiquetar A/B como implementaciones de AXTP o GitOfThoughts: son controles definidos para el experimento.

Mantener contenido, presupuesto, curación y acceso a evidencia comparables. Los índices, filtros y generación de lecciones deben contabilizarse por separado. Si C no mejora una métrica relevante frente al mejor de A/B, la capa de versiones no queda justificada por ese experimento, aunque sea más fácil de auditar. La auditabilidad también requiere una métrica operativa: tiempo y acierto al localizar el origen de un claim erróneo.

Añadir una partición por cercanía de tareas (casi duplicadas, relacionadas, nuevas) y distinguir resultados, procedimientos destilados y trazas. La utilidad en duplicados no debe presentarse como transferencia de método. Comparar fallos ausentes, crudos y anotados a igual presupuesto. No imponer que todo fallo tenga una causa raíz ya conocida: esa anotación puede ser una hipótesis que requiere prueba externa.

La revisión documental research/scion es el primer caso real de esta edición: muestra cómo una conclusión secundaria se corrige al recuperar el original. No se incluye como tarea ganada en el benchmark sintético.


## Eje de cobertura propuesto por Claude (H7 en S5)

Preguntar si las condiciones de aplicabilidad predicen la utilidad marginal. Estratificar tareas retenidas por casi duplicadas, relacionadas y nuevas; medir diferencias frente al mejor control, transferencia negativa y capacidad del ámbito para anticipar daño. La numeración H7 corresponde al informe S5 y no renumera automáticamente las seis hipótesis anteriores.

## Integración DCE: evidencia de ingeniería, no validación científica

Tres ejecuciones del run() real de DCE, revisión 81426cceecc631b488422c96f7ee46c751c02136, prueban captura, consumo explícitamente revisado y conservación de salida tras StateCommitError. Se ejecutan con fixtures sintéticos y generador offline-preview. No cuentan como tareas ganadas ni validan las hipótesis científicas. Las capturas están en results/dce; el siguiente estudio debe usar lecciones sustantivas, tareas retenidas y controles equivalentes.
