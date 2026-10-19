#!/usr/bin/env python3
"""music_playful.py · trilha lúdica sintetizada (ukulele + baixo pizzicato + chocalho/vassourinha + glockenspiel).
Importável: groove(buf_add, t0, t1, prog, style) ; demo: python3 music_playful.py out/audio/demo_groove.wav 24
"""
import sys, math, numpy as np
sys.path.insert(0, __import__('os').path.dirname(__file__))
from synth import SR, tline, env, fftfilt, noise, pluck, bass, bell, snare, hsh, piano, strings, hat

NOTE = {}
_names = ['C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B']
for o in range(1, 7):
    for i, nm in enumerate(_names): NOTE[f'{nm}{o}'] = 440 * 2 ** ((o - 4) + (i - 9) / 12)
CH = {'C': ['C4','E4','G4'], 'Am': ['A3','C4','E4'], 'F': ['F3','A3','C4'], 'G': ['G3','B3','D4'], 'Dm': ['D4','F4','A4'], 'Em': ['E3','G3','B3'],
      'Fmaj7': ['F3','A3','C4','E4'], 'G7': ['G3','B3','D4','F4'], 'Cmaj7': ['C4','E4','G4','B4'], 'E7': ['E3','Gs3','B3','D4'], 'A7': ['A3','Cs4','E4','G4'], 'D7': ['D4','Fs4','A4','C5']}
ROOT = {'C':'C2','Am':'A1','F':'F2','G':'G2','Dm':'D2','Em':'E2','Fmaj7':'F2','G7':'G2','Cmaj7':'C2','E7':'E2','A7':'A1','D7':'D2'}
FIFTH = {'C':'G2','Am':'E2','F':'C3','G':'D3','Dm':'A2','Em':'B2','Fmaj7':'C3','G7':'D3','Cmaj7':'G2','E7':'B2','A7':'E2','D7':'A2'}
fr = lambda ch: [NOTE[n] for n in CH[ch]]

def uke_chord(freqs, amp=1.0, strum=0.02, down=True, dur=0.6, bright=1.3):
    n = int((dur + strum * len(freqs)) * SR) + 10; out = np.zeros(n)
    order = freqs if down else list(reversed(freqs))
    for i, f in enumerate(order):
        x = pluck(f * 2, dur, bright, amp * (0.9 + 0.2 * hsh(i + f)))  # registro agudo do ukulele
        o = int(i * strum * SR); out[o:o + len(x)] += x
    return out * 0.6

def shaker(amp=0.3, dur=0.07, hard=False):
    t = tline(dur); x = fftfilt(noise(dur), lo=4200 if hard else 3200, hi=11000)
    return x * np.exp(-t * (60 if hard else 38)) * env(len(t), 0.002, 0.01) * amp

def brush(amp=0.25, dur=0.22):
    t = tline(dur); x = fftfilt(noise(dur), lo=1800, hi=9000); return x * np.exp(-t * 14) * env(len(t), 0.004, 0.05) * amp

def pizz(f, amp=1.0, dur=0.5):
    t = tline(dur); x = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t))
    return x * np.exp(-t * 6.5) * env(len(t), 0.004, 0.06) * amp

def glock(f, amp=0.5, dur=1.4):
    t = tline(dur); x = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 9) + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 16)
    return x * np.exp(-t * 3.2) * env(len(t), 0.001, 0.05) * amp

def whistle(f, dur=0.5, amp=0.4, vib=5.5):
    t = tline(dur); ff = f * (1 + 0.012 * np.sin(2 * np.pi * vib * t) * np.minimum(1, t * 6)); ph = 2 * np.pi * np.cumsum(ff) / SR
    return (np.sin(ph) + 0.08 * np.sin(2 * ph)) * env(len(t), 0.03, 0.08) * amp

def groove(madd, t0, t1, prog=('C','Am','F','G'), bpm=104, style='full', g=1.0, seed=0):
    """style: 'full' | 'light' (só uke+shaker) | 'bass' (uke+baixo, sem percussão) | 'sparse' (acordes longos, sem ritmo)"""
    beat = 60 / bpm; bar = beat * 4; t = t0; k = 0
    strum_pat = [(0, True, 1.0), (1, True, 0.7), (1.5, False, 0.5), (2.5, False, 0.55), (3, True, 0.8), (3.5, False, 0.5)]
    while t < t1 - 0.05:
        ch = prog[k % len(prog)]; f = fr(ch)
        if style == 'sparse':
            madd(uke_chord(f, 0.55 * g, 0.035, True, 1.6, 0.8), t, 1, 0.0)
            madd(pizz(NOTE[ROOT[ch]], 0.45 * g, 1.2), t, 1, -0.1)
        else:
            for (q, down, a) in strum_pat:
                madd(uke_chord(f, a * 0.5 * g * (0.9 + 0.2 * hsh(k * 7 + q + seed)), 0.018, down), t + q * beat, 1, 0.15)
            if style in ('full', 'bass'):
                madd(pizz(NOTE[ROOT[ch]], 0.9 * g), t, 1, -0.15); madd(pizz(NOTE[FIFTH[ch]], 0.7 * g), t + 2 * beat, 1, -0.15)
                if k % 2 == 1: madd(pizz(NOTE[ROOT[ch]] * 2 ** (2 / 12) if ch in ('C', 'F') else NOTE[ROOT[ch]], 0.5 * g, 0.3), t + 3.5 * beat, 1, -0.15)
            if style in ('full', 'light'):
                for q in range(8): madd(shaker((0.22 if q % 2 else 0.12) * g, 0.07, q % 2 == 1), t + q * beat / 2, 1, 0.35)
            if style == 'full':
                madd(brush(0.22 * g), t + beat, 1, 0.1); madd(brush(0.26 * g), t + 3 * beat, 1, 0.1)
                if k % 2 == 1:  # motivo de glockenspiel no fim de cada 2 compassos
                    for j, q in enumerate([2.5, 3, 3.5]): madd(glock(f[(j + k) % len(f)] * 4, 0.28 * g), t + q * beat, 1, 0.3)
        t += bar; k += 1
    return t

def ending(madd, t, ch='C', g=1.0):
    """acorde final: rasgueado + glock + baixo"""
    f = fr(ch); madd(uke_chord(f, 0.8 * g, 0.045, True, 2.2, 1.0), t, 1, 0.1); madd(pizz(NOTE[ROOT[ch]], 1.0 * g, 2.0), t, 1, -0.1)
    for j, x in enumerate(f): madd(glock(x * 4, 0.3 * g, 2.4), t + j * 0.06, 1, 0.3)

if __name__ == '__main__':
    out = sys.argv[1]; dur = float(sys.argv[2]) if len(sys.argv) > 2 else 24
    MIX = np.zeros((int((dur + 4) * SR), 2))
    def madd(buf, t, gain=1.0, pan=0.0):
        i = int(t * SR); n = min(len(buf), len(MIX) - i)
        if n <= 0: return
        l = math.sqrt(0.5 * (1 - pan)); r = math.sqrt(0.5 * (1 + pan)); MIX[i:i + n, 0] += buf[:n] * gain * l; MIX[i:i + n, 1] += buf[:n] * gain * r
    tt = groove(madd, 0, 8, ('C', 'Am', 'F', 'G'), 104, 'light')
    tt = groove(madd, tt, tt + 8, ('C', 'Am', 'F', 'G'), 104, 'full')
    tt = groove(madd, tt, tt + 6, ('F', 'G', 'C', 'Am'), 104, 'full')
    ending(madd, tt, 'C')
    pk = np.abs(MIX).max(); MIX *= (10 ** (-1 / 20)) / max(pk, 1e-6)
    import wave
    data = (np.clip(MIX[:int((dur + 3) * SR)], -1, 1) * 32767).astype('<i2')
    with wave.open(out, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
    print(out, 'pico', round(float(np.abs(MIX).max()), 3), 'rms', round(float(np.sqrt((MIX ** 2).mean())), 3))
