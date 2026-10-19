#!/usr/bin/env python3
"""headswap.py · colagem de revista: corpo fotográfico real + cabeça real do participante.

Uso: LD_LIBRARY_PATH=gllib python3 -I headswap.py job.json
job = {"src": "foto.png", "up": 2.5, "out": "out/img/col/metro",
       "figures": [{"name": "doc_elon", "head": "out/img/faces/elon.png",
                    "face": [x,y,w,h] (px da foto original) OU "auto": 0 (índice por x),
                    "scale": 1.25, "rot": -4, "dx": 0, "dy": 0,
                    "keep_hair": true, "crop": [x0,y0,x1,y1] (px originais, opcional)}]}
Saídas: <out>_frame.png (quadro inteiro com cabeças trocadas), <out>_<name>_flat.png (recorte corpo+cabeça com
borda de papel), <out>_<name>_body.png (corpo sem cabeça), <out>_<name>_meta.json (pescoço, escala, rotação).
"""
import sys, os, json
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); MODELS = os.path.join(HERE, 'models')
import mediapipe as mp
from mediapipe.tasks import python as mpp
from mediapipe.tasks.python import vision
try:
    import cv2
except Exception:
    cv2 = None

def mpimg(im):
    return mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(np.asarray(im.convert('RGB'), dtype=np.uint8)))

def detect_faces(im):
    opts = vision.FaceDetectorOptions(base_options=mpp.BaseOptions(model_asset_path=os.path.join(MODELS, 'blaze_face_short_range.tflite')), min_detection_confidence=0.3)
    with vision.FaceDetector.create_from_options(opts) as det:
        res = det.detect(mpimg(im))
    out = []
    for d in res.detections:
        b = d.bounding_box; kp = d.keypoints
        out.append({'box': [b.origin_x, b.origin_y, b.width, b.height], 'kp': [(k.x * im.width, k.y * im.height) for k in kp], 'score': d.categories[0].score})
    out.sort(key=lambda f: f['box'][0]); return out

def segment(im):
    """retorna dict de máscaras float (0..1) no tamanho de im: hair, body, face, clothes, acc, person"""
    opts = vision.ImageSegmenterOptions(base_options=mpp.BaseOptions(model_asset_path=os.path.join(MODELS, 'selfie_multiclass_256x256.tflite')), output_category_mask=False, output_confidence_masks=True)
    with vision.ImageSegmenter.create_from_options(opts) as seg:
        res = seg.segment(mpimg(im)); ms = [m.numpy_view().astype(np.float32).squeeze() for m in res.confidence_masks]
    d = {'bg': ms[0], 'hair': ms[1], 'body': ms[2], 'face': ms[3], 'clothes': ms[4], 'acc': ms[5]}
    d['person'] = 1 - d['bg']
    return d

def mask_touch(im, pts_norm):
    """segmentação interativa (magic touch): união das máscaras dos pontos (x,y normalizados)"""
    from mediapipe.tasks.python.components import containers
    opts = vision.InteractiveSegmenterOptions(base_options=mpp.BaseOptions(model_asset_path=os.path.join(MODELS, 'magic_touch.tflite')), output_category_mask=False, output_confidence_masks=True)
    acc = None
    with vision.InteractiveSegmenter.create_from_options(opts) as seg:
        img = mpimg(im)
        for (x, y) in pts_norm:
            roi = vision.InteractiveSegmenterRegionOfInterest(format=vision.InteractiveSegmenterRegionOfInterest.Format.KEYPOINT, keypoint=containers.keypoint.NormalizedKeypoint(float(x), float(y)))
            conf = seg.segment(img, roi).confidence_masks[0].numpy_view().astype(np.float32).squeeze()
            acc = conf if acc is None else np.maximum(acc, conf)
    return acc

def ellipse_mask(shape, cx, cy, rx, ry):
    yy, xx = np.mgrid[0:shape[0], 0:shape[1]]
    return (((xx - cx) / max(rx, 1)) ** 2 + ((yy - cy) / max(ry, 1)) ** 2 <= 1).astype(np.float32)

def largest_cc(m):
    if cv2 is None: return m
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8), 8)
    if n <= 1: return m
    k = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA]); return (lab == k)

def dilate(m, r):
    if r <= 0: return m
    im = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(int(r) * 2 + 1)); return np.asarray(im) / 255.0

def feather(m, r):
    return np.asarray(Image.fromarray((np.clip(m, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))) / 255.0

def paper_border(rgba, b=6, shadow=True):
    a = rgba.getchannel('A'); edge = a.filter(ImageFilter.MaxFilter(b * 2 + 1))
    W, H = rgba.size; pad = 26
    canvas = Image.new('RGBA', (W + 2 * pad, H + 2 * pad), (0, 0, 0, 0))
    if shadow:
        sh = Image.new('L', canvas.size, 0); sh.paste(edge, (pad + 6, pad + 10)); sh = sh.filter(ImageFilter.GaussianBlur(8)).point(lambda v: int(v * 0.5))
        s = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); s.putalpha(sh); canvas.alpha_composite(s)
    pw = Image.new('RGBA', rgba.size, (250, 247, 240, 255)); pw.putalpha(edge); p = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); p.paste(pw, (pad, pad)); canvas.alpha_composite(p)
    f = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); f.paste(rgba, (pad, pad)); canvas.alpha_composite(f)
    return canvas, pad

def head_geom(head):
    """bbox visível da cabeça (sem sombra): usa alpha>200"""
    a = np.asarray(head.getchannel('A')); ys, xs = np.where(a > 200)
    return xs.min(), ys.min(), xs.max(), ys.max()

def main(job):
    J = json.load(open(job)); up = J.get('up', 2.0)
    src = Image.open(J['src']).convert('RGB')
    if up != 1:
        src = src.resize((int(src.width * up), int(src.height * up)), Image.LANCZOS); src = ImageEnhance.Sharpness(src).enhance(1.25)
    W, H = src.size
    faces = None
    frame = src.copy(); frame_np = np.asarray(frame).copy()
    heads_layer = Image.new('RGBA', src.size, (0, 0, 0, 0))
    out = J['out']; os.makedirs(os.path.dirname(out), exist_ok=True)
    report = []
    for fg in J['figures']:
        name = fg['name']
        if 'face' in fg:
            fx, fy, fw, fh = [v * up for v in fg['face']]; kp = None
        else:
            if faces is None:
                faces = detect_faces(src); print('faces detectadas:', [(round(f['box'][0]), round(f['box'][1]), round(f['box'][2]), round(f['box'][3])) for f in faces])
            f = faces[fg.get('auto', 0)]; fx, fy, fw, fh = f['box']; kp = f['kp']
        # recorte de trabalho em volta da figura
        if 'crop' in fg:
            cx0, cy0, cx1, cy1 = [int(v * up) for v in fg['crop']]
        else:
            cx0 = int(max(0, fx - fw * 2.2)); cx1 = int(min(W, fx + fw * 3.2)); cy0 = int(max(0, fy - fh * 1.6)); cy1 = H
        crop = src.crop((cx0, cy0, cx1, cy1))
        seg = segment(crop)
        cov = float((seg['person'] > 0.45).mean()); fallback = cov < 0.03 or 'touch' in fg
        if fallback:
            cw, ch = crop.size; fcx, fcy = fx - cx0 + fw / 2, fy - cy0 + fh / 2
            pts = fg.get('touch') or [[fcx / cw, (fcy + fh * 2.0) / ch], [fcx / cw, (fcy + fh * 3.6) / ch], [fcx / cw, fcy / ch]]
            pts = [[min(0.99, max(0.01, a)), min(0.99, max(0.01, b))] for a, b in pts]
            tm = mask_touch(crop, pts)
            # tentativa 1: segmentação selfie num recorte justo da figura (ampliado), que o modelo entende melhor
            tx0, ty0 = int(max(0, fcx - fw * 1.7)), int(max(0, fcy - fh * 1.3)); tx1, ty1 = int(min(cw, fcx + fw * 1.7)), ch
            tight = crop.crop((tx0, ty0, tx1, ty1)); kk = max(1.0, 640 / max(1, tight.width)); tight2 = tight.resize((int(tight.width * kk), int(tight.height * kk)), Image.LANCZOS)
            sg2 = segment(tight2); pm = Image.fromarray((np.clip(sg2['person'], 0, 1) * 255).astype(np.uint8)).resize(tight.size, Image.BILINEAR)
            cov2 = float((np.asarray(pm) > 115).mean())
            if cov2 > 0.08:
                full = np.zeros_like(tm); full[ty0:ty1, tx0:tx1] = np.asarray(pm) / 255.0; tm = full.astype(np.float32); print(f'[{name}] selfie no recorte justo (cobertura={cov2:.2f})')
                for kname in ('hair', 'face', 'body', 'clothes', 'acc'):
                    m2 = Image.fromarray((np.clip(sg2[kname], 0, 1) * 255).astype(np.uint8)).resize(tight.size, Image.BILINEAR); f2 = np.zeros_like(tm); f2[ty0:ty1, tx0:tx1] = np.asarray(m2) / 255.0; seg[kname] = np.maximum(seg[kname], f2)
            elif cv2 is not None and float((tm > 0.5).mean()) > 0.55:
                arr = cv2.cvtColor(np.asarray(crop), cv2.COLOR_RGB2BGR); gm = np.zeros(arr.shape[:2], np.uint8)
                rx0 = int(max(0, fcx - fw * 1.7)); ry0 = int(max(0, fcy - fh * 0.9)); rx1 = int(min(cw - 1, fcx + fw * 1.7)); ry1 = ch - 1
                bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
                try:
                    cv2.grabCut(arr, gm, (rx0, ry0, rx1 - rx0, ry1 - ry0), bgd, fgd, 6, cv2.GC_INIT_WITH_RECT)
                    tm = np.where((gm == 1) | (gm == 3), 1.0, 0.0).astype(np.float32)
                    print(f'[{name}] grabcut (toque cobriu demais)')
                except Exception as e: print('grabcut falhou', e)
            seg['person'] = np.maximum(seg['person'], tm)
            seg['face'] = np.maximum(seg['face'], ellipse_mask(tm.shape, fcx, fcy, fw * 0.58, fh * 0.66))
            seg['hair'] = np.maximum(seg['hair'], ellipse_mask(tm.shape, fcx, fcy - fh * 0.25, fw * 0.62, fh * 0.6) * (1 - seg['face']))
            print(f'[{name}] segmentação por toque (cobertura selfie={cov:.3f})')
        # região da cabeça original a apagar
        face_m = seg['face']; hair_m = seg['hair']
        thr = 0.4
        # limita às vizinhanças da caixa do rosto (evita apagar rosto de outra pessoa)
        lim = np.zeros_like(face_m); lx0, ly0 = int(fx - cx0 - fw * 0.9), int(fy - cy0 - fh * 1.3); lx1, ly1 = int(fx - cx0 + fw * 1.9), int(fy - cy0 + fh * 1.45)
        lim[max(0, ly0):max(0, ly1), max(0, lx0):max(0, lx1)] = 1
        erase = (face_m > thr) * lim
        if not fg.get('keep_hair', False): erase = np.maximum(erase, (hair_m > thr) * lim)
        # pele do corpo logo acima do colarinho (orelhas/pescoço alto) dentro da caixa do rosto
        bodyskin = (seg['body'] > thr) * lim; ys_face = np.where(erase > 0)[0]
        if len(ys_face):
            chin = ys_face.max(); keep_neck = np.zeros_like(erase); keep_neck[: int(chin - fh * 0.05), :] = 1; erase = np.maximum(erase, bodyskin * keep_neck)
        erase = dilate(erase, max(2, int(fw * fg.get('erase_grow', 0.05))))
        erase = largest_cc(erase > 0.5) if erase.max() > 0 else erase
        erase_f = feather(erase.astype(np.float32), 1.5)
        # preenche o buraco no quadro inteiro (inpaint) antes de colar a cabeça
        if cv2 is not None and erase.max() > 0:
            sub = frame_np[cy0:cy1, cx0:cx1]; m8 = (erase_f > 0.3).astype(np.uint8) * 255
            m8 = cv2.dilate(m8, np.ones((5, 5), np.uint8))
            filled = cv2.inpaint(cv2.cvtColor(sub, cv2.COLOR_RGB2BGR), m8, 7, cv2.INPAINT_TELEA); frame_np[cy0:cy1, cx0:cx1] = cv2.cvtColor(filled, cv2.COLOR_BGR2RGB)
        # cabeça nova
        head = Image.open(fg['head']).convert('RGBA'); hx0, hy0, hx1, hy1 = head_geom(head); hw = hx1 - hx0; hh = hy1 - hy0
        target_w = fw * fg.get('scale', 1.25); k = target_w / hw
        head_s = head.resize((int(head.width * k), int(head.height * k)), Image.LANCZOS)
        rot = fg.get('rot', 0)
        # ponto do queixo da cabeça nova (no png escalado) e ponto de pescoço no quadro
        chin_pt = ((hx0 + hw / 2) * k, hy1 * k)
        if kp is not None:
            mouth = kp[3]; neck_xy = (mouth[0], mouth[1] + fh * 0.42)
        else:
            neck_xy = (fx + fw / 2, fy + fh * 1.02)
        neck_xy = (neck_xy[0] + fg.get('dx', 0) * up, neck_xy[1] + fg.get('dy', 0) * up)
        head_r = head_s.rotate(rot, resample=Image.BICUBIC, expand=True)
        # posição do queixo após rotação (em torno do centro)
        import math
        cxh, cyh = head_s.width / 2, head_s.height / 2; a = math.radians(rot)
        dxp, dyp = chin_pt[0] - cxh, chin_pt[1] - cyh
        rx = dxp * math.cos(a) + dyp * math.sin(a); ry = -dxp * math.sin(a) + dyp * math.cos(a)
        chin_r = (head_r.width / 2 + rx, head_r.height / 2 + ry)
        px, py = int(round(neck_xy[0] - chin_r[0])), int(round(neck_xy[1] - chin_r[1]))
        heads_layer.alpha_composite(head_r, (max(0, px), max(0, py)), (max(0, -px), max(0, -py)))
        # ---- recorte da figura (corpo + cabeça) ----
        person = seg['person'] > 0.45
        if 'xclip' in fg:
            xa, xb = [int(v * up) - cx0 for v in fg['xclip']]; person[:, :max(0, xa)] = False; person[:, max(0, xb):] = False
        for ex in fg.get('exclude', []):
            ex0, ey0, ex1, ey1 = [int(v * up) for v in ex]; person[max(0, ey0 - cy0):max(0, ey1 - cy0), max(0, ex0 - cx0):max(0, ex1 - cx0)] = False
        # fica só com o componente que contém a região do rosto (ou o maior)
        if cv2 is not None and person.any():
            n, lab, stats, _ = cv2.connectedComponentsWithStats(person.astype(np.uint8), 8)
            fyc, fxc = int(fy - cy0 + fh * 0.5), int(fx - cx0 + fw * 0.5)
            fyc = min(max(0, fyc), lab.shape[0] - 1); fxc = min(max(0, fxc), lab.shape[1] - 1)
            k = lab[fyc, fxc]
            if k == 0:
                sub = lab[max(0, fyc - int(fh)):fyc + int(fh * 2), max(0, fxc - int(fw)):fxc + int(fw)]; vals = sub[sub > 0]
                k = np.bincount(vals).argmax() if len(vals) else 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
            person = lab == k
        body = person & ~(erase > 0.5)
        body_f = feather(body.astype(np.float32), 1.2)
        body_rgba = crop.convert('RGBA'); body_rgba.putalpha(Image.fromarray((body_f * 255).astype(np.uint8)))
        # aplica inpaint também no corpo (sob a cabeça) para não sobrar borda do rosto antigo
        body_rgba = Image.fromarray(np.dstack([frame_np[cy0:cy1, cx0:cx1], (body_f * 255).astype(np.uint8)]), 'RGBA')
        flat = body_rgba.copy(); hl = heads_layer.crop((cx0, cy0, cx1, cy1)); flat.alpha_composite(hl)
        # recorta pela caixa útil
        bb = flat.getchannel('A').point(lambda v: 255 if v > 30 else 0).getbbox()
        flat = flat.crop(bb); body_c = body_rgba.crop(bb)
        flat_p, pad = paper_border(flat); body_p, _ = paper_border(body_c)
        flat_p.save(f'{out}_{name}_flat.png'); body_p.save(f'{out}_{name}_body.png')
        if J.get('debug'):
            pan = [crop, Image.fromarray((np.clip(seg['person'], 0, 1) * 255).astype(np.uint8)).convert('RGB'), Image.fromarray((erase_f * 255).astype(np.uint8)).convert('RGB'), flat_p.convert('RGB')]
            Wd = sum(q.width for q in pan) + 40; Hd = max(q.height for q in pan); sh = Image.new('RGB', (Wd, Hd), (40, 40, 40)); xx = 0
            for q in pan: sh.paste(q, (xx, 0)); xx += q.width + 10
            sh.save(f'{out}_{name}_dbg.jpg', quality=85)
        meta = {'neck': [neck_xy[0] - cx0 - bb[0] + pad, neck_xy[1] - cy0 - bb[1] + pad], 'size': flat_p.size, 'head': os.path.basename(fg['head']), 'head_scale': k, 'head_box': [hx0, hy0, hx1, hy1], 'head_size': list(head.size), 'rot': rot, 'face_px': [fx, fy, fw, fh], 'frame_offset': [cx0 + bb[0] - pad, cy0 + bb[1] - pad], 'frame_neck': [neck_xy[0], neck_xy[1]], 'frame_size': [W, H]}
        json.dump(meta, open(f'{out}_{name}_meta.json', 'w'), indent=1, default=lambda v: float(v) if hasattr(v, '__float__') else str(v)); report.append((name, flat_p.size, meta['neck']))
    Image.fromarray(frame_np).save(f'{out}_frame_base.png')
    frame = Image.fromarray(frame_np).convert('RGBA'); frame.alpha_composite(heads_layer); frame.convert('RGB').save(f'{out}_frame.png')
    print('ok', out, report)

if __name__ == '__main__':
    main(sys.argv[1])
