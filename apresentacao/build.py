"""Monta a apresentação a partir de src/.

Estrutura:
  src/shell.html               motor, chrome (barra inferior, painéis), Fernando e Roda
  src/slides/NN-id/slide.html  <section data-id="id" class="slide ...">…</section>
  src/slides/NN-id/slide.css   estilos do slide (escopados pelo slide)
  src/slides/NN-id/slide.js    comportamento; registra ganchos com DECK.register('id', {...})
A ordem dos slides é a ordem alfabética das pastas (NN).

Uso:
  python3 build.py              -> index.html (usa assets/) + dist/Treinamento_Gestao_de_Mudancas.html (arquivo único)
  python3 build.py --out X.html -> só um arquivo único em X.html (útil para pré-visualizar)
"""
import base64, pathlib, re, sys

here = pathlib.Path(__file__).parent
src = here / 'src'
MIME = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml'}


def assemble():
    shell = (src / 'shell.html').read_text(encoding='utf-8')
    css, html, js = [], [], []
    for d in sorted(p for p in (src / 'slides').iterdir() if p.is_dir()):
        css.append(f'/* ===== {d.name} ===== */\n' + (d / 'slide.css').read_text(encoding='utf-8'))
        html.append(f'<!-- ===== {d.name} ===== -->\n' + (d / 'slide.html').read_text(encoding='utf-8'))
        js.append(f'<script>/* ===== {d.name} ===== */\n' + (d / 'slide.js').read_text(encoding='utf-8') + '</script>')
    return (shell.replace('/*@SLIDE_CSS@*/', '\n'.join(css))
                 .replace('<!--@SLIDES@-->', '\n'.join(html))
                 .replace('<!--@SLIDE_JS@-->', '\n'.join(js)))


def inline(html):
    def rep(m):
        p = here / m.group(2)
        if not p.exists():
            print('aviso: arquivo ausente', p)
            return m.group(0)
        return '%s"data:%s;base64,%s"' % (m.group(1), MIME[p.suffix], base64.b64encode(p.read_bytes()).decode())
    return re.sub(r'((?:src|href)=)"(assets/[^"]+)"', rep, html)


if __name__ == '__main__':
    page = assemble()
    if '--out' in sys.argv:
        out = pathlib.Path(sys.argv[sys.argv.index('--out') + 1])
        out.write_text(inline(page), encoding='utf-8')
        print(out)
    else:
        (here / 'index.html').write_text(page, encoding='utf-8')
        dist = here / 'dist'
        dist.mkdir(exist_ok=True)
        f = dist / 'Treinamento_Gestao_de_Mudancas.html'
        f.write_text(inline(page), encoding='utf-8')
        print(here / 'index.html')
        print(f, f'{f.stat().st_size / 1024:.0f} KB')
