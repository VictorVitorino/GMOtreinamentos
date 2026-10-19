#!/usr/bin/env python3
"""prep_img.py · tratamentos de colagem para fotos reais (determinístico).

Uso:
  python3 -I prep_img.py <entrada> <saida.png> [--w 1200] [--mode bw|sepia|color|duo]
         [--halftone 0..1] [--dot 6] [--torn 10] [--seed 3] [--paper 0..1] [--grain 0.15]
         [--contrast 1.15] [--border 28] [--border-color #f4efe2] [--crop x,y,w,h] [--fade 0]
Gera PNG com alpha (bordas rasgadas opcionais) pronto para a composição HTML.
"""
import sys, argparse, math, random
from PIL import Image, ImageOps, ImageFilter, ImageDraw, ImageChops, ImageEnhance
import numpy as np

def parse():
    p = argparse.ArgumentParser()
    p.add_argument('src'); p.add_argument('dst')
    p.add_argument('--w', type=int, default=1200)
    p.add_argument('--h', type=int, default=0, help='altura alvo (recorta para o aspecto se >0)')
    p.add_argument('--mode', default='color', choices=['bw', 'sepia', 'color', 'duo'])
    p.add_argument('--duo', default='#1E2A44,#F2E8D5', help='cores do duotone (sombra,luz)')
    p.add_argument('--halftone', type=float, default=0.0, help='força da trama de meio-tom 0..1')
    p.add_argument('--dot', type=int, default=6, help='passo da trama em px')
    p.add_argument('--torn', type=float, default=0.0, help='amplitude do rasgo em px (0=sem)')
    p.add_argument('--seed', type=int, default=1)
    p.add_argument('--paper', type=float, default=0.0, help='textura de papel multiplicada 0..1')
    p.add_argument('--grain', type=float, default=0.0)
    p.add_argument('--contrast', type=float, default=1.0)
    p.add_argument('--bright', type=float, default=1.0)
    p.add_argument('--border', type=int, default=0, help='moldura de papel fotográfico em px')
    p.add_argument('--border-color', default='#f4efe2')
    p.add_argument('--crop', default='', help='x,y,w,h em fração 0..1 da imagem de origem')
    p.add_argument('--fade', type=float, default=0.0, help='esmaecimento das bordas 0..1')
    p.add_argument('--vignette', type=float, default=0.0)
    p.add_argument('--blur', type=float, default=0.0)
    p.add_argument('--posterize', type=int, default=0)
    return p.parse_args()

def hexrgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def halftone(gray, step, strength, seed):
    """Trama de pontos circulares (ângulo 45°) misturada com a imagem original."""
    w, h = gray.size
    g = np.asarray(gray, dtype=np.float32) / 255.0
    # grade girada: amostra a luminância no centro de cada célula
    out = Image.new('L', (w, h), 255)
    d = ImageDraw.Draw(out)
    ang = math.radians(45)
    ca, sa = math.cos(ang), math.sin(ang)
    diag = int(math.hypot(w, h))
    sm = gray.filter(ImageFilter.GaussianBlur(step * 0.6))
    gs = np.asarray(sm, dtype=np.float32) / 255.0
    for j in range(-diag // step, diag // step + 1):
        for i in range(-diag // step, diag // step + 1):
            x = i * step * ca - j * step * sa + w / 2
            y = i * step * sa + j * step * ca + h / 2
            if x < -step or y < -step or x > w + step or y > h + step: continue
            xi, yi = int(min(max(x, 0), w - 1)), int(min(max(y, 0), h - 1))
            v = gs[yi, xi]
            r = (1.0 - v) ** 0.9 * step * 0.72
            if r < 0.4: continue
            d.ellipse((x - r, y - r, x + r, y + r), fill=0)
    out = out.filter(ImageFilter.GaussianBlur(0.5))
    return Image.blend(gray, out, strength)

def torn_mask(w, h, amp, seed, feather=1.2):
    rnd = random.Random(seed)
    def edge(n, length):
        # ruído 1D suave: soma de senos com fases aleatórias + ruído fino
        ph = [rnd.random() * 6.28 for _ in range(6)]
        fr = [rnd.uniform(0.6, 1.4) * k for k in (2, 3.7, 6.1, 11, 19, 33)]
        xs = np.linspace(0, 1, n)
        v = np.zeros(n)
        for k, (p, f) in enumerate(zip(ph, fr)):
            v += np.sin(xs * f * 6.28 + p) / (k + 1.2)
        v += np.array([rnd.uniform(-1, 1) for _ in range(n)]) * 0.35
        v = v / (np.abs(v).max() + 1e-6)
        return v * amp
    top, bot = edge(w, w), edge(w, w)
    lef, rig = edge(h, h), edge(h, h)
    pts = []
    for i in range(w): pts.append((i, amp * 1.2 + top[i]))
    for j in range(h): pts.append((w - amp * 1.2 + rig[j], j))
    for i in range(w - 1, -1, -1): pts.append((i, h - amp * 1.2 + bot[i]))
    for j in range(h - 1, -1, -1): pts.append((amp * 1.2 + lef[j], j))
    m = Image.new('L', (w, h), 0)
    ImageDraw.Draw(m).polygon(pts, fill=255)
    if feather: m = m.filter(ImageFilter.GaussianBlur(feather))
    return m

def paper_tex(w, h, seed, amount):
    rnd = np.random.RandomState(seed)
    n = rnd.normal(0, 1, (h // 2 + 1, w // 2 + 1)).astype(np.float32)
    t = Image.fromarray(np.clip(128 + n * 26, 0, 255).astype(np.uint8), 'L').resize((w, h), Image.BILINEAR)
    t = t.filter(ImageFilter.GaussianBlur(0.8))
    fib = Image.fromarray(np.clip(128 + rnd.normal(0, 1, (h, w)) * 9, 0, 255).astype(np.uint8), 'L')
    t = ImageChops.add(t, fib, 2.0, -128)
    t = ImageEnhance.Contrast(t).enhance(amount)
    return t

def main():
    a = parse()
    im0 = Image.open(a.src)
    a0 = im0.getchannel('A') if im0.mode in ('RGBA','LA') else None
    im = im0.convert('RGB')
    if a.crop:
        x, y, w, h = [float(v) for v in a.crop.split(',')]
        W, Hh = im.size
        box = (int(x * W), int(y * Hh), int((x + w) * W), int((y + h) * Hh)); im = im.crop(box)
        if a0 is not None: a0 = a0.crop(box)
    if a.h > 0:
        im = ImageOps.fit(im, (a.w, a.h), Image.LANCZOS, centering=(0.5, 0.5))
        if a0 is not None: a0 = ImageOps.fit(a0, (a.w, a.h), Image.LANCZOS, centering=(0.5, 0.5))
    else:
        r = a.w / im.width
        im = im.resize((a.w, max(1, int(im.height * r))), Image.LANCZOS)
        if a0 is not None: a0 = a0.resize(im.size, Image.LANCZOS)
    if a.blur > 0: im = im.filter(ImageFilter.GaussianBlur(a.blur))
    if a.contrast != 1: im = ImageEnhance.Contrast(im).enhance(a.contrast)
    if a.bright != 1: im = ImageEnhance.Brightness(im).enhance(a.bright)
    if a.posterize: im = ImageOps.posterize(im, a.posterize)
    gray = ImageOps.grayscale(im)
    if a.halftone > 0:
        gray_ht = halftone(gray, a.dot, a.halftone, a.seed)
    else:
        gray_ht = gray
    if a.mode == 'bw':
        base = gray_ht.convert('RGB')
    elif a.mode == 'sepia':
        base = ImageOps.colorize(gray_ht, black=(38, 28, 18), white=(243, 232, 206), mid=(150, 118, 84))
    elif a.mode == 'duo':
        dk, lt = [hexrgb(c) for c in a.duo.split(',')]
        base = ImageOps.colorize(gray_ht, black=dk, white=lt)
    else:
        base = im if a.halftone == 0 else Image.composite(im, ImageOps.colorize(gray_ht, (0, 0, 0), (255, 255, 255)), Image.new('L', im.size, int(255 * (1 - a.halftone))))
        if a.halftone > 0:
            # trama colorida: multiplica a imagem pela trama em cinza
            ht_rgb = gray_ht.convert('RGB')
            base = ImageChops.multiply(im, Image.blend(Image.new('RGB', im.size, (255, 255, 255)), ht_rgb, a.halftone * 0.85))
    if a.paper > 0:
        t = paper_tex(*base.size, a.seed + 7, 1.0).convert('RGB')
        base = Image.blend(base, ImageChops.multiply(base, t), a.paper)
    if a.grain > 0:
        rnd = np.random.RandomState(a.seed + 11)
        g = rnd.normal(0, 1, (base.height, base.width, 1)).astype(np.float32) * 255 * a.grain * 0.25
        arr = np.asarray(base, dtype=np.float32) + g
        base = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGB')
    if a.vignette > 0:
        w, h = base.size
        yy, xx = np.mgrid[0:h, 0:w]
        d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
        v = np.clip(1 - a.vignette * np.clip(d - 0.55, 0, 1) ** 1.6 * 1.8, 0, 1)
        arr = np.asarray(base, dtype=np.float32) * v[..., None]
        base = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGB')
    out = base.convert('RGBA')
    if a0 is not None: out.putalpha(a0)
    if a.border > 0:
        b = a.border
        bg = Image.new('RGBA', (out.width + 2 * b, out.height + 2 * b), hexrgb(a.border_color) + (255,))
        bg.paste(out, (b, b)); out = bg
    if a.torn > 0:
        m = torn_mask(out.width, out.height, a.torn, a.seed)
        alpha = ImageChops.multiply(out.getchannel('A'), m)
        out.putalpha(alpha)
    if a.fade > 0:
        w, h = out.size
        yy, xx = np.mgrid[0:h, 0:w]
        ex = np.minimum(np.minimum(xx, w - 1 - xx) / (w * 0.5 * a.fade), np.minimum(yy, h - 1 - yy) / (h * 0.5 * a.fade))
        f = np.clip(ex, 0, 1) ** 0.8
        al = (np.asarray(out.getchannel('A'), dtype=np.float32) * f).astype(np.uint8)
        out.putalpha(Image.fromarray(al, 'L'))
    out.save(a.dst, optimize=True)
    print(a.dst, out.size)

if __name__ == '__main__':
    main()
