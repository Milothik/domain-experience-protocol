import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
test('unknown experience prefixes and nested suffixes are not intake routes',async()=>{
 for(const path of ['/api/experiences-extra','/api/experiences/a/b']){
  const result=await worker.fetch(new Request('https://example.test'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}),{});
  assert.equal(result.status,404);
 }
});
