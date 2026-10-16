"""Pure JS evaluator. No host callbacks, file/network modules or Python objects exposed."""
import json,sys
import quickjs
def evaluate(code,inputs):
    context=quickjs.Context();context.set_memory_limit(32*1024*1024);context.set_time_limit(.2);context.set_max_stack_size(256*1024)
    context.eval(code)
    fn=context.eval('(function(s){return JSON.stringify(solve(JSON.parse(s)));})')
    return [json.loads(fn(json.dumps(value))) for value in inputs]
if __name__=='__main__':
    req=json.loads(sys.stdin.read())
    try:print(json.dumps({'ok':True,'outputs':evaluate(req['code'],req['inputs'])}))
    except Exception as e:print(json.dumps({'ok':False,'errorType':type(e).__name__,'error':str(e)[:800]}))
