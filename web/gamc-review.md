# Respuesta a la reseña GAMC · 16 octubre 2026

Fuente aportada: DXP_Experience_Atlas_Observaciones_GAMC_151026_v3.pdf, firmado GAMC 15.10.26. Su hash y el alcance de esta comprobación están en [gamc-review.json](gamc-review.json). Se ha contrastado con el código actual.

| Observación | Corrección y prueba |
|---|---|
| Una lección B puede declarar el identificador aprobado de A. | Reproducido con hashes válidos. La identidad se deriva ahora del commit de origen, fuera de los campos de la lección. Tres regresiones fallaban antes; pasan después. Adaptador: 8/8. |
| La descarga requiere reconstruir rutas. | Reproducido: faltaba participation/catalog.json. Inventario exacto, datos requeridos y manifiesto de hashes. [Comprobación del ZIP extraído](kit-verification.json). |
| Demasiadas opciones en la primera visita. | Nueva entrada guiada con un registro real, cuatro pasos y revisiones inspeccionables. Herramientas avanzadas en «Explorar más». QA de navegador pendiente. |
| La transferencia útil todavía no está demostrada. | Sigue no validada. Se conserva el protocolo de la semana y el piloto de desarrollo; ninguna de estas reparaciones se cuenta como confirmación científica. |

## Comprobar las correcciones

- [Antes de corregir procedencia](gamc-trust-before.tap): 5 pasan y 3 fallan.
- [Después de corregir procedencia](gamc-trust-after.tap): 8 pasan y 0 fallan.
- [Inventario público y hashes](kit-manifest.json).
- [Registro versionado de tareas](work-repository.json).
- [Descargar código, documentación y evidencia](kit.zip).

El hash establece integridad del contenido, no verdad, identidad externa ni autorización. La aprobación del consumidor se limita a la revisión indicada. Los resultados históricos conservan sus límites y no se modifican para hacer pasar la evaluación.
