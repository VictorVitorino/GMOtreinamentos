#!/usr/bin/env python3
"""make_srt.py [timing.json] [saida.srt] · legenda a partir das falas temporizadas (gerar só com o áudio final).
Regras: ≤ 2 linhas × ≤ 42 caracteres, mínimo 1,0 s, 80 ms de respiro entre blocos, falas da Máquina em itálico."""
import json, sys, textwrap
T=json.load(open(sys.argv[1] if len(sys.argv)>1 else 'timing.json')); out=sys.argv[2] if len(sys.argv)>2 else 'out/legendas.srt'
def tc(s): h=int(s//3600); m=int(s%3600//60); sec=s%60; return f"{h:02d}:{m:02d}:{int(sec):02d},{int(round((sec-int(sec))*1000)):03d}"
lines=sorted(T['lines'].values(),key=lambda L:L['start']); blocks=[]
for L in lines:
    txt=L['text'].strip(); t0=L['start']; t1=L['start']+L['dur']+0.25
    segs=L.get('segs') or [{'text':txt,'t0':0,'t1':L['dur']}]
    # agrupa segmentos até 84 caracteres
    cur=[];
    def flush(a,b,parts):
        if not parts: return
        s=' '.join(p['text'] for p in parts); wrapped=textwrap.wrap(s,42)[:2]
        if len(wrapped)==2 and len(' '.join(textwrap.wrap(s,42)))>len(' '.join(wrapped)): wrapped=textwrap.wrap(s,42)
        for chunk in [wrapped[i:i+2] for i in range(0,len(wrapped),2)]:
            blocks.append([a,b,('<i>'+'\n'.join(chunk)+'</i>') if L.get('voice')=='M' else '\n'.join(chunk)])
    acc=[]; a=t0
    for sg in segs:
        if sum(len(p['text']) for p in acc)+len(sg['text'])>84 and acc:
            flush(a,L['start']+acc[-1]['t1']+0.15,acc); a=L['start']+sg['t0']; acc=[]
        acc.append(sg)
    flush(a,t1,acc)
# duração mínima e respiro
for i,b in enumerate(blocks):
    if b[1]-b[0]<1.0: b[1]=b[0]+1.0
    if i+1<len(blocks) and b[1]>blocks[i+1][0]-0.08: b[1]=max(b[0]+0.6,blocks[i+1][0]-0.08)
with open(out,'w',encoding='utf-8') as f:
    for i,(a,b,s) in enumerate(blocks,1): f.write(f"{i}\n{tc(a)} --> {tc(b)}\n{s}\n\n")
print(out,len(blocks),'blocos')
