#!/usr/bin/env python3
"""prep_audio3.py · vídeo v3 "Antes do nome": atempo, corte de silêncio, envelope 30/s,
segmentação por pontuação alinhada às pausas reais e linha do tempo das cenas.
O PLAN é gerado a partir do roteiro3.json (ordem das cenas/falas; campos opcionais
"pre" na cena e "pausa" na fala, em segundos)."""
import json, re, subprocess, sys, wave, numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parent
AUDIO = ROOT / "audio"; PROC = ROOT / "proc"; PROC.mkdir(exist_ok=True)
ROTEIRO = ROOT / "roteiro_fordt.json"
SR = 48000; FPS = 30; HOP = SR // FPS
TARGET_TOTAL = float(sys.argv[1]) if len(sys.argv) > 1 else 200.0
BASE = {"N": 1.0, "M": 1.0}
MAXF = {"N": 1.07, "M": 1.04}

def decode(path, factor):
    cmd = ["/usr/bin/ffmpeg","-v","error","-i",str(path),"-af",f"atempo={factor:.4f}",
           "-ac","1","-ar",str(SR),"-f","f32le","-"]
    raw = subprocess.run(cmd, check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)

def rms_env(x, win, hop):
    n = max(1, 1 + (len(x) - win) // hop) if len(x) >= win else 1
    out = np.zeros(n)
    for i in range(n):
        seg = x[i*hop:i*hop+win]
        out[i] = np.sqrt(np.mean(seg*seg)) if len(seg) else 0.0
    return out

def trim(x):
    win = SR // 100; hop = win          # 10 ms
    e = rms_env(x, win, hop)
    thr = max(e.max() * 0.02, 1e-5)
    idx = np.where(e > thr)[0]
    if len(idx) == 0: return x
    a = max(0, idx[0]*hop - int(0.05*SR)); b = min(len(x), (idx[-1]+1)*hop + int(0.16*SR))
    y = x[a:b].copy()
    f = int(0.01*SR)
    y[:f] *= np.linspace(0,1,f); y[-f:] *= np.linspace(1,0,f)
    return y

def envelope30(x):
    e = rms_env(x, HOP, HOP)
    ref = np.percentile(e, 97) or 1.0
    e = np.clip(e/ref, 0, 1) ** 0.7
    return [round(float(v),2) for v in e]

def segments(text, env):
    parts = [p.strip() for p in re.split(r'(?<=[.!?:;…])\s+|(?<=\.\.\.)\s+', text) if p.strip()]
    nseg = len(parts)
    n = len(env)
    # pausas internas: env < 0.07 por >= 4 quadros, longe das bordas
    gaps = []; i = 3
    while i < n-3:
        if env[i] < 0.07:
            j = i
            while j < n and env[j] < 0.07: j += 1
            if j - i >= 4: gaps.append(((i+j)/2.0/FPS, j-i))
            i = j
        else: i += 1
    bounds = []
    if nseg > 1:
        import functools
        tot = sum(len(p) for p in parts); acc = 0; exp = []
        for p in parts[:-1]:
            acc += len(p); exp.append(acc/tot * n/FPS)
        end = n/FPS
        lens = [len(p) for p in parts]
        gtimes = [g[0] for g in gaps]; gw = [g[1] for g in gaps]
        @functools.lru_cache(maxsize=None)
        def best(i, prev_t):
            # fronteira i (0-based) a partir do tempo prev_t; devolve (custo, lista)
            if i == nseg-1:
                seg_len = end - prev_t; ch = lens[i]
                pen = 0 if (seg_len >= 0.045*ch and seg_len <= 0.16*ch + 1.2) else 20
                return (pen, ())
            ch = lens[i]; opts = []
            for gi, gt in enumerate(gtimes):
                if gt <= prev_t + 1e-6: continue
                seg_len = gt - prev_t
                if seg_len < 0.045*ch or seg_len > 0.16*ch + 1.2: continue
                c, rest = best(i+1, round(gt,3))
                opts.append((c + abs(gt - exp[i]) - 0.004*min(gw[gi],20), (gt,)+rest))
            # alternativa: posição proporcional (penalizada)
            et = max(prev_t + 0.045*ch, exp[i])
            if et < end:
                c, rest = best(i+1, round(et,3))
                opts.append((c + 0.6, (et,)+rest))
            if not opts: return (1e6, tuple([prev_t]*(nseg-1-i)))
            return min(opts, key=lambda o:o[0])
        cost, picked = best(0, 0.0)
        bounds = list(picked)
    segs = []; t0 = 0.0
    for k,p in enumerate(parts):
        t1 = bounds[k] if k < len(bounds) else n/FPS
        segs.append({"text":p, "t0":round(t0,3), "t1":round(t1,3)}); t0 = t1
    return segs

def write_wav(path, x):
    y = np.clip(x, -1, 1); pcm = (y*32767).astype('<i2')
    with wave.open(str(path),'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

rot = json.loads(ROTEIRO.read_text())
CUT = set(rot.get("cortadas", []))
lines = {}; PLAN = []
for sc in rot["cenas"]:
    PLAN.append(('scene', sc["id"])); PLAN.append(('gap', float(sc.get("pre", 0.5))))
    for f in sc["falas"]:
        if f["id"] in CUT: continue
        lines[f["id"]] = {"voice": f["voz"], "text": f["texto"], "scene": sc["id"]}
        PLAN.append(('line', f["id"])); PLAN.append(('gap', float(f.get("pausa", 0.45))))
    PLAN.append(('gap', float(sc.get("pos", 0.0))))
for v in {L["voice"] for L in lines.values()}:
    BASE.setdefault(v, 1.0); MAXF.setdefault(v, 1.07)

def build(factors, gapscale):
    durs = {}
    audio = {}
    for lid, L in lines.items():
        x = trim(decode(AUDIO/f"{lid}.mp3", factors[L["voice"]]))
        audio[lid] = x; durs[lid] = len(x)/SR
    t = 0.0; scenes = {}; starts = {}; cur = None
    for item in PLAN:
        if item[0] == 'scene':
            if cur: scenes[cur]["end"] = round(t,3)
            cur = item[1]; scenes[cur] = {"start": round(t,3)}
        elif item[0] == 'gap': t += item[1]*gapscale
        elif item[0] == 'line': starts[item[1]] = t; t += durs[item[1]]
    scenes[cur]["end"] = round(t,3)
    return t, durs, starts, scenes, audio

factors = dict(BASE); gapscale = 1.0
total, durs, starts, scenes, audio = build(factors, gapscale)
print(f"[1] fatores base {factors} -> total {total:.2f}s (fala {sum(durs.values()):.2f}s)")
if total > TARGET_TOTAL:
    speech = sum(durs.values()); need = total - TARGET_TOTAL
    k = speech / max(1e-6, speech - need)          # aceleração extra necessária
    newf = {v: min(MAXF[v], BASE[v]*k) for v in BASE}
    total, durs, starts, scenes, audio = build(newf, gapscale); factors = newf
    print(f"[2] fatores ajustados {factors} -> total {total:.2f}s")
if total > TARGET_TOTAL:
    gaps = sum(i[1] for i in PLAN if i[0]=='gap')
    gapscale = max(0.75, 1 - (total - TARGET_TOTAL)/gaps)
    total, durs, starts, scenes, audio = build(factors, gapscale)
    print(f"[3] gaps x{gapscale:.3f} -> total {total:.2f}s")

out = {"fps": FPS, "sr": SR, "total": round(total,3), "factors": factors, "gapscale": gapscale,
       "scenes": scenes, "lines": {}}
for lid, L in lines.items():
    x = audio[lid]; write_wav(PROC/f"{lid}.wav", x)
    env = envelope30(x)
    out["lines"][lid] = {"voice": L["voice"], "scene": L["scene"], "text": L["text"],
        "start": round(starts[lid],3), "dur": round(durs[lid],3), "env": env,
        "segs": segments(L["text"], env), "file": f"proc/{lid}.wav"}
(ROOT/"timing.json").write_text(json.dumps(out, ensure_ascii=False))
print(f"TOTAL {total:.2f}s  ({int(total//60)}:{total%60:05.2f})")
for sid, s in scenes.items(): print(f"  {sid}: {s['start']:7.2f} -> {s['end']:7.2f}  ({s['end']-s['start']:.2f}s)")
for lid, L in out["lines"].items():
    print(f"  {lid:6s} {L['voice']} start {L['start']:6.2f} dur {L['dur']:5.2f}  segs={[ (s['text'][:14], s['t0']) for s in L['segs']]}")
