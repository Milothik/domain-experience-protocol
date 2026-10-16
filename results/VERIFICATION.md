# Verificación de DXP Atlas 0.2

15 de octubre de 2026. Resultados de ingeniería sobre esta edición; no validación científica de mejora de modelos.

- 22/22 pruebas del núcleo y adaptador DXP superadas; TAP en adapter-tests.tap.
- 41/41 pruebas de la revisión fijada de DCE superadas; TAP en dce-tests.tap.
- Build y benchmark offline DCE ejecutados.
- Tres casos DCE reales sobre fixtures sintéticos: productor, consumidor explícitamente revisado, StateCommitError con salida preservada y una generación.
- Ocho snapshots iniciales y un template conformes al vocabulario de JSON Schema.
- Diario con tareas reales, hash de fuentes, cobertura parcial de conversaciones, declaración previa y cierre conservados.
- Checks sobre el snapshot del diario: ámbito 10→0, cuarentena 10→9, alteración rechazada 1/1; dos revisiones de una tarea.
- JavaScript modular y embebido comprobado por sintaxis; servidor local HTTP 200.
- Navegador: verificación visual no completada por error de infraestructura al abrir la superficie. No se traslada la QA visual anterior a esta edición.

Las fechas del diario son de captura. La atribución de productores de investigaciones es declarada y no atestada. No se recuperaron tres exportaciones completas de chats. Los checks no prueban transferencia entre modelos, defensa ante ataques desconocidos ni ahorro causal.

## Public0.3

28/28 tests passed; public D1 reads and writes observed, malformed and local submissions refused. Three independent agent episodes stored, origins declared and transport attributed. Pilot score4/4 each arm: no improvement observed. The dynamic report evaluator does not authenticate sources or combine heterogeneous benchmarks into one success rate.
