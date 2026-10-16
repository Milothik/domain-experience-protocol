import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
const invoke=async(method,params)=>await (await worker.fetch(new Request('https://test/mcp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:7,method,params})}),{})).json();
test('MCP discovers four read-only tools and the supported protocol',async()=>{
 assert.deepEqual((await invoke('server/discover')).result.supportedVersions,['2026-07-28']);
 const tools=(await invoke('tools/list')).result.tools;
 assert.equal(tools.length,4);assert.ok(tools.every(t=>t.inputSchema.additionalProperties===false));
 assert.equal((await worker.fetch(new Request('https://test/mcp'),{})).status,405);
});
test('MCP returns current public status and all four fixed evidence artifacts',async()=>{
 const status=await invoke('tools/call',{name:'dxp_status'});assert.equal(status.result.isError,false);
 assert.equal(JSON.parse(status.result.content[0].text).trust,'unverified-data');
 for(const artifact of ['week-state','week-protocol','diagnostic','sensitivity']){
  const r=await invoke('tools/call',{name:'dxp_read_evidence',arguments:{artifact}});assert.equal(r.result.isError,false,artifact);
 }
});
test('MCP rejects unknown tools, path injection, extra arguments and storage failures',async()=>{
 for(const params of [{name:'write'},{name:'dxp_status',arguments:{url:'https://elsewhere'}},{name:'dxp_get_experience',arguments:{id:'../secret'}},{name:'dxp_list_experiences',arguments:{outcome:'bad'}},{name:'dxp_read_evidence',arguments:{artifact:'constructor'}},{name:'dxp_get_experience'},{name:'dxp_list_experiences'}])assert.equal((await invoke('tools/call',params)).result.isError,true);
 assert.equal((await invoke('missing')).error.code,-32601);
 const bad=await worker.fetch(new Request('https://test/mcp',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'}),{});
 assert.equal((await bad.json()).error.code,-32700);
});
