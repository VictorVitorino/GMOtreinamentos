"""Gera dist/Roteiro_Apresentacao.html (arquivo único, offline) a partir de roteiro/roteiro.md.
Uso: python3 roteiro/build_roteiro.py
Convenções do .md: # Ato · ## Slide/Momento (+ linha **hh:mm–hh:mm | N minutos**) · ### Bloco
 "texto" = fala · **Na tela/Na apresentação…** ou linha toda em negrito = dica de tela · *(…)* = pausa/gesto · demais = nota"""
import html, json, pathlib, re

here = pathlib.Path(__file__).parent
src = (here / 'roteiro.md').read_text(encoding='utf-8')

def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)', r'<em>\1</em>', t)
    return t

atos, cur_ato, cur_sec, cur_sub = [], None, None, None
in_quote = False
def new_sub(title):
    global cur_sub
    cur_sub = {'title': title, 'items': []}
    cur_sec['subs'].append(cur_sub)
def add(kind, text):
    global cur_sub
    if cur_sub is None: new_sub('')
    cur_sub['items'].append((kind, text))

blocks = []
for block in re.split(r'\n\s*\n', src.strip()):
    lines = block.strip().split('\n')
    if lines[0].startswith('#') and len(lines) > 1:   # título colado na linha de tempo
        blocks += [lines[0], '\n'.join(lines[1:])]
    else:
        blocks.append(block)
for block in blocks:
    b = block.strip()
    if not b or b == '---':
        in_quote = False if b == '---' else in_quote
        continue
    if b.startswith('# '):
        cur_ato = {'title': b[2:].strip(), 'secs': []}; atos.append(cur_ato); continue
    if b.startswith('## '):
        t = b[3:].strip()
        m = re.match(r'(SLIDE\s+(\d+)|MOMENTO RESERVADO|ABERTURA)\s*[—-]\s*(.*)', t)
        tag = (('Slide ' + m.group(2)) if m and m.group(2) else ('Momento reservado' if t.startswith('MOMENTO') else 'Abertura'))
        cur_sec = {'tag': tag, 'title': (m.group(3) if m else t), 'time': '', 'dur': 0, 'subs': [], 'id': 's%d' % sum(len(a['secs']) for a in atos)}
        cur_ato['secs'].append(cur_sec); cur_sub = None; in_quote = False; continue
    if b.startswith('### '):
        new_sub(b[4:].strip()); in_quote = False; continue
    m = re.match(r'\*\*(\d\d:\d\d)\s*[–-]\s*(\d\d:\d\d)\s*\|\s*(.*?)\*\*$', b)
    if m and cur_sec is not None and not cur_sec['subs']:
        cur_sec['time'] = f'{m.group(1)} – {m.group(2)}'
        cur_sec['durtxt'] = m.group(3)
        d = re.match(r'(\d+)', m.group(3)); cur_sec['dur'] = int(d.group(1)) if d else 0; continue
    if re.fullmatch(r'\*\(.*\)\*', b):
        add('pause', b[2:-2].strip()); continue
    if re.fullmatch(r'\*\*Retomada sugerida:\*\*', b):
        add('label', 'Retomada sugerida'); continue
    if b.startswith('**Na ') or (b.startswith('**') and b.endswith('**') and b.count('**') == 2):
        add('cue', b); continue
    if b.startswith('"') or in_quote:
        end = b.rstrip().endswith('"')
        txt = b
        if txt.startswith('"'): txt = txt[1:]
        if end: txt = txt.rstrip()[:-1]
        add('say', txt)
        in_quote = (b.startswith('"') and not end) or (in_quote and not end)
        continue
    add('note', b)

# ---------- HTML ----------
out_nav, out_main = [], []
n_items = 0
for ai, a in enumerate(atos):
    out_nav.append(f'<div class="nv-ato">{html.escape(a["title"].split(" — ")[0].title())}<small>{html.escape(a["title"].split(" — ",1)[-1].lower().capitalize() if " — " in a["title"] else "")}</small></div>')
    out_main.append(f'<header class="ato" id="a{ai}"><span>{html.escape(a["title"].split(" — ")[0].title())}</span><h2>{html.escape(a["title"].split(" — ",1)[-1].lower().capitalize())}</h2></header>')
    for s in a['secs']:
        out_nav.append(f'<a class="nv" href="#{s["id"]}" data-s="{s["id"]}"><b>{html.escape(s["tag"].replace("Slide ", ""))}</b><span>{html.escape(s["title"])}</span><i>{html.escape(s.get("durtxt","").split(" ")[0])}′</i></a>' if s['tag'].startswith('Slide') else
                        f'<a class="nv res" href="#{s["id"]}" data-s="{s["id"]}"><b>◆</b><span>{html.escape(s["title"])}</span><i>{s["dur"]}′</i></a>')
        parts = [f'<section class="sec{" res" if not s["tag"].startswith("Slide") else ""}" id="{s["id"]}" data-dur="{s["dur"]}" data-title="{html.escape(s["tag"] + " · " + s["title"])}">',
                 f'<div class="sh"><span class="tg">{html.escape(s["tag"])}</span><h3>{html.escape(s["title"])}</h3><span class="tm"><b>{html.escape(s["time"])}</b><em>{html.escape(s.get("durtxt",""))}</em></span></div>']
        for sub in s['subs']:
            if sub['title']:
                parts.append(f'<h4 class="sub">{html.escape(sub["title"])}</h4>')
            for kind, text in sub['items']:
                n_items += 1
                if kind == 'say':
                    parts.append(f'<p class="it say">{inline(text)}</p>')
                elif kind == 'cue':
                    cue = re.sub(r'^\*\*(Na tela|Na apresentação):?\*\*:?\s*', '', text)
                    lab = 'Na tela' if text.startswith('**Na tela') else ('Na apresentação' if text.startswith('**Na apresentação') else 'Ação')
                    if lab == 'Ação' or cue == text:
                        cue = re.sub(r'^\*\*Na tela:\s*', '**', text) if text.startswith('**Na tela:') else text
                        cue = re.sub(r'^\*\*(.*)\*\*$', r'\1', cue.strip())
                        if lab == 'Ação': lab = 'Ação'
                        cue = html.escape(cue, quote=False)
                    else:
                        cue = inline(cue)
                    parts.append(f'<p class="it cue"><span class="cl">{lab}</span>{cue}</p>')
                elif kind == 'pause':
                    parts.append(f'<p class="it pause">{inline(text)}</p>')
                elif kind == 'label':
                    parts.append(f'<p class="lab">{html.escape(text)}</p>')
                else:
                    parts.append(f'<p class="it note">{inline(text)}</p>')
        parts.append('</section>')
        out_main.append('\n'.join(parts))

tpl = (here / 'roteiro.tpl.html').read_text(encoding='utf-8')
page = tpl.replace('<!--NAV-->', '\n'.join(out_nav)).replace('<!--MAIN-->', '\n'.join(out_main))
dist = here.parent / 'dist'; dist.mkdir(exist_ok=True)
f = dist / 'Roteiro_Apresentacao.html'
f.write_text(page, encoding='utf-8')
print(f, f'{f.stat().st_size/1024:.0f} KB', n_items, 'blocos')
