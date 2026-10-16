// DXP Atlas 0.1 — shared, dependency-free reference kernel.
export const VERSION = '0.1';
export const OUTCOMES = ['success','failure','partial','incomplete'];
export const TYPES = ['observation','hypothesis','intuition','negative','disputed'];
export const VALIDITY = ['active','superseded','quarantined'];
export const clone = x => JSON.parse(JSON.stringify(x));
export function canonical(x) {
  if (x === null || typeof x !== 'object') return JSON.stringify(x);
  if (Array.isArray(x)) return '[' + x.map(canonical).join(',') + ']';
  return '{' + Object.keys(x).sort().map(k => JSON.stringify(k)+':'+canonical(x[k])).join(',') + '}';
}
export async function digest(x) {
  let crypto = globalThis.crypto;
  if (!crypto?.subtle && typeof process !== 'undefined') crypto = (await import('node:crypto')).webcrypto;
  if (!crypto?.subtle) throw Error('Se necesita HTTPS, localhost o Node 18+ para SHA-256.');
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical(x)));
  return 'sha256:'+Array.from(new Uint8Array(b),v=>v.toString(16).padStart(2,'0')).join('');
}
const nonempty = x => typeof x === 'string' && x.trim().length > 0;
const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const req = (p,m) => {if (!p) throw Error(m);};
export function validateExperience(e) {
  req(object(e),'La experiencia debe ser un objeto.');
  req(e.schemaVersion===VERSION,'schemaVersion debe ser 0.1.');
  for(const k of ['experienceId','title','domain','goal']) req(nonempty(e[k]),`Falta ${k}.`);
  req(object(e.actor)&&nonempty(e.actor.agentId)&&nonempty(e.actor.runtime),'actor requiere agentId y runtime.');
  req(object(e.scope)&&['provider','environment','apiVersion','plan'].every(k=>nonempty(e.scope[k])),'scope requiere provider, environment, apiVersion y plan.');
  req(Array.isArray(e.constraints)&&e.constraints.every(nonempty),'constraints debe contener textos.');
  req(OUTCOMES.includes(e.outcome?.status)&&nonempty(e.outcome.summary),'outcome inválido.');
  req(VALIDITY.includes(e.validity),'validity inválida.');
  req(typeof e.demo==='boolean','demo debe ser booleano.');
  req(['local','shareable'].includes(e.classification),'classification inválida.');
  req(Array.isArray(e.evidence)&&e.evidence.length>0,'Añade al menos una evidencia declarada.');
  const ids = new Set();
  for(const a of e.evidence) {
    req(object(a)&&nonempty(a.id)&&nonempty(a.label)&&nonempty(a.content),'Evidencia incompleta.');
    req(!ids.has(a.id),'ID de evidencia duplicado.'); ids.add(a.id);
    req(['illustrative','declared','observed'].includes(a.kind),'Tipo de evidencia inválido.');
  }
  req(Array.isArray(e.trace)&&e.trace.length>0,'Añade al menos un paso.');
  e.trace.forEach((s,i)=>{
    req(s.step===i+1,'La traza debe tener pasos consecutivos desde 1.');
    for(const k of ['observation','selected','rationaleSummary','action','result','uncertainty']) req(nonempty(s[k]),`Paso ${i+1}: falta ${k}.`);
    req(Array.isArray(s.alternatives)&&s.alternatives.every(nonempty),'alternatives inválidas.');
    req(typeof s.pivot==='boolean','pivot debe ser booleano.');
    req(Array.isArray(s.evidenceRefs)&&s.evidenceRefs.length>0&&s.evidenceRefs.every(x=>ids.has(x)),'Referencia de evidencia inexistente.');
  });
  req(Array.isArray(e.lessons)&&e.lessons.length>0,'Añade al menos una lección.');
  for(const l of e.lessons) {
    req(nonempty(l.claim)&&nonempty(l.subject)&&nonempty(l.predicate),'Lección incompleta.');
    req(typeof l.value==='string'||(typeof l.value==='number'&&Number.isFinite(l.value)),'value debe ser texto o número finito.');
    req(TYPES.includes(l.type),'Estado epistémico inválido.');
    req(object(l.scope)&&['provider','environment','apiVersion','plan'].every(k=>nonempty(l.scope[k])),'Ámbito de lección incompleto.');
    req(Array.isArray(l.evidenceRefs)&&l.evidenceRefs.length>0&&l.evidenceRefs.every(x=>ids.has(x)),'Lección sin evidencia referenciada.');
  }
  // This is a structural gate, not a truth, PII or injection detector.
  return true;
}
export function emptyRepository() {return {format:'dxp-atlas-repository',version:VERSION,commits:[],refs:{}};}
const refName = s => typeof s==='string' && /^[A-Za-z0-9][A-Za-z0-9._/-]{0,79}$/.test(s)&&!['__proto__','constructor','prototype'].includes(s);
export function getCommit(repo,id) {
  const key=Object.hasOwn(repo.refs,id)?repo.refs[id]:id;
  const c=repo.commits.find(x=>x.commitId===key);req(c,'Commit o rama no encontrado.');return c;
}
export async function commit(repo, experience, {parents=[],branch,message='Nueva experiencia',operation='commit',timestamp=new Date().toISOString(),target=null}={}) {
  validateExperience(experience);req(refName(branch),'Nombre de rama inválido.');req(nonempty(message),'Falta mensaje.');
  req(['commit','branch','merge','revert'].includes(operation),'Operación inválida.');
  req(Array.isArray(parents)&&new Set(parents).size===parents.length,'Padres duplicados.');
  if(operation==='merge')req(parents.length===2,'Merge requiere dos padres.');
  if(operation==='revert')req(parents.length===1,'Revert requiere un padre.');
  const resolved=parents.map(p=>getCommit(repo,p));
  req(resolved.every(p=>p.experience.experienceId===experience.experienceId),'Los padres deben pertenecer a la misma experiencia.');
  if(Object.hasOwn(repo.refs,branch)) req(parents.includes(repo.refs[branch]),'La rama cambió: su HEAD debe ser padre del nuevo commit.');
  if(operation==='revert') req(getCommit(repo,target).experience.experienceId===experience.experienceId,'Revert de otra experiencia.');
  req(Number.isFinite(Date.parse(timestamp)),'Fecha inválida.');
  const body={schemaVersion:VERSION,parents:resolved.map(p=>p.commitId),timestamp,message,operation,target,experience:clone(experience)};
  const c={commitId:await digest(body),...body};
  const next=clone(repo);if(!next.commits.some(x=>x.commitId===c.commitId)) next.commits.push(c);next.refs[branch]=c.commitId;
  return {repo:next,commit:c};
}
export function branch(repo,from,name) {
  req(refName(name),'Nombre de rama inválido.');req(!Object.hasOwn(repo.refs,name),'La rama ya existe.');
  const c=getCommit(repo,from),next=clone(repo);next.refs[name]=c.commitId;return next;
}
export function history(repo,id) {
  const seen=new Set();const visit=c=>{if(seen.has(c.commitId))return;seen.add(c.commitId);c.parents.forEach(p=>visit(getCommit(repo,p)));};
  visit(getCommit(repo,id));return repo.commits.filter(x=>seen.has(x.commitId));
}
export function scopeMatch(a,b) {return ['provider','environment','apiVersion','plan'].every(k=>a[k]===b[k]);}
export function diff(a,b) {
  a=a.experience||a;b=b.experience||b;
  const fields=['title','goal','scope','constraints','trace','outcome','lessons','evidence','validity','actor','classification'];
  const changes=fields.filter(k=>canonical(a[k])!==canonical(b[k])).map(k=>({field:k,before:clone(a[k]),after:clone(b[k])}));
  const conflicts=[];
  for(const l of a.lessons) for(const r of b.lessons) {
    if(l.subject!==r.subject||l.predicate!==r.predicate||canonical(l.value)===canonical(r.value)||l.type==='negative'||r.type==='negative')continue;
    let type=scopeMatch(l.scope,r.scope)?'contradiction':l.scope.apiVersion!==r.scope.apiVersion?'temporal_drift':'scope_mismatch';
    conflicts.push({type,left:l.claim,right:r.claim,subject:l.subject,predicate:l.predicate});
  }
  return {changes,conflicts,method:'typed-key comparison; no natural-language inference'};
}
export async function merge(repo,left,right,branchName,note) {
  req(nonempty(note),'La integración requiere una nota explícita.');
  const a=getCommit(repo,left),b=getCommit(repo,right);req(a.commitId!==b.commitId,'Selecciona dos commits distintos.');
  req(a.experience.experienceId===b.experience.experienceId,'Solo se integran revisiones de la misma experiencia.');
  const d=diff(a,b), e=clone(a.experience);
  e.title='Integración · '+a.experience.title.replace(/^Integración · /,'');e.actor={agentId:'reviewer:local',runtime:'dxp-atlas',model:'not-used',identityStatus:'declared'};
  const remap=new Map();
  for(const ev of b.experience.evidence) {
    const existing=e.evidence.find(x=>x.id===ev.id);
    if(existing && canonical(existing)!==canonical(ev)) {
      let id='right:'+ev.id;while(e.evidence.some(x=>x.id===id))id='right:'+id;
      remap.set(ev.id,id);e.evidence.push({...clone(ev),id});
    } else if(!existing)e.evidence.push(clone(ev));
  }
  const rightLessons=b.experience.lessons.map(x=>({...clone(x),evidenceRefs:x.evidenceRefs.map(id=>remap.get(id)||id)}));
  const all=[...e.lessons,...rightLessons];
  e.lessons=all.filter((x,i)=>all.findIndex(y=>canonical(x)===canonical(y))===i).map(x=>{
    const clash=x.type!=='negative'&&all.some(y=>y.type!=='negative'&&x.subject===y.subject&&x.predicate===y.predicate&&scopeMatch(x.scope,y.scope)&&canonical(x.value)!==canonical(y.value));
    return clash?{...x,type:'disputed'}:x;
  });
  e.validity='active';e.demo=a.experience.demo||b.experience.demo;
  e.classification=a.experience.classification==='local'||b.experience.classification==='local'?'local':'shareable';
  e.outcome={status:'incomplete',summary:'Integración documental: '+note};
  e.trace=[...e.trace,{step:e.trace.length+1,observation:'Dos revisiones disponibles.',alternatives:['Conservar ramas','Integrar con ámbitos explícitos'],selected:'Conservar ambas lecciones y sus ámbitos',rationaleSummary:note,action:'Integración documental, sin ejecutar la tarea',result:d.conflicts.length+' diferencias de criterio; padres preservados.',uncertainty:'La compatibilidad causal requiere revisión externa.',pivot:true,evidenceRefs:e.evidence.map(x=>x.id)}];
  return commit(repo,e,{parents:[a.commitId,b.commitId],branch:branchName,message:note,operation:'merge'});
}
export async function revert(repo,branchName,target,note) {
  req(nonempty(note),'Explica la reversión.');
  const current=getCommit(repo,branchName),old=getCommit(repo,target);
  req(history(repo,current.commitId).some(c=>c.commitId===old.commitId),'El objetivo debe ser ancestro del HEAD.');
  return commit(repo,old.experience,{parents:[current.commitId],branch:branchName,message:note,operation:'revert',target:old.commitId});
}
export async function validateRepository(repo) {
  req(object(repo)&&repo.format==='dxp-atlas-repository'&&repo.version===VERSION,'Formato de repositorio inválido.');
  req(Array.isArray(repo.commits)&&repo.commits.length<=2000&&object(repo.refs),'Máximo 2.000 commits.');
  const seen=new Map();
  for(const c of repo.commits) {
    req(object(c)&&typeof c.commitId==='string'&&/^sha256:[a-f0-9]{64}$/.test(c.commitId),'Hash inválido.');
    req(!seen.has(c.commitId),'Commit duplicado.');validateExperience(c.experience);
    const {commitId,...body}=c;req(await digest(body)===commitId,'Integridad SHA-256 incorrecta.');
    req(c.schemaVersion===VERSION&&nonempty(c.message)&&Number.isFinite(Date.parse(c.timestamp)),'Metadatos inválidos.');
    req(['commit','branch','merge','revert'].includes(c.operation),'Operación desconocida.');
    req(Array.isArray(c.parents)&&new Set(c.parents).size===c.parents.length,'Padres inválidos.');
    req(c.parents.every(p=>seen.has(p)&&seen.get(p).experience.experienceId===c.experience.experienceId),'Padre inexistente, fuera de orden o de otra experiencia.');
    if(c.operation==='merge')req(c.parents.length===2,'Merge requiere dos padres.');
    if(c.operation==='revert')req(seen.has(c.target)&&c.parents.length===1&&history({commits:[...seen.values()],refs:{}},c.parents[0]).some(x=>x.commitId===c.target),'Objetivo de reversión inválido.');
    seen.set(c.commitId,c);
  }
  for(const [ref,id] of Object.entries(repo.refs))req(refName(ref)&&seen.has(id),'Referencia de rama inválida.');
  return true;
}
export function query(repo,{text='',domain='',outcome='',scope=null}={}) {
  const terms=text.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return repo.commits.filter(c=>{
    const e=c.experience;
    return (!domain||e.domain===domain)&&(!outcome||e.outcome.status===outcome)&&(!scope||scopeMatch(e.scope,scope))&&terms.every(t=>JSON.stringify(e).toLocaleLowerCase().includes(t));
  });
}
export function contextPacket(repo,{scope,domain,includeNegative=true,includeHypotheses=false}) {
  // Current branch heads only. Data is never executed as instructions.
  const ids=[...new Set(Object.values(repo.refs))];
  const candidates=ids.map(id=>getCommit(repo,id)).filter(c=>c.experience.validity==='active'&&c.experience.domain===domain&&!c.experience.demo);
  const lessons=candidates.flatMap(c=>c.experience.lessons.filter(l=>scopeMatch(l.scope,scope)&&!['intuition','disputed'].includes(l.type)&&(includeNegative||l.type!=='negative')&&(includeHypotheses||l.type!=='hypothesis')).map(l=>({commitId:c.commitId,...clone(l),evidenceKind:c.experience.evidence.filter(e=>l.evidenceRefs.includes(e.id)).map(e=>e.kind)})));
  return {format:'dxp-context-packet',version:VERSION,scope,domain,trust:'unverified-data',reviewRequired:true,lessons};
}
export const BENCH_MEMORY = [
  {provider:'North',plan:'basic',apiVersion:'v1',cap:4,trusted:true},
  {provider:'North',plan:'basic',apiVersion:'v2',cap:2,trusted:true},
  {provider:'North',plan:'pro',apiVersion:'v1',cap:12,trusted:true},
  {provider:'South',plan:'basic',apiVersion:'v1',cap:3,trusted:true},
  {provider:'North',plan:'basic',apiVersion:'v2',cap:64,trusted:false}
];
export function runBenchmark({seed=17,count=120,shift=true,poison=true,unknown=false}={}) {
  req(Number.isInteger(seed)&&seed>=0&&seed<=4294967295,'Semilla fuera de rango.');
  req(Number.isInteger(count)&&count>=1&&count<=10000,'Cantidad inválida.');
  let n=seed>>>0;const random=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
  const known=BENCH_MEMORY.filter(m=>m.trusted&&(shift||m.apiVersion==='v1'));
  const memory=BENCH_MEMORY.filter(m=>(shift||m.apiVersion==='v1')&&(poison||m.trusted));
  const rows=[];const totals=Object.fromEntries(['none','raw','flat','dxp'].map(k=>[k,{success:0,failures:0,calls:0,quarantined:0,abstentions:0}]));
  for(let i=0;i<count;i++) {
    const base=known[Math.floor(random()*known.length)],task={...base,requests:20+Math.floor(random()*80)};
    if(unknown&&i%5===0){task.apiVersion='v3';task.cap=1;}
    const decisions={none:16,raw:memory.filter(x=>x.provider===task.provider).at(-1)?.cap||16,flat:memory.at(-1).cap,dxp:memory.filter(x=>x.trusted&&x.provider===task.provider&&x.plan===task.plan&&x.apiVersion===task.apiVersion).at(-1)?.cap??null};
    const result={id:i+1,task,decisions,results:{}};
    for(const [mode,c] of Object.entries(decisions)) {
      const abstain=c===null,success=!abstain&&c<=task.cap,calls=abstain?0:Math.ceil(task.requests/c)*(success?1:2);
      result.results[mode]={concurrency:c,success,calls,abstain};const t=totals[mode];t.success+=Number(success);t.failures+=Number(!success&&!abstain);t.calls+=calls;t.abstentions+=Number(abstain);
      if(mode==='dxp'&&poison)t.quarantined+=memory.filter(m=>!m.trusted&&m.provider===task.provider&&m.plan===task.plan&&m.apiVersion===task.apiVersion).length;
    }
    rows.push(result);
  }
  return {format:'dxp-toy-benchmark',version:VERSION,seed,count,shift,poison,unknown,kind:'deterministic synthetic policy comparison; no LLM',policies:{none:'fixed concurrency 16',raw:'last matching provider record',flat:'last global record',dxp:'exact provider+plan+version, trusted=true; abstain when unknown'},totals,rows};
}
