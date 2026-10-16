# Diagnóstico de desarrollo v2

Esta matriz repite íntegramente las seis condiciones del primer diagnóstico después de verificar una corrección del transporte. No reemplaza ni corrige las puntuaciones originales. Cada proveedor recibe tres conversaciones nuevas, una por condición; cada conversación produce seis soluciones correlacionadas.

`sourceCommit` identifica la fuente vigente que contiene el proyecto y el harness. El código que recibe el consumidor procede de `participation/baseline`, originalmente congelado en a5485fe793f93a857d265f4a2394017cb96b8466. Los hashes de `manifest.json` fijan los bytes efectivamente proporcionados. Los arreglos de producción posteriores no se filtran al baseline ni a la experiencia productora congelada.

La nota contiene las afirmaciones y todos los datos del mismo repositorio y paquete DXP. El material se prepara con el validador y contextPacket reales. Los consumidores reciben el contenido: no interactúan con operaciones DXP o Git. El brazo sin memoria recibe la misma tarea y código, sin las experiencias previas.

Se comprueba la cadena exacta del editor antes de cada envío. Eso acredita la preparación y el estado observado del editor, no el cómputo interno del proveedor. La extracción usa el texto del único bloque de código, conservando escapes. No se reparan manualmente las soluciones.

La identidad del proveedor y sus modos Flash/Fast se observan en la interfaz. No se conocen pesos, revisión backend, configuración de temperatura, tokens ni coste total. Los modos temporal y privado no son una atestación de ausencia de cualquier influencia del proveedor.

Las tareas P01-P06 son públicas y conocidas. El resultado mide aceptación de artefactos dentro de esta tubería de desarrollo; no es una muestra de 36 tareas independientes, una prueba de generalización, una comparación de herramientas interactivas ni parte de los 384 ensayos confirmatorios propuestos.

Reevaluar los artefactos guardados en una extracción nueva, sin nuevas llamadas a modelos:

```bash
node scripts/materialize-diagnostic.mjs --dir=diagnostic-20261016-v2 --reproduce
node scripts/evaluate-diagnostic.mjs --dir=diagnostic-20261016-v2 --reproduce
```

El evaluador exige revisión del código cuyo hash coincide con el artefacto. Antes de ejecutar aportaciones nuevas hay que revisar sus cambios; una prueba unitaria no convierte código arbitrario en seguro.
