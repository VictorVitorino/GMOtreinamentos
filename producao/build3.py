#!/usr/bin/env python3
import json, base64, sys, shutil, argparse
from pathlib import Path
ROOT=Path(__file__).resolve().parent; COMP=ROOT/'comp'; OUT=ROOT/'out'; OUT.mkdir(exist_ok=True); REF=Path('/tmp/claude-0/-home-user-dashboardgestao/57c253dd-6685-5f25-aa92-a5a49a9cc0a9/scratchpad/ref')
ap=argparse.ArgumentParser(); ap.add_argument('--scenes',default='scenes3a.js,scenes3b.js'); ap.add_argument('--out',default='index.html'); ap.add_argument('--timing',default='timing.json'); a=ap.parse_args()
b64=lambda p:'data:image/png;base64,'+base64.b64encode(Path(p).read_bytes()).decode()
timing=json.loads((ROOT/a.timing).read_text())
brand={'ons':b64(REF/'axon_ons_white.png'),'am':b64(REF/'axon_am_mark_white.png'),'amDark':b64(REF/'axon_am_mark.png')}
tpl=(COMP/'template3.html').read_text()
sc=[s for s in a.scenes.split(',') if s]
parts={'TEX':'textures.js','ENGINE':'engine.js','FX':'fx.js','FX3':'fx3.js','ART':'art3.js','SCENES_A':sc[0] if sc else '','SCENES_B':sc[1] if len(sc)>1 else '','BOOT':'boot3.js'}
for k,f in parts.items():
    p=COMP/f if f else None; tpl=tpl.replace('/*@%s@*/'%k,(p.read_text() if p and p.exists() else '').replace('</script','<\\/script'))
# imagens: out/img/<slot>.(png|jpg) -> IMG[slot]; slots ausentes recebem um placeholder cinza
PH='data:image/svg+xml;utf8,'+'<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22600%22><rect width=%22800%22 height=%22600%22 fill=%22%23888%22/><text x=%2250%25%22 y=%2252%25%22 font-size=%2248%22 text-anchor=%22middle%22 fill=%22%23eee%22 font-family=%22sans-serif%22>placeholder</text></svg>'
imgs={}
for p in sorted((OUT/'img').rglob('*')):
    if p.suffix.lower() in ('.png','.jpg','.jpeg','.webp'): imgs[p.relative_to(OUT/'img').with_suffix('').as_posix().replace('/','_')]=p.relative_to(OUT).as_posix()
import re as _re
slots=set(_re.findall(r"IMG\.([a-zA-Z0-9_]+)", ''.join((COMP/f).read_text() for f in [x for x in parts.values() if x] if (COMP/f).exists())))
for s in slots: imgs.setdefault(s, PH)
tpl=tpl.replace('/*@IMG@*/',json.dumps(imgs))
meta={}
for p in sorted((OUT/'img').rglob('*_meta.json')):
    meta[p.relative_to(OUT/'img').as_posix()[:-10].replace('/','_')]=json.loads(p.read_text())
tpl=tpl.replace('/*@META@*/',json.dumps(meta))
tpl=tpl.replace('/*@FONTS@*/',(ROOT/'fonts'/'fonts.css').read_text())
tpl=tpl.replace('/*@TIMING@*/',json.dumps(timing,ensure_ascii=False)).replace('/*@BRAND@*/',json.dumps(brand))
if (OUT/'mix.mp3').exists(): tpl=tpl.replace('<div id="ui" hidden>','<audio id="mix" src="mix.mp3"></audio><div id="ui" hidden>')
shutil.copytree(ROOT/'fonts',OUT/'fonts',dirs_exist_ok=True)
(OUT/a.out).write_text(tpl); print('out/'+a.out,len(tpl)//1024,'KB')
