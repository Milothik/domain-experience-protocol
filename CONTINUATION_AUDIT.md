# Auditoría de continuación · 16 octubre 2026

Fuente vigente recuperada del repositorio de Sites: 49a2f838ce32bc0267a35c384a37182bc0e2f09d. Las copias dxp-experience-atlas y dxp-release contienen trabajo previo y se preservan.

Arquitectura: núcleo ESM sin dependencias, Worker que inserta núcleo y activos en build, D1 para recepción pública y participación, diario DXP content-addressed. DCE permanece separado. Los informes suministrados y CLAUDE_REVIEW/RESEARCH_AUDIT aportan hipótesis y límites, no ensayos de modelos.

Deuda comprobada: múltiples checkouts de distinto estado pueden producir diagnósticos obsoletos; la campaña histórica tiene techo 6/6 y ausencia de consulta DXP; el piloto local tiene suelo 0/16. Los diagnósticos públicos P01-P05 aún permiten probar errores conocidos. La versión vigente ya excluye ilustraciones de las cuentas de ejecución.

Escala: el Worker embebe todos los activos y el paquete descargable, consulta ventanas limitadas de 50/500/1000 registros, y el núcleo busca commits en arrays. No equivalen a paginación completa, aislamiento de consumidores, autenticación del productor ni verificación factual. No emprender una migración de almacenamiento antes de medir volumen y carga.

Mejoras propuestas antes de implementar: fijar el commit fuente, registrar ejecución real sin historial y con controles de igual información; mantener errores y telemetría; ejecutar regresiones congeladas antes de corregir defectos; publicar evidencia con alcance diagnóstico explícito. Separar utilidad de modelos, conformidad del software y procedencia. La semana confirmatoria de 384 ensayos permanece un programa distinto y no se incrementa con este diagnóstico.


## Repetición con transporte verificado · 16 octubre 2026

Tras conservar la primera matriz, una prueba prospectiva de eco de cadenas preservó escapes, operadores y guiones bajos en ambos proveedores. Se congeló diagnostic-20261016-v2: mensajes JSON en una línea, igualdad exacta en el editor antes de los seis envíos y captura del único bloque de código sin reparación. Se ejecutaron las seis condiciones/proveedor de nuevo. gemini dxp: 6/6; grok note: 6/6; gemini none: 5/6; grok dxp: 6/6; gemini note: 5/6; grok none: 6/6. Son seis conversaciones con seis tareas correlacionadas cada una; tareas públicas, sin revisión de pesos atestada ni operaciones interactivas de memoria. No se infiere comprensión del material solo de su envío.

Artefactos ejecutados: 34; aceptados: 34; indisponibles: 2. La comparación no valida ventaja incremental DXP. Los protocolos anteriores y sus errores quedan preservados, y el contador confirmatorio continúa en cero.


## Sensibilidad del aplicador · 16 octubre 2026

Auditoría posterior, sin nuevas llamadas a modelos: los dos P06 indisponibles de Gemini tenían espacios iniciales en old que impedían la coincidencia literal. Quitando exclusivamente ese prefijo en copias, sin editar new, la nota plana pasa 12/12; sin memoria falla por sintaxis antes de ejecutar pruebas. La repetición conserva hashes y desenlaces. La diferencia estricta DXP 6/6 frente a nota 5/6 incluye por tanto un fallo de aplicabilidad, no una ventaja funcional demostrada. Las puntuaciones originales permanecen intactas; DXP sigue no validado y se añaden cero ensayos confirmatorios. [Método y reproducción](EVALUATOR_SENSITIVITY.md) · [Evidencia](evaluator-sensitivity-evidence.zip).
