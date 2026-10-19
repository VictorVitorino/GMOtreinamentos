/* ==== collage.js · personagens de colagem real: corpo recortado (PNG com borda de papel) + cabeça real pinada no pescoço ====
   collageChar(parent,{body:IMG.x_body|IMG.x_flat, head:IMG.faces_y (opcional), meta:META.x, scale, flip})
   → {id (wrap: x,y,rot,sx,sy,o), head (id da cabeça: rot/sx/sy em torno do queixo), w, h, neck:[x,y]}         */
"use strict";
function collageChar(parent,o){const sc=o.scale||1;const m=o.meta;const W=m.size[0]*sc,Hh=m.size[1]*sc;
  const wrap=H('div',{style:`position:absolute;left:0;top:0;width:${W}px;height:${Hh}px;transform-origin:${o.origin||'50% 100%'}`},parent);
  const inner=H('div',{style:`position:absolute;inset:0;transform:${o.flip?'scaleX(-1)':'none'}`},wrap);
  inner.appendChild(imgEl(o.body,`position:absolute;left:0;top:0;width:${W}px;height:${Hh}px`));
  const ch={wrap,w:W,h:Hh,neck:[m.neck[0]*sc,m.neck[1]*sc],head:null};
  if(o.head&&m.head_box){const k=m.head_scale*sc*(o.headScale||1);const [hx0,hy0,hx1,hy1]=m.head_box;const chin={x:(hx0+hx1)/2*k,y:hy1*k};
    const hb=H('div',{style:`position:absolute;left:${ch.neck[0]-chin.x}px;top:${ch.neck[1]-chin.y}px;width:${m.head_size[0]*k}px;height:${m.head_size[1]*k}px`},inner);
    const im=imgEl(o.head,`position:absolute;left:0;top:0;width:${m.head_size[0]*k}px;height:${m.head_size[1]*k}px;transform-origin:${chin.x}px ${chin.y}px`);hb.appendChild(im);
    ch.head=R(im,{rot:m.rot||0});
    if(o.rivet!==false)H('div',{style:`position:absolute;left:${ch.neck[0]-7}px;top:${ch.neck[1]-9}px;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#f1d98a,#c9a24a 55%,#8a6a22);box-shadow:0 1px 2px rgba(0,0,0,.5)`},inner)}
  ch.id=R(wrap,{x:o.x||0,y:o.y||0,rot:o.rot||0});return ch}
/* ---- movimentos de papel ---- */
function headWobble(ch,amp,speed,seed){if(!ch.head)return;proc(t=>{REG[ch.head].cur.rot+=Math.sin(t*(speed||1.3)+(seed||0))*(amp||3)+noise1(t*0.4,(seed||0)+9)*1.5})}
function paperBob(ch,amp,speed,seed){proc(t=>{const r=REG[ch.id].cur;r.y+=Math.sin(t*(speed||1.1)+(seed||0))*(amp||6);r.rot+=noise1(t*0.25,(seed||0)+3)*1.2})}
function cameoSlide(ch,t0,t1,from,to,o){o=o||{};const hold=o.hold===undefined?0.6:o.hold;setAt(ch.id,0,{o:0});setAt(ch.id,t0,{o:1,x:from.x,y:from.y,rot:from.rot||0});
  tw(ch.id,t0,o.inDur||0.7,{x:to.x,y:to.y,rot:to.rot||0},o.ease||'backSoft');const back=o.exit||from;tw(ch.id,t1-(o.outDur||0.5),o.outDur||0.5,{x:back.x,y:back.y,rot:back.rot||0},'in');setAt(ch.id,t1,{o:0})}
function cameoPeek(ch,t0,t1,o){/* espia pela borda: sobe/entra girando, segura, some */o=o||{};const edge=o.edge||'bottom';const x=o.x||960,y=o.y||1080;const amt=o.amt||ch.h*0.55;
  const hidden={bottom:{x,y:y+20,rot:o.rot||-6},left:{x:x-ch.w-20,y,rot:o.rot||8},right:{x:x+20,y,rot:o.rot||-8},top:{x,y:y-ch.h-20,rot:o.rot||4}}[edge];
  const shown={bottom:{x,y:y-amt,rot:0},left:{x:x-ch.w+amt,y,rot:0},right:{x:x-amt,y,rot:0},top:{x,y:y-ch.h+amt,rot:0}}[edge];
  cameoSlide(ch,t0,t1,hidden,shown,{inDur:o.inDur||0.6,outDur:o.outDur||0.4,ease:'backSoft'})}
function cameoPop(ch,t0,t1,x,y,o){o=o||{};setAt(ch.id,0,{o:0,x,y});pop(ch.id,t0,o.dur||0.5,0.2,'back');if(t1)fadeOut(ch.id,t1-0.25,0.25)}
function cameoDrop(ch,t0,t1,x,y,o){/* cai de cima e quica */o=o||{};setAt(ch.id,0,{o:0});setAt(ch.id,t0,{o:1,x,y:y-700,rot:(o.rot||-8)});tw(ch.id,t0,0.55,{y:y,rot:0},'bounce');if(t1){tw(ch.id,t1-0.4,0.4,{y:y+700},'in');setAt(ch.id,t1,{o:0})}}
function nodYes(ch,t0,t1,speed){if(!ch.head)return;proc(t=>{if(t<t0||t>t1)return;REG[ch.head].cur.rot+=Math.sin((t-t0)*(speed||10))*4;REG[ch.head].cur.sy+=Math.max(0,Math.sin((t-t0)*(speed||10)))*0.02})}
function shakeNo(ch,t0,t1,speed){if(!ch.head)return;proc(t=>{if(t<t0||t>t1)return;REG[ch.head].cur.rot+=Math.sin((t-t0)*(speed||12))*7})}
function lookAt(ch,t0,dur,deg){if(!ch.head)return;tw(ch.head,t0,dur||0.3,{rot:deg},'backSoft')}
function surprise(ch,t0,dur){if(!ch.head)return;tw(ch.head,t0,0.15,{sx:1.12,sy:1.12},'out');tw(ch.head,t0+0.15,dur||0.5,{sx:1,sy:1},'elastic')}
/* ---- legenda em caixinha creme (referência 'Exemplo bacana 2') ---- */
function captionBox(parent,txt,o){o=o||{};return H('div',{style:`position:absolute;left:0;top:0;transform-origin:50% 50%;background:${o.bg||'#f3ecd8'};color:${o.color||'#1b1e21'};font:${o.weight||400} ${o.size||36}px/1.25 ${o.font||FS};padding:${o.pad||'10px 26px'};box-shadow:0 6px 18px rgba(0,0,0,.28);white-space:${o.wrap?'normal':'nowrap'};${o.w?`width:${o.w}px;`:''}${o.style||''}`},parent,txt)}
