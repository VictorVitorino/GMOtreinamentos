/* ==== sets.js · cenários de colagem: parede de cartões, janela de época, carimbo postal, balão de pictograma ==== */
"use strict";
/* parede de cartões rasgados com fita e leve flutuação; cards: [{src,w,h,x,y,rot,tape,seed,t0,t1}] */
function collageWall(parent,cards,o){o=o||{};return cards.map((c,i)=>{const ph=photo(parent,c.src,{w:c.w||600,h:c.h||400,fit:c.fit||'cover',tape:c.tape===undefined?(i%2?'tl':'tr'):c.tape,seed:c.seed||i+1,sa:.4,sy:14,sb:22});
  const id=R(ph,{x:c.x||0,y:c.y||0,rot:c.rot||0});if(c.t0!==undefined)pop(id,c.t0,0.55,0.85,'backSoft');if(c.t1!==undefined)fadeOut(id,c.t1-0.3,0.3);if(o.bob!==false)floatY(id,o.amp||4,0.7+0.1*i,i*1.3);return {id,el:ph}})}
/* janela de época (ref. 'Exemplo bacana 1'): moldura de papel e fotos que deslizam/trocam dentro */
function eraWindow(parent,o){o=o||{};const w=o.w||700,h=o.h||460,r=o.r||26;const wrap=box(parent,w,h,'transform-origin:50% 50%');
  const frame=H('div',{style:`position:absolute;inset:0;border-radius:${r}px;overflow:hidden;background:#dcd4c2;box-shadow:inset 0 0 0 ${o.border||14}px ${o.frameColor||'#efe7d4'},0 18px 40px rgba(0,0,0,.35)`},wrap);
  const inner=H('div',{style:`position:absolute;inset:${o.border||14}px;border-radius:${Math.max(0,r-10)}px;overflow:hidden;background:#9fb7c9`},frame);
  const ids=(o.frames||[]).map((f,i)=>{const im=imgEl(f.src,`position:absolute;left:0;top:0;width:${w}px;height:${h}px;object-fit:cover;object-position:${f.pos||'50% 50%'}`);inner.appendChild(im);const id=R(im,{o:0});
    if(f.t0!==undefined){const dir=f.dir||'right';const dx=dir==='right'?w:dir==='left'?-w:0,dy=dir==='down'?h:dir==='up'?-h:0;setAt(id,f.t0,{o:1,x:dx,y:dy});tw(id,f.t0,f.dur||0.9,{x:0,y:0},'inOut');if(f.t1!==undefined){tw(id,f.t1-(f.dur||0.9),f.dur||0.9,{x:-dx,y:-dy},'inOut');setAt(id,f.t1,{o:0})}}
    if(f.kb)kb(id,f.t0||0,f.t1||(f.t0||0)+8,{s:1},{s:1.08});return id});
  // reflexo de vidro leve
  H('div',{style:`position:absolute;inset:${o.border||14}px;border-radius:${Math.max(0,r-10)}px;background:linear-gradient(115deg,rgba(255,255,255,.22),transparent 35%,transparent 70%,rgba(255,255,255,.1));pointer-events:none`},frame);
  wrap._frames=ids;return wrap}
/* carimbo postal redondo com texto (ano/lugar) */
function postmark(parent,txt,o){o=o||{};const d=o.d||220,col=o.color||'#1b1e21';const svg=svgBox(parent,d,d);const g=svg._svg;const c=d/2;
  S('circle',{cx:c,cy:c,r:c-4,fill:'none',stroke:col,'stroke-width':4},g);S('circle',{cx:c,cy:c,r:c-16,fill:'none',stroke:col,'stroke-width':2,'stroke-dasharray':'6 5'},g);
  const t=S('text',{x:c,y:c+(o.size||56)*0.36,'font-family':FA,'font-size':o.size||56,'text-anchor':'middle',fill:col,'letter-spacing':2},g);t.textContent=txt;
  if(o.sub){const s2=S('text',{x:c,y:c+(o.size||56)*0.36+28,'font-family':FO,'font-size':18,'text-anchor':'middle',fill:col,'letter-spacing':3},g);s2.textContent=o.sub}
  for(let i=0;i<4;i++)S('path',{d:`M${c+c-10} ${c-24+i*16} q22 -4 44 0 q22 4 44 0`,fill:'none',stroke:col,'stroke-width':3,'stroke-linecap':'round'},g);
  svg.style.opacity=o.opacity||.85;svg.style.mixBlendMode='multiply';return svg}
/* balão de pictograma: kind = '?', '!', 'rocket', 'zzz', 'heart', 'gear', 'coffee', 'car', 'horse', 'hand' */
function pictoBubble(parent,kind,o){o=o||{};const w=o.w||150,h=o.h||120;const wrap=box(parent,w,h+22,'transform-origin:50% 100%');const svg=S('svg',{viewBox:`0 0 ${w} ${h+22}`,width:w,height:h+22,style:'overflow:visible;display:block'},wrap);
  S('path',{d:`M14 0 H${w-14} a14 14 0 0 1 14 14 V${h-14} a14 14 0 0 1 -14 14 H${w*0.42} L${w*0.3} ${h+20} L${w*0.3} ${h} H14 a14 14 0 0 1 -14 -14 V14 a14 14 0 0 1 14 -14z`,fill:o.bg||'#fff',stroke:'#1b1e21','stroke-width':3.5,'stroke-linejoin':'round'},svg);
  const g=S('g',{transform:`translate(${w/2} ${h/2})`},svg);const ink={fill:'none',stroke:'#1b1e21','stroke-width':5,'stroke-linecap':'round','stroke-linejoin':'round'};
  switch(kind){
    case '?':case '!':{const t=S('text',{x:0,y:h*0.3,'font-family':FA,'font-size':h*0.8,'text-anchor':'middle',fill:o.color||'#1b1e21'},g);t.textContent=kind;break}
    case 'rocket':S('path',Object.assign({d:'M0 -42 q22 20 14 60 h-28 q-8 -40 14 -60z M-14 18 l-14 14 M14 18 l14 14 M0 18 v18'},ink),g);S('circle',{cx:0,cy:-10,r:7,fill:'#7fd1ff',stroke:'#1b1e21','stroke-width':3},g);S('path',{d:'M-8 36 q8 22 16 0z',fill:'#ffb13b'},g);break;
    case 'zzz':['Z','z','z'].forEach((z,i)=>{const t=S('text',{x:-30+i*26,y:10-i*18,'font-family':FA,'font-size':40-i*8,fill:'#1b1e21'},g);t.textContent=z});break;
    case 'heart':S('path',{d:'M0 30 C-40 0 -36 -36 -12 -34 C-4 -34 0 -28 0 -22 C0 -28 4 -34 12 -34 C36 -36 40 0 0 30z',fill:'#c8322b',stroke:'#1b1e21','stroke-width':3},g);break;
    case 'gear':{let d='';for(let i=0;i<10;i++){const a=i/10*Math.PI*2,a2=a+Math.PI/10;d+=`${i?'L':'M'}${(Math.cos(a)*34).toFixed(1)} ${(Math.sin(a)*34).toFixed(1)} L${(Math.cos(a+0.15)*34).toFixed(1)} ${(Math.sin(a+0.15)*34).toFixed(1)} L${(Math.cos(a2-0.15)*24).toFixed(1)} ${(Math.sin(a2-0.15)*24).toFixed(1)} L${(Math.cos(a2+0.15)*24).toFixed(1)} ${(Math.sin(a2+0.15)*24).toFixed(1)} `}S('path',{d:d+'z',fill:'#9a9ea3',stroke:'#1b1e21','stroke-width':3},g);S('circle',{cx:0,cy:0,r:9,fill:'#fff',stroke:'#1b1e21','stroke-width':3},g);break}
    case 'coffee':S('path',Object.assign({d:'M-26 -10 h44 l-5 40 h-34z M18 -4 q18 0 14 18 q-3 10 -16 10 M-14 -26 q6 -8 0 -16 M0 -26 q6 -8 0 -16'},ink),g);break;
    case 'car':S('path',Object.assign({d:'M-40 14 h80 v-16 l-16 -16 h-28 l-18 16z M-26 14 v8 M26 14 v8'},ink),g);S('circle',{cx:-22,cy:18,r:8,fill:'#1b1e21'},g);S('circle',{cx:22,cy:18,r:8,fill:'#1b1e21'},g);break;
    case 'horse':S('path',Object.assign({d:'M-34 20 v-26 q0 -14 14 -14 h26 l12 -16 l10 6 l-6 14 v36 M-22 20 v-12 M22 20 v-12'},ink),g);break;
    case 'coin':S('circle',{cx:0,cy:0,r:34,fill:'#d8b24a',stroke:'#1b1e21','stroke-width':4},g);S('circle',{cx:0,cy:0,r:24,fill:'none',stroke:'#8a6a22','stroke-width':2,'stroke-dasharray':'4 3'},g);S('text',{x:0,y:12,'font-family':FA,'font-size':34,'text-anchor':'middle',fill:'#1b1e21'},g).textContent='$';break;
    case 'phone':S('rect',{x:-22,y:-44,width:44,height:88,rx:8,fill:'#1b1e21'},g);S('rect',{x:-17,y:-36,width:34,height:66,rx:3,fill:'#7fd1ff'},g);S('path',{d:'M-8 -10 l6 6 l10 -12',fill:'none',stroke:'#1b1e21','stroke-width':4,'stroke-linecap':'round'},g);break;
    case 'bulb':S('path',{d:'M0 -40 a26 26 0 0 1 14 48 v10 h-28 v-10 a26 26 0 0 1 14 -48z',fill:'#ffe680',stroke:'#1b1e21','stroke-width':4},g);S('rect',{x:-12,y:20,width:24,height:14,rx:3,fill:'#9a9ea3',stroke:'#1b1e21','stroke-width':3},g);break;
    case 'hand':S('path',Object.assign({d:'M-18 30 v-40 M-6 30 v-52 M6 30 v-48 M18 30 v-40 M-18 -10 q-16 10 -8 30 M-18 30 h36'},ink),g);break;
  }
  return wrap}
