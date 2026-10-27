#!/usr/bin/env python3
"""Gera dist/GMO_Maestro_Executivo.html (um arquivo só, com as imagens embutidas)."""
import base64, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent
MIME = {'.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg'}


def inline(m):
    p = ROOT / m.group(1)
    return 'src="data:%s;base64,%s"' % (MIME[p.suffix], base64.b64encode(p.read_bytes()).decode())


html = re.sub(r'src="(assets/[^"]+)"', inline, (ROOT / 'index.html').read_text(encoding='utf-8'))
out = ROOT / 'dist' / 'GMO_Maestro_Executivo.html'
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding='utf-8')
print(out, len(html) // 1024, 'KB')
