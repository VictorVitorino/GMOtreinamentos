#!/usr/bin/env python3
"""make_roteiro.py <script.json> <roteiro.json> · converte o JSON da sala de roteiristas no formato do pipeline de áudio.
Vozes: N = narrador (Lax), M = a Máquina (falas entre « »)."""
import json, re, sys
S=json.load(open(sys.argv[1])); out=sys.argv[2]
cenas=[]
for i,sc in enumerate(S['scenes'],1):
    sid=f"S{i:02d}"; narr=(sc.get('narration') or '').strip(); falas=[]
    if narr:
        # separa falas da Máquina «...» do narrador; mantém a ordem
        toks=re.split(r'(«[^»]*»)', narr)
        k=0
        for tok in toks:
            tok=tok.strip()
            if not tok: continue
            if tok.startswith('«'):
                falas.append({'id':f's{i:02d}{chr(97+k)}','voz':'M','texto':tok.strip('«»').strip(),'pausa':0.5}); k+=1
            else:
                # quebra o narrador em frases curtas (uma fala por sentença longa, mas agrupa fragmentos de 1-2 palavras)
                sents=[p.strip() for p in re.split(r'(?<=[.!?…])(?<!\.\.\.)\s+', tok) if p.strip()]
                sents=[x for x in sents]
                # 'Isso tem nome. Gestão da Mudança.' vira duas falas (pausa da revelação)
                tmp=[]
                for s_ in sents:
                    if s_.startswith('Isso tem nome.') and 'Gestão' in s_: tmp+= ['Isso tem nome.', s_.split('Isso tem nome.',1)[1].strip()]
                    else: tmp.append(s_)
                sents=tmp
                buf=[]
                for s_ in sents:
                    buf.append(s_)
                    if sum(len(b.split()) for b in buf)>=4 or s_ == sents[-1] or s_.startswith('Isso tem nome'):
                        falas.append({'id':f's{i:02d}{chr(97+k)}','voz':'N','texto':' '.join(buf),'pausa':0.6}); k+=1; buf=[]
    pre=0.4
    if i==16: pre=1.2  # respiro antes da revelação
    cenas.append({'id':sid,'nome':sc.get('scene') or sc.get('title') or sid,'t0':sc['t0'],'t1':sc['t1'],'pre':pre,'falas':falas,'visual':(sc.get('visual') or '')[:400]})
# pausas especiais
for c in cenas:
    for f in c['falas']:
        if f['texto'].startswith('Gestão da Mudança'): f['pausa']=1.5
        if f['texto'].startswith('Isso tem nome'): f['pausa']=1.0
        if f['texto'].startswith('Quem aperta o botão?'): f['pausa']=1.5
        if f['texto'].startswith('Hipoteticamente'): f['pausa']=0.9
R={'titulo':S.get('title'),'versao':'v3','alvo_segundos':int(S.get('estimated_duration_s',130)),
   'vozes':{'N':'Narrador · Lax (ElevenLabs tS45q0QcrDHqHoaWdCDR)','M':'A Máquina · Monica (ElevenLabs 9K5K6kEHsM7u8gMJHU9C), direção monótona'},
   'mensagem_central':'A máquina sempre funcionou. Faltava levar as pessoas junto. Isso tem nome: Gestão da Mudança.','cenas':cenas}
json.dump(R,open(out,'w'),ensure_ascii=False,indent=1)
n=sum(len(c['falas']) for c in cenas); w=sum(len(f['texto'].split()) for c in cenas for f in c['falas'])
print(out, len(cenas),'cenas', n,'falas', w,'palavras')
for c in cenas:
    for f in c['falas']: print(f"  {f['id']} [{f['voz']}] {f['texto']}")
