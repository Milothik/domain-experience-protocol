# Sensibilidad del aplicador · 16 octubre 2026

Auditoría de ingeniería posterior a los resultados. Cero llamadas nuevas a modelos y cero ensayos confirmatorios. Conserva todas las respuestas y puntuaciones originales de diagnostic-20261016-v2.

El aplicador original exige una coincidencia literal única de `old`. Los dos P06 no materializados de Gemini tenían cero coincidencias. Se registró la predicción antes de esta intervención acotada: eliminar exclusivamente espacios/tabulaciones al comienzo de `old`, sin tocar su interior ni el texto `new`. La selección de estos dos casos fue posterior a conocer la matriz; no es un análisis confirmatorio preregistrado.

| Artefacto | Condición | Prefijo eliminado de old | Coincidencias tras ajuste | Resultado de aceptación congelada |
| --- | --- | --- | --- | --- |
| B3/P06 | Sin memoria | 3 espacios | 1 | Error de sintaxis; salida 1, ninguna prueba ejecutada |
| B5/P06 | Nota plana | 2 espacios | 1 | 12 pruebas pasan, 0 fallan |

Ambos `new` permanecen idénticos a las respuestas archivadas. Se revisó el código antes de ejecutarlo y se comprobaron hashes del resto del baseline, de la aceptación y de los archivos originales. En B3, Node rechaza `export` por la estructura de llaves del parche; no se contabiliza como cero aciertos sobre doce pruebas ejecutadas. Una repetición en copias nuevas reproduce los hashes y ambos desenlaces.

La diferencia original de entregabilidad Gemini DXP 6/6 frente a nota 5/6 incluye un fallo de anclaje. El parche de nota funciona bajo este ajuste acotado. Esa diferencia no aporta una demostración de ventaja funcional DXP frente a nota. Tampoco demuestra equivalencia general ni refuta DXP. La clasificación sigue siendo **no validado**. Las puntuaciones estrictas originales no cambian.

Reproducción desde el kit extraído, con Node y sin red ni instalación:

```text
node scripts/replay-evaluator-sensitivity.mjs
```

El comando crea copias temporales, aplica la misma transformación, comprueba la revisión por hash, ejecuta la aceptación original y compara los resultados con los archivados. Escribe `replay.json`; no modifica las respuestas ni los resultados originales. Los TAP públicos sustituyen rutas absolutas por `<workspace>`; los hashes `logSha256` de evaluation.json corresponden a los logs locales originales anteriores a esa sustitución.
