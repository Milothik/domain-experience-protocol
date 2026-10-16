// Independent check against the structural contract's JSON Schema vocabulary.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const schema=JSON.parse(fs.readFileSync(new URL('../experience.schema.json',import.meta.url),'utf8'));
const repo=JSON.parse(fs.readFileSync(new URL('../examples/repository-demo.json',import.meta.url),'utf8'));
function check(value,s,path='$'){
  if(s.const!==undefined)assert.deepEqual(value,s.const,path+' const');
  if(s.enum)assert(s.enum.includes(value),path+' enum');
  if(s.type){const types=Array.isArray(s.type)?s.type:[s.type];assert(types.some(t=>t==='object'?value!==null&&typeof value==='object'&&!Array.isArray(value):t==='array'?Array.isArray(value):t==='integer'?Number.isInteger(value):typeof value===t),path+' type');}
  if(typeof value==='string'){if(s.minLength)assert(value.length>=s.minLength,path+' minLength');if(s.pattern)assert(new RegExp(s.pattern).test(value),path+' pattern');}
  if(typeof value==='number'&&s.minimum!==undefined)assert(value>=s.minimum,path+' minimum');
  if(Array.isArray(value)){if(s.minItems)assert(value.length>=s.minItems,path+' minItems');if(s.items)value.forEach((v,i)=>check(v,s.items,path+'['+i+']'));}
  if(value&&typeof value==='object'&&!Array.isArray(value)){for(const k of s.required||[])assert(Object.hasOwn(value,k),path+' requires '+k);for(const [k,p] of Object.entries(s.properties||{}))if(Object.hasOwn(value,k))check(value[k],p,path+'.'+k);}
}
repo.commits.forEach(c=>check(c.experience,schema));
check(JSON.parse(fs.readFileSync(new URL('../examples/experience-template.json',import.meta.url),'utf8')),schema);
process.stdout.write((repo.commits.length+1)+' example snapshots conform to the schema vocabulary used by this contract.\n');
