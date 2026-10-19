#!/usr/bin/env python3
"""Trilha, efeitos e mixagem do vídeo "Quem aperta o botão?" (numpy puro).
Uso: python3 audio_fordt.py [MUS_DB=-18] [SFX_DB=-16]  → out/mix.wav (48 kHz estéreo)"""
import json, math, wave, sys
import numpy as np
from pathlib import Path
ROOT=Path(__file__).resolve().parent; OUT=ROOT/'out'; OUT.mkdir(exist_ok=True)
sys.path.insert(0,str(ROOT))
from synth import *   # SR, instrumentos, utilidades
MUS_DB=float(sys.argv[1]) if len(sys.argv)>1 else -17.0; SFX_DB=float(sys.argv[2]) if len(sys.argv)>2 else -16.0
T=json.loads((ROOT/'timing.json').read_text()); L=T['lines']; SC=T['scenes']; TOTAL=T['total']
N=int((TOTAL+0.8)*SR)
MIX=np.zeros((N,2)); MUS=np.zeros((N,2))

# ---------- tempos (mesma lógica do engine.js) ----------
def segT(lid,i): s=L[lid]['segs'][min(i,len(L[lid]['segs'])-1)]; return L[lid]['start']+s['t0']
def lineEnd(lid): return L[lid]['start']+L[lid]['dur']
def lineStart(lid): return L[lid]['start']
def wt(lid,word,lead=0.1,seg=None):
    li=L.get(lid)
    if not li: return None
    segs=li['segs']; wl=word.lower()
    si=seg if seg is not None else next((k for k,s in enumerate(segs) if wl in s['text'].lower()),-1)
    if si<0: return None
    s=segs[si]; i=max(0,s['text'].lower().find(wl)); p=i/max(1,len(s['text'])); return li['start']+s['t0']+p*(s['t1']-s['t0'])-lead
def S0(sid): return SC[sid]['start']
def S1(sid): return SC[sid]['end']

# ---------- utilitários de mixagem ----------
def _put(dst,buf,t,gain=1.0,pan=0.0):
    if t is None: return
    i=int(round(t*SR))
    if i>=N or i+len(buf)<=0: return
    if i<0: buf=buf[-i:]; i=0
    n=min(len(buf),N-i); b=buf[:n]*gain; l=math.cos((pan+1)*math.pi/4); r=math.sin((pan+1)*math.pi/4)
    dst[i:i+n,0]+=b*l; dst[i:i+n,1]+=b*r
def add(buf,t,gain=1.0,pan=0.0): _put(MIX,buf,t,gain,pan)
def madd(buf,t,gain=1.0,pan=0.0): _put(MUS,buf,t,gain,pan)
def ticks(t0,t1,rate,amp,lo=1500):
    t=t0
    while t<t1: add(click(amp*(0.7+0.5*hsh(t*17)),0.006,lo),t); t+=1/rate*(0.85+0.3*hsh(t*5))
def typing(t0,n,cps=14,amp=0.3):
    for i in range(n): add(typeclick(amp*(0.7+0.5*hsh(i*3.3))),t0+i/cps)
def debris_sfx(t0,n=10,amp=0.3):
    for i in range(n): add(click(amp*(0.5+0.5*hsh(i*7)),0.012,900+hsh(i)*1500),t0+0.05+hsh(i*11)*0.5)
def photo_in(t,amp=0.8,pan=0.0): add(whoosh(0.45,220,2600,0.5*amp),t-0.35,1,pan); add(paper_slap(amp),t,1,pan); add(thud(0.3*amp),t)
def year_slam(t,amp=1.0): add(thud(1.1*amp),t); add(boom(0.35*amp,1.0),t); add(paper_slap(0.5*amp),t+0.02); debris_sfx(t,8,0.25*amp)
def label_in(t,amp=0.6): add(click(amp,0.02,1400),t); add(whoosh(0.25,500,3000,0.3*amp),t-0.12)
def stamp_in(t,amp=1.0): add(stamp(amp),t); add(thud(0.4*amp),t)
def transition(t,kind='tear'):
    if kind=='tear': add(tear(0.5,0.85),t-0.02); add(whoosh(0.5,200,1800,0.35),t-0.05)
    elif kind=='wipe': add(whoosh(0.5,300,2400,0.6),t-0.1); add(paper_slap(0.5),t+0.35)
    elif kind=='iris': add(whoosh(0.6,2200,300,0.45),t-0.05); add(thud(0.3),t+0.5)
    elif kind=='zoom': add(whoosh(0.8,250,3500,0.7,0.7),t-0.1); add(boom(0.3,0.8),t+0.6)
def phone_ring(t,n=3,amp=0.5):
    for k in range(n):
        for i in range(10): add(beep(1200+((i%2)*180),0.035,amp*0.5),t+k*0.9+i*0.05)

from music_playful import groove, ending, glock, pizz, uke_chord, fr as ufr
# ---------- utilidades extras ----------
def S0(sid): return SC[sid]['start']
def S1(sid): return SC[sid]['end']
def Lstart(lid): return L[lid]['start'] if lid in L else None
def chime(t,amp=0.5):
    if t is None: return
    add(machine_chime(amp),t-0.75)
def press(t,amp=1.0): add(thud(0.9*amp),t); add(click(0.6*amp,0.012,1200),t); add(paper_slap(0.3*amp),t+0.02)
def whump(t,amp=0.8): add(boom(0.5*amp,0.9),t); add(thud(0.6*amp),t)
SIL=[]
def silence(t0,t1,floor=0.12): SIL.append((t0,t1,floor))
# ===== MÚSICA (por seção) =====
groove(madd,S0('S01'),S1('S02'),('C','Am','F','G'),104,'light',0.8)
groove(madd,S0('S03'),S1('S07'),('C','Am','F','G'),104,'full',0.9)
groove(madd,S0('S08'),S1('S10'),('F','G','C','Am'),104,'full',0.9)
groove(madd,S0('S11'),S1('S12')-2.4,('C','Em','F','G'),104,'bass',0.8)
groove(madd,S0('S13'),S1('S13'),('C','Am','F','G'),104,'light',0.7)
groove(madd,S0('S14'),S1('S14'),('Am','F','Am','G'),104,'sparse',0.6)
groove(madd,S0('S15'),S1('S15'),('C','Am','F','G'),104,'full',1.0)
groove(madd,S0('S16')+2.4,S1('S17')-2.0,('F','G','C','C'),104,'sparse',0.8)
ending(madd,S1('S17')-2.0,'C',0.9)
silence(S1('S12')-2.2,S1('S12')+0.2,0.0)          # portas abrem, ninguém entra
silence(S0('S16')-0.2,S0('S16')+2.4,0.25)          # respiro antes da revelação
# ===== SFX por cena =====
# S01 · estação: zumbido, passos de papel, moeda, pix, botão cai
add(fftfilt(noise(S1('S01')-S0('S01')),lo=120,hi=900)*0.06,S0('S01'))
for i in range(8): add(paper_slap(0.25),S0('S01')+0.4+i*0.55)
add(click(0.8,0.02,2600),S0('S01')+5.6); add(click(0.6,0.02,2000),S0('S01')+6.3); add(ding(0.6),S0('S01')+6.9); add(thud(0.8),S0('S01')+8.0); add(rivet_click(0.8),S0('S01')+8.05)
# S02 · título: whoosh + baque + pizzicato
add(whoosh(0.5,250,2600,0.8),S0('S02')-0.3); whump(S0('S02')+0.3,1.0); debris_sfx(S0('S02')+0.3,10,0.3)
# S03 · peças caem (uma a cada 1,5 s), disco, chime, botão
t=S0('S03')+1.6
for d in (0,1.5,3.0,4.5,6.0,6.2,6.4,7.5): add(thud(0.9),t+d); add(paper_slap(0.5),t+d+0.03)
for lid in ('s03b','s03e'): chime(Lstart(lid))
if Lstart('s03c'):
    for k in range(4): ticks(Lstart('s03c')+k*0.7,Lstart('s03c')+k*0.7+0.5,22,0.25,2200)
press(S1('S03')-0.6,1.0)
# S04 · chegada 1908: ano, pouso, poeira, cascos, relincho
year_slam(S0('S04')+0.2,0.9); add(whoosh(0.6,120,1400,0.7),S0('S04')+2.2); whump(S0('S04')+3.5,0.9); debris_sfx(S0('S04')+3.5,10,0.3); add(hooves(2.5,120,0.4),S0('S04')+3.0); add(neigh(0.45),S0('S04')+4.6)
chime(Lstart('s04a'))
# S05 · carroça atola, relógio dispara, jornal, Ford T entra, buzina, flash
ticks(S0('S05')+0.3,S0('S05')+6.0,8,0.18,1800); add(tear(0.5,0.9),S0('S05')+2.4); add(paper_slide(0.6,0.7),S0('S05')+2.5)
add(crank_start(0.7),S0('S05')+3.6); add(car_horn(0.9),S0('S05')+6.0); stamp_in(S0('S05')+6.0,0.8); add(shutter(0.9),S0('S05')+8.2); add(boom(0.3,0.6),S0('S05')+8.2)
# S06 · feno + buzina, visor datilografa, giz, lâmpada, flash, carimbo
add(paper_slide(0.7,0.5),S0('S06')+0.2); add(car_horn(1.0),S0('S06')+2.8); add(thud(0.5),S0('S06')+3.3)
if Lstart('s06b'): chime(Lstart('s06b')); typing(Lstart('s06b'),22,14,0.3)
ticks(S0('S06')+5.4,S0('S06')+8.0,6,0.2,1200); add(ding(0.7),S0('S06')+8.4); add(shutter(0.9),S0('S06')+9.6); stamp_in(S0('S06')+10.6,1.0)
# S07 · disco mais curto, botão com cotovelo
for k in range(4): ticks(S0('S07')+0.2+k*0.55,S0('S07')+0.2+k*0.55+0.35,22,0.25,2200)
press(S1('S07')-0.5,0.9)
# S08 · 1965: ano, buzinas em coro afinadas, prancheta
year_slam(S0('S08')+0.2,0.9); chime(Lstart('s08a'))
for i,f in enumerate([330,392,440,494,523]): add(fftfilt(osc(f,0.5,'square'),lo=200,hi=3000)*np.exp(-tline(0.5)*3)*0.18,S0('S08')+3.8+i*0.22)
add(paper_slide(0.6,0.6),S0('S08')+4.4); add(paper_slap(0.6),S0('S08')+5.6)
# S09 · apito, semáforo clica, relógio, mapa, clic do cinto, carimbo
add(beep(1800,0.25,0.35),S0('S09')+0.8); ticks(S0('S09')+1.0,S0('S09')+2.2,3,0.3,900); ticks(S0('S09')+3.4,S0('S09')+6.0,4,0.2,1600)
add(paper_slide(0.9,0.8),S0('S09')+6.4); add(rivet_click(1.0),S0('S09')+8.8); chime(Lstart('s09d')); stamp_in(S0('S09')+8.9,1.0)
# S10 · glitch, teclado, matricial, bipe
add(glitch(0.4,0.9),S0('S10')); typing(S0('S10')+0.9,26,16,0.35); ticks(S0('S10')+1.4,S0('S10')+5.4,30,0.14,3200); chime(Lstart('s10a')); press(S1('S10')-0.6,0.9)
# S11 · 2026: rufo, rotores, pop, zumbido
year_slam(S0('S11')+0.2,1.0); ticks(S0('S11')+2.2,S0('S11')+2.6,40,0.3,900); add(thruster(2.2,0.35),S0('S11')+2.6); chime(Lstart('s11a'))
for i in range(4): add(click(0.9,0.015,900),S0('S11')+2.6+i*0.12)
add(thruster(10,0.12),S0('S12')); add(thruster(9,0.12),S0('S13'))
# S12 · folhas de manual, obturador de celular, escadinha, portas; depois SILÊNCIO
add(paper_slide(0.5,0.5),S0('S12')+1.0); add(shutter(0.6),S0('S12')+3.0); ticks(S0('S12')+4.2,S0('S12')+5.0,4,0.25,700); add(paper_slide(0.6,0.5),S0('S12')+6.6)
add(whoosh(0.8,200,900,0.5),S0('S12')+8.0); chime(Lstart('s13a'))
# S13 · buzina de novo, clic, contador, carimbo
add(car_horn(0.8),S0('S13')+2.4); add(rivet_click(1.0),S0('S13')+6.0); ticks(S0('S13')+6.8,S0('S13')+8.6,14,0.18,2400); chime(Lstart('s13d')); stamp_in(S0('S13')+7.8,1.0)
# S14 · corredor: eco, gotas, máquina de escrever por placa
for i in range(6): add(fftfilt(click(0.5,0.02,1500),hi=2000),S0('S14')+0.6+i*1.3)
for i in range(3): typing(S0('S14')+2+i*2,8,16,0.3)
chime(Lstart('s14a'))
# S15 · bocejo (silêncio cômico), mãos entram, THUNK gigante, carimbo final
add(fftfilt(noise(0.6),lo=200,hi=1200)*np.exp(-tline(0.6)*4)*0.12,S0('S15')+3.8)
for i in range(14): add(paper_slide(0.4,0.35),S0('S15')+4.5+i*0.05)
whump(S0('S15')+5.6,1.4); add(boom(0.9,1.6),S0('S15')+5.6); debris_sfx(S0('S15')+5.6,14,0.4); stamp_in(S0('S15')+6.8,1.1)
# S16 · flip do cartão, whump por palavra
add(paper_slide(0.7,0.8),S0('S16')+0.2)
for d in (2.5,3.0,3.5): whump(S0('S16')+d,0.6)
# S17 · flash do celular, chime final, glock
add(shutter(1.0),S0('S17')); add(boom(0.3,0.6),S0('S17')); chime(Lstart('s17a')); add(machine_chime(0.5),S1('S17')-1.4)
# ---------- VOZES ----------
VOICE=np.zeros((N,2))
def read_wav(p):
    with wave.open(str(p)) as w: x=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float64)/32768
    return x
for lid,li in L.items():
    if not li.get('file'): continue
    x=read_wav(ROOT/li['file']); rms_=np.sqrt(np.mean(x**2)); x=x*(10**(-19/20)/max(rms_,1e-6))
    x=fftfilt(x,lo=70)
    i=int(li['start']*SR); n=min(len(x),N-i); VOICE[i:i+n,0]+=x[:n]*0.7071; VOICE[i:i+n,1]+=x[:n]*0.7071
# ---------- ducking ----------
act=np.abs(VOICE).max(axis=1); w=int(0.03*SR); act=np.convolve(act,np.ones(w)/w,mode='same')
thr=0.02; blk=int(0.005*SR); nb=N//blk+1; ab=np.array([act[i*blk:(i+1)*blk].max() if i*blk<N else 0 for i in range(nb)]); eb=np.zeros(nb); e=0.0
for i in range(nb):
    x=1.0 if ab[i]>thr else 0.0
    e=x+(e-x)*(0.72 if x>e else 0.97); eb[i]=e
duck=np.repeat(eb,blk)[:N]
MUSG=10**(MUS_DB/20); SFXG=10**(SFX_DB/20)
music=MUS*(MUSG*(1-0.55*duck))[:,None]
# silêncios dramáticos
fade=np.ones(N)
for (t0,t1,fl) in SIL:
    i0,i1=int(max(0,t0)*SR),int(min(TOTAL,t1)*SR); r=int(0.12*SR); r2=int(0.5*SR)
    fade[i0:i1]=np.minimum(fade[i0:i1],fl); fade[max(0,i0-r):i0]=np.minimum(fade[max(0,i0-r):i0],np.linspace(1,fl,min(r,i0))); fade[i1:min(N,i1+r2)]=np.minimum(fade[i1:min(N,i1+r2)],np.linspace(fl,1,min(r2,N-i1)))
music*=fade[:,None]
sfx=MIX*SFXG*(1-0.25*duck)[:,None]
def rms(x): return np.sqrt(np.mean(x**2)) if len(x) else 0
on=duck>0.5; off=~on
db=lambda v:20*np.log10(v+1e-9)
print('voz %.1f dB | música c/voz %.1f · sem voz %.1f dB | sfx c/voz %.1f dB'%(db(rms(VOICE[on])),db(rms(music[on])),db(rms(music[off])),db(rms(sfx[on]))))
master=VOICE+music+sfx
fo=int(1.2*SR); master[-fo:]*=np.linspace(1,0,fo)[:,None]
master=np.tanh(master*1.15)/np.tanh(1.15); master*=0.89/np.max(np.abs(master))
pcm=(np.clip(master,-1,1)*32767).astype('<i2')
with wave.open(str(OUT/'mix.wav'),'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('out/mix.wav %.1fs pico %.3f'%(N/SR,float(np.max(np.abs(master)))))
