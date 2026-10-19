#!/usr/bin/env python3
"""build_doc.py <script.json> <saida.md> · monta o storytelling completo a partir do JSON da sala de roteiristas + seções fixas."""
import json, sys, re, os
HERE=os.path.dirname(os.path.abspath(__file__))
S=json.load(open(sys.argv[1])); out=sys.argv[2]
rd=lambda n: open(os.path.join(HERE,n),encoding='utf-8').read().strip()
alts=json.load(open(os.path.join(HERE,'alternativas.json')))
def tc(s):
    s=float(s); m=int(s//60); return f"{m}:{s-60*m:04.1f}"
scenes=S.get('scenes',[])
total=S.get('estimated_duration_s') or (scenes[-1]['t1'] if scenes else 130)
narr=S.get('narration_full','').strip()
words=len(narr.split())
# ---- barra de tempo em texto ----
def timeline():
    rows=[]
    for i,sc in enumerate(scenes,1):
        d=float(sc['t1'])-float(sc['t0']); bar='█'*max(1,round(d/2))
        nm=(sc.get('scene') or sc.get('title') or '').split('—')[0].strip()
        rows.append(f"| S{i:02d} | {tc(sc['t0'])}–{tc(sc['t1'])} | {d:4.1f} s | `{bar}` | {nm} |")
    return "| Cena | Tempo | Dur. | | Bloco |\n|---|---|---|---|---|\n"+"\n".join(rows)
def narration_block():
    lines=[]
    for ln in narr.split('\n'):
        ln=ln.strip()
        if not ln: continue
        if ln.startswith('«'): lines.append(f"> 🤖 **A MÁQUINA:** {ln.strip('«»')}")
        else: lines.append(f"> 🎙️ {ln}")
    return "\n>\n".join(lines)
def scene_blocks():
    parts=[]
    for i,sc in enumerate(scenes,1):
        nm=sc.get('scene') or sc.get('title') or f'Cena {i}'
        parts.append(f"### S{i:02d} · {tc(sc['t0'])} → {tc(sc['t1'])} · {nm}\n")
        parts.append(f"**Imagem.** {sc.get('visual','').strip()}\n")
        if sc.get('narration'): parts.append(f"**Narração.** {sc['narration'].strip()}\n")
        else: parts.append("**Narração.** — (silêncio de voz; só som e imagem)\n")
        if sc.get('text_on_screen'): parts.append(f"**Texto na tela.** {sc['text_on_screen'].strip()}\n")
        cams=sc.get('cameos') or []
        if cams:
            parts.append("**Participações da turma.**\n")
            parts.append("| Slot | Papel | Reação à mudança | Entrada / saída | Piada |\n|---|---|---|---|---|")
            for c in cams:
                parts.append(f"| {c.get('slot','')} | {c.get('role','')} | {c.get('reaction','')} | {c.get('entry_exit','')} | {c.get('gag','')} |")
            parts.append("")
        if sc.get('sfx_music'): parts.append(f"**Som.** {sc['sfx_music'].strip()}\n")
    return "\n".join(parts)
def cameo_table():
    rows=["| Slot | Cenas | Reação à mudança (o que a pessoa representa) | Corpo real | Época |","|---|---|---|---|---|"]
    for c in S.get('cameo_plan',[]): rows.append(f"| **{c.get('slot')}** | {c.get('scene','')} | {c.get('reaction','')} | {c.get('body','')} | {c.get('era','')} |")
    return "\n".join(rows)
def sheets():
    parts=[]
    for ch in S.get('character_sheets',[]):
        parts.append(f"**{ch.get('name')}** · *{ch.get('era','')}*\n\n- Corpo e figurino: {ch.get('body_design','')}\n- Adereços: {ch.get('props','')}\n- Animação: {ch.get('animation','')}\n")
    return "\n".join(parts)
def alts_table():
    rows=["| Conceito | Logline | Média do júri (5 lentes) | O que aproveitamos |","|---|---|---|---|"]
    taken=S.get('what_was_taken_from_each_concept','')
    for a in sorted(alts,key=lambda a:-a['media']):
        t=a['title']; use='**vencedor — espinha do filme**' if a['media']==max(x['media'] for x in alts) else ''
        if not use:
            m=re.search(re.escape(t.split(' — ')[0].upper()[:14])+r'[^:]*:\s*([^.]+\.)',taken.upper()) 
            use=''
        rows.append(f"| **{t}** | {a['logline'] or ''} | {a['media']} ({', '.join(map(str,a['notas']))}) | {use} |")
    return "\n".join(rows)+"\n\n"+("**Peças roubadas dos outros conceitos (síntese do chefe de roteiro):** "+taken if taken else "")
def gag_map():
    return """| Piada que volta | 1ª vez | Volta | Payoff |
|---|---|---|---|
| **Quem aperta?** (tecla verde CONFIRMA) | S03 — Cientista aponta pro Jovem, Jovem pro Cientista, uma volta lenta, o Jovem aperta | S07 — Cientista aperta com o cotovelo (café nas duas mãos) · S10 — Analista de 1985 aperta pela dupla sem olhar | S15 — catorze pessoas apontam pro vizinho, o gato boceja, catorze mãos apertam juntas: THUNK |
| **A Máquina como GPS educado** | S03 «Olá. Sou a Máquina.» | S06 «Erro: ninguém explicou. Recalculando.» · S08 «Trânsito à frente.» · S12 «Passageiros: zero.» · S14 «Recalculando.» | S17 «Você chegou ao seu destino.» — a tese dita como punchline antes de alguém explicá-la |
| **Feno no radiador + buzina** | S06 — Rapaz do Feno dá feno ao carro, o carro buzina, ele pula | — | S13 — ele é o primeiro a embarcar em 2026; a Máquina buzina igual; desta vez ele ri na hora |
| **Moeda × Pix** | S01 — a moeda do Cientista falha, o Pix do Jovem compra a tecla | S10 — o seletor vira touch; o Cientista guarda o telefone de disco no bolso | S17 — no retrato final, o Cientista ainda segura o telefone de disco |
| **O Fotógrafo de todas as épocas** | S05 — câmera de fole, pano preto, POOF | S08 compacta · S10 filmadora de ombro | S17 — celular com o capuz do moletom no lugar do pano preto: a ferramenta muda, o propósito não |
| **O cartão perfurado** | S06 — carimbo ENTENDER | S09 CONFIAR · S13 APRENDER | S15 ADOTAR completa o cartão → S16 o cartão vira e revela o nome |
| **O gato dono do carro** | S11 — já instalado no capô | S12 — vira a cara pra selfie | S15 — boceja no silêncio cômico · S17 — dorme no retrato |"""
doc=f"""# {S.get('title','QUEM APERTA O BOTÃO?')} — storytelling completo (v3)

> Vídeo de abertura do treinamento de Gestão da Mudança · **{tc(total)}** · pt-BR · 16:9 Full HD · colagem real (corpos de foto + cabeças reais da turma) · {words} palavras de narração em duas vozes.
> Documento gerado pela sala de roteiristas (6 conceitos → 5 jurados → chefe de roteiro → 3 críticos) e consolidado para aprovação. Substitui o `ROTEIRO_CENAS.md` (v2) como guia de produção; o briefing (`BRIEFING_CLAUDE.md`) continua sendo a espinha obrigatória.

## 0 · Versão executiva (para apresentar em 1 minuto)

**Logline.** {S.get('logline','')}

**Por que funciona.** A história nunca explica Gestão da Mudança: ela faz a plateia *sentir* quatro vezes a mesma cena (a máquina funciona, alguém trava, um gesto humano destrava, THUNK do carimbo) e só no fim dá nome ao que todos já entenderam. O humor é visual e situacional (feno no radiador, braços que viram semáforo, manual de doze volumes virando almofada, corredor das ideias geniais com troféu "FUNCIONA 100%" cheio de teia), a turma entra como reações humanas — nunca como alvo — e a revelação ganha 12 segundos de respiro.

**Início divertido:** a dupla improvável e a tecla verde comprada numa máquina de lanche. **Meio divertido:** cada época tem um "quem aperta?" diferente e um colega que reage ao novo de um jeito reconhecível. **Fim divertido:** catorze mãos apertam juntas, o gato boceja, e "Gestão da Mudança" cai como nome de algo que a sala acabou de viver. Última frase: *Próxima parada: esta sala.*

**Reação esperada:** "caramba, que massa — entendi por que gestão da mudança é importante."

---

{rd('diagnostico_v2.md')}

## 2 · Oportunidades que o júri encontrou

- **Um motor, não uma linha do tempo:** a dupla + a tecla CONFIRMA dão à história pergunta, repetição e resposta.
- **Segunda voz:** a Máquina (GPS educada e imperturbável) anuncia a tese como punchline antes que alguém a diga — comédia de voz barata e poderosa.
- **O custo de não gerir a mudança aparece sem sermão:** o corredor das ideias geniais que ninguém usou é o único momento que converte "que massa" em "entendi por que importa".
- **Cameos com função:** cada colega é um verbo vivido (entender, confiar, aprender, adotar) e volta no final — nada é figuração.
- **Linguagem de colagem real** (sua direção de 19/10): corpos fotográficos de época + cabeça real pinada = o visual mais memorável e o mais barato de produzir com as fotos que você já tem.

## 3 · A história em uma página

Dois sujeitos que não combinaram nada caminham na mesma direção numa estação: um Cientista excêntrico (rosto de Elon Musk, mudo, só pictogramas) e um Jovem cético (Gabriel). Na máquina de lanche da estação, a moeda do Cientista falha; o Pix do Jovem compra a única peça que faltava: uma **tecla verde CONFIRMA**. O Cientista montou uma máquina do tempo com o que tinha em casa — banco de carro antigo, relógio de estação, telefone de disco, máquina de escrever como visor e uma xícara de café como combustível. A Máquina fala, educada como um GPS: *Disque o ano.* O Jovem disca 1-9-0-8. E aí começa a pergunta do filme: **quem aperta?**

Em **1908**, sair de casa era um projeto: a carroça atola, o relógio dispara. Chega o Ford T — *não o primeiro do mundo, o primeiro que muita gente podia ter* — e a reação é humana: alguém dá feno ao radiador, o carro buzina de volta. A Máquina registra: *Erro: ninguém explicou. Recalculando.* O Jovem pega o giz e explica com desenhos. THUNK: primeiro carimbo, **ENTENDER**.

Em **1965**, todo mundo tem carro — logo, todo mundo tem trânsito. O engenheiro propõe "MAIS FAIXAS" e o engarrafamento alarga junto; o guarda vira semáforo; no ponto, a barba do passageiro cresce enquanto o relógio conta anos. Até que uma motorista larga o carro antigo, pendura a chave no relógio e aperta o cinto. THUNK: **CONFIAR**.

Em **1985**, a rota é calculada por um PC que cospe um mapa infinito. O seletor da Máquina vira touch; o Cientista guarda o telefone de disco no bolso, com carinho. Em **2026**, "atualização instalada" — hipoteticamente — a Máquina ganha rotores, neon e um gato no capô. As portas abrem… e **ninguém entra**. Um quer o manual (doze volumes), outra quer o vídeo, um olha pra baixo, outra procura o volante. Silêncio absoluto. Então quem levou o susto em 1908 entra primeiro, e quem leu o manual mostra o cinto a quem tinha medo. THUNK: **APRENDER**.

A Máquina erra o corredor e entra onde moram as ideias geniais que ninguém usou: PLANILHA 4.0, APP INTERNO, PROCESSO REVISADO v7_final_FINAL — todas com troféu "FUNCIONA 100%" e teia de aranha. De volta ao céu: *quem aperta o botão?* Todo mundo aponta para o vizinho, o gato boceja… e **catorze mãos apertam juntas**. THUNK: **ADOTAR**, cartão completo. O cartão vira: *É por isso que existe.* E o nome cai, em letras grandes e lentas: **GESTÃO DA MUDANÇA**. A Máquina: *Você chegou ao seu destino.* Narrador: *Próxima parada: esta sala.*

## 4 · Roteiro de narração (duas vozes · {words} palavras)

{narration_block()}

**Narrador — persona.** {S.get('narrator_persona','')}

## 5 · Linha do tempo

{timeline()}

## 6 · Storyboard cena a cena

{scene_blocks()}

## 7 · Mapa das piadas que voltam (e pagam)

{gag_map()}

**Resumo do motor cômico (chefe de roteiro).** {S.get('running_gag','')}

**Como a revelação ganha.** {S.get('final_reveal','')}

**Cartela final.** {S.get('end_card','')}

## 8 · Elenco: slots da turma e fichas de personagem

{cameo_table()}

> Os P-códigos são **slots**: quem é quem, você decide (e qualquer pessoa pode trocar de papel). Nenhum nome, sobrenome ou e-mail aparece na tela ou na narração. Papéis sensíveis (medo de altura, cauteloso) só com o OK da pessoa. Fotos: você entrega em boa qualidade depois e eu troco — o encaixe é automático.

### Fichas

{sheets()}

{rd('secoes_fixas.md')}

**Direção de voz (chefe de roteiro).** {S.get('voice_direction','')}

{rd('manifesto_assets.md')}

## 9 · Fatos, direitos e o que evitar

**Fatos a manter verificados.**
{chr(10).join('- '+f for f in S.get('facts_to_verify',[]))}

**Evitar.**
{chr(10).join('- '+f for f in S.get('avoid',[]))}

**Decisões do solicitante que prevalecem sobre a cautela do júri (registradas):** usar a foto do metrô e a foto de Elon Musk que você enviou, recortadas de verdade, com as cabeças trocadas (uso interno de treinamento, paródia). Mitigações mantidas: etiqueta "O CIENTISTA", nenhuma fala atribuída, micro-legenda "paródia · cena fictícia", nenhum título/logo/trilha/carro do filme, linha legal na cartela final.

## 10 · Soluções alternativas consideradas (e por que não)

{alts_table()}

## 11 · Ganhos esperados e diferenciais

| Ganho | Como o filme entrega |
|---|---|
| Engenheiros céticos dizem "entendi por que importa" sem terem sido palestrados | cadeia causal mostrada 4× + custo visível (corredor das ideias) + revelação tardia |
| Pelo menos 4 risadas altas na sala | feno/buzina · MAIS FAIXAS · v7_final_FINAL · catorze mãos + gato |
| A turma se vê sem se expor | reações humanas (não defeitos), pictogramas em vez de falas, slots trocáveis |
| Memória de longo prazo | a pergunta "quem aperta o botão?" vira bordão interno do treinamento |
| Produção barata e editável | motor HTML/SVG determinístico; trocar uma foto = regenerar; trilha e SFX sintetizados, sem direitos de terceiros |

**Diferenciais inovadores:** segunda voz de GPS como narradora da tese; cartão perfurado como quebra-cabeça que a plateia vê encher; colagem real com cabeças pinadas por colchete; referência de época com fac-símile recriado (sem erro histórico); salto no tempo com relâmpago de papel ligando o carro voador às épocas (sua referência "após o carro voar").

## 12 · Próximos passos

1. **Sua aprovação** deste storytelling (ou ajustes) → gero a locução final (Narrador *Lax* + Máquina) e só então travo os tempos.
2. Você entrega as **fotos em boa qualidade** quando puder; eu troco as cabeças (o encaixe é automático) e defino com você quem é quem nos slots.
3. Produção: animatic com cartões → teste de frio (2 pessoas, contar risadas) → render Full HD + SRT sincronizado ao áudio final → commit no repositório.

*Arquivo gerado por `producao/doc/build_doc.py` a partir do JSON da sala de roteiristas; regenerado após cada rodada de crítica.*
"""
open(out,'w',encoding='utf-8').write(doc); print(out, len(doc)//1024,'KB', words,'palavras')
