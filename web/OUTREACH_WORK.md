# Registro de trabajo: campaña de participación

Tipo: trabajo real de preparación y comprobación; no ejecución experimental de un agente consumidor ni publicación social.
Fecha: 2026-10-15.

## Tarea y contexto

Preparar una serie de publicaciones para incorporar operadores y agentes externos a DXP sin afirmar una eficacia que la evidencia disponible no demuestra.

## Acciones observables y decisiones resumidas

- Se leyeron las reglas oficiales de r/AI_Agents, r/codex, r/LocalLLaMA, Hacker News, Hugging Face, LangChain y Moltbook; enlaces en outreach-guide.md.
- Se sustituyó la idea inicial de posts genéricos por comentarios en hilos permitidos y mensajes específicos de cada comunidad.
- Se excluyeron textos listos para publicar en Hacker News y r/LocalLLaMA por sus restricciones de contenido generado por IA. No se intentó eludirlas mediante otra cuenta o reformulación.
- Se recuperó la versión publicada del repositorio, commit a5485fe793f93a857d265f4a2394017cb96b8466, después de cambiar el entorno de ejecución.
- Se comprobó que la versión hospedada seguía siendo la 4 y que la guía pública existente respondía HTTP 200. Se redactaron las invitaciones para ese registro, no para un portal aún sin desplegar.
- Se añadieron siete secciones de campaña: cinco invitaciones adaptadas, una respuesta metodológica y una plantilla de resultados con campos explícitos pendientes.
- Se añadieron una página pública de consulta/copia y tres pruebas específicas de contenido y rutas. La copia usa textContent, no interpretación HTML de entradas.

## Errores y correcciones

- En el entorno anterior, el empaquetado del nuevo portal falló con ENOSPC. Tras el cambio de entorno, los cambios no publicados no estaban en el checkout recuperado. No se declararon publicados ni se incluyeron enlaces a funciones inexistentes en las invitaciones.
- La primera apertura del repositorio mediante el helper devolvió un error genérico. Tras inicializar el directorio Git vacío, el helper oficial completó la recuperación del mismo repositorio. No se sobrescribió historia remota.
- La búsqueda web no pudo abrir directamente algunos recursos del Site; una comprobación HTTP directa de la guía devolvió 200. No se confundió el fallo de la búsqueda con una caída del Site.

## Resultado y evidencia

- Suite actual: 38 pruebas aprobadas, 0 fallos. Ejecutar node scripts/test-all.mjs para reproducir.
- Pruebas nuevas: tests/outreach.test.mjs. Verifican separación de borradores/resultados, ausencia de anuncios del portal no desplegado, límites de evidencia, reglas y rutas servidas por el Worker compilado.
- Archivos: outreach-posts.md, outreach-guide.md, outreach.html y el enlace desde campaign.html.
- No se realizó publicación en Reddit, Slack, Hugging Face ni Moltbook. No se crearon cuentas ni se aceptaron términos nuevos.
- No se obtuvieron participantes, réplicas ni resultados externos atribuibles a esta campaña de difusión.

## Límites y siguiente paso

Las comprobaciones automáticas no sustituyen la revisión humana de las reglas antes de publicar. No se hizo QA visual con navegador en este entorno. La recepción estructural de una experiencia tampoco certifica identidad, ejecución ni utilidad. La publicación social requiere la identidad adecuada y una vía que permita esa acción; el portal experimental nuevo sigue pendiente y no forma parte de esta entrega de difusión.
