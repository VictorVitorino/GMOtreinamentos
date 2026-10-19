"""Biblioteca de síntese (numpy puro) para trilha cinematográfica e SFX · v3."""
import math, numpy as np
SR=48000
rng=np.random.default_rng(11)
def hsh(n): x=math.sin(n*127.1+311.7)*43758.5453; return x-math.floor(x)
def tline(dur): return np.arange(int(dur*SR))/SR
def mixin(x,m,k=1.0):
    n=min(len(x),len(m)); x[:n]+=m[:n]*k; return x
def env(n,a=0.005,r=0.05,shape=1.0):
    e=np.ones(n); na=max(1,min(n//2,int(a*SR))); nr=max(1,min(n//2,int(r*SR)))
    e[:na]=np.linspace(0,1,na)**shape; e[-nr:]*=np.linspace(1,0,nr)**shape; return e
def fftfilt(x,lo=None,hi=None,order=2):
    n=len(x)
    if n<8: return x
    X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); g=np.ones_like(f)
    if lo: g*=1/np.sqrt(1+(lo/np.maximum(f,1e-3))**(2*order))
    if hi: g*=1/np.sqrt(1+(f/hi)**(2*order))
    return np.fft.irfft(X*g,n)
def noise(dur): return rng.standard_normal(int(dur*SR))
def sweep_noise(dur,f0,f1,bw=1.6,curve=1.0):
    x=noise(dur); n=len(x); w=int(0.025*SR); h=w//2; out=np.zeros(n+w); win=np.hanning(w)
    for i in range(0,max(1,n-w),h):
        p=(i/n)**curve; fc=f0*(f1/f0)**p
        out[i:i+w]+=fftfilt(x[i:i+w]*win,lo=fc/bw,hi=fc*bw,order=2)
    return out[:n]
def osc(freq,dur=None,wave='sine',phase=0.0):
    if np.isscalar(freq): freq=np.full(int(dur*SR),float(freq))
    ph=phase+2*np.pi*np.cumsum(freq)/SR
    if wave=='sine': return np.sin(ph)
    if wave=='saw': return sum(np.sin(k*ph)/k for k in range(1,11))*0.55
    if wave=='square': return sum(np.sin(k*ph)/k for k in (1,3,5,7,9))*0.75
    if wave=='tri': return sum(((-1)**((k-1)//2))*np.sin(k*ph)/k**2 for k in (1,3,5,7))*0.9
# ---------- instrumentos ----------
def piano(f,dur=1.8,amp=1.0,soft=0.0):
    t=tline(dur); out=np.zeros(len(t))
    for k,(a,d) in enumerate([(1,1.2),(0.55,2.0),(0.33,3.2),(0.2,4.5),(0.12,6),(0.07,8)],start=1):
        if f*k>16000: break
        out+=a*np.sin(2*np.pi*f*k*(1+0.0004*k*k)*t+hsh(k*f))*np.exp(-t*d*(1+soft))
    hammer=fftfilt(noise(0.02),lo=800,hi=5000)*np.exp(-tline(0.02)*300)
    out=mixin(out,hammer,0.25*(1-soft)); return out*env(len(t),0.002,0.08)*amp*0.5
def strings(freqs,dur,amp=1.0,attack=1.2,release=1.5,bright=1.0):
    t=tline(dur); out=np.zeros(len(t))
    for f in freqs:
        for det,vib in ((-0.006,5.1),(-0.002,4.7),(0.003,5.5),(0.007,4.3)):
            ff=f*(1+det)*(1+0.004*np.sin(2*np.pi*vib*t+hsh(f*det)))
            ph=2*np.pi*np.cumsum(ff)/SR
            for k in range(1,9): out+=np.sin(k*ph+hsh(ff[0]*k))/k**(1.4/bright)
    out/=max(1,len(freqs))*4
    out=fftfilt(out,hi=3200*bright)
    out*=1+0.06*np.sin(2*np.pi*0.3*t)
    return out*env(len(t),attack,release,1.5)*amp
def brass_braam(f,dur=2.4,amp=1.0):
    t=tline(dur); fr=f*(1+0.02*np.exp(-t*3))*(1-0.01*np.clip(t-1,0,1))
    x=osc(fr,wave='saw')*0.7+osc(fr*0.5,wave='square')*0.5+osc(fr*1.005,wave='saw')*0.4
    x=fftfilt(x,hi=900+1400*np.exp(-0.0)); 
    return x*env(len(t),0.08,1.2,1.2)*amp
def taiko(amp=1.0,f0=140,f1=46,dur=0.9):
    t=tline(dur); fr=f1+(f0-f1)*np.exp(-t*18); k=osc(fr)*np.exp(-t*4.5)
    sk=fftfilt(noise(0.06),lo=200,hi=3000)*np.exp(-tline(0.06)*80)
    return mixin(k,sk,0.9)*env(len(t),0.001,0.1)*amp
def kick(amp=1.0,f0=130,f1=42,dur=0.35):
    t=tline(dur); fr=f1+(f0-f1)*np.exp(-t*22); return osc(fr)*np.exp(-t*9)*env(len(t),0.001,0.02)*amp
def hat(amp=0.4,dur=0.04,lo=6000):
    x=fftfilt(noise(dur),lo=lo); return x*env(len(x),0.001,0.02)*np.exp(-tline(dur)*60)*amp
def snare(amp=0.6):
    t=tline(0.25); x=fftfilt(noise(0.25),lo=400,hi=7000)*np.exp(-t*22)+osc(190,0.25)*np.exp(-t*30)*0.5; return x*amp
def click(amp=1.0,dur=0.008,lo=2500): x=fftfilt(noise(dur),lo=lo); return x*np.exp(-tline(dur)*500)*amp
def tick(amp=1.0): 
    x=click(1.0,0.012,1800); m=osc(2400,0.012)*np.exp(-tline(0.012)*300); return mixin(x,m,0.5)*amp
def tock(amp=1.0):
    x=click(1.0,0.014,1200); m=osc(1500,0.014)*np.exp(-tline(0.014)*250); return mixin(x,m,0.6)*amp
def bell(f,dur=2.0,amp=1.0):
    t=tline(dur); out=np.sin(2*np.pi*f*t)*np.exp(-t*2.2)+0.5*np.sin(2*np.pi*f*2.76*t)*np.exp(-t*5)+0.25*np.sin(2*np.pi*f*5.4*t)*np.exp(-t*8)
    return out*env(len(t),0.002,0.05)*amp
def pluck(f,dur=0.9,bright=1.0,amp=1.0):
    t=tline(dur); out=np.zeros(len(t))
    for k in range(1,9):
        if f*k>18000: break
        out+=(1/k**1.1)*np.sin(2*np.pi*f*k*t+hsh(k*f))*np.exp(-t*(2.6+k*1.6*bright))
    return out*np.exp(-t*2.2)*env(len(t),0.002,0.02)*amp
def bass(f,dur,amp=1.0):
    t=tline(dur); return (np.sin(2*np.pi*f*t)+0.3*np.sin(2*np.pi*2*f*t))*np.exp(-t*1.2)*env(len(t),0.005,0.1)*amp
def sub_drone(f,dur,amp=1.0):
    t=tline(dur); x=osc(f,dur)*0.6+osc(f*1.003,dur)*0.4+osc(f*2.002,dur)*0.15; x*=1+0.1*np.sin(2*np.pi*0.2*t); return x*env(len(t),1.5,2.0)*amp
def riser(dur=2.5,amp=1.0,f0=150,f1=6000):
    x=sweep_noise(dur,f0,f1,2.0,1.4); t=tline(dur); s=osc(70*2**(t/dur*3.2))*0.25; return (x+s)*(t/dur)**1.7*amp
def boom(amp=1.0,dur=1.6):
    k=kick(1.0,120,32,dur); t=tline(dur); n=fftfilt(noise(dur),hi=700)*np.exp(-t*3.5)*0.5; return (k+n)*amp
def whoosh(dur=0.5,f0=250,f1=2600,amp=1.0,curve=1.0):
    x=sweep_noise(dur,f0,f1,1.7,curve); t=tline(dur); e=np.sin(np.pi*np.clip(t/dur,0,1))**1.4; return x*e*amp
def thud(amp=1.0):
    k=kick(1.0,90,40,0.3); n=fftfilt(noise(0.09),hi=1800)*np.exp(-tline(0.09)*45); return mixin(k.copy(),n,0.9)*amp
def paper_slap(amp=1.0):
    x=fftfilt(noise(0.07),lo=300,hi=2500)*np.exp(-tline(0.07)*55); c=click(0.6,0.006,1500); return mixin(x,c)*amp
def tear(dur=0.45,amp=1.0):
    n=int(dur*SR); x=np.zeros(n)
    for i in range(int(dur*260)):
        p=int(hsh(i*3.3)*n*0.92); l=int(SR*0.004*(0.5+hsh(i*7.7))); x[p:p+l]+=rng.standard_normal(l)*(0.5+hsh(i))
    x=fftfilt(x,lo=500,hi=6000); bed=fftfilt(noise(dur),lo=400,hi=3500)*0.35
    return (x+bed)*np.hanning(n)**0.5*amp
def glitch(dur=0.28,amp=1.0):
    n=int(dur*SR); x=np.zeros(n)
    for i in range(int(dur*40)):
        p=int(hsh(i*5.1)*n); l=int(SR*0.01*(0.3+hsh(i*2.2)*2)); f=200+hsh(i*9)*3000
        x[p:p+l]+=osc(f,l/SR,wave='square')[:max(0,min(l,n-p))]*0.6
    x+=fftfilt(noise(dur),lo=1500,hi=9000)*0.4*(rng.random(n)<0.3)
    return x*np.hanning(n)**0.3*amp
def typeclick(amp=1.0):
    x=click(1.0,0.012,2000); m=osc(2900,0.012)*np.exp(-tline(0.012)*300); return mixin(x,m,0.4)*amp
def ding(amp=1.0): return bell(2350,0.8,amp)
def stamp(amp=1.0):
    k=kick(1.0,100,45,0.25); n=fftfilt(noise(0.05),lo=300,hi=4000)*np.exp(-tline(0.05)*90); return mixin(k.copy(),n,1.1)*amp
def beep(f=880,dur=0.07,amp=1.0): t=tline(dur); return osc(f,dur)*env(len(t),0.003,0.02)*amp
def heartbeat(amp=1.0):
    a=kick(1.0,80,40,0.3); b=kick(0.7,75,38,0.25); out=np.zeros(int(0.7*SR)); mixin(out,a); seg=out[int(0.22*SR):]; mixin(seg,b); return out*amp
def crowd(dur=2.0,amp=1.0):
    t=tline(dur); x=np.zeros(len(t))
    for i in range(18):
        f=110+hsh(i*3)*120; seg=osc(f*(1+0.01*np.sin(2*np.pi*(2+hsh(i))*t)),wave='saw')*fftfilt(np.abs(noise(dur)),hi=6)*0.5
        x+=fftfilt(seg,lo=200,hi=1800)
    return x/18*env(len(t),0.3,0.3)*amp
def cash_register(amp=1.0):
    x=bell(1900,0.5,0.7); x=mixin(x,click(1.0,0.01,3000),0.8); x=mixin(x,bell(2500,0.4,0.5)); return x*amp
def car_horn(amp=1.0):
    t=tline(0.5); return (osc(415,0.5,wave='square')+osc(520,0.5,wave='square'))*0.4*env(len(t),0.02,0.08)*amp
def engine_idle(dur,amp=1.0,rate=14):
    x=np.zeros(int(dur*SR))
    for i in range(int(dur*rate)): p=int(i/rate*SR); l=int(0.03*SR); x[p:p+l]+=np.exp(-tline(0.03)*120)[:max(0,min(l,len(x)-p))]*(0.8+0.4*hsh(i))
    return fftfilt(x,hi=600)*amp
def clock_tick_train(dur,bpm=60,amp=1.0):
    x=np.zeros(int(dur*SR)); per=60/bpm; i=0
    while i*per<dur:
        p=int(i*per*SR); s=tick(amp) if i%2==0 else tock(amp); n=min(len(s),len(x)-p); x[p:p+n]+=s[:n]; i+=1
    return x
def shutter(amp=1.0):
    x=click(1.0,0.01,1500); x=mixin(x,fftfilt(noise(0.05),lo=600,hi=5000)*np.exp(-tline(0.05)*100),0.8); return x*amp

# ---------- SFX extras (colagem Ford T) ----------
def hooves(dur=2.0,bpm=150,amp=0.6):
    """cascos em trote: pares de toques surdos com variação"""
    out=np.zeros(int(dur*SR)); step=60/bpm
    t=0.0; k=0
    while t<dur-0.1:
        for j,(off,a) in enumerate([(0,1.0),(0.09,0.7)]):
            i=int((t+off)*SR); x=thud(0.25*a*amp*(0.85+0.3*hsh(k*3+j)))
            x=fftfilt(x,hi=900); n=min(len(x),len(out)-i)
            if n>0: out[i:i+n]+=x[:n]
        t+=step; k+=1
    return out
def neigh(amp=0.6,dur=1.1):
    """relincho: glissando descendente com vibrato e ruído de sopro"""
    t=tline(dur); f=np.interp(t,[0,0.15,0.5,dur],[620,880,520,300])*(1+0.06*np.sin(2*np.pi*23*t))
    x=osc(f,dur,'saw')*0.5+osc(f*2.01,dur,'sine')*0.2
    x=fftfilt(x,lo=250,hi=4200)*env(len(t),0.03,0.25)*np.exp(-t*1.4)
    br=fftfilt(noise(dur),lo=1500,hi=6000)*np.exp(-t*3)*0.12
    return (x+br)*amp
def thruster(dur=2.5,amp=0.7):
    """propulsor: rumble grave + jato filtrado com flutuação"""
    t=tline(dur); j=fftfilt(noise(dur),lo=600,hi=5200)*(0.55+0.25*np.sin(2*np.pi*7*t)+0.15*np.sin(2*np.pi*0.9*t))
    r=osc(48+6*np.sin(2*np.pi*0.5*t),dur,'saw')*0.35+osc(31,dur,'sine')*0.3
    return (j*0.6+r)*env(len(t),0.35,0.6)*amp
def machine_chime(amp=0.6):
    """campainha da 'máquina' (sinal próprio, três notas curtas)"""
    out=np.zeros(int(0.9*SR))
    for i,f in enumerate([1046.5,1318.5,1568.0]):
        x=bell(f,0.5,0.55*amp); o=int(i*0.13*SR); n=min(len(x),len(out)-o); out[o:o+n]+=x[:n]
    return out
def rivet_click(amp=0.8):
    """colchete de latão encaixando"""
    return np.concatenate([click(amp,0.006,3000),np.zeros(int(0.03*SR)),click(0.6*amp,0.01,1800)])
def paper_slide(dur=0.5,amp=0.5):
    """papel deslizando sobre papel"""
    t=tline(dur); return fftfilt(noise(dur),lo=900,hi=7000)*(np.sin(np.pi*t/dur)**0.7)*amp*0.6
def crank_start(amp=0.7):
    """manivela + motor pegando (Ford T)"""
    parts=[]
    for i in range(4): parts.append(fftfilt(noise(0.12),lo=200,hi=1800)*np.exp(-tline(0.12)*25)*amp*(0.6+0.1*i)); parts.append(np.zeros(int(0.16*SR)))
    parts.append(engine_idle(1.6,amp*0.8,rate=11)); return np.concatenate(parts)

# ---------- sonoplastia cômica (Risco-GMO) ----------
def boing(amp=0.8,f0=320,dur=0.6):
    """mola de desenho animado: tom que cai com vibrato forte"""
    t=tline(dur); f=f0*np.exp(-t*2.2)*(1+0.35*np.sin(2*np.pi*(9+18*np.exp(-t*3))*t)); x=osc(f,dur,'tri')*np.exp(-t*4.5)*env(len(t),0.004,0.1); return x*amp
def slide_whistle(up=True,amp=0.6,dur=0.7,f0=500,f1=1500):
    t=tline(dur); a,b=(f0,f1) if up else (f1,f0); f=np.interp(t,[0,dur],[a,b]); x=osc(f,dur,'sine')+0.25*osc(2*f,dur,'sine'); br=fftfilt(noise(dur),lo=2000,hi=6000)*0.08; return (x+br)*env(len(t),0.02,0.08)*amp
def record_scratch(amp=0.8,dur=0.35):
    t=tline(dur); f=np.interp(t,[0,dur*0.3,dur],[900,250,120]); x=fftfilt(noise(dur),lo=600,hi=5000)*(0.6+0.4*np.sin(2*np.pi*f*t)); return x*env(len(t),0.005,0.06)*np.exp(-t*4)*amp
def pop_cartoon(amp=0.7,f=700):
    t=tline(0.09); return np.sin(2*np.pi*f*np.exp(-t*12)*t)*env(len(t),0.002,0.04)*amp
def wah_wah(amp=0.6):
    """trombone triste: três notas descendentes com vibrato (fracasso cômico)"""
    out=[]
    for i,(f,d) in enumerate([(392,0.32),(370,0.32),(349,0.32),(330,0.7)]):
        t=tline(d); ff=f*(1+0.02*np.sin(2*np.pi*6*t)*(0.3+0.7*i/3)); x=(osc(ff,d,'saw')*0.6+osc(ff*2,d,'sine')*0.2); x=fftfilt(x,lo=200,hi=3200)*env(len(t),0.03,0.12); out.append(x); out.append(np.zeros(int(0.04*SR)))
    return np.concatenate(out)*amp
def kazoo(f=440,dur=0.5,amp=0.5):
    t=tline(dur); x=osc(f*(1+0.01*np.sin(2*np.pi*7*t)),dur,'square')*0.5+fftcarrier(f,dur) if False else osc(f*(1+0.01*np.sin(2*np.pi*7*t)),dur,'square')*0.5; return fftfilt(x,lo=300,hi=4000)*env(len(t),0.02,0.08)*amp
def cymbal_crash(amp=0.6,dur=1.2):
    t=tline(dur); return fftfilt(noise(dur),lo=3000,hi=14000)*np.exp(-t*3)*env(len(t),0.002,0.2)*amp
def drum_fill(amp=0.7):
    out=[]
    for i in range(6): out.append(snare(0.5*amp*(0.6+0.08*i))[:int(0.09*SR)]); 
    out.append(kick(amp)); return np.concatenate(out)
def ding_typewriter(amp=0.6): return bell(1760,0.6,amp)
def paper_rip(amp=0.8): return tear(0.5,amp)
def zip_in(amp=0.5): return whoosh(0.25,300,4000,amp,1.4)
def honk_clown(amp=0.7):
    t=tline(0.28); f=np.interp(t,[0,0.08,0.28],[520,420,380]); x=osc(f,0.28,'square')*0.4+osc(f*1.5,0.28,'saw')*0.2; return fftfilt(x,lo=200,hi=3500)*env(len(t),0.01,0.08)*amp
