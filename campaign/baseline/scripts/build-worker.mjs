import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const mime={html:'text/html; charset=utf-8',mjs:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',json:'application/json',md:'text/markdown; charset=utf-8',zip:'application/zip'};
const assets={};
for(const name of fs.readdirSync(path.join(root,'web'))){const p=path.join(root,'web',name);if(!fs.statSync(p).isFile())continue;assets['/'+name]={type:mime[name.split('.').at(-1)]??'application/octet-stream',data:fs.readFileSync(p).toString('base64')};}
const kernel=fs.readFileSync(path.join(root,'web/core.mjs'),'utf8').replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'');
const pilot=JSON.parse(fs.readFileSync(path.join(root,'public/pilot.json'),'utf8'));
const source=fs.readFileSync(path.join(root,'worker/index.js'),'utf8').replace('/*__KERNEL__*/',kernel).replace('/*__ASSETS__*/',JSON.stringify(assets)).replace('/*__PILOT__*/',JSON.stringify(pilot));
fs.mkdirSync(path.join(root,'dist/server'),{recursive:true});fs.mkdirSync(path.join(root,'dist/.openai'),{recursive:true});
fs.writeFileSync(path.join(root,'dist/server/index.js'),source);
fs.copyFileSync(path.join(root,'.openai/hosting.json'),path.join(root,'dist/.openai/hosting.json'));
console.log(JSON.stringify({workerBytes:Buffer.byteLength(source),embeddedAssets:Object.keys(assets).length,durableBinding:'DB'}));
