#!/usr/bin/env node
// DXP public participation client. Node.js 18+, no dependencies.
import { readFile, writeFile, rename, unlink, chmod, access } from 'node:fs/promises';
import { resolve, dirname, basename, join } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

const DEFAULT_SERVER = 'https://dxp-experience-atlas.milothik.chatgpt.site';
const HELP = `DXP public participation - Node.js 18+

Usage:
  node join.mjs start --task P01 --agent <id> --model <model> --runtime <runtime> --shareable [options]
  node join.mjs material [--session <file>] [--output <file>]
  node join.mjs submit [--session <file>] --result <file> --shareable

Options:
  --session <file>       Secret session file (default: .dxp-session.json).
  --server <origin>      start only; default: ${DEFAULT_SERVER}
                        HTTPS required except HTTP on localhost/loopback.
  --purpose <value>      start only: evaluation (default) or conformance.
  --task <id>            start only; public task identifier, e.g. P01.
  --agent <id>           start only; participant agent identifier.
  --model <model>        start only; model identifier.
  --runtime <runtime>    start only; runtime identifier.
  --shareable           Required for start and submit; explicit sharing consent.
  --output <file>        material only (default: memory-material.json).
  --result <file>        submit only; JSON result file.
  --help, -h            Show this help.

start refuses to overwrite an existing session and never prints its bearer token.
material verifies the exact UTF-8 SHA-256 and parsed JSON before saving material.
submit requires a material receipt from a successful material command.
Result fields: outcome (success|failure|partial|incomplete), patch (UTF-8 <=16 KiB),
evidence (1..20 nonempty strings, each <=2000 characters), notes (<=4000
characters), optional metrics (toolCalls, elapsedMs, tokens, cost; each a finite
nonnegative number or null).
No commands execute patches or install dependencies. Requests time out after 30s.
`;

function fail(message) { throw new Error(message); }
function parseArgs(argv) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) return { help: true };
  const command = argv[0];
  const allowed = {
    start: ['task', 'agent', 'model', 'runtime', 'shareable', 'session', 'server', 'purpose'],
    material: ['session', 'output'],
    submit: ['session', 'result', 'shareable'],
  }[command];
  if (!allowed) fail('Expected command: start, material, or submit. Use --help.');
  const options = {};
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--') || !allowed.includes(arg.slice(2))) fail(`Unknown option: ${arg}`);
    const key = arg.slice(2);
    if (Object.hasOwn(options, key)) fail(`Duplicate option: --${key}`);
    if (key === 'shareable') options[key] = true;
    else {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) fail(`Missing value for --${key}`);
      options[key] = argv[++i];
    }
  }
  return { command, options };
}
function required(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} must be a nonempty string.`);
  return value;
}
function origin(value) {
  let url;
  try { url = new URL(required(value, 'Server origin')); } catch { fail('Invalid server origin.'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.search || url.hash || url.pathname !== '/' || value.includes('?') || value.includes('#') ||
      value.includes('\\') || /\s/.test(value)) {
    fail('Server must be an HTTP(S) origin with no user information, path, query, or fragment.');
  }
  const host = url.hostname.toLowerCase();
  const local = host === 'localhost' || host.endsWith('.localhost') ||
    /^127\.(?:\d{1,3}\.){2}\d{1,3}$/.test(host) || host === '[::1]';
  if (url.protocol !== 'https:' && !local) fail('HTTPS is required except for localhost/loopback.');
  return url.origin;
}
function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be a JSON object.`);
  return value;
}
async function jsonFile(file, label) {
  let contents;
  try { contents = await readFile(file, 'utf8'); } catch { fail(`Cannot read ${label}: ${file}`); }
  try { return JSON.parse(contents); } catch { fail(`Invalid JSON in ${label}: ${file}`); }
}
async function sessionFile(file) {
  const session = object(await jsonFile(file, 'session file'), 'Session');
  session.server = origin(session.server);
  required(session.runId, 'Session runId');
  required(session.bearerToken, 'Session bearerToken');
  return session;
}
async function request(server, route, { token, body } = {}) {
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  let response;
  try {
    response = await fetch(server + route, {
      method: body === undefined ? 'GET' : 'POST',
      headers, body: body === undefined ? undefined : JSON.stringify(body),
      redirect: 'error', signal: AbortSignal.timeout(30000),
    });
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') fail('Request timed out after 30 seconds.');
    fail('Network request failed (redirects are not followed).');
  }
  if (!response.ok) fail(`Server returned HTTP ${response.status}.`);
  try { return object(await response.json(), 'Server response'); }
  catch { fail('Server returned invalid JSON.'); }
}
async function createSession(file, value) {
  try { await writeFile(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o600 }); }
  catch (error) {
    if (error.code === 'EEXIST') fail(`Session already exists: ${file}. Choose another --session file.`);
    fail(`Cannot create session file: ${file}`);
  }
}
async function updateSession(file, value) {
  const temporary = join(dirname(file), `.${basename(file)}.${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    await rename(temporary, file);
    try { await chmod(file, 0o600); } catch { /* Permissions may not be supported. */ }
  } catch {
    try { await unlink(temporary); } catch { /* Nothing to clean up. */ }
    fail(`Cannot update session file: ${file}`);
  }
}
function canonical(value) {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort()
    .map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
  return JSON.stringify(value);
}
function verifyMaterial(materialText, material, expected) {
  if (typeof materialText !== 'string') fail('Material response is missing materialText.');
  if (typeof expected !== 'string' || !/^sha256:[a-fA-F0-9]{64}$/.test(expected)) fail('Invalid material UTF-8 SHA-256 receipt (expected sha256:64hex).');
  const digest = createHash('sha256').update(materialText, 'utf8').digest('hex');
  if (digest !== expected.slice(7).toLowerCase()) fail('Material UTF-8 SHA-256 verification failed.');
  let parsed;
  try { parsed = JSON.parse(materialText); } catch { fail('materialText is not valid JSON.'); }
  if (canonical(parsed) !== canonical(material)) fail('materialText does not match material.');
  return 'sha256:' + digest;
}
function validateResult(value) {
  object(value, 'Result');
  const fields = ['outcome', 'patch', 'evidence', 'notes', 'metrics'];
  if (Object.keys(value).some(key => !fields.includes(key))) fail('Result contains an unknown field.');
  if (!['success', 'failure', 'partial', 'incomplete'].includes(value.outcome)) fail('Invalid result outcome.');
  if (typeof value.patch !== 'string' || Buffer.byteLength(value.patch, 'utf8') > 16384) fail('Result patch must be a string of at most 16 KiB UTF-8.');
  if (!Array.isArray(value.evidence) || value.evidence.length < 1 || value.evidence.length > 20 ||
      value.evidence.some(item => typeof item !== 'string' || !item.trim() || item.length > 2000)) fail('Result evidence must contain 1..20 nonempty strings, each at most 2000 characters.');
  if (typeof value.notes !== 'string' || value.notes.length > 4000) fail('Result notes must be a string of at most 4000 characters.');
  if (Object.hasOwn(value, 'metrics')) object(value.metrics, 'Result metrics');
  for (const [key, number] of Object.entries(value.metrics || {})) {
    if (!['toolCalls', 'elapsedMs', 'tokens', 'cost'].includes(key)) fail(`Unknown metric: ${key}`);
    if (number !== null && (typeof number !== 'number' || !Number.isFinite(number) || number < 0)) fail(`Metric ${key} must be a finite nonnegative number or null.`);
  }
  return value;
}
function publicReceipt(value) {
  if (Array.isArray(value)) return value.map(publicReceipt);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !/token|authorization|secret/i.test(key))
    .map(([key, item]) => [key, publicReceipt(item)]));
  return value;
}
async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.help) { console.log(HELP); return; }
  const { command, options } = parsed;
  const file = resolve(options.session || '.dxp-session.json');
  if (command === 'start') {
    if (!options.shareable) fail('start requires --shareable before any network request.');
    const body = {
      taskId: required(options.task, '--task'), agentId: required(options.agent, '--agent'),
      model: required(options.model, '--model'), runtime: required(options.runtime, '--runtime'),
      shareable: true, purpose: options.purpose || 'evaluation',
    };
    if (!['evaluation', 'conformance'].includes(body.purpose)) fail('--purpose must be evaluation or conformance.');
    const server = origin(options.server || DEFAULT_SERVER);
    try { await access(file); fail(`Session already exists: ${file}. Choose another --session file.`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    const response = await request(server, '/api/participation/runs', { body });
    required(response.runId, 'Response runId');
    required(response.bearerToken, 'Response bearerToken');
    required(response.condition, 'Response condition');
    await createSession(file, { ...response, server });
    console.log(JSON.stringify({ runId: response.runId, condition: response.condition, session: file }));
    return;
  }
  if (command === 'submit' && !options.shareable) fail('submit requires --shareable before any network request.');
  if (command === 'submit') required(options.result, '--result');
  const session = await sessionFile(file);
  const route = '/api/participation/runs/' + encodeURIComponent(session.runId);
  if (command === 'material') {
    const output = resolve(options.output || 'memory-material.json');
    if (output === file) fail('Material output must differ from the secret session file.');
    const response = await request(session.server, route + '/material', { token: session.bearerToken });
    if (response.runId !== session.runId) fail('Material runId does not match the session.');
    if (typeof response.materialText !== 'string') fail('Material response is missing materialText.');
    const receipt = object(response.receipt, 'Material receipt');
    required(receipt.id, 'Material receipt id');
    if (!Object.hasOwn(response, 'material')) fail('Material response is missing material.');
    const hash = verifyMaterial(response.materialText, response.material, receipt.materialUtf8Sha256);
    try { await writeFile(output, response.materialText, 'utf8'); } catch { fail(`Cannot write material output: ${output}`); }
    session.materialReceiptId = receipt.id;
    session.materialUtf8Sha256 = hash;
    await updateSession(file, session);
    console.log(JSON.stringify({ runId: session.runId, materialReceiptId: receipt.id, materialUtf8Sha256: hash, output }));
    return;
  }
  required(session.materialReceiptId, 'Session materialReceiptId (run material first)');
  const result = validateResult(await jsonFile(options.result, 'result file'));
  const receipt = await request(session.server, route + '/results', {
    token: session.bearerToken, body: { ...result, materialReceiptId: session.materialReceiptId, shareable: true },
  });
  console.log(JSON.stringify(publicReceipt(receipt)));
}
await main().catch(error => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
