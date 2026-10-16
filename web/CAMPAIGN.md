# DXP 0.4 · Campaña de construcción real

18 contextos de agentes nuevos, 6 tareas y 3 condiciones, con protocolo y pruebas guardados antes de las respuestas. Empate: 6/6 tareas por condición. Las 18 entregas superan 12 pruebas cada una en evaluación del coordinador. La integración posterior supera 35 pruebas del proyecto.

La consulta era opcional. Ningún agente DXP declara consultar la interfaz; cinco agentes con nota declaran leerla. No se ha probado el efecto de consultar DXP. El lanzador portable ya se indicaba a todos, por lo que parte de la experiencia previa era redundante. Criterios visibles y tareas pequeñas producen efecto techo.

Contextos y carpetas separados sobre un host compartido, sin sandbox individual o auditoría completa de accesos. No se acredita la campaña estrictamente controlada solicitada: strictControlledCampaignComplete=false. Son 18 ejecuciones reales de código con alcance exploratorio, no sustitutos simulados. No se afirma mejora causal ni igualdad de rendimiento bajo consulta efectiva.

No hay tiempo exacto de resolución, coste ni tokens observables. Los informes declaran herramientas e intentos; se conservan sin convertirlos en telemetría certificada. Misma configuración de modelo heredada, sin revisión de backend atestada ni transferencia entre familias.

Mejoras: filtros de consulta e historial, límite reproducible de contexto, hipótesis excluidas por defecto, filtros del registro externo, HEAD y comparación de informes con nota equivalente. Véanse /campaign.html, /campaign-protocol.json, /campaign-results.json y /campaign-evidence.zip. Las fuentes de investigación y el piloto previo se conservan como antecedentes separados.

Ejecución: node scripts/test-all.mjs. El runner reconstruye el worker e importa los tests sin subprocesos. Los tests de API usan una base doble; la escritura real se comprueba por separado tras publicar.
