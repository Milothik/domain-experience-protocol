# Registro real de cierre de participación
Fecha: 2026-10-15. Tipo: trabajo de ingeniería; no ensayo de utilidad.

Se recuperaron los cambios del entorno Windows y se integraron sobre la versión publicada 5 sin sobrescribir los borradores de difusión. Se mantuvieron idénticos protocolo, snapshot y código inicial. Se publicaron API, página, clientes y evidencias en la versión 6.

Una revisión separada detectó dos defectos: el encargo pedía campos que los clientes rechazaban, y el evaluador antiguo sumaba ilustraciones. Se corrigieron; P06 pasó su lógica de aceptación congelada en producción. Esa corrección no es una ejecución comparativa y deja su solución pública.

Pruebas: 54 aprobadas, 0 fallos; archivos tests/participation*.test.mjs, tests/illustrative-reports.test.mjs y participation/evidence/tests-integration.tap. Paquetes auditados sin rutas de usuario ni referencias excluidas.

HTTP público: Node completó el registro. Python recibió primero 403/error1010 con su identificación urllib predeterminada. Una identificación veraz DXP-Participation/0.1 (Python stdlib) funcionó; no se suplantó navegador ni se cambiaron políticas de acceso. Ambos clientes completaron el flujo e intercambiaron sesiones. Se rechazaron solicitudes sin bearer, entregas sin material y recibos ajenos; los duplicados se deduplicaron. Evidencias originales y corregidas se conservan en participation-evidence.zip.

Las dos sesiones son conformance, modelo no invocado, tarea incomplete y parche vacío; ninguna se atribuye a un operador externo. El navegador mostró seis encargos, copia de P01 confirmada, evaluación 0 y técnica 2. No se hizo revisión visual por capturas.

Límites: sin sandbox privado por subagente, sin atestación de modelo/presupuesto y sin nueva comparación causal completada. Dictamen: intercambio usable en lo probado; utilidad y superioridad abiertas; no justificar adopción por beneficio supuesto.
