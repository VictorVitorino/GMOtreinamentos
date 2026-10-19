#!/usr/bin/env python3
"""face_prep.py · recorta cabeça (cabelo + rosto) de uma foto para o boneco de papel.

Uso: python3 -I face_prep.py <foto> <saida.png> [--size 480] [--mode auto|ellipse] [--pad 0.08]
Modo auto: MediaPipe selfie multiclass (cabelo + pele do rosto + pele do corpo acima do queixo).
Modo ellipse: recorte elíptico simples centrado (fallback para fotos pequenas ou sem pessoa detectada).
Saída: PNG RGBA com a cabeça, borda de papel branca (4 px) e leve sombra, altura = --size.
"""
import sys, os, argparse
import numpy as np
from PIL import Image, ImageFilter, ImageOps, ImageDraw, ImageEnhance

HERE = os.path.dirname(os.path.abspath(__file__))
MODELS = os.path.join(HERE, 'models')

def seg_head(im, thr=0.45):
    import mediapipe as mp
    from mediapipe.tasks import python as mpp
    from mediapipe.tasks.python import vision
    base = mpp.BaseOptions(model_asset_path=os.path.join(MODELS, 'selfie_multiclass_256x256.tflite'))
    opts = vision.ImageSegmenterOptions(base_options=base, output_category_mask=False, output_confidence_masks=True)
    arr = np.ascontiguousarray(np.asarray(im.convert('RGB'), dtype=np.uint8))
    with vision.ImageSegmenter.create_from_options(opts) as seg:
        res = seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB, data=arr))
        masks = [m.numpy_view().astype(np.float32).squeeze() for m in res.confidence_masks]
    # 0 bg, 1 hair, 2 body-skin, 3 face-skin, 4 clothes, 5 others(accessories)
    hair, body, face, clothes, acc = masks[1], masks[2], masks[3], masks[4], masks[5]
    head = np.maximum(np.maximum(hair, face), acc * 0.9)
    # pele do corpo só na faixa logo abaixo do rosto (pescoço)
    ys = np.where(face > thr)[0]
    if len(ys):
        chin = ys.max(); H = face.shape[0]
        neck = np.zeros_like(body); neck[chin:min(H, chin + int(0.12 * H)), :] = body[chin:min(H, chin + int(0.12 * H)), :]
        head = np.maximum(head, neck)
    m = np.clip((head - thr) / (1 - thr) * 1.3, 0, 1)
    return Image.fromarray((m * 255).astype(np.uint8), 'L').resize(im.size, Image.BILINEAR), float((face > thr).mean())

def largest_cc(mask_img, thr=100):
    from collections import deque
    m = np.asarray(mask_img) > thr; h, w = m.shape; seen = np.zeros_like(m); best = []
    ys, xs = np.nonzero(m)
    for y0, x0 in zip(ys[::5], xs[::5]):
        if seen[y0, x0]: continue
        q = deque([(y0, x0)]); seen[y0, x0] = True; comp = []
        while q:
            y, x = q.popleft(); comp.append((y, x))
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and m[ny, nx] and not seen[ny, nx]: seen[ny, nx] = True; q.append((ny, nx))
        if len(comp) > len(best): best = comp
    out = np.zeros_like(m)
    if best:
        yy, xx = zip(*best); out[list(yy), list(xx)] = True
    arr = np.asarray(mask_img).copy(); arr[~out] = 0
    return Image.fromarray(arr, 'L')

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('dst')
    ap.add_argument('--size', type=int, default=480); ap.add_argument('--mode', default='auto'); ap.add_argument('--pad', type=float, default=0.08)
    ap.add_argument('--border', type=int, default=5)
    a = ap.parse_args()
    im = Image.open(a.src).convert('RGB')
    # fotos pequenas: amplia antes (suaviza e realça levemente)
    if im.height < 400:
        k = 400 / im.height; im = im.resize((int(im.width * k), 400), Image.LANCZOS)
        im = ImageEnhance.Sharpness(im).enhance(1.3)
    mask = None
    if a.mode == 'auto':
        try:
            mask, cov = seg_head(im)
            if cov < 0.02: mask = None
        except Exception as e:
            print('mediapipe indisponível, usando elipse:', e); mask = None
    if mask is None:
        w, h = im.size; mask = Image.new('L', im.size, 0)
        ImageDraw.Draw(mask).ellipse((w * 0.12, h * 0.04, w * 0.88, h * 0.96), fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(1.5))
    else:
        mask = largest_cc(mask)
        mask = mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    bbox = mask.point(lambda v: 255 if v > 24 else 0).getbbox()
    if not bbox: bbox = (0, 0, im.width, im.height)
    pad = int(a.pad * max(bbox[2] - bbox[0], bbox[3] - bbox[1]))
    box = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(im.width, bbox[2] + pad), min(im.height, bbox[3] + pad))
    im = im.crop(box); mask = mask.crop(box)
    k = a.size / im.height
    im = im.resize((max(1, int(im.width * k)), a.size), Image.LANCZOS); mask = mask.resize(im.size, Image.LANCZOS)
    # borda de papel branca (recorte de revista) + sombra suave
    b = a.border
    edge = mask.filter(ImageFilter.MaxFilter(b * 2 + 1))
    canvas = Image.new('RGBA', (im.width + 24, im.height + 24), (0, 0, 0, 0))
    shadow = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); sh = Image.new('L', canvas.size, 0); sh.paste(edge, (12 + 4, 12 + 6)); sh = sh.filter(ImageFilter.GaussianBlur(6)).point(lambda v: int(v * 0.45))
    shadow.putalpha(sh); canvas.alpha_composite(shadow)
    paper = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); pw = Image.new('RGBA', im.size, (250, 247, 240, 255)); pw.putalpha(edge); paper.paste(pw, (12, 12)); canvas.alpha_composite(paper)
    face = im.convert('RGBA'); face.putalpha(mask); fl = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); fl.paste(face, (12, 12)); canvas.alpha_composite(fl)
    canvas.save(a.dst, optimize=True); print(a.dst, canvas.size)

if __name__ == '__main__':
    main()
