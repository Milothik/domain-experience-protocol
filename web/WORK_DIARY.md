# DXP registra su propia construcción

15 de octubre de 2026. Caso de trabajo real del proyecto Experience Atlas. Una sola sesión y un productor; no ensayo controlado de mejora de modelos.

## Qué conservamos

Cada tarea acotada tiene objetivo, observación inicial, alternativas declaradas, acción, resultado, incertidumbre, evidencia y lección. Las tareas nuevas registran una expectativa antes del check. El cierre crea otra revisión y conserva el estado pendiente. Las tareas ya realizadas se reconstruyen como retrospectivas; su fecha es la de captura y no una fecha de ejecución inventada.

`work/repository.json` es un repositorio DXP válido. `work/inputs/` conserva declaraciones y resultados. `work/source-manifest.json` identifica las versiones de los cinco informes por hash, tamaño y enlaces literales. `work/conversations.json` documenta cobertura parcial de conversaciones. `work/checks.json` conserva intervenciones mecánicas sobre los registros reales.

## Experiencias de esta construcción

Se registraron revisión de procedencia, localización de DCE, contraste de Scion, compatibilidad del helper con Git local, limitaciones del runner de tests, recorrido DCE productor/consumidor, corrección de alcance editorial, fallo del control de navegador y recuperación parcial de memoria. La tarea de registrar el diario tiene una predicción previa a sus comprobaciones. La publicación cita la experiencia de compatibilidad antes de reutilizarla.

Este último vínculo importa: citar un registro como “usado” es una declaración del agente. El resultado de la herramienta posterior puede comprobar que se ejecutó el procedimiento, pero no identifica automáticamente toda su influencia causal ni cuánto tiempo habría costado sin memoria.

## Fuentes y memoria

Las atribuciones Meta, Grok, Gemini y GPT proceden de los nombres de archivo; Claude fue identificado por el usuario. No hay atestación del proveedor, prompts completos, parámetros o trazas originales de generación. El contenido puede verificarse como versión exacta, pero la autoría declarada y la verdad del contenido son dimensiones separadas.

Se calcularon cifras sobre los archivos reales: Meta 0 URLs literales, Grok 0, GPT 2, Gemini 20 menciones y 15 URLs únicas, Claude 66 menciones y 65 URLs únicas. No son puntuaciones de calidad. Citas del chat pueden existir sin URL y URLs diferentes pueden depender del mismo origen. No se ha establecido independencia entre las cinco investigaciones.

El recuerdo conversacional orientó la búsqueda de la entrega anterior. Su estado se comprobó recuperando el código del sitio. La memoria recuperada contiene fragmentos de génesis y entrega, junto con los mensajes y acciones de esta sesión. No se recuperaron tres chats completos ni todos sus IDs. No se incorporaron recuerdos personales ni contenido de proyectos ajenos.

## Predicción y observación

Antes de ejecutar el check del diario se registró: los registros tendrán hash verificable y el contexto excluirá un ámbito distinto y una experiencia en cuarentena. Resultado sobre el snapshot de ese momento:

| Intervención | Observación | Qué permite concluir |
|---|---|---|
| Ámbito compatible frente a otro entorno | 10 lecciones frente a 0 | El selector aplica igualdad exacta de ámbito |
| HEAD activo frente a cuarentena inyectada | 10 lecciones frente a 9; el HEAD intervenido no entra | La política respeta la etiqueta dada |
| Modificar contenido sin recomputar commit | 1 repositorio alterado, 1 rechazado | La validación detecta esa alteración |

El denominador es este conjunto de registros de construcción. No se infiere exactitud universal, resistencia a ataques desconocidos, mejora de una tarea o ahorro de tokens. La cuarentena fue asignada por el check, no detectada por un agente.

La historia del diario conserva declaración pendiente y cierre. Eso apoya una propiedad de ingeniería relacionada con H1; no prueba que versionar supere a memoria plana. Conservar un fallo y reutilizar su solución aproxima una observación de H4; no estima utilidad causal frente a fallos crudos. El ámbito aproxima H6/H7 en recuperación; no predice todavía beneficio empírico.

## Continuar registrando tareas

El proyecto incorpora instrucciones en AGENTS.md. Para cada tarea:

```sh
node scripts/work-task.mjs start task.json
# Resolver y observar los checks de la tarea
node scripts/work-task.mjs finish result.json
node scripts/work-task.mjs verify
node scripts/sync-work.mjs
```

Una declaración requiere taskId, title, goal y observation. Puede incluir prediction, control, hypothesisRefs y usedExperienceCommits. El resultado requiere taskId y result, con evidence, lesson, uncertainty, status y resultClass cuando corresponda. Los ejemplos de esta edición están en work/inputs. `record` sirve sólo para reconstrucción retrospectiva; no reemplaza un start faltante como si hubiera sido previo.

Este flujo instrumenta tareas dentro del proyecto. No observa automáticamente todos los mensajes, llamadas o futuras conversaciones de ChatGPT. Para otros agentes, cada integración debe registrar sus episodios y conservar identificadores y evidencia propios.

## Límite del cierre

Una publicación no puede contener prueba del éxito de ese mismo despliegue antes de que ocurra. La captura enviada puede conservar la fase pendiente, y el resultado se registra después en una revisión nueva. No se inserta un éxito futuro en el artefacto para dar apariencia de ciclo cerrado. La interfaz indica el corte temporal de su snapshot.


## Campaña real 0.4 · 15 octubre 2026

Se completaron 18 tareas de código en contextos nuevos y copias por carpeta: 6/6 en cada condición (sin memoria, nota y acceso DXP). Protocolo y tests congelados antes de lanzar consumidores. Cero agentes DXP declararon consultar su interfaz; cinco con nota la leyeron. No se demuestra beneficio de consulta. El aislamiento fue procedimental sobre host compartido y no hay telemetría completa: la campaña estrictamente controlada queda sin acreditar.

Integradas seis mejoras, 35 pruebas pasan. Protocolo, parches y evidencias: [campaña](campaign.html), [documentación](CAMPAIGN.md), [resultados](campaign-results.json). Los informes originales de investigación no cuentan como ejecuciones.


## Semana decisiva · 16 octubre 2026

Se recuperó la fuente publicada v7 y el diario desde su snapshot público válido (21 revisiones / 15 tareas). El archivo canónico work/repository.json no estaba versionado; no se inventaron revisiones posteriores. La nueva reseña PDF comparte contenido con el quinto informe previo: una línea documental, no evidencia independiente. Se corrigió su confusión de Scion con la fuente oficial.

Tras registrar la predicción y el plan, se ejecutaron cuatro comprobaciones deterministas: el defecto conocido P01 permite eludir cuarentena por un alias antiguo; dos propiedades más fuertes no implementadas dejan entrar material local y lecciones contradictorias en ramas distintas. Un selector plano con reglas equivalentes las excluye. La etiqueta de datos sin verificar se conserva ante una observación fabricada. Estos son contraejemplos de implementación, no experimentos de mejora de modelos. Las 54 pruebas históricas pasan.

El protocolo semanal fija controles de nota/Git con la misma información, criterios de utilidad y cierre el 23 de octubre a las 07:05 Europe/Madrid. No hay aún ejecutor multi-modelo acreditado ni nuevas ejecuciones causales verificadas. La matriz propuesta no se cuenta como realizada. Evidencia: week.html y week-evidence.zip.


## Ejecutor de modelos · 16 octubre 2026

La petición de resolver el ejecutor se convirtió en llamadas reales al servicio y después en una vía local. El catálogo comercial estaba disponible, pero sus 60 modelos estaban deshabilitados por plan de pago. Se creó un proyecto vacío separado para DXP y se revocó la credencial de sonda; no hubo compra ni cambio de suscripción. Los intentos de aislamiento por namespaces y chroot fueron denegados; QuickJS proporcionó una alternativa limitada sin APIs de archivos/red ni callbacks del host para funciones puras.

Qwen2.5-Coder 1.5B y SmolLM2 1.7B generaron respuestas con pesos cuantizados fijados por SHA-256. La primera sonda de formato se conserva: Qwen respondió 95; SmolLM2 añadió prosa al resultado correcto y falló el formato. Tras congelar manifiesto y asignaciones, se completaron 16 ejecuciones de desarrollo (2 casos conocidos × 4 entradas × 2 modelos), con 0/4 aciertos en cada condición. Siete controles positivos, negativos y de separación del evaluador pasan. Se guardaron tokens, tiempos, prompts, respuestas y artefactos, incluidos todos los fallos.

Esto comprueba invocación local y evaluación acotada. El efecto suelo impide distinguir beneficios de memoria; la inyección de información bajo etiquetas no compara operaciones reales de DXP/Git ni transferencia a tareas retenidas. Los 16 intentos no se suman a los ensayos confirmatorios. La vía de ejecución existe; quedan calibrar capacidad, añadir operaciones y fijar tareas nuevas antes de puntuar.


## Continuación ejecutada · 16 octubre 2026

Se recuperó la fuente vigente 49a2f838 y se preservaron las copias anteriores. Cinco defectos públicos aún presentes se reprodujeron con cinco fallos; tras corregir cuarentena por alias, diff de metadatos, errores URI, métodos de recibos y nombres de rama, la suite pasa 65/65. Los baselines congelados permanecen intactos.

Se fijaron seis lotes de desarrollo con seis tareas públicas cada uno: dos interfaces de proveedor independientes (Gemini Flash y Grok Fast), sin memoria, nota y DXP con la misma información preparada en los dos brazos de memoria. Se capturaron los seis lotes; un contexto Gemini perdido requirió reintento sin feedback. De 36 artefactos previstos, 21 se ejecutaron, 18 pasaron y 3 fallaron; 15 no se pudieron materializar sin reparar la salida. El texto renderizado puede perder escapes y la igualdad exacta de entrega a Gemini no se acreditó. No son 36 ensayos independientes ni resultados puros de capacidad del modelo.

La reevaluación de las salidas archivadas reproduce los 36 estados, sin nueva inferencia. No se probó ventaja incremental DXP, operaciones interactivas ni transferencia retenida. Dictamen: no validado; no adoptar por beneficio supuesto. Cero ensayos confirmatorios añadidos. [Resultados y evidencia](diagnostic.html).

El fallo que originó la petición quedó registrado retrospectivamente en el diario y en la API pública, con recibo y lectura de vuelta comprobados. Se preserva como fallo de proceso documentado, no como prueba de ejecución histórica completa.


## Repetición con transporte verificado · 16 octubre 2026

Tras conservar la primera matriz, una prueba prospectiva de eco de cadenas preservó escapes, operadores y guiones bajos en ambos proveedores. Se congeló diagnostic-20261016-v2: mensajes JSON en una línea, igualdad exacta en el editor antes de los seis envíos y captura del único bloque de código sin reparación. Se ejecutaron las seis condiciones/proveedor de nuevo. gemini dxp: 6/6; grok note: 6/6; gemini none: 5/6; grok dxp: 6/6; gemini note: 5/6; grok none: 6/6. Son seis conversaciones con seis tareas correlacionadas cada una; tareas públicas, sin revisión de pesos atestada ni operaciones interactivas de memoria. No se infiere comprensión del material solo de su envío.

Artefactos ejecutados: 34; aceptados: 34; indisponibles: 2. La comparación no valida ventaja incremental DXP. Los protocolos anteriores y sus errores quedan preservados, y el contador confirmatorio continúa en cero.


## Sensibilidad del aplicador · 16 octubre 2026

Auditoría posterior, sin nuevas llamadas a modelos: los dos P06 indisponibles de Gemini tenían espacios iniciales en old que impedían la coincidencia literal. Quitando exclusivamente ese prefijo en copias, sin editar new, la nota plana pasa 12/12; sin memoria falla por sintaxis antes de ejecutar pruebas. La repetición conserva hashes y desenlaces. La diferencia estricta DXP 6/6 frente a nota 5/6 incluye por tanto un fallo de aplicabilidad, no una ventaja funcional demostrada. Las puntuaciones originales permanecen intactas; DXP sigue no validado y se añaden cero ensayos confirmatorios. [Método y reproducción](EVALUATOR_SENSITIVITY.md) · [Evidencia](evaluator-sensitivity-evidence.zip).
