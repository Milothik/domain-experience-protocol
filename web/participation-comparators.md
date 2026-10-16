# Qué tendría que superar DXP
Revisión de fuentes primarias: 15 octubre 2026. Esta tabla es un mapa de comparadores, no una evaluación de rendimiento.

| Control o sistema | Capacidad documentada o comprobada | Comparación directa con DXP |
| --- | --- | --- |
| Nota equivalente | Mismo contenido y procedencia del snapshot congelado, entregados como nota y apéndice legible. | Campaña anterior: acceso opcional, empate y cero consultas DXP declaradas; efecto de consulta sin demostrar. Nueva convocatoria pendiente de ensayos verificados. |
| Nota en Git | Versionar el archivo y conservar su historia con herramientas normales. | Pendiente; no se sustituye por una política sintética deliberadamente débil. |
| AXTP | Su documentación propone registros estructurados de experiencia y operaciones de depósito, recuperación y validación. | Implementación y versión deberán fijarse y ejecutarse en una comparación equivalente. Sus afirmaciones comerciales no se toman como resultados propios de DXP. |
| Letta | Documenta repositorios compartidos en Git para agentes alojados en su nube. | Pendiente con configuración y acceso adecuados; no se ha ejecutado desde este proyecto. |
| Mem0 | Documenta operaciones de memoria y controles de recuperación por metadatos. | Pendiente; la ruta de plataforma documentada requiere una cuenta y credenciales propias. No se han supuesto disponibles. |

Fuentes:
- AXTP, documentación del proyecto: https://axtp.dev/ y https://github.com/edwrdsr/axtp
- Letta, Shared memory: https://docs.letta.com/concepts/shared-memory
- Mem0, Advanced Memory Operations: https://docs.mem0.ai/platform/advanced-memory-operations

DXP no puede reivindicar novedad por almacenar experiencias, compartir memoria o usar Git. El objeto de prueba es una ventaja medible de su contrato, selección por ámbito, historial y mecanismos de revisión frente a alternativas con información y presupuesto comparables. Una firma, un hash o un formato válido no certifican verdad ni mejor rendimiento.

## Criterios de decisión
1. **Usable en los casos probados:** los clientes JavaScript y Python completan el flujo, intercambian sesiones y rechazan recibos/integridad/autenticación incorrectos; las regresiones pasan.
2. **Adopción local:** antes de adoptarlo, repetir los seis problemas por condición en al menos dos configuraciones de modelo. El umbral provisional es al menos una tarea adicional resuelta frente a la nota por configuración, sin regresiones adicionales. Es una regla de decisión de ingeniería fijada antes de las respuestas, no significación estadística.
3. **Rechazo de la ventaja local:** si en ambas configuraciones no mejora aciertos y su coste total observado es igual o peor, rechazar la ventaja propuesta para ese contexto. Sin costes fiables o procedencia acreditada, el resultado queda inconcluso.
4. **Estado del arte:** hacen falta ejecuciones directas, versiones fijadas y tareas nuevas más amplias contra las implementaciones relevantes. Esta convocatoria no está completada por abrir una página o recibir JSON.
5. **Descartar totalmente:** ningún conjunto finito de estas pruebas permite demostrar que toda forma posible de DXP sea inútil. Podemos descartar esta implementación, un uso o una hipótesis concreta.

Las seis tareas publicadas son diagnósticas. Sus futuras soluciones dejan de ser material retenido. Para una confirmación posterior habrá que congelar nuevas tareas y un evaluador independiente.
