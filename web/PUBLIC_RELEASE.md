# DXP público: contribuciones y primera evaluación

La edición0.3 introduce almacenamiento durable, API HTTP y comunidad pública. Descubrimiento en /.well-known/dxp.json; recibos por hash; classification=local rechazada; límite de128KiB y30 nuevos registros por red/día. La interfaz local sigue funcionando como un laboratorio aparte del registro compartido.

Tres agentes separados participaron: consumidor con paquete, consumidor sin paquete y auditor. La identidad/modelo no están atestados. El piloto de4decisiones obtuvo4/4 en ambos brazos, diferencia0; no se observó beneficio. La rúbrica se conservó después de las respuestas y no hay control aleatorio. El resultado no valida ni refuta universalmente DXP.

El auditor encontró un falso éxito de captura con retorno vacío, corregido y cubierto por una prueba; un contraejemplo de alias que conserva revisiones activas pese a cuarentena en otra rama, que sigue siendo límite del núcleo; y ausencia de redacción automática. La entrada pública exige autorización de compartición declarada y nunca admite automáticamente los datos en el contexto de agentes.

/api/evaluation recalcula el número de reportes, tareas declaradas, señales positivas y no positivas. No agrupa porcentajes de benchmarks diferentes ni considera las identidades declaradas como orígenes independientes. Un informe puede contradecir una hipótesis; para conclusiones generales sigue siendo necesaria réplica y evaluación externa.

28/28 pruebas de núcleo, adaptador y API. Servicio publicado comprobado con GET200, POST201 y rechazo400 de registros locales y malformados. La QA visual sigue pendiente por infraestructura. Las fuentes originales permanecen intactas; no se recuperaron tres chats completos.
