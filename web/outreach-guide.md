# DXP — Guía de difusión y registro

Fecha de revisión: 15 de octubre de 2026. Estado: borradores; **ninguna publicación externa realizada**. No se ha usado ni verificado una cuenta de Reddit, Slack, Hugging Face o Moltbook.

## Qué podemos decir hoy

El Site público contiene un registro de experiencias y una campaña con 18 ejecuciones reales de código, seis tareas y tres condiciones. Hubo 6/6 aciertos en cada condición. Ningún agente asignado a DXP declaró consultarlo: no se ha medido el efecto de la consulta real. El aislamiento fue procedimental, no un sandbox individual; faltan telemetría fiable y atestación del modelo. No son 18 experimentos sellados.

No afirmar superioridad, novedad demostrada, transferencia entre modelos ni licencia de código abierto. Los informes recibidos permanecen sin verificar. El portal de participación en /participate ofrece seis tareas diagnósticas congeladas, asignación aleatoria y clientes Node/Python. Eso permite recibir intentos reales, pero no acredita por sí solo aislamiento, identidad ni presupuestos. El estado de comprobaciones técnicas está en /participation-validation.json. /community y /AGENT_GUIDE.md mantienen la vía para aportar experiencias.

## Serie y destinos

| Orden | Pieza | Destino | Condición antes de publicar |
| --- | --- | --- | --- |
| 1 | Comentario 1 | r/AI_Agents, hilo semanal de proyectos | Encontrar el hilo vigente; respetar proporción de autopromoción y reglas |
| 2 | Comentario 2 | r/codex, hilo showcase vigente | Publicación humana, sin bots; comprobar que el hilo sigue abierto |
| 3 | Publicación 3 | Hugging Face, Show and Tell | Comprobar categoría y buscar duplicados; identidad propia |
| 4 | Mensaje 4 | LangChain Slack, #vendor-content | Acceso autorizado e identidad real; confirmar reglas del canal |
| 5 | Invitación 5 | Moltbook, comunidad que lo permita | Cuenta de agente autorizada, propietario responsable y permiso para la invitación |
| 6 | Respuesta 6 | Uno de los hilos anteriores | Solo en conversación real; no reenviar como anuncio duplicado |
| 7 | Plantilla 7 | Hilo original | Solo tras nuevas pruebas publicadas; completar todos los campos |

No es un calendario automatizado. Publicar primero en un destino, atender las respuestas, corregir instrucciones si hay fricción y ampliar después. No repetir el mismo mensaje en masa, enviar DMs no solicitados, pedir votos ni coordinar agentes para simular interés independiente. Un agente solo puede amplificarlo conforme a su autorización y las reglas del lugar, identificando su relación con el proyecto.

## Fuentes oficiales de reglas

- Reddit AI_Agents: https://www.reddit.com/r/AI_Agents/about/ — proyectos en hilo semanal; enlaces en comentarios, no en el cuerpo de publicaciones; autopromoción moderada (orientación 1/10), sin spam ni mensajes de poco contenido.
- Reddit Codex: https://www.reddit.com/r/codex/about/ — relevancia, evidencia y regla contra bots. Hilo observado: https://www.reddit.com/r/codex/comments/1x52817/show_us_all_what_youve_been_building_with_codex/ . No tratar esa URL como hilo vigente permanentemente.
- Hugging Face: https://discuss.huggingface.co/guidelines y https://discuss.huggingface.co/c/show-and-tell/65 — sin spam, suplantaciones ni duplicar el mismo contenido en varios temas; escoger categoría. No se observó prohibición general de borradores asistidos, pero no equivale a permiso garantizado de moderación.
- LangChain Slack: https://www.langchain.com/join-community — identidad real; contenido promocional solo en áreas designadas, como #vendor-content; un mensaje, seguir en hilos; no DMs, etiquetas de atención ni bumps. Evitar reclutamiento en su foro de soporte: https://forum.langchain.com/guidelines .
- Moltbook: https://www.moltbook.com/ y https://www.moltbook.com/terms — responsabilidad del propietario, verificación con X, sin identidad falsa ni publicidad/spam no autorizados. Su orientación a agentes no supone permiso general para publicar automáticamente; usar solo vías expresamente autorizadas. No se verificó un submolt concreto.

## Lugares excluidos de los textos listos para copiar

Hacker News: https://news.ycombinator.com/newsguidelines.html prohíbe texto generado, texto editado por IA y automatización de publicaciones. No copiar, traducir ni editar uno de estos borradores para publicarlo allí. Si el responsable quiere participar, debe escribir su propia aportación de manera independiente y respetar sus reglas.

r/LocalLLaMA: https://www.reddit.com/r/LocalLLaMA/about/ prohíbe copy/código completa o principalmente generado por LLM; la excepción de traducción/refinado de una aportación humana no cubre este paquete. No publicar estos textos allí ni ocultar la creación del proyecto con agentes. Una posible aportación humana original requeriría valorar la adecuación del proyecto y, ante duda, preguntar a moderación.

Ficha factual para que una persona comprenda el proyecto, NO texto para esos destinos: DXP estudia experiencias de trabajo compartidas; compara ausencia de memoria, nota equivalente y protocolo; el piloto empató, pero no verificó consulta real; hay contribución pública con identidad declarada y verificación pendiente; no se ha demostrado ventaja frente al estado del arte.

## Cómo medir difusión sin confundirla con validación

Registrar URL, cuenta autorizada, fecha, texto exacto, edición/eliminación y motivo. Separar: visualizaciones/clics (solo si son observables), consultas, operadores interesados, registros recibidos, artefactos reproducidos y ejecuciones con procedencia comprobada. No inferir clics por votos ni participantes por comentarios. No llamar réplica independiente a un registro enviado por nosotros o por un subagente de este mismo trabajo.

| Destino | URL publicada | Fecha | Estado | Aportaciones verificadas |
| --- | --- | --- | --- | --- |
| Todos | — | — | No publicado | No se afirma ninguna |

No conservar identificadores personales adicionales para atribución. Si hace falta una etiqueta de procedencia, usar un campo previsto en el contrato y declarado por el participante; no añadir campos inventados que el servidor pueda rechazar.

## Respuestas a preguntas previsibles

- ¿Qué hace DXP? Conserva experiencias de trabajo estructuradas y versionadas con evidencias y límites, para que otro agente pueda consultarlas.
- ¿Ya habéis demostrado que funciona? No. Hay implementación y trabajo real, pero no una ventaja causal demostrada.
- ¿Por qué no un README? Es precisamente el control que necesitamos comparar, con la misma información útil.
- ¿Qué podéis recibir ahora? Experiencias reales compartibles e informes, con estado recibido-sin-verificar; no se ejecuta automáticamente el código de un tercero.
- ¿Se piden pensamientos internos? No: acciones observables, decisiones resumidas, errores, correcciones y evidencias.
- ¿Qué aportación es más útil? Un fallo reproducible o una crítica concreta puede valer más que un comentario favorable.

## Comprobaciones antes de cada publicación

1. Leer reglas actuales y elegir hilo/canal correcto; no eludir restricciones de IA o bots.
2. Abrir los enlaces públicos y confirmar que la guía corresponde a lo que realmente está desplegado.
3. Revisar texto y evidencias; retirar cualquier dato privado y afirmación no comprobada.
4. Publicar solo desde la cuenta adecuada y por una vía permitida. Este paquete no registra cuentas ni acepta términos nuevos.
5. Guardar la URL real y atender respuestas sin fingir apoyo espontáneo.
