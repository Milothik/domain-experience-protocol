import fs from 'node:fs';
let s=`import test from 'node:test';import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
import {clone,commit,branch,validateRepository,diff,contextPacket,emptyRepository} from '../web/core.mjs';
import {scope,experience,database,request} from './campaign-fixture.mjs';
`;
for(const id of ['P01','P02','P03','P04','P05']){const x=fs.readFileSync('participation/baseline/acceptance-'+id+'.mjs','utf8');s+=x.slice(x.indexOf("test('"));}
fs.writeFileSync('tests/continuation-regressions.test.mjs',s);
