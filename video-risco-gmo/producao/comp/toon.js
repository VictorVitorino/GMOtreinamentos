/* ==== toon.js · caricaturas desenhadas a marcador, recortadas em papel (referência do cliente) ====
   toon(parent,{who:'ze'|'chefe'|'dev'|'reporter'|'dona', scale, flip, x, y, mood:'neutro'|'feliz'|'susto'|'bravo'|'duvida'|'triste'})
   → {id, parts:{head,armL,armR,legL,legR,torso,browL,browR,mouth,eyes}, setMood(mood,t)}
   Traço: filtro SVG de deslocamento (linha trêmula de marcador) · preenchimento com hachura leve de caneta · borda branca de recorte. */
"use strict";
const TOON_DEFS=(()=>{const f=S('filter',{id:'marker',x:'-10%',y:'-10%',width:'120%',height:'120%'},DEFS);S('feTurbulence',{type:'fractalNoise',baseFrequency:'0.035',numOctaves:'2',seed:'7',result:'n'},f);S('feDisplacementMap',{in:'SourceGraphic',in2:'n',scale:'2.6',xChannelSelector:'R',yChannelSelector:'G'},f);
  const f2=S('filter',{id:'marker2',x:'-10%',y:'-10%',width:'120%',height:'120%'},DEFS);S('feTurbulence',{type:'fractalNoise',baseFrequency:'0.06',numOctaves:'2',seed:'3',result:'n'},f2);S('feDisplacementMap',{in:'SourceGraphic',in2:'n',scale:'1.8',xChannelSelector:'R',yChannelSelector:'G'},f2);
  // hachura de marcador (listras diagonais semitransparentes) para dar textura de caneta ao preenchimento
  const p=S('pattern',{id:'mk-hatch',patternUnits:'userSpaceOnUse',width:9,height:9,patternTransform:'rotate(35)'},DEFS);S('rect',{width:9,height:9,fill:'transparent'},p);S('rect',{width:3.2,height:9,fill:'rgba(255,255,255,.22)'},p);
  const p2=S('pattern',{id:'mk-hatch2',patternUnits:'userSpaceOnUse',width:7,height:7,patternTransform:'rotate(-28)'},DEFS);S('rect',{width:7,height:7,fill:'transparent'},p2);S('rect',{width:2.4,height:7,fill:'rgba(0,0,0,.08)'},p2);return true})();
const TK={ink:'#1a1a1a',white:'#ffffff'};
/* peça de marcador: borda branca de recorte + preenchimento + hachura + traço irregular */
function mk(g,d,fill,o){o=o||{};if(o.cut!==false)S('path',{d,fill:'none',stroke:TK.white,'stroke-width':o.edge||12,'stroke-linejoin':'round','stroke-linecap':'round'},g);
  const grp=S('g',{filter:'url(#marker)'},g);S('path',{d,fill:fill||'#eee',stroke:'none'},grp);if(o.hatch!==false)S('path',{d,fill:'url(#mk-hatch)',stroke:'none'},grp);
  S('path',{d,fill:'none',stroke:o.stroke||TK.ink,'stroke-width':o.sw===undefined?3.4:o.sw,'stroke-linejoin':'round','stroke-linecap':'round'},grp);return grp}
function ln(g,d,o){o=o||{};return S('path',{d,fill:'none',stroke:o.stroke||TK.ink,'stroke-width':o.sw||3,'stroke-linecap':'round','stroke-linejoin':'round',filter:'url(#marker2)'},g)}
/* ---- paletas por personagem (casaco, calça, camisa, pele, cabelo, sapato, detalhe) ---- */
const CAST={
  ze:{nome:'Zé do Projeto',coat:'#9be37a',pants:'#c9a8e6',shirt:'#f4f1ea',skin:'#f3d9a8',hair:'#d9a441',shoe:'#d8352f',acc:'#e0423b',tie:'bow',hairStyle:'tufos'},
  chefe:{nome:'Chefe Entusiasmado',coat:'#4a62c8',pants:'#2b3a6b',shirt:'#ffffff',skin:'#e9c39b',hair:'#5a3b2e',shoe:'#1a1a1a',acc:'#ffcc33',tie:'tie',hairStyle:'penteado'},
  dev:{nome:'Dev da Planilha',coat:'#f2c94c',pants:'#3a3a3a',shirt:'#f2c94c',skin:'#f7dcc0',hair:'#1a1a1a',shoe:'#ffffff',acc:'#7fd1ff',tie:null,hairStyle:'franja',glasses:true},
  reporter:{nome:'Repórter',coat:'#c8a27a',pants:'#7a5a3a',shirt:'#f4f1ea',skin:'#d9a579',hair:'#1a1a1a',shoe:'#5a3a21',acc:'#1a1a1a',tie:'tie',hairStyle:'chapeu'},
  dona:{nome:'Dona Marta do Financeiro',coat:'#e0423b',pants:'#1a1a1a',shirt:'#ffffff',skin:'#f1cfa6',hair:'#9a9a9a',shoe:'#1a1a1a',acc:'#c9a24a',tie:null,hairStyle:'coque',glasses:true},
  gato:{nome:'Gato do escritório',coat:'#f0b45a',pants:'#f0b45a',shirt:'#f0b45a',skin:'#f0b45a',hair:'#f0b45a',shoe:'#f0b45a',acc:'#1a1a1a',tie:null,hairStyle:'gato'},
};
/* expressões: sobrancelhas (rot), olhos (escala), pupilas (deslocamento), boca (path) */
const MOODS={
  neutro:{browL:0,browR:0,eye:1,pupil:[0,0],mouth:'M-22 40 q22 12 44 0',teeth:false},
  feliz:{browL:-8,browR:8,eye:1.05,pupil:[0,-2],mouth:'M-26 36 q26 30 52 0',teeth:true},
  susto:{browL:-16,browR:16,eye:1.35,pupil:[0,0],mouth:'M-16 44 a16 14 0 1 0 32 0 a16 14 0 1 0 -32 0',teeth:false},
  bravo:{browL:18,browR:-18,eye:0.9,pupil:[0,2],mouth:'M-22 48 q22 -14 44 0',teeth:true},
  duvida:{browL:-14,browR:10,eye:1.0,pupil:[6,-2],mouth:'M-20 44 q12 -6 22 2 q10 8 20 -4',teeth:false},
  triste:{browL:10,browR:-10,eye:0.95,pupil:[0,3],mouth:'M-22 50 q22 -16 44 0',teeth:false},
  grito:{browL:-20,browR:20,eye:1.4,pupil:[0,0],mouth:'M-24 32 q24 44 48 0 q-24 10 -48 0z',teeth:true},
};
function toon(parent,o){o=o||{};const c=Object.assign({},CAST[o.who||'ze']);const sc=o.scale||0.6;const VW=560,VH=860;
  const wrap=H('div',{class:'toon',style:`position:absolute;left:0;top:0;width:${VW*sc}px;height:${VH*sc}px;transform-origin:50% ${(840/860*100).toFixed(2)}%`},parent);
  const inner=H('div',{style:`position:absolute;inset:0;transform:${o.flip?'scaleX(-1)':'none'};filter:drop-shadow(${o.flip?-5:5}px 9px 9px rgba(0,0,0,.38))`},wrap);
  const svg=S('svg',{viewBox:`-280 -840 ${VW} ${VH}`,width:VW*sc,height:VH*sc,style:'overflow:visible;display:block'},inner);const root=S('g',null,svg);const k='tn'+(PUP_UID++);
  // pernas (origem no quadril y=-250), compridas e finas como na referência
  const legs={};[['L',-26],['R',26]].forEach(([s,x])=>{const g=S('g',{transform:`translate(${x} -250)`},root);const p=S('g',null,g);
    mk(p,`M-16 0 q-6 120 ${s==='L'?-10:6} 240 l34 0 q10 -120 14 -240z`,c.pants,{edge:10});
    mk(p,s==='L'?'M-30 236 q-40 4 -46 22 l80 0 l6 -30 z':'M-16 236 l6 30 l86 0 q-10 -22 -56 -26z',c.shoe,{edge:9});legs[s]=p});
  // tronco (origem no quadril): casaco longo de marcador
  const torsoG=S('g',{transform:'translate(0 -250)'},root);const torso=S('g',null,torsoG);
  mk(torso,'M-70 10 q-24 -110 -16 -230 q40 -22 86 -20 q50 2 84 24 q10 120 -18 226 q-70 14 -136 0z',c.shirt,{edge:10});
  if(c.hairStyle!=='gato'){mk(torso,'M-78 20 q-30 -120 -20 -236 l34 -4 l0 236 z M78 20 q30 -120 20 -236 l-34 -4 l0 236 z',c.coat,{edge:10});
    mk(torso,'M-88 20 q-28 -118 -20 -232 l56 -10 l-10 240z',c.coat,{edge:0,hatch:true});mk(torso,'M88 20 q28 -118 20 -232 l-56 -10 l10 240z',c.coat,{edge:0,hatch:true});
    ln(torso,'M-36 -200 l6 210 M36 -200 l-6 210');}
  if(c.tie==='bow'){mk(torso,'M-34 -214 l30 10 l-30 10z M34 -214 l-30 10 l30 10z',c.acc,{edge:7});S('circle',{cx:0,cy:-204,r:6,fill:c.acc,stroke:TK.ink,'stroke-width':2.5},torso)}
  if(c.tie==='tie'){mk(torso,'M-9 -206 l18 0 l-5 60 l9 50 l-13 16 l-13 -16 l9 -50z',c.acc,{edge:6})}
  // braços (origem no ombro): finos, mãos de luva com dedos de marcador
  const arms={};[['L',-74],['R',74]].forEach(([s,x])=>{const g=S('g',{transform:`translate(${x} -196)`},torso);const p=S('g',null,g);
    mk(p,`M-14 -8 q${s==='L'?-26:26} 90 ${s==='L'?-10:10} 190 l26 4 q${s==='L'?20:-20} -96 10 -194z`,c.coat,{edge:9});
    mk(p,`M-30 180 q-12 36 10 46 q22 10 40 -6 q10 -14 -2 -30 q-14 -16 -48 -10z`,c.skin,{edge:9});ln(p,'M-8 196 q10 -2 18 6 M-14 206 q10 -2 18 6');arms[s]=p});
  // cabeça (origem no pescoço y=-228 do tronco): grande, redonda, queixo achatado
  const headG=S('g',{transform:'translate(0 -228)'},torso);const head=S('g',null,headG);
  mk(head,'M-16 0 q-22 -2 -14 -30 q-82 -34 -86 -118 q0 -104 102 -106 q104 -2 106 100 q0 88 -70 126 q4 22 -10 28z',c.skin,{edge:12});
  // orelhas
  mk(head,'M-96 -112 q-26 -4 -22 22 q6 22 26 10z',c.skin,{edge:8});mk(head,'M104 -112 q26 -4 22 22 q-6 22 -26 10z',c.skin,{edge:8});
  // cabelo / chapéu
  if(c.hairStyle==='tufos'){mk(head,'M-62 -206 q6 -46 30 -26 q4 -50 36 -30 q10 -40 36 -16 q18 -34 30 2 q-22 -12 -42 8 q-26 -12 -48 6 q-24 -6 -42 10z',c.hair,{edge:8})}
  if(c.hairStyle==='penteado'){mk(head,'M-90 -176 q10 -74 94 -78 q88 -4 100 64 q-42 -32 -102 -24 q-60 10 -92 38z',c.hair,{edge:8})}
  if(c.hairStyle==='franja'){mk(head,'M-92 -166 q20 -74 98 -76 q82 0 96 60 q-28 -14 -58 4 q-32 -24 -68 -2 q-30 -22 -68 14z',c.hair,{edge:8})}
  if(c.hairStyle==='coque'){mk(head,'M-92 -166 q10 -64 96 -70 q86 -4 98 58 q-52 -28 -194 12z',c.hair,{edge:8});mk(head,'M-30 -240 a34 30 0 1 0 68 0 a34 30 0 1 0 -68 0z',c.hair,{edge:8})}
  if(c.hairStyle==='chapeu'){mk(head,'M-126 -160 l252 0 l0 18 l-252 0z',c.acc,{edge:8});mk(head,'M-82 -160 l12 -70 q70 -16 140 0 l12 70z',c.acc,{edge:8});S('rect',{x:-78,y:-194,width:156,height:16,fill:c.hair},head)}
  if(c.hairStyle==='gato'){mk(head,'M-84 -150 l-14 -70 l60 36z M84 -150 l14 -70 l-60 36z',c.skin,{edge:8})}
  // olhos esbugalhados: branco + pupila vermelha pequena (referência) · sobrancelhas grossas
  const eyes=S('g',null,head);const eyeL=S('g',{transform:'translate(-34 -112)'},eyes),eyeR=S('g',{transform:'translate(34 -112)'},eyes);
  [eyeL,eyeR].forEach(e=>{S('ellipse',{cx:0,cy:0,rx:30,ry:34,fill:'#fff',stroke:TK.ink,'stroke-width':3.4,filter:'url(#marker2)'},e)});
  const pupL=S('circle',{cx:-30,cy:-108,r:6.5,fill:'#c8322b'},eyes),pupR=S('circle',{cx:38,cy:-108,r:6.5,fill:'#c8322b'},eyes);S('circle',{cx:-30,cy:-108,r:2.4,fill:TK.ink},eyes);S('circle',{cx:38,cy:-108,r:2.4,fill:TK.ink},eyes);
  if(c.glasses){S('circle',{cx:-34,cy:-112,r:38,fill:'none',stroke:TK.ink,'stroke-width':4},head);S('circle',{cx:34,cy:-112,r:38,fill:'none',stroke:TK.ink,'stroke-width':4},head);ln(head,'M-4 -112 l8 0 M-72 -116 l-20 -6 M72 -116 l20 -6',{sw:4})}
  const browL=S('g',{transform:'translate(-34 -158)'},head),browR=S('g',{transform:'translate(34 -158)'},head);ln(browL,'M-30 6 q30 -16 60 -2',{sw:7});ln(browR,'M-30 4 q30 -14 60 8',{sw:7});
  // nariz + boca (com dentes de marcador quando a expressão pede)
  ln(head,'M2 -96 q14 18 -4 34 q-10 4 -16 -2',{sw:3.4});
  const mouthG=S('g',{transform:'translate(0 -50)'},head);const mouth=S('path',{d:MOODS.neutro.mouth,fill:'#5a1f1f',stroke:TK.ink,'stroke-width':3.4,filter:'url(#marker2)'},mouthG);const teeth=S('path',{d:'M-20 42 l40 0 l-4 8 l-32 0z',fill:'#fff',stroke:TK.ink,'stroke-width':2,opacity:0},mouthG);
  // colchetes de papel nas articulações (discretos)
  [[-74,-196],[74,-196],[0,-228]].forEach(([x,y])=>S('circle',{cx:x,cy:y,r:5,fill:'#e9e9e9',stroke:TK.ink,'stroke-width':2},torso));
  const parts={legL:k+'lL',legR:k+'lR',torso:k+'t',armL:k+'aL',armR:k+'aR',head:k+'h',browL:k+'bL',browR:k+'bR',eyes:k+'e'};
  reg(parts.legL,legs.L,{},{svg:true});reg(parts.legR,legs.R,{},{svg:true});reg(parts.torso,torso,{},{svg:true});reg(parts.armL,arms.L,{},{svg:true});reg(parts.armR,arms.R,{},{svg:true});reg(parts.head,head,{},{svg:true});
  reg(parts.browL,browL,{},{svg:true});reg(parts.browR,browR,{},{svg:true});reg(parts.eyes,eyes,{},{svg:true,pivot:[0,-112]});
  const id=R(wrap,{x:o.x||0,y:o.y||0});
  const T={id,wrap,svg,parts,k,uid:PUP_UID,scale:sc,w:VW*sc,h:VH*sc,cfg:c,mouth,teeth,pupL,pupR};
  T.setMood=(mood,t,dur)=>{const m=MOODS[mood]||MOODS.neutro;dur=dur||0.25;if(t===undefined){setAt(parts.browL,0,{rot:m.browL});setAt(parts.browR,0,{rot:m.browR});setAt(parts.eyes,0,{sx:m.eye,sy:m.eye});mouth.setAttribute('d',m.mouth);teeth.setAttribute('opacity',m.teeth?1:0);return}
    tw(parts.browL,t,dur,{rot:m.browL},'backSoft');tw(parts.browR,t,dur,{rot:m.browR},'backSoft');tw(parts.eyes,t,dur,{sx:m.eye,sy:m.eye},'backSoft');
    proc(tt=>{if(tt>=t&&tt<t+0.04){mouth.setAttribute('d',m.mouth);teeth.setAttribute('opacity',m.teeth?1:0);pupL.setAttribute('cx',-30+m.pupil[0]);pupR.setAttribute('cx',38+m.pupil[0]);pupL.setAttribute('cy',-108+m.pupil[1]);pupR.setAttribute('cy',-108+m.pupil[1])}})};
  T.setMood(o.mood||'neutro');
  if(o.idle!==false)puppetIdle(T,PUP_UID*1.3+(o.seed||0));
  // piscar de olhos periódico
  proc(t=>{const ph=(t*0.9+T.uid*0.37)%3.1;const sy=ph<0.08?0.1:1;REG[parts.eyes].cur.sy*=sy});
  return T}
/* fala: boca abre/fecha com o envelope da fala (lid) */
function toonTalk(T,lid,amp){const L=LINES[lid];if(!L)return;proc(t=>{const e=envAt(lid,t);if(e<=0)return;T.mouth.setAttribute('transform',`scale(1 ${1+e*(amp||1.6)})`)})}
