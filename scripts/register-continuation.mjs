import fs from 'node:fs';
import {getCommit,validateRepository} from '../web/core.mjs';
const repo=JSON.parse(fs.readFileSync('work/repository.json'));await validateRepository(repo);
const task=process.argv[2];if(!['registration-failure-retrospective','continuation-20261016','diagnostic-v2-20261016'].includes(task))throw Error('Expected reviewed continuation task');
const experience=getCommit(repo,'work/'+task).experience;
if(experience.classification!=='shareable')throw Error('Experience is not shareable');
const origin='https://dxp-experience-atlas.milothik.chatgpt.site';
const receipt=await fetch(origin+'/api/experiences',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({experience})});
const text=await receipt.text();let data;try{data=JSON.parse(text)}catch{throw Error('Non-JSON intake response: HTTP '+receipt.status);}
if(!receipt.ok||!data.id)throw Error('Intake not confirmed: '+JSON.stringify(data));
const read=await fetch(origin+'/api/experiences/'+encodeURIComponent(data.id));const readData=await read.json();
if(!read.ok||readData.payload?.experienceId!==experience.experienceId)throw Error('Receipt read-back failed');
const result={taskId:task,checkedAt:new Date().toISOString(),postStatus:receipt.status,receipt:data,readBackStatus:read.status,experienceId:experience.experienceId,roundTripVerified:true,scope:'Public storage round trip; not utility validation or proof of historical execution.'};
fs.writeFileSync('work/'+task+'-receipt.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
