"""Timing provisório (sem áudio) para o Ford T: cenas com t0/t1 do storyboard; falas distribuídas no tempo da cena por palavras."""
import json,re,sys
from pathlib import Path
R=json.loads(Path(sys.argv[1] if len(sys.argv)>1 else 'roteiro_fordt.json').read_text()); WPS=2.4
lines={}; scenes={}
for sc in R['cenas']:
    t0,t1=float(sc['t0']),float(sc['t1']); scenes[sc['id']]={'start':t0,'end':t1}
    falas=sc['falas']
    if not falas: continue
    durs=[len(f['texto'].split())/WPS+0.3 for f in falas]; gaps=[f.get('pausa',0.6) for f in falas]
    need=sum(durs)+sum(gaps[:-1]); avail=(t1-t0)-sc.get('pre',0.4)-0.4
    k=min(1.0,avail/need) if need>0 else 1.0
    t=t0+sc.get('pre',0.4)
    for f,d,g in zip(falas,durs,gaps):
        d*=k
        parts=[p.strip() for p in re.split(r'(?<=[.!?:;…])\s+',f['texto']) if p.strip()] or [f['texto']]
        tot=sum(len(p) for p in parts) or 1; acc=0; segs=[]
        for p in parts:
            a=acc/tot*d; acc+=len(p); b=acc/tot*d; segs.append({'text':p,'t0':round(a,3),'t1':round(b,3)})
        lines[f['id']]={'voice':f['voz'],'scene':sc['id'],'text':f['texto'],'start':round(t,3),'dur':round(d,3),'env':[0.5]*int(d*30),'segs':segs,'file':''}
        t+=d+g*k
total=max(s['end'] for s in scenes.values())
out={'fps':30,'sr':48000,'total':round(total,3),'scenes':scenes,'lines':lines,'mock':True}
Path('timing.json').write_text(json.dumps(out,ensure_ascii=False)); print('total',total,'s',len(lines),'falas')
