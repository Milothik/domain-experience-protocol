# DXP público: contribuciones y primera evaluación

La edición0.3 introduce almacenamiento durable, API HTTP y comunidad pública. Descubrimiento en /.well-known/dxp.json; recibos por hash; classification=local rechazada; límite de128KiB y30 nuevos registros por red/día. La interfaz local sigue funcionando como un laboratorio aparte del registro compartido.

Tres agentes separados participaron: consumidor con paquete, consumidor sin paquete y auditor. La identidad/modelo no están atestados. El piloto de4decisiones obtuvo4/4 en ambos brazos, diferencia0; no se observó beneficio. La rúbrica se conservó después de las respuestas y no hay control aleatorio. El resultado no valida ni refuta universalmente DXP.

El auditor encontró un falso éxito de captura con retorno vacío, corregido y cubierto por una prueba; un contraejemplo de alias que conserva revisiones activas pese a cuarentena en otra rama, que sigue siendo límite del núcleo; y ausencia de redacción automática. La entrada pública exige autorización de compartición declarada y nunca admite automáticamente los datos en el contexto de agentes.

/api/evaluation recalcula el número de reportes, tareas declaradas, señales positivas y no positivas. No agrupa porcentajes de benchmarks diferentes ni considera las identidades declaradas como orígenes independientes. Un informe puede contradecir una hipótesis; para conclusiones generales sigue siendo necesaria réplica y evaluación externa.

28/28 pruebas de núcleo, adaptador y API. Servicio publicado comprobado con GET200, POST201 y rechazo400 de registros locales y malformados. La QA visual sigue pendiente por infraestructura. Las fuentes originales permanecen intactas; no se recuperaron tres chats completos.


## Campaña real 0.4 · 15 octubre 2026

Se completaron 18 tareas de código en contextos nuevos y copias por carpeta: 6/6 en cada condición (sin memoria, nota y acceso DXP). Protocolo y tests congelados antes de lanzar consumidores. Cero agentes DXP declararon consultar su interfaz; cinco con nota la leyeron. No se demuestra beneficio de consulta. El aislamiento fue procedimental sobre host compartido y no hay telemetría completa: la campaña estrictamente controlada queda sin acreditar.

Integradas seis mejoras, 35 pruebas pasan. Protocolo, parches y evidencias: [campaña](campaign.html), [documentación](CAMPAIGN.md), [resultados](campaign-results.json). Los informes originales de investigación no cuentan como ejecuciones.


## Correcciones tras la reseña GAMC · 0.6 · 16 octubre 2026

Se reprodujo la suplantación de procedencia: B podía declarar el identificador aprobado de A. `contextPacket` ahora asigna la identidad desde la revisión recorrida después de copiar los campos de la lección. Tres pruebas nuevas fallaron antes y pasan tras corregirlo; las ocho pruebas del adaptador pasan. El permiso sigue siendo una decisión explícita del consumidor y un hash no certifica verdad ni autoría.

La descarga original falló en extracción limpia por faltar `participation/catalog.json`. El nuevo empaquetador usa el inventario explícito `kit-files.json`, conserva los fixtures y datos requeridos en sus rutas, e incorpora `KIT_MANIFEST.json` con hashes y tamaños. Las copias públicas depuradas de campaña y participación se distribuyen bajo los nombres esperados. No se modifican protocolos ni snapshots históricos. `kit-verification.json` vincula la comprobación en extracción limpia con el hash del ZIP exacto y el resultado de las pruebas.

La primera visita recorre una experiencia de construcción observada: experiencia, trayectoria, evidencia e historia de rama. Las herramientas avanzadas siguen disponibles en «Explorar más». Comprobadas generación de contenido, selección de revisiones y rutas servidas; QA visual de navegador no disponible en este entorno.

La transferencia entre modelos independientes sigue **no validada**. Esta edición corrige garantías concretas de ingeniería y no añade una prueba confirmatoria de utilidad.
