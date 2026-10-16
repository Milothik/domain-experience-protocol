# DXP · Guion para presentar Experience Atlas

Duración: 5–7 minutos. Material: navegador con DXP_Atlas.html o aplicación alojada. Puedes usar el modo de presentación para la introducción y regresar a navegación con Esc.

## 1. Una solución tiene historia

«Cuando un agente termina una tarea, solemos conservar el resultado. El código, el informe o la respuesta. Pero durante la tarea ocurrió algo más: observó condiciones, eligió entre alternativas, falló, corrigió un supuesto y cambió de estrategia. Ese camino puede importar tanto como la llegada.»

«DXP — Domain Experience Protocol — plantea una pregunta: ¿podemos convertir esa experiencia en un objeto que otros agentes puedan examinar, versionar y reutilizar sin asumir ciegamente que sigue siendo válido?»

## 2. El fallo no desaparece

Abrir Atlas → «La intuición: más workers, menos espera» → Trayectoria.

«En este ejemplo inventado, el agente interpreta que solicitudes independientes pueden ejecutarse en paralelo. Prueba veinte workers. El proveedor devuelve rate limiting. La experiencia conserva la decisión y el supuesto que no se había comprobado.»

Abrir «La corrección» → Evidencia → Historia.

«La revisión siguiente limita a cuatro. El primer intento permanece. Otro agente puede consultar el error sin pagar otra vez esa exploración. El hash verifica integridad del registro; no demuestra que los hechos sean verdaderos.»

## 3. Dos agentes pueden tener razón

Comparar → seleccionar Basic y Pro.

«Cuatro workers funcionan en Basic. Doce funcionan en Pro. Convertir ambos ejemplos en una única regla perdería el contexto. Aquí vemos la diferencia de ámbito antes de integrar.»

Integrar con nota: «Conservar las dos lecciones condicionadas al plan; revalidar al cambiar el servicio».

«La integración crea otro commit y conserva sus dos padres. No vota por una conclusión. No afirma haber vuelto a ejecutar la tarea. Mantiene las condiciones para que un consumidor pueda decidir.»

## 4. El mundo cambia

Laboratorio → ejecutar con semilla 17 → activar v3 desconocida → ejecutar.

«Este experimento usa funciones deterministas, no modelos. Su propósito es hacer visible la mecánica. El pool simple reutiliza una cifra fuera de su contexto. El selector DXP exige ámbito exacto y una etiqueta confiable dada por el simulador. Si no hay experiencia para v3, se abstiene.»

«Por eso no presento el porcentaje como validación científica. La prueba importante vendrá cuando modelos reales produzcan y consuman experiencias en tareas nuevas, con baselines fuertes y sin oráculos de confianza.»

## 5. Del prototipo al programa científico

Protocolo → mostrar hipótesis y fuentes.

«DXP tiene antecedentes: reflexión, aprendizaje experiencial, repositorios y procedencia. Su aportación candidata es reunir el objeto de experiencia, el ámbito, la historia y la interoperabilidad en un contrato cuyo valor podamos poner a prueba.»

«Hoy podemos registrar, ramificar, comparar, integrar, revertir e intercambiar experiencias. Todavía no hemos demostrado transferencia útil entre modelos, seguridad de memoria compartida ni originalidad completa. El proyecto empieza precisamente donde esas preguntas se vuelven medibles.»

## Preguntas previsibles

**¿Es Git para agentes?** Es una analogía operativa. Git puede guardar JSON; DXP añade semántica de experiencia y condiciones de aplicación. No presupone que Git esté obsoleto.

**¿Captura cadenas de pensamiento?** Registra decisiones y razones resumidas externalizadas, acciones y resultados. No accede a razonamiento interno ni acredita que una explicación sea causalmente fiel.


**¿Cómo puedo usarlo hoy?** Registrar una experiencia propia, revisar condiciones, exportar JSON e importarlo en otro entorno. El kit incluye una CLI y un módulo sin dependencias para instrumentar un proyecto.

**¿Por qué conservar errores?** Porque pueden delimitar condiciones que una solución final oculta. Si mejoran las tareas futuras es una hipótesis que debe medirse, no una promesa universal.

**¿Qué sería un fracaso productivo?** Que DXP reduzca contexto pero no mejore éxito; que un filtro por recencia sea igual de útil; o que conservar fallos confunda. Registrar ese resultado también sería trabajo DXP.


## Añadido: el Atlas documenta su propia corrección

En Atlas, abrir «Una corrección también necesita evidencia» y «La fuente original corrige al informe». Son dos revisiones de una comprobación realmente realizada durante esta continuación. El informe S5 descartaba un proyecto cuya fuente oficial no había consultado. La revisión posterior conserva el antecedente y documenta el contraste. Este ejemplo prueba el registro de una corrección documental, no una mejora de inteligencia.


## DCE: mostrar el origen y la primera integración

Abrir DCE → consultar el repositorio → recorrer las siete responsabilidades → inspeccionar Productor, Consumidor y Fallo y recuperación.

«DCE convierte conocimiento del proyecto en contexto de una tarea. DXP conserva la experiencia de esa ejecución. Hemos ejecutado el motor real con datos públicos de ejemplo, registrado su contexto y salida, e introducido una experiencia revisada en otro contexto. El fallo de continuidad muestra que podemos conservar la salida sin volver a generar. Es compatibilidad comprobada, todavía no mejora de inteligencia.»

Descargar los registros o añadirlos al Atlas, abrir Evidencia e Historia. Mostrar CLAUDE_REVIEW.md para explicar qué crítica se adoptó y qué conclusiones se corrigieron con originales.
