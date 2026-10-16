import test from 'node:test';import assert from 'node:assert/strict';
import {mcpRead} from '../worker/mcp.mjs';
const call=async(args,records)=>{
 const r=new Request('https://test/mcp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/call',params:{name:'dxp_list_experiences',arguments:args}})});
 return await (await mcpRead(r,{},async()=>new Response(JSON.stringify({items:records})),r=>r.json())).json();
};
test('MCP list summarizes a bounded window while preserving receipts and full-read discovery',async()=>{
 const records=Array.from({length:50},(_,i)=>({id:'sha256:'+String(i).padStart(64,'0'),actor:'a'.repeat(100000),title:'語'.repeat(100000),status:'received-unverified',payload:{domain:'語'.repeat(10000),trace:['unbounded'],outcome:{status:'success',summary:'語'.repeat(100000)}}}));
 const r=await call({limit:20},records),data=JSON.parse(r.result.content[0].text).data;
 assert.equal(data.items.length,20);assert.equal(data.availableInWindow,50);assert.equal(data.truncated,true);
 assert.equal(data.items[0].id,records[0].id);assert.equal(data.fullRecordTool,'dxp_get_experience');assert.equal(data.items[0].payload,undefined);
 assert(Buffer.byteLength(r.result.content[0].text)<50000);
 assert.equal(JSON.parse((await call({},records)).result.content[0].text).data.items.length,10);
 const next=JSON.parse((await call({offset:20},records)).result.content[0].text).data;assert.equal(next.items[0].id,records[20].id);assert.equal(next.nextOffset,30);
 for(const limit of [0,21,1.5,'10',null])assert.equal((await call({limit},[])).result.isError,true);
 for(const offset of [-1,50,1.5,'0',null])assert.equal((await call({offset},[])).result.isError,true);
});
