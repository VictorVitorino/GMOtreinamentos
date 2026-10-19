#!/usr/bin/env python3
"""cutout.py · recorte de fundo local (sem rede durante o uso).

Modos:
  white   fundo branco/claro e contínuo até as bordas (objetos isolados de banco de imagens)
  touch   MediaPipe Interactive Segmenter (MagicTouch): clique em pontos normalizados --pt x,y [--pt ...]
  deeplab MediaPipe DeepLabV3 (classes VOC): --cls person|car|bus|train|tvmonitor|bottle|chair|bicycle|horse ...
  person  MediaPipe selfie multiclass (pessoa inteira)

Uso: python3 -I cutout.py <entrada> <saida.png> --mode touch --pt 0.5,0.5 [--feather 1.5] [--w 1600]
Modelos em ./models (baixados de storage.googleapis.com/mediapipe-models).
"""
import sys, argparse, os
from PIL import Image, ImageFilter, ImageOps, ImageChops, ImageDraw
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
MODELS = os.path.join(HERE, 'models')
VOC = ['background', 'aeroplane', 'bicycle', 'bird', 'boat', 'bottle', 'bus', 'car', 'cat', 'chair', 'cow', 'diningtable', 'dog', 'horse', 'motorbike', 'person', 'pottedplant', 'sheep', 'sofa', 'train', 'tvmonitor']

def parse():
    p = argparse.ArgumentParser()
    p.add_argument('src'); p.add_argument('dst')
    p.add_argument('--mode', default='touch', choices=['white', 'touch', 'deeplab', 'person', 'grabcut'])
    p.add_argument('--pt', action='append', default=[], help='x,y normalizados (modo touch); vários permitidos')
    p.add_argument('--cls', default='person')
    p.add_argument('--tol', type=int, default=28, help='tolerância do branco (modo white)')
    p.add_argument('--feather', type=float, default=1.2)
    p.add_argument('--erode', type=int, default=0, help='encolhe a máscara em px (remove halo)')
    p.add_argument('--grow', type=int, default=0, help='expande a máscara em px')
    p.add_argument('--w', type=int, default=0, help='largura de saída (0 = original)')
    p.add_argument('--thr', type=float, default=0.5, help='limiar de confiança')
    p.add_argument('--rect', default='0.05,0.05,0.9,0.9', help='x,y,w,h normalizados do retângulo inicial (grabcut)')
    p.add_argument('--iters', type=int, default=6)
    p.add_argument('--keep-largest', action='store_true', help='mantém só o maior componente')
    p.add_argument('--crop', action='store_true', help='recorta ao conteúdo (bbox da alpha) com margem')
    return p.parse_args()

def largest_component(mask):
    """maior componente conexo de uma máscara binária (numpy, BFS iterativo)."""
    m = mask.astype(np.uint8)
    h, w = m.shape
    seen = np.zeros_like(m, dtype=bool)
    best, best_n = None, 0
    from collections import deque
    ys, xs = np.nonzero(m)
    for y0, x0 in zip(ys[::7], xs[::7]):  # amostragem para acelerar
        if seen[y0, x0]: continue
        q = deque([(y0, x0)]); seen[y0, x0] = True; comp = []
        while q:
            y, x = q.popleft(); comp.append((y, x))
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and m[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True; q.append((ny, nx))
        if len(comp) > best_n:
            best_n, best = len(comp), comp
    out = np.zeros_like(m, dtype=bool)
    if best:
        yy, xx = zip(*best); out[list(yy), list(xx)] = True
    return out

def mask_white(im, tol):
    g = np.asarray(im.convert('RGB'), dtype=np.int16)
    dist = (255 - g.min(axis=2))  # distância ao branco pelo canal mais escuro
    bg_like = (dist <= tol).astype(np.uint8) * 255
    # preenche a partir das bordas: só o fundo conectado às bordas sai
    pil = Image.fromarray(bg_like, 'L')
    flood = Image.new('L', pil.size, 0)
    fl = ImageDraw.Draw(flood)
    arr = np.asarray(pil)
    H, W = arr.shape
    seeds = [(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1), (W // 2, 0), (W // 2, H - 1), (0, H // 2), (W - 1, H // 2)]
    work = pil.copy()
    for s in seeds:
        if work.getpixel(s) == 255:
            ImageDraw.floodfill(work, s, 128)
    bg = (np.asarray(work) == 128)
    alpha = (~bg).astype(np.float32)
    # suaviza a transição usando a distância ao branco perto da borda
    soft = np.clip((dist - tol * 0.4) / (tol * 1.2), 0, 1)
    alpha = np.minimum(alpha, np.maximum(soft, alpha * 0.0 + (alpha > 0) * soft))
    alpha = np.where(bg, 0, np.maximum(alpha, soft * (~bg)))
    return alpha

def mp_image(im):
    import mediapipe as mp
    arr = np.asarray(im.convert('RGB'), dtype=np.uint8)
    return mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(arr))

def mask_touch(im, pts, thr):
    import mediapipe as mp
    from mediapipe.tasks import python as mpp
    from mediapipe.tasks.python import vision
    from mediapipe.tasks.python.components import containers
    base = mpp.BaseOptions(model_asset_path=os.path.join(MODELS, 'magic_touch.tflite'))
    opts = vision.InteractiveSegmenterOptions(base_options=base, output_category_mask=False, output_confidence_masks=True)
    acc = None
    with vision.InteractiveSegmenter.create_from_options(opts) as seg:
        img = mp_image(im)
        for p in pts:
            x, y = [float(v) for v in p.split(',')]
            roi = vision.InteractiveSegmenterRegionOfInterest(format=vision.InteractiveSegmenterRegionOfInterest.Format.KEYPOINT, keypoint=containers.keypoint.NormalizedKeypoint(x, y))
            res = seg.segment(img, roi)
            conf = res.confidence_masks[0].numpy_view().astype(np.float32).squeeze()
            acc = conf if acc is None else np.maximum(acc, conf)
    if acc.shape != (im.height, im.width):
        acc = np.asarray(Image.fromarray((acc * 255).astype(np.uint8), 'L').resize(im.size, Image.BILINEAR), dtype=np.float32) / 255
    return np.clip((acc - thr) / max(1e-3, (1 - thr)) * 1.4, 0, 1)

def mask_deeplab(im, cls, thr):
    import mediapipe as mp
    from mediapipe.tasks import python as mpp
    from mediapipe.tasks.python import vision
    base = mpp.BaseOptions(model_asset_path=os.path.join(MODELS, 'deeplab_v3.tflite'))
    opts = vision.ImageSegmenterOptions(base_options=base, output_category_mask=False, output_confidence_masks=True)
    with vision.ImageSegmenter.create_from_options(opts) as seg:
        res = seg.segment(mp_image(im))
        idx = VOC.index(cls)
        conf = res.confidence_masks[idx].numpy_view().astype(np.float32).squeeze()
    if conf.shape != (im.height, im.width):
        conf = np.asarray(Image.fromarray((conf * 255).astype(np.uint8), 'L').resize(im.size, Image.BILINEAR), dtype=np.float32) / 255
    return np.clip((conf - thr) / max(1e-3, (1 - thr)) * 1.4, 0, 1)

def mask_person(im, thr):
    import mediapipe as mp
    from mediapipe.tasks import python as mpp
    from mediapipe.tasks.python import vision
    base = mpp.BaseOptions(model_asset_path=os.path.join(MODELS, 'selfie_multiclass_256x256.tflite'))
    opts = vision.ImageSegmenterOptions(base_options=base, output_category_mask=False, output_confidence_masks=True)
    with vision.ImageSegmenter.create_from_options(opts) as seg:
        res = seg.segment(mp_image(im))
        # 0 background, 1 hair, 2 body-skin, 3 face-skin, 4 clothes, 5 others
        conf = 1 - res.confidence_masks[0].numpy_view().astype(np.float32).squeeze()
    if conf.shape != (im.height, im.width):
        conf = np.asarray(Image.fromarray((conf * 255).astype(np.uint8), 'L').resize(im.size, Image.BILINEAR), dtype=np.float32) / 255
    return np.clip((conf - thr) / max(1e-3, (1 - thr)) * 1.4, 0, 1)

def mask_grabcut(im, rect, iters):
    import cv2
    arr = cv2.cvtColor(np.asarray(im.convert('RGB')), cv2.COLOR_RGB2BGR)
    h, w = arr.shape[:2]
    x, y, rw, rh = [float(v) for v in rect.split(',')]
    r = (int(x * w), int(y * h), int(rw * w), int(rh * h))
    mask = np.zeros((h, w), np.uint8)
    bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
    cv2.grabCut(arr, mask, r, bgd, fgd, iters, cv2.GC_INIT_WITH_RECT)
    fg = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 1.0, 0.0).astype(np.float32)
    return fg

def main():
    a = parse()
    im = Image.open(a.src).convert('RGB')
    if a.w and im.width > a.w:
        im = im.resize((a.w, int(im.height * a.w / im.width)), Image.LANCZOS)
    if a.mode == 'white':
        alpha = mask_white(im, a.tol)
    elif a.mode == 'touch':
        pts = a.pt or ['0.5,0.5']
        alpha = mask_touch(im, pts, a.thr)
    elif a.mode == 'deeplab':
        alpha = mask_deeplab(im, a.cls, a.thr)
    elif a.mode == 'grabcut':
        alpha = mask_grabcut(im, a.rect, a.iters)
    else:
        alpha = mask_person(im, a.thr)
    m = Image.fromarray((np.clip(alpha, 0, 1) * 255).astype(np.uint8), 'L')
    if a.keep_largest:
        binm = np.asarray(m) > 100
        big = largest_component(binm)
        m = Image.fromarray(np.where(big, np.asarray(m), 0).astype(np.uint8), 'L')
    if a.erode > 0: m = m.filter(ImageFilter.MinFilter(a.erode * 2 + 1))
    if a.grow > 0: m = m.filter(ImageFilter.MaxFilter(a.grow * 2 + 1))
    if a.feather > 0: m = m.filter(ImageFilter.GaussianBlur(a.feather))
    out = im.convert('RGBA'); out.putalpha(m)
    if a.crop:
        bbox = m.point(lambda v: 255 if v > 8 else 0).getbbox()
        if bbox:
            pad = 12
            out = out.crop((max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(out.width, bbox[2] + pad), min(out.height, bbox[3] + pad)))
    out.save(a.dst, optimize=True)
    cov = float(np.asarray(m).mean() / 255)
    print(a.dst, out.size, f'cobertura={cov:.2f}')

if __name__ == '__main__':
    main()
