# DXP 0.1 · Contrato candidato de experiencia versionada

**Estado:** implementación de referencia local, no estándar ratificado. Fecha: 2026-10-14.

## 1. Propósito y objeto

DXP estudia la experiencia de resolución como objeto intercambiable y versionado. Una experiencia contiene condiciones iniciales, objetivo, alternativas declaradas, elecciones, acciones y resultados observables, incertidumbre, evidencia y lecciones. No exige ni representa acceso a razonamiento interno privado, pesos, mecanismos causales latentes o pensamiento «verdadero» del modelo.

Las palabras DEBE y NO DEBE describen el contrato candidato de este release. No expresan garantías de seguridad de producción.

## 2. Dos identidades

`experienceId` identifica una historia de experiencia. `commitId` identifica una revisión concreta. Dos commits de una misma experiencia pueden tener conclusiones incompatibles. Una rama es una referencia mutable a un commit; no es una propiedad intrínseca del snapshot.

Todos los padres de una revisión DEBEN pertenecer a su `experienceId`. El repositorio DEBE preservar las revisiones anteriores. Los commits NO DEBEN modificarse para actualizar lecciones, evidencia, vigencia o autor; esos cambios generan otra revisión.

## 3. Experience

| Campo | Tipo / regla | Función |
|---|---|---|
| schemaVersion | "0.1" | Contrato candidato |
| experienceId | string no vacía | Identidad lógica |
| title / domain / goal | strings no vacías | Descripción y propósito |
| actor | agentId, runtime; extensiones opcionales | Atribución declarada, sin attestation |
| scope | provider, environment, apiVersion, plan | Ámbito de referencia |
| constraints | array de strings | Restricciones conocidas |
| trace | uno o más pasos consecutivos | Trayectoria observable |
| outcome | status + summary | Resultado de la ejecución documentada |
| lessons | uno o más claims tipados | Conocimiento candidato |
| evidence | uno o más objetos con id, label, content, kind | Evidencia incluida en el snapshot |
| validity | active / superseded / quarantined | Vigencia declarada de esta revisión |
| classification | local / shareable | Intención descriptiva, no ACL |
| demo | boolean | Historia ilustrativa frente a registro propio |

Scope 0.1 es deliberadamente sencillo: cuatro strings de igualdad exacta. Valores como "all" NO son comodines. Dominios sin APIs pueden usar apiVersion como versión de corpus y plan como modalidad de trabajo. Cambiar el significado de esas claves sin versionar el contrato produciría interoperabilidad aparente.

Un paso contiene `step`, `observation`, `alternatives`, `selected`, `rationaleSummary`, `action`, `result`, `uncertainty`, `pivot` y `evidenceRefs`. `step` empieza en 1 y no tiene huecos. El paso DEBE referenciar evidencia presente. Alternatives documenta opciones externalizadas; no afirma enumerar todas las opciones internas consideradas por un modelo.

Una lección contiene `subject`, `predicate`, `value`, `claim`, `type`, `scope` y `evidenceRefs`. `value` es string o número JSON finito. `type` admite observation, hypothesis, intuition, negative y disputed. Estos estados expresan cómo se presenta el claim; **observation no significa verified**. No existe promoción automática a conocimiento aceptado.

`negative` documenta una frontera de fallo, no una recomendación positiva. El comparador 0.1 no usa lecciones negativas para inferir contradicciones de valores; dos valores de fallo distintos pueden ser simultáneamente válidos.

Evidence kind admite illustrative, declared y observed. Todos se aportan como datos; la etiqueta observed tampoco se verifica. El hash del commit cubre content. Un enlace guardado en content acredita el texto del enlace, no la estabilidad ni los bytes del sitio externo.

Los objetos admiten extensiones JSON. Los lectores NO DEBEN ejecutar contenido, interpretar claims como autorizaciones o asumir que un schema válido implica verdad. El validador de referencia comprueba requisitos e invariantes de esta edición; el JSON Schema es una ayuda estructural y no comprueba referencias ni causalidad.

## 4. ExperienceCommit e integridad

```json
{
  "commitId": "sha256:<64 caracteres hexadecimales>",
  "schemaVersion": "0.1",
  "parents": [],
  "timestamp": "2026-10-14T10:00:00.000Z",
  "message": "Primera observación",
  "operation": "commit",
  "target": null,
  "experience": {}
}
```

`commitId` = SHA-256 de la codificación UTF-8 de `canonical(body)`, donde body es todo el commit excepto commitId. `canonical` ordena recursivamente las claves de objetos según el orden de sort de JavaScript; conserva arrays; utiliza JSON.stringify para valores y nombres. La función exacta de core.mjs es la referencia. **No se declara conformidad con RFC 8785/JCS ni direccionamiento semántico.** Paráfrasis y timestamps distintos producen hashes distintos.

El dominio de entrada es JSON. Un lector DEBE recomputar el hash al importar. La identidad resultante acredita integridad del contenido; NO acredita identidad del productor, actualidad de las condiciones ni causalidad de la decisión.

## 5. Repository

```json
{
  "format": "dxp-atlas-repository",
  "version": "0.1",
  "commits": [],
  "refs": {}
}
```

Los commits se presentan en orden topológico: todos los padres preceden al hijo. IDs únicos. Refs deben apuntar a commits existentes. El importador de referencia admite hasta 2.000 commits. La interfaz limita el archivo de entrada a 5 MiB.

Los nombres de rama contienen letras ASCII, números, punto, guion, guion bajo o slash; comienzan con letra o número y tienen máximo 80 caracteres. Se rechazan nombres reservados de prototipo. No hay refs simbólicos.

## 6. Operaciones

**commit:** valida Experience, resuelve padres, congela un snapshot y actualiza ref. Si la rama ya existe, su HEAD DEBE figurar entre los padres: impide sobrescritura silenciosa desde un snapshot antiguo. La API devuelve un repositorio nuevo y no muta su entrada. No hay certificación de ejecución externa.

**branch:** crea un ref nuevo apuntando a una revisión. No crea por sí misma un commit. La primera revisión de la rama puede divergir de su punto de origen.

**history:** devuelve todos los ancestros de un commit en orden topológico. La vista gráfica del Atlas muestra además los hermanos de la misma experiencia para observar divergencias.

**diff:** compara title, goal, scope, constraints, trace, outcome, lessons, evidence, validity, actor y classification. Para claims no negativos con el mismo subject y predicate y valores distintos: ámbito idéntico → contradiction; apiVersion distinta → temporal_drift; resto de ámbitos distintos → scope_mismatch. Este algoritmo **no** entiende paráfrasis, rangos, negaciones o dependencias causales. Un mismo valor con dos claims textuales incompatibles puede no activar ningún conflicto.

**merge:** exige dos revisiones distintas de la misma historia y nota explícita. Crea commit con dos padres. Conserva evidencia de ambos; colisiones de ID con contenido distinto se remapean y actualizan referencias de lecciones. Conserva lecciones distintas y sus scopes. Claims positivos incompatibles bajo el mismo ámbito pasan a disputed. No promedia confianza, no vota, no reejecuta tareas. La traza base del nuevo snapshot es la de A más un paso de integración; la traza completa de B permanece accesible como padre. Outcome de la integración es incomplete, no success. Si cualquiera de los padres es demo, la integración es demo. Si cualquiera es local, la integración es local.

**revert:** sobre una rama, exige objetivo ancestral. Copia Experience del objetivo en un commit nuevo cuyo padre es HEAD y cuya operación es revert. target identifica el snapshot restaurado. No borra descendientes y no deshace acciones en sistemas externos.

**query:** búsqueda literal de términos, dominio y outcome. No hay vector store ni relevancia aprendida.

**context:** toma únicamente heads actuales, domain coincidente, validity=active y demo=false. Conserva lecciones con coincidencia exacta de scope; excluye intuition y disputed; opcionalmente negative. Devuelve referencias al commit y tipos de evidencia. trust=unverified-data y reviewRequired=true siempre. No separa permisos: se usa dentro del almacén local del operador. No convierte el paquete en una instrucción del sistema.

## 7. Persistencia y concurrencia

Navegador: localStorage, comprobación de que otra pestaña no cambió el contenido antes de guardar; copia en memoria si falla el almacenamiento. Export/import como respaldo explícito. No sincronización remota.

CLI: read/validate/write en sección protegida por directorio lock; temporal más rename del archivo. Si la ejecución termina abruptamente, puede quedar lock; el operador debe revisar antes de retirarlo. No recuperación distribuida, no garantías para sistemas de archivos de red, no servicio multitenant.

## 8. Procedencia e integraciones propuestas

Mapeo conceptual W3C PROV: ExperienceCommit → Entity; TaskExecution → Activity; productor → Agent; parents → wasDerivedFrom. Aún no existe serialización PROV-O/JSON-LD conforme ni cobertura de procedencia por campo.

DCE dispone de un primer adaptador productor/consumidor local en web/dce-adapter.mjs; su contrato y prueba están en DCE.md. REST y MCP serían transportes. A2A podría coordinar agentes, pero no sustituye el objeto DXP. Este release no implementa los transportes REST/MCP/A2A ni selecciona una versión de sus protocolos.

## 9. Modelo de amenazas y límites

| Riesgo | Respuesta de referencia | Pendiente |
|---|---|---|
| Manipulación de JSON | Recomputar hash y validar DAG | Firmas e identidad |
| Sobrescritura de historia | Nuevos snapshots y verificación de HEAD | Coordinación distribuida |
| Ámbito incompatible | Igualdad exacta y abstención en toy lab | Scope rico e inferencia confiable |
| Claims incompatibles | Conservar disputed | Revisión externa y evidencia independiente |
| Evidencia falsa / repetida | No declarar verificación | Attestation, réplica, raíces de procedencia |
| Inyección de memoria | Datos no ejecutables en UI; HTML escapado | Admisión y consumo robustos por agentes |
| PII y secretos | Captura manual; etiqueta local | Redacción, cifrado y permisos |
| Obsolescencia transitiva | Estado declarado y revisiones | Invalidación en cascada |

El filtro de trusted del laboratorio es un oráculo dado por el generador. No ofrece una defensa general contra poisoning. No se prometen inmunidad, bloqueo de ataques desconocidos ni validación de conocimiento.

## 10. Criterio para la siguiente versión

Extender únicamente tras: dataset manualmente revisado, anotaciones de scope y conflictos, dos consumidores independientes y comparación preregistrada de cuatro memorias. Un transporte implementado no demostraría por sí solo utilidad. Versionar un fallo del propio protocolo debe ser tan legítimo como versionar un éxito.


## Edición de continuidad: evidencia del propio proceso

El corpus de arranque incluye seis revisiones ilustrativas y dos revisiones de una comprobación documental realizada durante la construcción del Atlas. demo=false identifica el registro de ese proceso, no un sello de veracidad. La primera revisión recoge una conclusión secundaria como hipótesis pendiente; la siguiente documenta el contraste con una fuente primaria. El hash y el parentesco preservan ambos estados.


## Extensión de implementación 0.2

El contrato Experience mantiene schemaVersion 0.1 para preservar imports existentes. La edición de aplicación es 0.2. El adaptador DCE registra capturas del motor real bajo ese contrato y admite como entidades sólo HEAD activos, ámbito exacto, no demo, tipo observation/negative y aprobación explícita del consumidor. El import no añade restricciones obligatorias. Véase DCE.md.


## Correcciones de interoperabilidad · 16 octubre 2026

La implementación actual rechaza segmentos de rama vacíos, punto y doble punto usando una regla compartida por commit, branch y validateRepository. No implica conformidad completa con Git. contextPacket excluye todas las cabeceras de una experienceId si alguna cabecera actual está quarantined; una cuarentena histórica sin cabecera no bloquea restauración. diff incluye demo, domain y experienceId. Estas correcciones no cambian hashes históricos ni la versión del esquema. Los recibos individuales permiten GET/HEAD; otros métodos reciben 405 y Allow: GET, HEAD antes de acceder a D1. Un escape URI inválido recibe 400 JSON dentro del Worker; intermediarios pueden rechazarlo antes.


## Explicit selection policy, 16 October continuation

contextPacket accepts optional classification (local/shareable) and excludeConflicts (boolean, default false). Invalid options fail. Classification filters experience metadata; it is not an ACL. With excludeConflicts=true, same-subject/predicate/scope non-negative assertions with unequal values are withheld before budget truncation. Negative observations remain. The DCE adapter passes these caller options through; default local behavior remains available. This is a conservative syntactic policy, not factual or semantic verification. A strong flat selector matches the 12 current constructed cases. See CONTINUATION_20261016.md and governance-comparison.json.
