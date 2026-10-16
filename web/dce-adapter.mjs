import {clone,commit,validateExperience,validateRepository,contextPacket} from './core.mjs';

export const DCE_SOURCE = {
  repository: 'https://github.com/Milothik/domain-context-engine',
  revision: '81426cceecc631b488422c96f7ee46c751c02136',
  version: '0.2.0'
};
const requireValue=(x,m)=>{if(!x)throw Error(m);};

/** Observe a caller-supplied DCE run. No model endpoint or credentials are serialized. */
export async function captureDceRun(run,options,task,metadata) {
  requireValue(typeof run==='function','Supply the real DCE run function.');
  requireValue(metadata?.scope&&metadata.experienceId,'Explicit scope and experienceId required.');
  const events=[];
  let latestContext=null,generated=null,adapted=null,result=null,error=null,stage='engine-validation';
  const observe=(object,method,name,onResult)=>{
    const wrapper=Object.create(object);
    wrapper[method]=async(...args)=>{
      stage=name;
      const value=await object[method](...args);
      events.push({stage:name,status:'completed'});
      onResult?.(value);
      return value;
    };
    return wrapper;
  };
  const wrapped={...options,
    retriever:observe(options.retriever,'retrieve','discovery'),
    decision:observe(options.decision,'select','decision'),
    compiler:observe(options.compiler,'compile','compile',x=>latestContext=clone(x)),
    generator:observe(options.generator,'generate','generation',x=>generated=clone(x)),
    output:observe(options.output,'adapt','output-adaptation',x=>adapted=clone(x)),
    state:observe(options.state,'commit','state-commit')
  };
  try {result=await run(wrapped,clone(task),clone(metadata.overrides??{})); requireValue(result&&Object.hasOwn(result,'output')&&result.context&&result.trace&&events.some(e=>e.stage==='generation'),'Capture lacks a context, output, trace or observed generation boundary.');}
  catch(cause){error=cause;events.push({stage,status:'failed',errorName:cause.name});}
  const context=result?.context??error?.context??latestContext;
  const outcomeStatus=error?'failure':'success';
  const reason=error?`DCE stopped during ${stage}: ${error.message}`:'The supplied DCE run returned context, output and trace after observed generation.';
  const recovery=error?.name==='StateCommitError';
  const artifact={format:'dce-dxp-capture',version:'0.1',source:clone(metadata.source??DCE_SOURCE),
    task:clone(task),events,trace:result?.trace??null,context:context??null,
    output:result?.output??error?.output??adapted??generated??null,
    status:outcomeStatus,failedStage:error?stage:null,errorName:error?.name??null,
    errorMessage:error?.message??null,generationCompleted:events.some(x=>x.stage==='generation'),
    recoveryRequired:recovery,automaticRetry:false};
  const evidenceId='ev:dce-capture';
  const scope=clone(metadata.scope);
  const experience={schemaVersion:'0.1',experienceId:metadata.experienceId,
    title:metadata.title??(error?'DCE execution failed':'DCE execution captured'),
    domain:metadata.domain??'software',goal:task.prompt,
    actor:{agentId:metadata.agentId??'dce:local',runtime:'domain-context-engine/0.2.0',
      model:metadata.model??'not-attested',identityStatus:'declared'},scope,
    constraints:['Capture describes this run only; it does not establish transfer utility.',
      'Decision reasons are provider declarations, not independent causal evidence.',
      'No automatic retry after failure; preserve validated output for reconciliation.'],
    trace:[{step:1,observation:`Task ${task.id} submitted to DCE.`,
      alternatives:['Return only the final artifact','Preserve an execution record'],
      selected:'Preserve observed execution boundaries',
      rationaleSummary:'Keep source revision, task, context and outcome available for review.',
      action:'Invoke the caller-supplied DCE engine once with observer wrappers.',
      result:reason,uncertainty:'Schema conformance does not validate domain truth or model quality.',
      pivot:!!error,evidenceRefs:[evidenceId]}],
    outcome:{status:outcomeStatus,summary:reason},
    lessons:[{subject:metadata.experienceId,predicate:recovery?'recovery-policy':'execution-status',
      value:recovery?'reconcile-without-regeneration':outcomeStatus,
      claim:recovery?'Generation completed but continuity commit failed: reconcile the preserved output before retrying.':reason,
      type:error?'negative':'observation',scope,evidenceRefs:[evidenceId]}],
    evidence:[{id:evidenceId,label:'Observed DCE execution capture',kind:'observed',content:JSON.stringify(artifact,null,2)}],
    validity:'active',classification:metadata.classification??'local',demo:metadata.demo??false};
  validateExperience(experience);
  return {result,error,experience,artifact};
}

export async function recordDceRun(repo,capture,{branch,parents=[],timestamp,message}={}) {
  return commit(repo,capture.experience,{branch,parents,timestamp,
    message:message??capture.experience.title});
}

/** Explicit caller review is required. Imported experiences remain data, never mandatory rules. */
export async function dceEntitiesFromRepository(repo,{scope,domain,approvedCommitIds=[],reviewer,classification,excludeConflicts=false}={}) {
  await validateRepository(repo);
  const packet=contextPacket(repo,{scope,domain,classification,excludeConflicts});
  if(!approvedCommitIds.length)return {entities:[],packet,excluded:packet.lessons.length};
  requireValue(typeof reviewer==='string'&&reviewer.trim(),'A reviewer is required for explicit imports.');
  const allowed=new Set(approvedCommitIds);
  const lessons=packet.lessons.filter(l=>allowed.has(l.commitId)&&['observation','negative'].includes(l.type));
  const entities=lessons.map((l,i)=>({
    '@id':`dxp:${l.commitId.slice(7)}:${i}`,'@type':'DXPExperience',name:l.claim,
    attributes:{claim:l.claim,subject:l.subject,predicate:l.predicate,value:l.value,
      sourceCommit:l.commitId,scope:clone(l.scope),epistemicStatus:l.type,
      review:'Caller-approved import; not independently replicated',reviewer},
    relationships:[],rules:{mustPreserve:[],mayVary:[],avoid:[]},
    provenance:[{source:`dxp:${l.commitId}`,type:'user-canon',confidence:0,
      locator:`Reviewed import by ${reviewer}; approval permits context inclusion, not truth certification.`}]
  }));
  return {entities,packet,excluded:packet.lessons.length-lessons.length};
}
