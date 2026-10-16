#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {emptyRepository,validateRepository,commit,branch,diff,merge,revert,query,history,getCommit,contextPacket,runBenchmark,clone} from './web/core.mjs';
import {seedRepository} from './web/seeds.mjs';
const args=process.argv.slice(2),opts={},pos=[];
for(let i=0;i<args.length;i++){if(args[i].startsWith('--')){const key=args[i].slice(2);opts[key]=args[i+1]&&!args[i+1].startsWith('--')?args[++i]:true;}else pos.push(args[i]);}
const [command,...rest]=pos,store=path.resolve(String(opts.store||'repository.json'));
const read=p=>JSON.parse(fs.readFileSync(path.resolve(p),'utf8'));
const output=x=>{const text=JSON.stringify(x,null,2)+'\n';if(opts.out)fs.writeFileSync(path.resolve(String(opts.out)),text,'utf8');else process.stdout.write(text);};
const requireArg=(v,label)=>{if(!v||typeof v!=='string')throw Error('Falta '+label);return v;};
async function transaction(fn){fs.mkdirSync(path.dirname(store),{recursive:true});const lock=store+'.lock';try{fs.mkdirSync(lock);}catch{throw Error('Repositorio bloqueado por otro escritor. Si una ejecución terminó abruptamente, revisa y retira '+lock);}
 try {let repo=null;if(fs.existsSync(store)){repo=read(store);await validateRepository(repo);}const result=await fn(repo);await validateRepository(result.repo);const temp=store+'.tmp';fs.writeFileSync(temp,JSON.stringify(result.repo,null,2)+'\n','utf8');fs.renameSync(temp,store);output(result.result??{commits:result.repo.commits.length,refs:result.repo.refs});}finally{fs.rmdirSync(lock);}}
async function loadRepo(){if(!fs.existsSync(store))throw Error('No existe el repositorio. Ejecuta init --store '+store);const r=read(store);await validateRepository(r);return r;}
function help(){process.stdout.write(`DXP Atlas 0.1 — Node 18+; sin dependencias

node cli.mjs init [--empty] [--store repository.json]
node cli.mjs commit experience.json --branch work/main [--parent REF] --message "motivo"
node cli.mjs branch FROM NAME
node cli.mjs log [REF]
node cli.mjs show REF
node cli.mjs diff A B
node cli.mjs merge A B --branch NAME --note "alcance"
node cli.mjs revert TARGET --branch NAME --note "motivo"
node cli.mjs query [--text "429"] [--domain software] [--outcome failure]
node cli.mjs context options.json
node cli.mjs export --out export.json
node cli.mjs import export.json
node cli.mjs verify
node cli.mjs benchmark [--seed 17] [--count 120] [--no-shift] [--no-poison] [--unknown]

--store selecciona el repositorio en todos los comandos.
--out guarda la salida JSON; por defecto se escribe en stdout.
Usa IDs completos o nombres de rama. init nunca sobrescribe un repositorio.
context options.json = {"domain":"software","scope":{"provider":"North","plan":"basic","apiVersion":"v1","environment":"sandbox"}}
`);}
try{
 if(!command||command==='help')help();
 else if(command==='benchmark')output(runBenchmark({seed:Number(opts.seed??17),count:Number(opts.count??120),shift:!opts['no-shift'],poison:!opts['no-poison'],unknown:!!opts.unknown}));
 else if(command==='init')await transaction(async r=>{if(r)throw Error('init no sobrescribe un repositorio existente.');return {repo:opts.empty?emptyRepository():await seedRepository()};});
 else if(command==='commit')await transaction(async r=>{if(!r)throw Error('Ejecuta init primero.');const b=requireArg(opts.branch,'--branch');const parent=opts.parent?getCommit(r,String(opts.parent)).commitId:r.refs[b];const result=await commit(r,read(requireArg(rest[0],'experience.json')),{branch:b,parents:parent?[parent]:[],message:requireArg(opts.message,'--message')});return {...result,result:result.commit};});
 else if(command==='branch')await transaction(async r=>{if(!r)throw Error('Ejecuta init primero.');return {repo:branch(r,requireArg(rest[0],'FROM'),requireArg(rest[1],'NAME'))};});
 else if(command==='merge')await transaction(async r=>{if(!r)throw Error('Ejecuta init primero.');const result=await merge(r,requireArg(rest[0],'A'),requireArg(rest[1],'B'),requireArg(opts.branch,'--branch'),requireArg(opts.note,'--note'));return {...result,result:result.commit};});
 else if(command==='revert')await transaction(async r=>{if(!r)throw Error('Ejecuta init primero.');const result=await revert(r,requireArg(opts.branch,'--branch'),requireArg(rest[0],'TARGET'),requireArg(opts.note,'--note'));return {...result,result:result.commit};});
 else if(command==='import')await transaction(async r=>{if(!r)throw Error('Ejecuta init primero.');const imported=read(requireArg(rest[0],'archivo JSON'));await validateRepository(imported);const next=clone(r),ids=new Set(r.commits.map(c=>c.commitId));for(const c of imported.commits){if(!ids.has(c.commitId)){next.commits.push(c);ids.add(c.commitId);}}for(const [k,id] of Object.entries(imported.refs)){if(Object.hasOwn(next.refs,k)&&next.refs[k]!==id)throw Error('Rama en conflicto: '+k+'. Renombra la rama antes de importar.');next.refs[k]=id;}return {repo:next};});
 else {const r=await loadRepo();if(command==='log')output(rest[0]?history(r,rest[0]):r.commits);else if(command==='show')output(getCommit(r,requireArg(rest[0],'REF')));else if(command==='diff')output(diff(getCommit(r,requireArg(rest[0],'A')),getCommit(r,requireArg(rest[1],'B'))));else if(command==='query')output(query(r,{text:String(opts.text||''),domain:String(opts.domain||''),outcome:String(opts.outcome||'')}));else if(command==='context')output(contextPacket(r,read(requireArg(rest[0],'options.json'))));else if(command==='export')output(r);else if(command==='verify')output({valid:true,commits:r.commits.length,refs:Object.keys(r.refs).length});else throw Error('Comando desconocido: '+command);}
}catch(e){process.stderr.write(e.message+'\n');process.exitCode=1;}
