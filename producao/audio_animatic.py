#!/usr/bin/env python3
"""trilha provisória do animatic (130 s): groove por seção + silêncio em S12 + acorde final."""
import sys, math, json, numpy as np, wave
sys.path.insert(0,'.')
from synth import SR
from music_playful import groove, ending
T=json.load(open('timing.json')); total=float(T['total']); SCN=T['scenes']
MIX=np.zeros((int((total+3)*SR),2))
def madd(buf,t,gain=1.0,pan=0.0):
    i=int(t*SR); n=min(len(buf),len(MIX)-i)
    if n<=0 or i<0: return
    l=math.sqrt(0.5*(1-pan)); r=math.sqrt(0.5*(1+pan)); MIX[i:i+n,0]+=buf[:n]*gain*l; MIX[i:i+n,1]+=buf[:n]*gain*r
S0=lambda k:SCN[k]['start']; S1=lambda k:SCN[k]['end']
groove(madd,S0('S01'),S1('S02'),('C','Am','F','G'),104,'light',0.8)
groove(madd,S0('S03'),S1('S07'),('C','Am','F','G'),104,'full',0.9)
groove(madd,S0('S08'),S1('S10'),('F','G','C','Am'),104,'full',0.9)
groove(madd,S0('S11'),S0('S12')+8,('C','Em','F','G'),104,'bass',0.8)
# silêncio absoluto: portas abrem, ninguém entra (fim de S12)
groove(madd,S0('S13'),S1('S13'),('C','Am','F','G'),104,'light',0.7)
groove(madd,S0('S14'),S1('S14'),('Am','F','Am','G'),104,'sparse',0.6)
groove(madd,S0('S15'),S1('S15'),('C','Am','F','G'),104,'full',1.0)
groove(madd,S0('S16')+2.4,S1('S17')-2,('F','G','C','C'),104,'sparse',0.8)
ending(madd,S1('S17')-2.0,'C',0.9)
# corta o silêncio de S12 (últimos 2 s) e deixa um fade de 1 s antes
a=int((S1('S12')-2.2)*SR); b=int(S1('S12')*SR); f=int(0.6*SR); MIX[a-f:a]*=np.linspace(1,0,f)[:,None]; MIX[a:b]=0
pk=np.abs(MIX).max(); MIX*= (10**(-3/20))/max(pk,1e-6)
data=(np.clip(MIX,-1,1)*32767).astype('<i2')
with wave.open('out/audio/animatic_music.wav','wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
print('ok', round(total,1),'s pico',round(float(np.abs(MIX).max()),3))
