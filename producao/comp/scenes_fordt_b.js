/* ==== QUEM APERTA O BOTÃO? · cenas S07–S17 ==== */
"use strict";
function stubScene(sid,nome,bg){const sc=mkScene(sid,bg||C.paper2,T0(sid),T1(sid));bgPaperPrint(sc.cam,'#efe7d4');const c=captionBox(sc.cam,`${sid} · ${nome}`,{size:40,font:FA});R(c,{x:120,y:120});const t=captionBox(sc.cam,'cena em construção — ver storyboard',{size:24,font:FO});R(t,{x:120,y:210});return sc}
function addRotors(m){/* quatro rotores de papel nos cantos do chassi + contorno neon */
  const spots=[[40,300],[800,300],[120,250],[720,250]].slice(0,2).concat([[300,290],[560,290]]);
  const rs=spots.map(([x,y],i)=>{const p=pos(m.inner,x,y);const d=H('div',{style:`position:absolute;left:-70px;top:-14px;width:140px;height:28px;border-radius:14px;background:#2b2b2b;border:3px solid #fff;box-shadow:0 6px 10px rgba(0,0,0,.4);transform-origin:50% 50%`},p);const mast=H('div',{style:`position:absolute;left:-6px;top:0;width:12px;height:${y>280?60:40}px;background:#444;border:2px solid #fff`},p);return R(d,{})});
  const neon=H('div',{style:'position:absolute;left:52px;top:322px;width:796px;height:166px;border-radius:34px 64px 24px 24px;box-shadow:0 0 18px 6px rgba(190,80,255,.75),inset 0 0 12px rgba(190,80,255,.6);pointer-events:none'},m.inner);const nid=R(neon,{o:0});
  m.rotors=rs;m.neon=nid;return m}
function spinRotors(m,t0,t1){proc(t=>{if(t<t0||t>t1)return;m.rotors.forEach((id,i)=>{REG[id].cur.sx=Math.abs(Math.cos(t*18+i))*0.9+0.1})})}
function flightMode(m,t){m.rotors.forEach((id,i)=>{setAt(id,0,{o:0});setAt(id,t+i*0.12,{o:1,sy:0});tw(id,t+i*0.12,0.35,{sy:1},'back')});tw(m.neon,t+0.5,0.6,{o:1},'out');proc(tt=>{if(tt<t+1.1)return;REG[m.neon].cur.o*=0.8+0.2*Math.sin(tt*6)})}
/* ---------- S07 · Disca 1965 ---------- */
function buildS07(){const sid='S07';const sc=mkScene(sid,'#3b2a1a',T0(sid),T1(sid));bgWood(sc.cam);
  const ph=img(sc.cam,IMG.veh_phone,1100,720);const pid=R(ph,{x:160,y:200});kb(pid,T0(sid),T1(sid),{s:1.0},{s:1.12});
  const dial=H('div',{style:`position:absolute;left:0;top:0;width:260px;height:260px;border-radius:50%;border:10px dashed rgba(255,255,255,.55);transform-origin:50% 50%`},sc.cam);const did=R(dial,{x:560,y:420});
  [[0.2,'1'],[0.9,'9'],[1.5,'6'],[2.0,'5']].forEach(([d,n],i)=>{tw(did,T0(sid)+d,0.35,{rot:-120-i*40},'out');tw(did,T0(sid)+d+0.4,0.4,{rot:0},'inOut');const c=captionBox(sc.cam,n,{size:64,font:FA,pad:'4px 22px'});const cid=R(c,{x:1300+i*120,y:300});pop(cid,T0(sid)+d+0.1,0.3,0.4,'back')});
  const vis=captionBox(sc.cam,'1965_',{size:40,font:FTW,pad:'10px 26px'});const vid=R(vis,{x:1300,y:460});pop(vid,T0(sid)+2.3,0.4,0.6,'backSoft');
  // o Cientista aperta com o cotovelo (café nas duas mãos)
  const e=collageChar(sc.cam,{body:IMG.col_metro_cientista_elon_body,head:IMG.faces_elon,meta:META.col_metro_cientista_elon,scale:0.55,flip:true});cameoPeek(e,T0(sid)+1.6,T1(sid)+0.2,{edge:'right',x:1920,y:300,amt:330});
  const cf=pictoBubble(sc.cam,'coffee',{w:120,h:100});const cfid=R(cf,{x:1560,y:180});pop(cfid,T0(sid)+2.0,0.35,0.3,'back');
  const bp=pos(sc.cam,1380,760);const btn=H('div',{style:'position:absolute;left:0;top:0;transform-origin:50% 100%'},bp,'PARTIU');arcadeButton(btn,130);const bid=R(btn,{});pop(bid,T0(sid)+1.2,0.4,0.6,'backSoft');tw(bid,T1(sid)-0.5,0.1,{sy:0.72},'in');tw(bid,T1(sid)-0.4,0.3,{sy:1},'elastic');camBump(sid,T1(sid)-0.5,0.02);flashAt(T1(sid)-0.08,0.5,0.25,'#f5e1c8');}
/* ---------- S08 · Chegada: 1965 — e a solução óbvia ---------- */
function buildS08(){const sid='S08';const sc=mkScene(sid,C.blue,T0(sid),T1(sid));bgGridColor(sc.cam,C.blue,'rgba(255,255,255,.25)');
  const y3=year3d(sc.cam,{text:'1965',size:420,depth:16});const yid=R(y3,{x:420,y:280});slam(yid,T0(sid)+0.2,1.8,-3);fadeOut(yid,T0(sid)+2.4,0.3);
  const p5=collageChar(sc.cam,{body:IMG.col_rua1908_barba_gabriel_flat,meta:META.col_rua1908_barba_gabriel,scale:0.9});cameoPeek(p5,T0(sid)+0.6,T0(sid)+2.6,{edge:'bottom',x:200,y:1080,amt:300});
  const pb=photo(sc.cam,IMG.cards_transito_pb,{w:2000,h:1330,fit:'cover',shadow:false});const pbid=R(pb,{x:-40,y:-120});setAt(pbid,0,{o:0});setAt(pbid,T0(sid)+2.5,{o:1});kb(pbid,T0(sid)+2.5,T1(sid),{s:1},{s:1.06});
  const co=photo(sc.cam,IMG.cards_transito_cor,{w:2000,h:1330,fit:'cover',shadow:false});const coid=R(co,{x:-40,y:-120});setAt(coid,0,{o:0});setAt(coid,T0(sid)+3.6,{o:1});kb(coid,T0(sid)+2.5,T1(sid),{s:1},{s:1.06});
  proc(t=>{const a=T0(sid)+3.6,p=clamp((t-a)/1.4,0,1);co.style.clipPath=t<a?'circle(0px at 60% 55%)':`circle(${E.inOut(p)*1500}px at 60% 55%)`});
  cap(sc.cam,'A CIDADE CRESCEU',T0(sid)+3.0,T0(sid)+5.2,120,120,{size:36,font:FA,pop:true});
  // a Máquina no fim da fila, com pisca-alerta
  const m=makeMachine(sc.cam,0.42,{x:1380,y:760});setAt(m.id,0,{o:0});setAt(m.id,T0(sid)+3.8,{o:1});machineBob(m,T0(sid)+3.8,T1(sid),1.2);const bl=H('div',{style:'position:absolute;left:60px;top:300px;width:40px;height:40px;border-radius:50%;background:#ffb13b;box-shadow:0 0 18px #ffb13b'},m.inner);proc(t=>{bl.style.opacity=(Math.floor(t*2)%2)?1:0.15});
  // P08 Engenheiro da prancheta: "SOLUÇÃO: MAIS FAIXAS" — e a estrada alarga com o engarrafamento junto
  const p8=collageChar(sc.cam,{body:IMG.col_terno_exec_gabriel_flat,meta:META.col_terno_exec_gabriel,scale:0.24});cameoPop(p8,T0(sid)+4.4,T1(sid)+0.2,1300,520);
  const plan=captionBox(sc.cam,'SOLUÇÃO: MAIS FAIXAS',{size:34,font:FTW,bg:'#dfe8ef',pad:'14px 26px'});const plid=R(plan,{x:1240,y:300,rot:-4});pop(plid,T0(sid)+4.9,0.45,0.6,'backSoft');
  tw(coid,T0(sid)+5.6,1.2,{sx:1.25,sy:1.0},'inOut');tw(pbid,T0(sid)+5.6,1.2,{sx:1.25,sy:1.0},'inOut');}
/* ---------- S09 · A dor mudou de lugar + carimbo CONFIAR ---------- */
function buildS09(){const sid='S09';const sc=mkScene(sid,C.paper2,T0(sid),T1(sid));
  const co=photo(sc.cam,IMG.cards_transito_cor,{w:2000,h:1330,fit:'cover',shadow:false,filter:'saturate(.85) brightness(.9)'});const coid=R(co,{x:-40,y:-120});kb(coid,T0(sid),T1(sid),{s:1.06},{s:1.12});
  H('div',{style:'position:absolute;left:0;top:0;width:1920px;height:1080px;background:rgba(240,236,220,.35)'},sc.cam);
  // P06 Guarda no pedestal; o semáforo brota do pedestal
  const ped=H('div',{style:'position:absolute;left:0;top:0;width:220px;height:90px;background:#f3ecd8;border:4px solid #1b1e21;border-radius:8px;box-shadow:0 10px 20px rgba(0,0,0,.4)'},sc.cam);R(ped,{x:120,y:900});
  const p6=collageChar(sc.cam,{body:IMG.col_soldados_dir_elon_flat,meta:META.col_soldados_dir_elon,scale:0.33});setAt(p6.id,0,{x:150,y:330});headWobble(p6,3,1.2,2);
  const sem=svgBox(sc.cam,90,250);const g=sem._svg;S('rect',{x:5,y:5,width:80,height:240,rx:14,fill:'#1b1e21',stroke:'#fff','stroke-width':4},g);[['#c8322b',50],['#f2c200',125],['#2f9e48',200]].forEach(([c,y])=>S('circle',{cx:45,cy:y,r:28,fill:c,stroke:'#fff','stroke-width':3},g));sem.style.transformOrigin='50% 100%';const semid=R(sem,{x:380,y:650});setAt(semid,0,{o:0});setAt(semid,T0(sid)+1.0,{o:1,sy:0});tw(semid,T0(sid)+1.0,1.2,{sy:1},'back');lookAt(p6,T0(sid)+2.2,0.5,22);
  const cf=pictoBubble(sc.cam,'coffee',{w:120,h:100});const cfid=R(cf,{x:290,y:200});pop(cfid,T0(sid)+2.8,0.35,0.3,'back');fadeOut(cfid,T0(sid)+4.4,0.3);
  // relógio com anos no lugar das horas; a barba do passageiro cresce
  const ck=img(sc.cam,IMG.veh_clock,300,300);const ckid=R(ck,{x:760,y:90});pop(ckid,T0(sid)+3.2,0.4,0.6,'backSoft');['1965','1966','1967','1968'].forEach((y,i)=>{const c=captionBox(sc.cam,y,{size:26,font:FO,pad:'4px 10px'});const cid=R(c,{x:1070,y:120+i*62});pop(cid,T0(sid)+3.6+i*0.5,0.3,0.5,'back')});
  const p9=collageChar(sc.cam,{body:IMG.col_fedora_senhor_elon_flat,meta:META.col_fedora_senhor_elon,scale:0.24});cameoPop(p9,T0(sid)+3.4,null,1240,520);
  const beard=H('div',{style:'position:absolute;left:0;top:0;width:120px;height:0;background:#d9d9d9;border-radius:0 0 60px 60px;border:3px solid #fff;box-shadow:0 6px 10px rgba(0,0,0,.3);transform-origin:50% 0'},sc.cam);const bid=R(beard,{x:1360,y:760});setAt(bid,0,{o:0});setAt(bid,T0(sid)+4.0,{o:1});proc(t=>{const a=T0(sid)+4.0;if(t<a)return;beard.style.height=Math.min(220,(t-a)*55)+'px'});
  // P07 Motorista: mapa gigante → troca de carro → cinto 'clic'
  const p7=collageChar(sc.cam,{body:IMG.col_rua1908_dama_elon_flat,meta:META.col_rua1908_dama_elon,scale:1.0});cameoSlide(p7,T0(sid)+5.5,T1(sid)+0.3,{x:-300,y:420,rot:-5},{x:420,y:420,rot:0},{inDur:0.9,exit:{x:900,y:560,rot:0},outDur:1.0});
  const map=H('div',{style:`position:absolute;left:0;top:0;width:520px;height:360px;background:#efe6cf;border:3px solid #1b1e21;box-shadow:0 10px 24px rgba(0,0,0,.4);background-image:linear-gradient(rgba(60,80,120,.25) 2px,transparent 2px),linear-gradient(90deg,rgba(60,80,120,.25) 2px,transparent 2px);background-size:60px 60px;transform-origin:0 0;font:400 28px/1 ${FO};padding:10px;box-sizing:border-box;color:#1b1e21`},sc.cam,'MAPA · 1965');const mid=R(map,{x:620,y:380});setAt(mid,0,{o:0});setAt(mid,T0(sid)+6.4,{o:1,sx:0.1,sy:0.1});tw(mid,T0(sid)+6.4,0.8,{sx:1,sy:1},'backSoft');tw(mid,T0(sid)+8.2,0.4,{sx:0.05,sy:0.05,o:0},'in');
  const m=makeMachine(sc.cam,0.5,{x:1000,y:620});setAt(m.id,0,{o:0});setAt(m.id,T0(sid)+5.0,{o:1});machineBob(m,T0(sid)+5,T1(sid),1.5);
  tag(sc.cam,'clic',T0(sid)+8.8,T0(sid)+9.6,1240,560,-6);
  const card=stampCard(sc.cam,'<div style="font:400 24px/1.1 \'Oswald\';letter-spacing:.14em;color:#6b6f75">BILHETE · 4 PARADAS</div>',{w:560,h:170,font:`400 20px/1.1 ${FO}`});const cardId=R(card,{x:1200,y:80,rot:3});pop(cardId,T0(sid)+8.4,0.5,0.6,'backSoft');
  const st=stamp(sc.cam,'CONFIAR',{size:36,color:C.red,pad:'10px 16px',border:5});const stid=R(st,{x:1360,y:120,rot:-10});slam(stid,T0(sid)+8.9,2.6,-10);camBump(sid,T0(sid)+8.9,0.02);}
/* ---------- S10 · 1985: glitch — a rota, resolvida ---------- */
function buildS10(){const sid='S10';const sc=mkScene(sid,'#2a0f3a',T0(sid),T1(sid));H('div',{style:'position:absolute;inset:0;background:linear-gradient(160deg,#3b1254,#1a0a2a 60%,#102040)'},sc.cam);scanlines(sc.cam,.22);glitchAt(T0(sid),0.5);
  const pc=photo(sc.cam,IMG.c_office80s,{w:900,h:620,fit:'cover',tape:'both',sa:.5});const pcid=R(pc,{x:120,y:180,rot:-2});pop(pcid,T0(sid)+0.3,0.5,0.7,'backSoft');
  const scr=captionBox(sc.cam,'',{size:30,font:FTW,bg:'#0b2a12',color:'#7CFF7C',pad:'12px 18px'});const scid=R(scr,{x:260,y:300});fadeIn(scid,T0(sid)+0.8,0.2);typed(scr,'ROTA CALCULADA · TEMPO: 4 HORAS_',T0(sid)+0.9,16);
  // impressora matricial: mapa infinito desenrolando
  const strip=H('div',{style:'position:absolute;left:0;top:0;width:260px;height:900px;background:repeating-linear-gradient(180deg,#f4f1e6 0 48px,#e6e2d4 48px 50px);border-left:14px dotted #ccc;border-right:14px dotted #ccc;box-shadow:0 10px 24px rgba(0,0,0,.45);transform-origin:50% 0'},sc.cam);const stid=R(strip,{x:540,y:640});setAt(stid,0,{o:0});setAt(stid,T0(sid)+1.4,{o:1,sy:0});tw(stid,T0(sid)+1.4,4.0,{sy:1},'lin');
  const p10=collageChar(sc.cam,{body:IMG.col_fedora_senhor_elon_flat,meta:META.col_fedora_senhor_elon,scale:0.26});cameoPop(p10,T0(sid)+0.6,null,900,330);headWobble(p10,3,1.6,5);
  // a Máquina atualizou o seletor: touch; visor 2026
  const m=makeMachine(sc.cam,0.5,{x:1240,y:600});setAt(m.id,0,{o:0});setAt(m.id,T0(sid)+2.6,{o:1});machineBob(m,T0(sid)+2.6,T1(sid),1.5);
  const ph=pictoBubble(sc.cam,'phone',{w:120,h:100});const phid=R(ph,{x:1300,y:440});pop(phid,T0(sid)+3.0,0.35,0.3,'back');fadeOut(phid,T0(sid)+4.4,0.3);
  visorSeq(m.visor,[[T0(sid)+3.4,'2026_']],12);
  const bp=pos(sc.cam,980,820);const btn=H('div',{style:'position:absolute;left:0;top:0;transform-origin:50% 100%'},bp,'PARTIU');arcadeButton(btn,120);const bid=R(btn,{});pop(bid,T0(sid)+4.0,0.4,0.6,'backSoft');tw(bid,T1(sid)-0.6,0.1,{sy:0.72},'in');tw(bid,T1(sid)-0.5,0.3,{sy:1},'elastic');camBump(sid,T1(sid)-0.6,0.02);
  cap(sc.cam,'Oitenta e cinco.',T0(sid)+0.6,T0(sid)+3.2,1240,120,{size:44,font:FA,bg:'#f2c200'});}
/* ---------- S11 · 2026: atualização instalada (hipoteticamente) ---------- */
function buildS11(){const sid='S11';const sc=mkScene(sid,C.red,T0(sid),T1(sid));bgRed(sc.cam);
  const y3=year3d(sc.cam,{text:'2026',size:420,depth:16});const yid=R(y3,{x:420,y:280});slam(yid,T0(sid)+0.2,1.8,-3);fadeOut(yid,T0(sid)+2.3,0.3);
  // Elon (sua imagem, meio corpo) apresenta a atualização; o carro voador real paira; a Máquina ganha rotores e neon
  const el=img(sc.cam,IMG.veh_elon_meio,620,520);const elid=R(el,{x:40,y:520});setAt(elid,0,{o:0});setAt(elid,T0(sid)+2.4,{o:1,x:-300});tw(elid,T0(sid)+2.4,0.7,{x:40},'backSoft');
  const car=img(sc.cam,IMG.veh_voador_carro,760,560);const carid=R(car,{x:1120,y:80});setAt(carid,0,{o:0});setAt(carid,T0(sid)+2.6,{o:1,y:-500});tw(carid,T0(sid)+2.6,0.9,{y:80},'out');floatY(carid,10,1.4,3);
  const m=makeMachine(sc.cam,0.7,{x:620,y:560});addRotors(m);setAt(m.id,0,{o:0});setAt(m.id,T0(sid)+2.5,{o:1});flightMode(m,T0(sid)+2.6);spinRotors(m,T0(sid)+2.6,T1(sid)+20);machineBob(m,T0(sid)+3.2,T1(sid)+20,8);
  const hip=captionBox(sc.cam,'HIPOTÉTICO',{size:26,font:FO,bg:'#f2c200',pad:'8px 16px'});const hid=R(hip,{x:1000,y:560,rot:-8});pop(hid,T0(sid)+3.0,0.4,0.6,'backSoft');proc(t=>{if(t<T0(sid)+3.4)return;REG[hid].cur.rot+=Math.sin(t*2.2)*7});
  cap(sc.cam,'VOA DE VERDADE (NESTA HISTÓRIA)',T0(sid)+2.9,null,1180,700,{size:26,font:FO,bg:'rgba(255,255,255,.9)',pop:true});}
/* ---- utilitários do terceiro ato ---- */
function skyGrass(parent){bgGrass(parent);H('div',{style:'position:absolute;left:-100px;top:700px;width:2200px;height:500px;background:linear-gradient(180deg,#5aa63a,#3f8a2a 60%,#2e6d1f);border-top:6px solid rgba(255,255,255,.35)'},parent)}
function flyingMachine(parent,sc,x,y,t0,t1){const m=makeMachine(parent,sc,{x,y});addRotors(m);m.rotors.forEach(id=>setAt(id,0,{o:1}));setAt(m.neon,0,{o:1});spinRotors(m,t0,t1);machineBob(m,t0,t1,10);return m}
function slotChar(parent,o){/* participante: cabeça real se existir, senão disco-placeholder com o código */return collageChar(parent,Object.assign({placeholder:o.code},o))}
function paperHand(parent,color,rot){const w=svgBox(parent,120,150);const g=w._svg;S('path',{d:'M30 150 V70 q0 -14 14 -14 q14 0 14 14 V40 q0 -14 14 -14 q14 0 14 14 V60 q0 -12 12 -12 q12 0 12 12 V75 q0 -10 10 -10 q10 0 10 10 V110 q0 40 -40 40z',fill:color,stroke:'#1b1e21','stroke-width':4,'stroke-linejoin':'round'},g);S('path',{d:'M30 150 V70 q0 -14 14 -14 q14 0 14 14 V40 q0 -14 14 -14 q14 0 14 14 V60 q0 -12 12 -12 q12 0 12 12 V75 q0 -10 10 -10 q10 0 10 10 V110 q0 40 -40 40z',fill:'none',stroke:'#fff','stroke-width':10,'stroke-linejoin':'round',opacity:.9},g);g.insertBefore(g.lastChild,g.firstChild);w.style.transformOrigin='50% 100%';return w}
/* ---------- S12 · Ninguém entra (o silêncio) ---------- */
function buildS12(){const sid='S12';const sc=mkScene(sid,'#7fb6ff',T0(sid),T1(sid));skyGrass(sc.cam);
  const m=flyingMachine(sc.cam,0.75,620,560,T0(sid),T1(sid)+30);
  const hip=captionBox(sc.cam,'HIPOTÉTICO',{size:24,font:FO,bg:'#f2c200',pad:'6px 14px'});const hid=R(hip,{x:1040,y:600,rot:-8});proc(t=>{REG[hid].cur.rot+=Math.sin(t*2.2)*7;REG[hid].cur.y+=Math.sin(t*1.7)*10*0.75});
  // a turma entra num semicírculo, um por vez (2 s cada)
  const p11=slotChar(sc.cam,{body:IMG.col_linha_operario_gabriel_body,meta:META.col_linha_operario_gabriel,code:'P11',scale:0.36});cameoSlide(p11,T0(sid),T1(sid)+10,{x:-400,y:420,rot:-4},{x:120,y:420,rot:0},{inDur:1.0,exit:{x:120,y:420}});
  const vol=captionBox(sc.cam,'MANUAL DO CARRO VOADOR — VOL. 1 de 12',{size:22,font:FTW,pad:'8px 14px'});const volid=R(vol,{x:60,y:330,rot:-5});pop(volid,T0(sid)+1.0,0.4,0.6,'backSoft');fadeOut(volid,T0(sid)+2.4,0.3);
  const p12=slotChar(sc.cam,{body:IMG.col_soldados_esq_gabriel_body,meta:META.col_soldados_esq_gabriel,code:'P12',scale:0.33});cameoSlide(p12,T0(sid)+2.0,T1(sid)+10,{x:2000,y:420,rot:4},{x:1480,y:420,rot:0},{inDur:1.0,exit:{x:1480,y:420}});
  const ph=pictoBubble(sc.cam,'phone',{w:120,h:100});const phid=R(ph,{x:1420,y:300});pop(phid,T0(sid)+3.0,0.35,0.3,'back');fadeOut(phid,T0(sid)+4.2,0.3);
  const p13=slotChar(sc.cam,{body:IMG.col_soldados_dir_elon_body,meta:META.col_soldados_dir_elon,code:'P13',scale:0.33});cameoSlide(p13,T0(sid)+4.0,T1(sid)+10,{x:420,y:1200,rot:0},{x:420,y:480,rot:0},{inDur:0.9,exit:{x:420,y:480}});lookAt(p13,T0(sid)+5.0,0.5,24);
  const lad=H('div',{style:'position:absolute;left:0;top:0;width:90px;height:220px;background:repeating-linear-gradient(180deg,#c9a24a 0 10px,transparent 10px 40px);border-left:10px solid #8a6a22;border-right:10px solid #8a6a22;box-sizing:border-box'},sc.cam);R(lad,{x:540,y:860});
  const p14=slotChar(sc.cam,{body:IMG.col_rua1908_dama_elon_body,meta:META.col_rua1908_dama_elon,code:'P14',scale:1.0});cameoSlide(p14,T0(sid)+6.0,T1(sid)+10,{x:-300,y:460,rot:-5},{x:1180,y:460,rot:0},{inDur:1.0,exit:{x:1180,y:460}});
  const wheel=pictoBubble(sc.cam,'?',{w:120,h:100});const whid=R(wheel,{x:1200,y:330});pop(whid,T0(sid)+7.0,0.35,0.3,'back');fadeOut(whid,T0(sid)+8.2,0.3);
  // portas abrem (duas folhas de papel) e... silêncio
  const doorL=H('div',{style:'position:absolute;left:0;top:0;width:70px;height:120px;background:#b58a55;border:4px solid #fff;border-radius:6px;box-sizing:border-box;transform-origin:0 50%;box-shadow:0 6px 10px rgba(0,0,0,.3)'},m.inner);const dl=R(doorL,{x:300,y:330});const doorR=H('div',{style:'position:absolute;left:0;top:0;width:70px;height:120px;background:#b58a55;border:4px solid #fff;border-radius:6px;box-sizing:border-box;transform-origin:100% 50%;box-shadow:0 6px 10px rgba(0,0,0,.3)'},m.inner);const dr=R(doorR,{x:780,y:330});
  tw(dl,T0(sid)+8.0,0.8,{rot:-70},'inOut');tw(dr,T0(sid)+8.0,0.8,{rot:70},'inOut');
  visorSeq(m.visor,[[T0(sid)+8.2,'PASSAGEIROS: 0']],20);
  cap(sc.cam,'…',T0(sid)+8.6,T1(sid),930,160,{size:60,font:FP});}
/* ---------- S13 · Alguém ensina + carimbo APRENDER ---------- */
function buildS13(){const sid='S13';const sc=mkScene(sid,'#7fb6ff',T0(sid),T1(sid));skyGrass(sc.cam);
  const m=flyingMachine(sc.cam,0.75,620,560,T0(sid),T1(sid)+30);
  // P04 (o do feno) entra primeiro; a Máquina buzina; ele ri
  const p4=collageChar(sc.cam,{body:IMG.col_soldados_esq_gabriel_body,head:IMG['faces_felipe-treistman'],meta:META.col_soldados_esq_gabriel,scale:0.33});cameoSlide(p4,T0(sid)+1.0,T1(sid)+10,{x:-300,y:420,rot:-5},{x:700,y:420,rot:0},{inDur:1.2,exit:{x:700,y:420}});headWobble(p4,3,1.5,4);
  const ex=pictoBubble(sc.cam,'!',{w:110,h:100});const exid=R(ex,{x:900,y:250});pop(exid,T0(sid)+2.4,0.3,0.3,'back');fadeOut(exid,T0(sid)+3.2,0.2);camBump(sid,T0(sid)+2.4,0.02);nodYes(p4,T0(sid)+2.8,T0(sid)+4.0,9);
  // P11 ensina o cinto a P13
  const p11=slotChar(sc.cam,{body:IMG.col_linha_operario_gabriel_body,meta:META.col_linha_operario_gabriel,code:'P11',scale:0.36});setAt(p11.id,0,{x:120,y:420});cameoSlide(p11,T0(sid)+3.6,T1(sid)+10,{x:120,y:420},{x:420,y:400},{inDur:1.2,exit:{x:420,y:400}});
  const p13=slotChar(sc.cam,{body:IMG.col_soldados_dir_elon_body,meta:META.col_soldados_dir_elon,code:'P13',scale:0.33});setAt(p13.id,0,{x:420,y:480});cameoSlide(p13,T0(sid)+4.4,T1(sid)+10,{x:420,y:480},{x:900,y:380},{inDur:1.2,exit:{x:900,y:380}});
  tag(sc.cam,'clic',T0(sid)+6.0,T0(sid)+6.9,1000,330,-6);
  const hand=pictoBubble(sc.cam,'hand',{w:110,h:100});const hdid=R(hand,{x:620,y:260});pop(hdid,T0(sid)+5.4,0.3,0.3,'back');fadeOut(hdid,T0(sid)+6.6,0.3);
  // contador de passageiros 0 → 14
  const cnt=captionBox(sc.cam,'PASSAGEIROS: 0',{size:28,font:FTW,pad:'8px 16px'});const cid=R(cnt,{x:1240,y:200,rot:2});pop(cid,T0(sid)+0.4,0.4,0.6,'backSoft');counter(cnt,T0(sid)+6.8,1.8,14,'PASSAGEIROS: ','');
  const card=stampCard(sc.cam,'<div style="font:400 24px/1.1 \'Oswald\';letter-spacing:.14em;color:#6b6f75">BILHETE · 4 PARADAS</div>',{w:560,h:170,font:`400 20px/1.1 ${FO}`});const cardId=R(card,{x:1200,y:60,rot:3});pop(cardId,T0(sid)+7.2,0.5,0.6,'backSoft');
  const st=stamp(sc.cam,'APRENDER',{size:36,color:C.red,pad:'10px 16px',border:5});const stid=R(st,{x:1340,y:100,rot:-10});slam(stid,T0(sid)+7.8,2.6,-10);camBump(sid,T0(sid)+7.8,0.02);}
/* ---------- S14 · O corredor das ideias geniais que ninguém usou ---------- */
function buildS14(){const sid='S14';const sc=mkScene(sid,'#1b2a2a',T0(sid),T1(sid));
  const ph=photo(sc.cam,IMG.p_ward,{w:2100,h:1180,fit:'cover',shadow:false,filter:'saturate(.7) brightness(.85)'});const pid=R(ph,{x:-90,y:-50});kb(pid,T0(sid),T1(sid),{s:1.0},{s:1.1});
  H('div',{style:'position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,transparent 45%,rgba(0,20,20,.6) 100%)'},sc.cam);
  const m=flyingMachine(sc.cam,0.42,120,700,T0(sid),T1(sid)+30);visorSeq(m.visor,[[T0(sid)+0.2,'RECALCULANDO_']],20);
  const plates=[['PLANILHA 4.0',560,300],['APP INTERNO',960,260],['PROCESSO REVISADO v7_final_FINAL',1300,320]];
  plates.forEach(([txt,x,y],i)=>{const t=T0(sid)+2+i*2;const pl=captionBox(sc.cam,txt,{size:26,font:FTW,bg:'#efe6cf',pad:'10px 18px'});const plid=R(pl,{x,y,rot:(i%2?2:-2)});pop(plid,t,0.45,0.6,'backSoft');
    const tr=captionBox(sc.cam,'🏆 FUNCIONA 100%',{size:18,font:FO,bg:'#f2c200',pad:'4px 10px'});const trid=R(tr,{x:x+20,y:y+70,rot:(i%2?-3:3)});pop(trid,t+0.5,0.35,0.5,'back');
    const web=svgBox(sc.cam,140,110);const g=web._svg;for(let k=0;k<6;k++)S('path',{d:`M0 0 L${20+k*22} ${110-k*10}`,stroke:'rgba(255,255,255,.7)','stroke-width':1.5},g);for(let r=1;r<5;r++)S('path',{d:`M0 ${r*22} Q${r*18} ${r*18} ${r*26} 0`,stroke:'rgba(255,255,255,.7)','stroke-width':1.2,fill:'none'},g);const wid=R(web,{x:x-20,y:y-30});fadeIn(wid,t+0.8,0.5)});
  cap(sc.cam,'MAIS TECNOLOGIA',T0(sid)+0.4,null,1560,820,{size:22,font:FO,bg:'#d9d9d9'});}
/* ---------- S15 · Quem aperta o botão? → ADOTAR ---------- */
function buildS15(){const sid='S15';const sc=mkScene(sid,'#7fb6ff',T0(sid),T1(sid));skyGrass(sc.cam);
  const m=flyingMachine(sc.cam,0.75,620,560,T0(sid),T1(sid)+30);
  // quadro-negro: o botão com catorze dedinhos
  const cb=photo(sc.cam,IMG.b_chalkboard,{w:620,h:360,fit:'cover',tape:'both',sa:.45});const cbid=R(cb,{x:80,y:90,rot:-3});pop(cbid,T0(sid)+0.3,0.5,0.6,'backSoft');fadeOut(cbid,T0(sid)+3.2,0.3);
  const ck=svgBox(sc.cam,620,360);const g=ck._svg;S('circle',{cx:310,cy:180,r:70,fill:'none',stroke:'#fff','stroke-width':6},g);for(let i=0;i<14;i++){const a=i/14*Math.PI*2;S('path',{d:`M${310+Math.cos(a)*95} ${180+Math.sin(a)*95} L${310+Math.cos(a)*140} ${180+Math.sin(a)*140}`,stroke:'#fff','stroke-width':6,'stroke-linecap':'round'},g)}const ckid=R(ck,{x:80,y:90,rot:-3});setAt(ckid,0,{o:0});fadeIn(ckid,T0(sid)+0.8,0.6);fadeOut(ckid,T0(sid)+3.2,0.3);
  // o botão cresce no centro; todos apontam para o vizinho
  const bp=pos(sc.cam,860,420);const btn=H('div',{style:'position:absolute;left:0;top:0;transform-origin:50% 50%'},bp,'PARTIU');arcadeButton(btn,200);const bid=R(btn,{});pop(bid,T0(sid)+2.2,0.6,0.3,'backSoft');
  const crowd=[['P02',IMG.col_rua1908_cartola_fernando_flat,META.col_rua1908_cartola_fernando,1.0,80,520],['P04',IMG.col_soldados_esq_gabriel_body,META.col_soldados_esq_gabriel,0.3,330,470],['P06',IMG.col_soldados_dir_elon_flat,META.col_soldados_dir_elon,0.3,1380,420],['P11',IMG.col_linha_operario_gabriel_flat,META.col_linha_operario_gabriel,0.34,1600,460],['P07',IMG.col_rua1908_dama_elon_flat,META.col_rua1908_dama_elon,0.95,1200,480]];
  const chars=crowd.map(([code,body,meta,scl,x,y])=>{const c=collageChar(sc.cam,{body,meta,scale:scl,head:code==='P04'?IMG['faces_felipe-treistman']:undefined,placeholder:code==='P04'?undefined:null});setAt(c.id,0,{x,y});return c});
  chars.forEach((c,i)=>{const t=T0(sid)+2.6+i*0.35;tw(c.id,t,0.3,{rot:(i%2?6:-6)},'backSoft');tw(c.id,t+0.6,0.3,{rot:0},'inOut')});
  const yawn=pictoBubble(sc.cam,'zzz',{w:120,h:100});const yid=R(yawn,{x:1040,y:300});pop(yid,T0(sid)+3.8,0.35,0.3,'back');fadeOut(yid,T0(sid)+4.6,0.3);
  // catorze mãos de papel entram de todos os lados e apertam juntas
  const cols=['#f1c9a5','#e8b996','#c98a62','#9c6240','#6b3f25','#f3ecd8','#d9b48f'];
  for(let i=0;i<14;i++){const a=i/14*Math.PI*2;const hx=960+Math.cos(a)*1100,hy=520+Math.sin(a)*700;const h=paperHand(sc.cam,cols[i%cols.length],0);const hid=R(h,{x:hx,y:hy,rot:(a*180/Math.PI)+90});setAt(hid,0,{o:0});setAt(hid,T0(sid)+4.5+i*0.05,{o:1});tw(hid,T0(sid)+4.5+i*0.05,0.9,{x:960+Math.cos(a)*150-60,y:520+Math.sin(a)*120-80},'inOut')}
  tw(bid,T0(sid)+5.6,0.12,{sx:0.85,sy:0.7},'in');tw(bid,T0(sid)+5.75,0.4,{sx:1,sy:1},'elastic');camBump(sid,T0(sid)+5.6,0.04);flashAt(T0(sid)+5.65,0.6,0.3,'#fff6d0');debris(sc.cam,{t0:T0(sid)+5.6,cx:960,cy:520,n:40,dur:1.4,colors:[C.cream,'#101214','#ffb347']});
  const card=stampCard(sc.cam,'<div style="font:400 24px/1.1 \'Oswald\';letter-spacing:.14em;color:#6b6f75">BILHETE · 4 PARADAS</div>',{w:560,h:170,font:`400 20px/1.1 ${FO}`});const cardId=R(card,{x:1200,y:60,rot:3});pop(cardId,T0(sid)+6.2,0.5,0.6,'backSoft');
  const st=stamp(sc.cam,'ADOTAR',{size:36,color:C.red,pad:'10px 16px',border:5});const stid=R(st,{x:1360,y:100,rot:-10});slam(stid,T0(sid)+6.8,2.6,-10);camBump(sid,T0(sid)+6.8,0.02);}
/* ---------- S16 · Revelação — GESTÃO DA MUDANÇA ---------- */
function buildS16(){const sid='S16';const sc=mkScene(sid,C.green,T0(sid),T1(sid));
  const paper=H('div',{style:'position:absolute;inset:0'},sc.cam);bgPaperPrint(paper,'#efe7d4');const papId=R(paper,{},{noTransform:true});
  // verso do cartão: 'É por isso que existe'
  const card=stampCard(sc.cam,'<div style="font:italic 400 54px/1.1 \'Playfair Display\';color:#1b1e21;text-transform:none">É por isso que existe</div>',{w:900,h:300,style:'text-transform:none'});const cardId=R(card,{x:510,y:380,rot:-2});setAt(cardId,0,{o:0});setAt(cardId,T0(sid),{o:1,sx:-1});tw(cardId,T0(sid)+0.2,0.7,{sx:1},'inOut');fadeOut(cardId,T0(sid)+2.3,0.3);
  // grade verde + GESTÃO DA MUDANÇA palavra por palavra, lenta
  const grid=H('div',{style:'position:absolute;inset:0'},sc.cam);bgGridColor(grid,C.green,'rgba(255,255,255,.28)');const gid=R(grid,{o:0},{noTransform:true});setAt(gid,T0(sid)+2.5,{o:1});
  const words=[['GESTÃO',260,300,T0(sid)+2.5],['DA',1130,300,T0(sid)+3.0],['MUDANÇA',250,540,T0(sid)+3.5]];words.forEach(([w,x,y,t])=>{const y3=year3d(sc.cam,{text:w,size:220,depth:14});const id=R(y3,{x,y});slam(id,t,1.6,-2)});
  const row=['ENTENDER','CONFIAR','APRENDER','ADOTAR'].map((w,i)=>{const st=stamp(sc.cam,w,{size:26,color:C.cream,pad:'8px 12px',border:4,blend:'normal'});const id=R(st,{x:440+i*280,y:820,rot:(i%2?3:-3)});pop(id,T0(sid)+4.2+i*0.25,0.35,0.6,'backSoft');return id});
  cap(sc.cam,'Tecnologia constrói a possibilidade. Pessoas fazem a mudança.',T0(sid)+4.5,null,470,940,{size:30,font:FS,style:'font-style:italic'});}
/* ---------- S17 · Cartela final — próxima parada: esta sala ---------- */
function buildS17(){const sid='S17';const sc=mkScene(sid,C.red,T0(sid),T1(sid));bgRed(sc.cam);flashAt(T0(sid),0.9,0.35,'#fff6d0');
  const frame=H('div',{style:'position:absolute;left:0;top:0;width:980px;height:640px;background:#f3ecd8;border:26px solid #c9a24a;box-shadow:inset 0 0 0 6px #8a6a22,0 30px 60px rgba(0,0,0,.5);box-sizing:border-box;overflow:hidden'},sc.cam);const fid=R(frame,{x:470,y:150});pop(fid,T0(sid)+0.3,0.6,0.85,'backSoft');
  const inner=H('div',{style:'position:absolute;inset:0;overflow:hidden'},frame);skyGrass(inner);const m=flyingMachine(inner,0.6,200,330,T0(sid),T1(sid)+5);
  [[IMG.col_rua1908_cartola_fernando_flat,META.col_rua1908_cartola_fernando,0.7,40,180],[IMG.col_soldados_esq_gabriel_body,META.col_soldados_esq_gabriel,0.2,200,170],[IMG.col_metro_jovem_gabriel_flat,META.col_metro_jovem_gabriel,0.26,420,120],[IMG.col_metro_cientista_elon_flat,META.col_metro_cientista_elon,0.26,560,110],[IMG.col_soldados_dir_elon_flat,META.col_soldados_dir_elon,0.2,720,150],[IMG.col_rua1908_dama_elon_flat,META.col_rua1908_dama_elon,0.62,820,170]].forEach(([b,mt,scl,x,y])=>{const c=collageChar(inner,{body:b,meta:mt,scale:scl});setAt(c.id,0,{x,y})});
  const plaque=captionBox(sc.cam,'TURMA — PRIMEIRA VIAGEM · PRÓXIMA PARADA: ESTA SALA',{size:22,font:FO,bg:'#c9a24a',color:'#1b1e21',pad:'8px 18px'});const plid=R(plaque,{x:620,y:800});pop(plid,T0(sid)+1.0,0.4,0.6,'backSoft');
  cap(sc.cam,'Gestão da Mudança · Treinamento',T0(sid)+1.6,null,760,880,{size:30,font:FS,style:'font-style:italic'});
  const legal=label(sc.cam,'Paródia e hipótese narrativa. Nenhuma fala atribuída a pessoas reais. Imagens de referência do solicitante e acervo licenciado. Referência do treinamento: ADKAR — Jeff Hiatt.',{size:14,weight:400,font:FB,color:'rgba(255,255,255,.75)',upper:false,ls:'.02em'});legal.style.left='200px';legal.style.top='1000px';}
