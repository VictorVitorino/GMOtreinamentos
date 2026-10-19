/* ==== QUEM APERTA O BOTÃO? · cenas S01–S09 (colagem real) ==== */
"use strict";
const T0=id=>SC[id].start,T1=id=>SC[id].end;const L0=id=>LINES[id]?LINES[id].start:0;const L1=id=>LINES[id]?LINES[id].start+LINES[id].dur:0;
function img(parent,src,w,h,o){return photo(parent,src,Object.assign({w,h,fit:"contain",sa:.4,sy:12,sb:20},o||{}))}
function pos(parent,x,y){return H('div',{style:`position:absolute;left:${x}px;top:${y}px`},parent)}
function cap(parent,txt,t0,t1,x,y,o){o=o||{};const el=captionBox(parent,txt,o);const id=R(el,{x,y,rot:o.rot||0});if(o.pop)pop(id,t0,0.45,0.6,'backSoft');else fadeIn(id,t0,0.35);if(t1)fadeOut(id,t1-0.3,0.3);return id}
function tag(parent,txt,t0,t1,x,y,rot){return cap(parent,txt,t0,t1,x,y,{size:22,font:FO,pad:'6px 14px',rot:rot||0,pop:true})}
function dropIn(id,t,h,rot){setAt(id,0,{o:0});setAt(id,t,{o:1,y:-(h||700),rot:rot||-6});tw(id,t,0.6,{y:0,rot:0},'bounce')}
/* botão redondo de fliperama (laranja), com aro cromado e a palavra/seta no topo */
function arcadeButton(el,d){const txt=el.textContent;el.textContent='';el.style.cssText+=`;width:${d}px;height:${d}px;border-radius:50%;background:radial-gradient(circle at 50% 38%,#ffb347,#f28a1a 60%,#c45f08);box-shadow:inset 0 -${d*0.12}px 0 #9a4a05,0 ${d*0.1}px ${d*0.16}px rgba(0,0,0,.45);border:${Math.max(4,d*0.05)}px solid #e8e8e8;box-sizing:border-box;display:flex;align-items:center;justify-content:center;font:400 ${d*0.22}px/1 ${FA};color:#fff;letter-spacing:.06em;text-shadow:0 2px 0 rgba(0,0,0,.35)`;
  H('div',{style:`position:absolute;inset:-${d*0.16}px;border-radius:50%;border:${d*0.09}px solid #2b2b2b;box-shadow:0 0 0 ${d*0.03}px #d9d9d9;z-index:-1`},el);const t=H('div',{},el,txt||'→');return el}
function visorSeq(el,steps,cps){proc(t=>{let cur='';for(const [t0,txt] of steps){if(t>=t0)cur=txt.slice(0,Math.floor((t-t0)*(cps||22)))}el.textContent=cur})}
/* ---- a Máquina do tempo: banco de couro real + relógio + telefone de disco + máquina de escrever + tecla verde, sobre chassi de papelão ---- */
function makeMachine(parent,sc,o){o=o||{};const W=900,Hh=560;const wrap=H('div',{style:`position:absolute;left:0;top:0;width:${W*sc}px;height:${Hh*sc}px;transform-origin:50% 100%`},parent);
  const inner=H('div',{style:`position:absolute;left:0;top:0;width:${W}px;height:${Hh}px;transform:scale(${sc});transform-origin:0 0`},wrap);
  const part=(x,y,w,h,html,style)=>{const p=pos(inner,x,y);const el=H('div',{style:`position:absolute;left:0;top:0;width:${w}px;height:${h}px;${style||''}`},p,html||'');return el};
  const chassi=part(60,330,780,150,'',`border-radius:30px 60px 20px 20px;background:#b58a55;box-shadow:inset 0 -14px 0 #8f6a3c,0 18px 30px rgba(0,0,0,.35);border:4px solid #fff;box-sizing:border-box`);
  const wheels=[[180,470],[700,470]].map(([x,y])=>part(x-60,y-60,120,120,'',`border-radius:50%;background:radial-gradient(circle,#c9a24a 0 14px,#2b2b2b 15px 22px,#e9d9b4 23px 48px,#1b1e21 49px);border:4px solid #fff;box-sizing:border-box;box-shadow:0 8px 14px rgba(0,0,0,.35)`));
  const banco=part(330,150,520,220,'');banco.appendChild(imgEl(IMG.veh_banco,'position:absolute;left:0;top:0;width:520px;height:220px;object-fit:contain;object-position:50% 100%;filter:drop-shadow(0 10px 14px rgba(0,0,0,.4))'));
  const clock=part(30,70,230,230,'');clock.appendChild(imgEl(IMG.veh_clock,'position:absolute;inset:0;width:230px;height:230px;object-fit:contain;filter:drop-shadow(0 8px 12px rgba(0,0,0,.4))'));
  const hand=H('div',{style:'position:absolute;left:113px;top:112px;width:92px;height:6px;background:#c8322b;transform-origin:2px 50%;border-radius:3px;box-shadow:0 1px 2px rgba(0,0,0,.5)'},clock);
  const phone=part(120,236,220,140,'');phone.appendChild(imgEl(IMG.veh_phone,'position:absolute;inset:0;width:220px;height:140px;object-fit:contain;object-position:50% 100%;filter:drop-shadow(0 8px 12px rgba(0,0,0,.4))'));
  const tw_=part(600,236,260,140,'');tw_.appendChild(imgEl(IMG.veh_typewriter,'position:absolute;inset:0;width:260px;height:140px;object-fit:contain;object-position:50% 100%;filter:drop-shadow(0 8px 12px rgba(0,0,0,.4))'));
  const visor=part(590,160,270,66,'',`padding:10px 12px;box-sizing:border-box;background:#f6f1e4;border:3px solid #1b1e21;font:400 21px/1.15 ${FTW};color:#1b1e21;box-shadow:0 4px 10px rgba(0,0,0,.3);white-space:nowrap;overflow:hidden`);
  const key=part(448,296,100,100,'PARTIU','');arcadeButton(key,100);
  const cup=part(350,286,64,64,'',`border-radius:10px 10px 22px 22px;background:#fff;border:4px solid #1b1e21;box-sizing:border-box;box-shadow:0 6px 10px rgba(0,0,0,.3)`);H('div',{style:'position:absolute;right:-22px;top:14px;width:22px;height:28px;border:5px solid #1b1e21;border-left:0;border-radius:0 12px 12px 0'},cup);H('div',{style:'position:absolute;left:10px;top:10px;width:42px;height:14px;background:#5a3a21;border-radius:50%'},cup);
  const ids={chassi:R(chassi,{}),w0:R(wheels[0],{}),w1:R(wheels[1],{}),banco:R(banco,{}),clock:R(clock,{}),phone:R(phone,{}),tw:R(tw_,{}),visor:R(visor,{}),key:R(key,{}),cup:R(cup,{})};
  const id=R(wrap,{x:o.x||0,y:o.y||0});
  proc(t=>{hand.style.transform=`rotate(${(t*40)%360}deg)`});
  return {wrap,inner,id,ids,keyEl:key,visor,hand,W:W*sc,H:Hh*sc,sc}}
function pressKey(m,t){tw(m.ids.key,t,0.1,{sy:0.72},'in');tw(m.ids.key,t+0.1,0.35,{sy:1},'elastic')}
function machineBob(m,t0,t1,amp){proc(t=>{if(t<t0||t>t1)return;const r=REG[m.id].cur;r.y+=Math.sin(t*1.7)*(amp||10);r.rot+=Math.sin(t*1.1)*0.8})}
/* ---------- S01 · Estação do Tempo ---------- */
function buildS01(){const sid='S01';const sc=mkScene(sid,'#0b0c0e',T0(sid),T1(sid));bgDarkVignette(sc.cam);
  const s=1080/1302;const fr=collageFrame(sc.cam,{base:IMG.col_metro_frame_base,scale:s,x:(1920-1232*s)/2,y:0,metas:[{meta:META.col_metro_jovem_gabriel,head:IMG.faces_gabriel},{meta:META.col_metro_cientista_elon,head:IMG.faces_elon}]});
  proc(t=>{if(t<T0(sid)||t>T1(sid))return;REG[fr.heads[0]].cur.rot+=Math.sin(t*1.3)*2.5;REG[fr.heads[1]].cur.rot+=Math.sin(t*1.1+1)*2});
  tw(fr.heads[1],T0(sid)+2.0,0.4,{rot:-14},'backSoft');tw(fr.heads[1],T0(sid)+3.6,0.5,{rot:-3},'inOut');tw(fr.heads[0],T0(sid)+2.6,0.4,{rot:10},'backSoft');tw(fr.heads[0],T0(sid)+4.0,0.5,{rot:3},'inOut');
  camTo(sid,T0(sid),T1(sid)-T0(sid),1.10,960,480,'lin');
  const bd=cap(sc.cam,'PRÓXIMO TREM → 1908 · ATRASADO: 118 ANOS',T0(sid)+0.3,null,70,70,{bg:'#111',color:'#ffcc33',font:FO,size:26,pad:'10px 18px'});proc(t=>{if(t<T0(sid)+2.5)return;const r=REG[bd].cur;r.o*=(Math.floor(t*1.6)%2)?1:0.35});
  tag(sc.cam,'O CIENTISTA',T0(sid)+1.0,T0(sid)+4.8,1160,700,3);tag(sc.cam,'O JOVEM',T0(sid)+1.2,T0(sid)+4.8,560,720,-4);
  const b1=pictoBubble(sc.cam,'?',{w:150,h:120});const b1id=R(b1,{x:300,y:60});pop(b1id,T0(sid)+2.6,0.45,0.3,'back');fadeOut(b1id,T0(sid)+4.8,0.3);
  const b2=pictoBubble(sc.cam,'rocket',{w:150,h:120});const b2id=R(b2,{x:1420,y:30});pop(b2id,T0(sid)+2.1,0.45,0.3,'back');fadeOut(b2id,T0(sid)+4.8,0.3);
  // máquina de lanche: moeda falha, Pix funciona, cai a tecla verde
  const vm=stampCard(sc.cam,'PEÇAS<br>BOTÕES<br>LANCHES',{w:300,h:260,font:`400 30px/1.15 ${FA}`});const vmId=R(vm,{x:1560,y:560,rot:3});pop(vmId,T0(sid)+5.0,0.5,0.6,'backSoft');
  const c1=pictoBubble(sc.cam,'coin',{w:120,h:100});const c1id=R(c1,{x:1400,y:440});pop(c1id,T0(sid)+5.6,0.4,0.3,'back');tw(c1id,T0(sid)+6.5,0.25,{rot:-25,o:0.0},'in');
  const c2=pictoBubble(sc.cam,'phone',{w:120,h:100});const c2id=R(c2,{x:1400,y:440});pop(c2id,T0(sid)+6.9,0.4,0.3,'back');fadeOut(c2id,T0(sid)+8.4,0.3);
  const kp=pos(sc.cam,1640,850);const key=H('div',{style:'position:absolute;left:0;top:0;width:150px;height:150px;transform-origin:50% 50%'},kp,'PARTIU');arcadeButton(key,150);const kid=R(key,{});dropIn(kid,T0(sid)+7.4,300,-30);
  cap(sc.cam,'Plataforma três. Um trem atrasado cento e dezoito anos.',(L0('s01a')||T0(sid)+0.8)+1.6,T1(sid),480,960,{size:34});}
/* ---------- S02 · Título ---------- */
function buildS02(){const sid='S02';const sc=mkScene(sid,C.green,T0(sid),T1(sid));bgGridColor(sc.cam,C.green,'rgba(255,255,255,.28)');flashAt(T0(sid),0.6,0.3);
  const y3=year3d(sc.cam,{text:'QUEM APERTA O BOTÃO?',size:140,depth:12});y3.style.whiteSpace='normal';y3.style.width='1500px';y3.style.textAlign='center';y3.style.lineHeight='0.95';const yid=R(y3,{x:210,y:300});slam(yid,T0(sid)+0.3,1.8,-2);
  debris(sc.cam,{t0:T0(sid)+0.3,cx:960,cy:540,n:34,dur:1.6,colors:[C.cream,'#101214',C.yellow3d]});
  cap(sc.cam,'uma viagem no tempo em dois minutos',T0(sid)+1.0,null,660,760,{size:30,font:FS,style:'font-style:italic'});}
/* ---------- S03 · A Máquina: montagem e discar 1908 ---------- */
function buildS03(){const sid='S03';const sc=mkScene(sid,'#5a3a22',T0(sid),T1(sid));bgWood(sc.cam);
  // planta em papel vegetal
  const pl=H('div',{style:`position:absolute;left:0;top:0;width:1500px;height:820px;background:rgba(240,236,220,.85);border:2px solid rgba(60,40,20,.4);box-shadow:0 20px 40px rgba(0,0,0,.4);background-image:linear-gradient(rgba(60,80,120,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(60,80,120,.12) 1px,transparent 1px);background-size:40px 40px;transform-origin:50% 50%`},sc.cam);const plId=R(pl,{x:210,y:130});setAt(plId,0,{o:0});setAt(plId,T0(sid),{o:1,sx:0.02});tw(plId,T0(sid),1.2,{sx:1},'out');
  const m=makeMachine(sc.cam,1.05,{x:490,y:240});
  const t=T0(sid)+1.6;
  [[m.ids.chassi,0],[m.ids.w0,0],[m.ids.w1,0]].forEach(([id,d])=>dropIn(id,t,900,0));
  dropIn(m.ids.banco,t+1.2,800,-8);dropIn(m.ids.clock,t+2.7,800,6);dropIn(m.ids.phone,t+2.75,800,-5);dropIn(m.ids.cup,t+2.8,700,0);dropIn(m.ids.tw,t+4.2,800,4);dropIn(m.ids.visor,t+4.3,800,0);dropIn(m.ids.key,t+4.4,900,-20);
  tag(sc.cam,'FLUXO',t+3.1,t+6.5,560,220,-6);tag(sc.cam,'DISQUE O ANO',t+3.3,t+7,540,520,4);tag(sc.cam,'PARTIU',t+4.8,t+8,1000,730,-4);
  debris(sc.cam,{t0:t,cx:960,cy:760,n:24,dur:1.2,colors:['#8f6a3c',C.cream,'#101214']});debris(sc.cam,{t0:t+4.4,cx:980,cy:620,n:16,dur:1.0,colors:['#ffb347',C.cream]});
  visorSeq(m.visor,[[L0('s03a')||t+5,'OLÁ. SOU A MÁQUINA.'],[(L0('s03a')||t+5)+1.6,'DISQUE O ANO_'],[L0('s03b')||t+7,'1'],[(L0('s03b')||t+7)+0.7,'19'],[(L0('s03b')||t+7)+1.4,'190'],[(L0('s03b')||t+7)+2.1,'1908'],[L0('s03c')||t+10,'AGUARDANDO O BOTÃO_']],24);
  // loop "quem aperta?": as duas cabeças espiam de baixo e apontam uma pra outra
  const j=collageChar(sc.cam,{body:IMG.col_metro_jovem_gabriel_body,head:IMG.faces_gabriel,meta:META.col_metro_jovem_gabriel,scale:0.5});cameoPeek(j,(LINES.s03b?segT('s03b',1):t+8.5),T1(sid)+0.2,{edge:'bottom',x:120,y:1080,amt:520});
  const e=collageChar(sc.cam,{body:IMG.col_metro_cientista_elon_body,head:IMG.faces_elon,meta:META.col_metro_cientista_elon,scale:0.5,flip:true});cameoPeek(e,(LINES.s03b?segT('s03b',1):t+8.5)+0.3,T1(sid)+0.2,{edge:'bottom',x:1500,y:1080,amt:540});
  const q=(LINES.s03b?segT('s03b',1):t+8.5);lookAt(j,q+0.8,0.4,14);lookAt(e,q+1.6,0.4,-14);lookAt(j,q+2.4,0.4,-8);lookAt(e,q+3.0,0.4,8);
  pressKey(m,T1(sid)-0.6);camBump(sid,T1(sid)-0.55,0.02);flashAt(T1(sid)-0.1,0.5,0.25,'#dff5e3');}
/* ---------- S04 · Chegada: 1908 ---------- */
function buildS04(){const sid='S04';const sc=mkScene(sid,C.green,T0(sid),T1(sid));bgGridColor(sc.cam,C.green,'rgba(255,255,255,.28)');
  const y3=year3d(sc.cam,{text:'1908',size:420,depth:16});const yid=R(y3,{x:420,y:280});slam(yid,T0(sid)+0.2,1.8,-3);fadeOut(yid,T0(sid)+2.4,0.3);
  // rua de Viena c.1900 entra por rasgo de papel
  const ph=photo(sc.cam,IMG.cards_cavalos_viena,{w:2000,h:1240,fit:'cover',shadow:false});const pid=R(ph,{x:-40,y:-80});setAt(pid,0,{o:0});setAt(pid,T0(sid)+2.5,{o:1});kb(pid,T0(sid)+2.5,T1(sid)+9,{s:1.0},{s:1.08});
  const m=makeMachine(sc.cam,0.55,{x:120,y:560});dropIn(m.id,T0(sid)+2.9,900,-6);debris(sc.cam,{t0:T0(sid)+3.5,cx:380,cy:860,n:20,dur:1.0,colors:['#5a3a22','#8a5a34',C.cream]});
  machineBob(m,T0(sid)+3.6,T1(sid),2);
  const pm=postmark(sc.cam,'1908',{d:220,sub:'CHEGADA'});const pmid=R(pm,{x:1560,y:80,rot:-10});pop(pmid,T0(sid)+3.2,0.4,1.6,'in');
  cap(sc.cam,'antes do carro popular',T0(sid)+3.4,null,120,960,{size:34,font:FS,style:'font-style:italic'});}
/* ---------- S05 · A dor da carroça → chega o Ford T ---------- */
function buildS05(){const sid='S05';const sc=mkScene(sid,C.paper2,T0(sid),T1(sid));
  const ph=photo(sc.cam,IMG.cards_cavalos_viena,{w:2000,h:1240,fit:'cover',shadow:false});const pid=R(ph,{x:-40,y:-80});kb(pid,T0(sid),T1(sid),{s:1.08},{s:1.14});
  // relógio dispara no canto
  const ck=pos(sc.cam,1620,60);const cke=H('div',{style:'position:absolute;left:0;top:0;width:220px;height:220px'},ck);cke.appendChild(imgEl(IMG.veh_clock,'position:absolute;inset:0;width:220px;height:220px;object-fit:contain;filter:drop-shadow(0 8px 12px rgba(0,0,0,.5))'));const hand=H('div',{style:'position:absolute;left:108px;top:106px;width:84px;height:6px;background:#c8322b;transform-origin:2px 50%;border-radius:3px'},cke);const ckid=R(cke,{});pop(ckid,T0(sid)+0.3,0.4,0.6,'backSoft');fadeOut(ckid,T0(sid)+6.3,0.3);proc(t=>{if(t>=T0(sid))hand.style.transform=`rotate(${((t-T0(sid))*160)%360}deg)`});
  // P02 Cocheiro puxa as rédeas
  const p2=collageChar(sc.cam,{body:IMG.col_rua1908_cartola_fernando_flat,meta:META.col_rua1908_cartola_fernando,scale:1.25});cameoSlide(p2,T0(sid),T0(sid)+6.5,{x:-400,y:420,rot:-6},{x:80,y:420,rot:0},{inDur:0.9});
  const hb=pictoBubble(sc.cam,'horse',{w:150,h:120});const hbid=R(hb,{x:420,y:330});pop(hbid,T0(sid)+1.4,0.4,0.3,'back');fadeOut(hbid,T0(sid)+3.6,0.3);
  tag(sc.cam,'1908 · a carroça atola',T0(sid)+0.6,T0(sid)+6.2,700,960,-2);
  // jornal fac-símile recriado
  const np=newspaper(sc.cam,{w:1400,h:900,masthead:'O CORREIO DA MANHÃ',place:'DETROIT',date:'ANÚNCIO DE ÉPOCA',price:'PREÇO APROXIMADO',headline:'O AUTOMÓVEL QUE CABE NO BOLSO',sub:'o primeiro que muita gente podia ter',photo:IMG.cards_rua_fordt_1908,photoH:260,photoPos:'50% 75%',cols:3,headSize:62});const npid=R(np,{x:260,y:90,rot:-2});pop(npid,T0(sid)+2.5,0.6,0.5,'backSoft');fadeOut(npid,T1(sid)-0.3,0.3);
  const st=stamp(sc.cam,'ACESSO',{size:96,color:C.red});const stid=R(st,{x:1100,y:620,rot:-12});slam(stid,T0(sid)+6.0,2.4,-12);
  // o Ford T (sua referência) entra rodando pela direita
  const car=img(sc.cam,IMG.veh_fordt_ref,760,600);const cid=R(car,{x:2000,y:480});setAt(cid,0,{o:0});setAt(cid,T0(sid)+4.0,{o:1});tw(cid,T0(sid)+4.0,2.6,{x:1120},'out');proc(t=>{const a=T0(sid)+4.0;if(t<a||t>a+2.6)return;REG[cid].cur.y+=Math.sin(t*22)*3;REG[cid].cur.rot+=Math.sin(t*11)*0.5});
  // P05 Fotógrafo: espia de baixo e dispara POOF
  const p5=collageChar(sc.cam,{body:IMG.col_rua1908_barba_gabriel_flat,meta:META.col_rua1908_barba_gabriel,scale:1.1});cameoPeek(p5,T0(sid)+6.6,T1(sid),{edge:'bottom',x:1500,y:1080,amt:400});flashAt(T0(sid)+8.2,0.8,0.35,'#fff6d0');}
/* ---------- S06 · Primeira pane humana + carimbo ENTENDER ---------- */
function buildS06(){const sid='S06';const sc=mkScene(sid,C.paper2,T0(sid),T1(sid));bgPaperPrint(sc.cam,'#efe7d4');
  H('div',{style:'position:absolute;left:-200px;top:820px;width:2400px;height:300px;background:#8d8577;box-shadow:inset 0 10px 0 #6f685c'},sc.cam);
  const car=img(sc.cam,IMG.veh_fordt_iso,820,450);const cid=R(car,{x:120,y:400});
  const m=makeMachine(sc.cam,0.6,{x:1200,y:530});machineBob(m,T0(sid),T1(sid),1.5);
  // P04 Rapaz do Feno dá feno ao radiador; o carro buzina; ele pula e ri
  const p4=collageChar(sc.cam,{body:IMG.col_soldados_esq_gabriel_body,head:IMG['faces_felipe-treistman'],meta:META.col_soldados_esq_gabriel,scale:0.36});cameoSlide(p4,T0(sid),T0(sid)+9.6,{x:-300,y:300,rot:-5},{x:560,y:300,rot:0},{inDur:1.0,exit:{x:560,y:300}});headWobble(p4,3,1.5,4);
  const hb=pictoBubble(sc.cam,'horse',{w:150,h:120});const hbid=R(hb,{x:760,y:220});pop(hbid,T0(sid)+1.4,0.4,0.3,'back');fadeOut(hbid,T0(sid)+2.6,0.2);
  const ex=pictoBubble(sc.cam,'!',{w:120,h:110});const exid=R(ex,{x:760,y:220});pop(exid,T0(sid)+2.9,0.3,0.3,'back');fadeOut(exid,T0(sid)+4.2,0.3);
  camBump(sid,T0(sid)+2.8,0.025);surprise(p4,T0(sid)+2.8,0.6);proc(t=>{const a=T0(sid)+2.8;if(t<a||t>a+0.5)return;REG[p4.id].cur.y-=Math.sin((t-a)/0.5*Math.PI)*60});nodYes(p4,T0(sid)+3.6,T0(sid)+4.6,9);
  visorSeq(m.visor,[[L0('s06b')||T0(sid)+3,'ERRO: NINGUÉM EXPLICOU_']],26);
  // quadro-negro de papel: cavalo + relógio = muitas horas; carro + relógio = poucas
  const cb=photo(sc.cam,IMG.b_chalkboard,{w:760,h:430,fit:'cover',tape:'both',sa:.45});const cbid=R(cb,{x:580,y:120,rot:-2});pop(cbid,L0('s06c')||T0(sid)+5,0.5,0.6,'backSoft');fadeOut(cbid,T0(sid)+9.2,0.3);
  const row=[['horse',640,200],['gear',800,200],['zzz',960,200],['car',640,360],['gear',800,360],['heart',960,360]];row.forEach(([k,x,y],i)=>{const b=pictoBubble(sc.cam,k,{w:120,h:100,bg:'#f6f1e4'});const bid=R(b,{x,y});pop(bid,(L0('s06c')||T0(sid)+5)+0.4+i*0.35,0.35,0.3,'back');fadeOut(bid,T0(sid)+9.2,0.3)});
  const lb=pictoBubble(sc.cam,'bulb',{w:130,h:110});const lbid=R(lb,{x:1180,y:140});pop(lbid,T0(sid)+8.4,0.4,0.3,'back');fadeOut(lbid,T0(sid)+9.6,0.3);
  flashAt(T0(sid)+9.6,0.9,0.35,'#fff6d0');
  // carimbo ENTENDER no cartão perfurado (casa 1 de 4)
  const card=stampCard(sc.cam,'<div style="font:400 26px/1.1 \'Oswald\';letter-spacing:.14em;color:#6b6f75">BILHETE · 4 PARADAS</div><div style="display:flex;gap:18px;margin-top:14px">'+['1','2','3','4'].map(w=>`<div style="width:120px;height:120px;border:3px dashed #9a9ea3;border-radius:50%;display:flex;align-items:center;justify-content:center;font:400 40px/1 \'Anton\';color:#c9c9c9">${w}</div>`).join('')+'</div>',{w:720,h:300,font:`400 20px/1.1 ${FO}`});const cardId=R(card,{x:600,y:380,rot:-3});pop(cardId,T0(sid)+9.9,0.5,0.6,'backSoft');
  const st=stamp(sc.cam,'✎ GIZ',{size:30,color:C.red,pad:'12px 14px',border:5});const stid=R(st,{x:650,y:490,rot:-14});slam(stid,T0(sid)+10.6,2.6,-14);camBump(sid,T0(sid)+10.6,0.02);}
