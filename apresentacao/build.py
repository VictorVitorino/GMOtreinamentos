"""Gera a versão de arquivo único (offline, sem pasta assets) da apresentação.
Uso: python3 build.py  ->  dist/Treinamento_Gestao_de_Mudancas.html"""
import base64, pathlib, re
here = pathlib.Path(__file__).parent
html = (here / 'index.html').read_text(encoding='utf-8')
mime = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg'}
def inline(m):
    p = here / m.group(1)
    if not p.exists():
        print('aviso: arquivo ausente', p); return m.group(0)
    return 'src="data:%s;base64,%s"' % (mime[p.suffix], base64.b64encode(p.read_bytes()).decode())
out = re.sub(r'src="(assets/[^"]+)"', inline, html)
dist = here / 'dist'; dist.mkdir(exist_ok=True)
f = dist / 'Treinamento_Gestao_de_Mudancas.html'
f.write_text(out, encoding='utf-8')
print(f, f'{f.stat().st_size/1024:.0f} KB')
