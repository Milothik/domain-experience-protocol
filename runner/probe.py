"""Real, unscored gateway probe. Credential enters through hidden stdin only."""
import datetime, hashlib, json, pathlib, secrets, sys, time, urllib.request, urllib.error

def read_private():
    if sys.stdin.isatty():
        import termios
        old=termios.tcgetattr(sys.stdin.fileno())
        new=termios.tcgetattr(sys.stdin.fileno());new[3]&=~termios.ECHO
        termios.tcsetattr(sys.stdin.fileno(),termios.TCSADRAIN,new)
        print('Ready for private runner JSON on stdin (input is hidden).',flush=True)
        try: return json.loads(sys.stdin.readline())
        finally: termios.tcsetattr(sys.stdin.fileno(),termios.TCSADRAIN,old)
    return json.loads(sys.stdin.readline())

def utc(): return datetime.datetime.now(datetime.timezone.utc).isoformat()
def request(base,token,path,body=None):
    started=time.perf_counter();data=None if body is None else json.dumps(body).encode()
    req=urllib.request.Request(base.rstrip('/')+path,data=data,headers={'Authorization':'Bearer '+token,'Content-Type':'application/json'})
    try:
        with urllib.request.urlopen(req,timeout=45) as response:
            code=response.status;raw=response.read();headers=dict(response.headers)
    except urllib.error.HTTPError as error:
        code=error.code;raw=error.read();headers=dict(error.headers)
    except Exception as error:
        return {'at':utc(),'status':None,'elapsedSeconds':time.perf_counter()-started,'errorType':type(error).__name__,'error':str(error).replace(token,'[redacted]')[:800]},None
    try: parsed=json.loads(raw)
    except (json.JSONDecodeError,UnicodeDecodeError): parsed={'nonJsonBody':raw.decode(errors='replace')[:1000]}
    record={'at':utc(),'status':code,'elapsedSeconds':time.perf_counter()-started,'bodySha256':'sha256:'+hashlib.sha256(raw).hexdigest(),'requestId':headers.get('x-request-id') or headers.get('X-Request-Id') or headers.get('x-databricks-request-id')}
    if code!=200: record['error']=json.loads(json.dumps(parsed).replace(token,'[redacted]'))
    return record,parsed

def main():
    config=read_private();base=config['base_url'];token=config['token']
    out=pathlib.Path(__file__).resolve().parent/'evidence';out.mkdir(exist_ok=True)
    report={'id':'dxp-runner-unscored-probe-20261016','startedAt':utc(),'projectId':config['project_id'],'branchId':config['branch_id'],'baseUrl':base,'scope':'ai_gateway:invoke','scoredTrials':0,'planChanged':False,'creditsPurchased':False,'modelFamilyAttestation':'Gateway catalog owned_by plus returned model metadata; provider backend revision not cryptographically attested.'}
    catalog_record,catalog=request(base,token,'/v1/models');report['catalogRequest']=catalog_record
    if catalog_record['status']==200 and isinstance(catalog,dict):
        (out/'catalog.json').write_text(json.dumps(catalog,indent=2)+'\n')
        models=catalog.get('data',[])
        report['catalogModelCount']=len(models)
        chosen=[]
        for preferred in [('gpt-6-luna','gpt-5-nano','gpt-5-mini'),('claude-haiku-5-5','claude-haiku-4-5','gemini-3-flash','qwen3-next-80b-a3b-instruct')]:
            item=next((m for key in preferred for m in models if m.get('id')==key and m.get('enabled',True)),None)
            if item: chosen.append(item)
        report['selectedModels']=[{'id':m['id'],'owned_by':m.get('owned_by'),'pricing':m.get('pricing')} for m in chosen]
        probes=[]
        for m in chosen:
            nonce=secrets.token_hex(8);body={'model':m['id'],'messages':[{'role':'user','content':'Unscored connectivity test. Return only JSON with sum equal to 37 + 58 and nonce equal to '+nonce+'. Do not explain.'}],'max_tokens':80}
            record,response=request(base,token,'/v1/chat/completions',body)
            record['requestedModel']=m['id'];record['catalogOwner']=m.get('owned_by');record['prompt']=body['messages'][0]['content']
            if record['status']==200 and isinstance(response,dict):
                choices=response.get('choices',[]);message=(choices[0].get('message') or {}) if choices else {}
                answer=message.get('content');record.update({'returnedModel':response.get('model'),'completionId':response.get('id'),'usage':response.get('usage'),'visibleAnswer':answer,'finishReason':choices[0].get('finish_reason') if choices else None})
                try:
                    value=json.loads(answer.strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip());record['answerVerified']=value.get('sum')==95 and value.get('nonce')==nonce
                except Exception: record['answerVerified']=False
            probes.append(record)
        report['probes']=probes;report['twoFamiliesInvoked']=len({p.get('catalogOwner') for p in probes if p.get('answerVerified')})>=2
    else: report['twoFamiliesInvoked']=False
    report['completedAt']=utc()
    (out/'probe.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2),flush=True)

if __name__=='__main__':main()
