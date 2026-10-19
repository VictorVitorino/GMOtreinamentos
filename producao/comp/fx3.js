"use strict";
/* =====================================================================
   fx3 · colagem com imagens reais, cartões, balões, jornal facsímile,
   fundos de referência (grade, grama, bloco vermelho) e utilidades 3D
   ===================================================================== */
Object.assign(C,{red:'#A61E1E',red2:'#7A1212',yellow3d:'#F2D23A',yellowDk:'#8C7415',orange:'#F07F1A',green:'#1F8A3A',green2:'#146A2B',blue:'#2457B8',cream:'#F2E8D5',cream2:'#E6D9BC',black:'#0B0C0E',white:'#FFFFFF'});
const FA="'Anton','Bebas Neue','Barlow Condensed',sans-serif";          // condensado pesado (Ex2/Ex4)
const FBN="'Bebas Neue','Anton','Barlow Condensed',sans-serif";
const FO="'Oswald','Barlow Condensed',sans-serif";
const FS="'Old Standard TT','Libre Baskerville',Georgia,serif";         // jornal
const FN="'UnifrakturCook','Old Standard TT',serif";                    // cabeçalho gótico
const FP="'Playfair Display','Libre Baskerville',Georgia,serif";        // serifada elegante (Ex1)
const FTW="'Special Elite','Courier Prime',monospace";                  // máquina de escrever
const FSIX="'Six Caps','Anton',sans-serif";

/* ---------- imagens: pré-carregamento ---------- */
const PRELOAD=[];
function imgEl(src,style){const im=H('img',{src,draggable:'false',style:style||''});PRELOAD.push(im);return im}
function imagesReady(){return Promise.all(PRELOAD.map(i=>(i.decode?i.decode():Promise.resolve()).catch(()=>{})))}

/* ---------- foto / recorte com papel, rasgo, fita e sombra ---------- */
function photo(parent,src,o){o=o||{};const w=o.w||600,h=o.h||400,pad=o.pad||0;
  const wrap=box(parent,w,h,`transform-origin:${o.origin||'50% 50%'};${o.shadow===false?'':`filter:drop-shadow(0 ${o.sy===undefined?16:o.sy}px ${o.sb===undefined?26:o.sb}px rgba(0,0,0,${o.sa===undefined?.45:o.sa}));`}${o.style||''}`);
  const paper=H('div',{style:`position:absolute;inset:0;background:${o.paper||(pad?'#f3eee1':'transparent')};${o.torn?`clip-path:${torn(w,h,o.seed||1,o.torn===true?8:o.torn)};`:''}${o.round?`border-radius:${o.round}px;`:''}overflow:hidden;transform-origin:50% 50%`},wrap);
  const im=imgEl(src,`position:absolute;left:${pad}px;top:${pad}px;width:${w-2*pad}px;height:${h-2*pad}px;object-fit:${o.fit||'cover'};object-position:${o.pos||'50% 50%'};${o.filter?`filter:${o.filter};`:''}${o.imgStyle||''}`);paper.appendChild(im);
  if(o.tint)H('div',{style:`position:absolute;inset:${pad}px;background:${o.tint};mix-blend-mode:${o.tintBlend||'multiply'};pointer-events:none`},paper);
  if(o.tex)H('div',{style:`position:absolute;inset:0;background:url(${TEX.paper});background-size:520px;opacity:${o.tex===true?.35:o.tex};mix-blend-mode:multiply;pointer-events:none`},paper);
  if(o.caption)H('div',{style:`position:absolute;left:${pad}px;right:${pad}px;bottom:${Math.max(4,pad-30)}px;font:italic 400 ${o.capSize||18}px/1.2 ${FS};color:#3a342a;text-align:center`},paper,o.caption);
  if(o.tape)tape(wrap,w,h,o.tape,o.seed||1);
  wrap._img=im;wrap._paper=paper;return wrap}
function cutout(parent,src,o){o=o||{};return photo(parent,src,Object.assign({fit:'contain',sy:22,sb:30,sa:.5},o))}
/* fita adesiva: kind = 'top' | 'corners' | 'tl' | 'tr' | 'both' | 'x' */
function tape(parent,w,h,kind,seed){const j=k=>(hash((seed||1)*31+k)-.5);
  const mk=(x,y,rot,len)=>{const t=H('div',{style:`position:absolute;left:${x-len/2}px;top:${y-17}px;width:${len}px;height:34px;background:rgba(238,226,186,.84);box-shadow:inset 0 1px 2px rgba(0,0,0,.16),0 2px 4px rgba(0,0,0,.14);transform:rotate(${rot}deg);clip-path:polygon(1.5% 0,98% 3%,100% 52%,97.5% 100%,2.5% 97%,0 46%)`},parent);H('div',{style:`position:absolute;inset:0;background:url(${TEX.paper});background-size:220px;opacity:.45;mix-blend-mode:multiply`},t);return t};
  if(kind==='top'||kind===true)mk(w/2+j(1)*40,0,j(2)*6,Math.min(260,w*.42));
  if(kind==='corners'||kind==='x'){mk(16,16,-45+j(3)*8,150);mk(w-16,h-16,-45+j(4)*8,150)}
  if(kind==='tl')mk(18,14,-42+j(5)*8,150);if(kind==='tr')mk(w-18,14,42+j(6)*8,150);
  if(kind==='both'){mk(w*.2+j(7)*20,0,j(8)*5,180);mk(w*.8+j(9)*20,0,j(10)*5,180)}}
/* balanço 3D sutil (cartão flutuando, Ex1) aplicado ao miolo, não ao nó registrado */
function tilt(el,o){o=o||{};const inner=el._paper||el._inner||el.firstChild;el.style.perspective=(o.persp||1400)+'px';inner.style.transformStyle='preserve-3d';const amp=o.amp||10,sp=o.speed||0.35,seed=o.seed||1;
  proc(t=>{const a=noise1(t*sp,seed)*amp+(o.ry||0),b=noise1(t*sp*0.8,seed+3)*amp*0.6+(o.rx||0);inner.style.transform=`rotateY(${a}deg) rotateX(${b}deg)`})}
/* ken burns: de a para b (s = escala, x/y = deslocamento) */
function kb(id,t0,t1,a,b,ease){setAt(id,t0,{sx:a.s,sy:a.s,x:a.x||0,y:a.y||0});tw(id,t0,t1-t0,{sx:b.s,sy:b.s,x:b.x||0,y:b.y||0},ease||'lin')}
/* flutuação contínua (objetos "3D" pairando) */
function floatY(id,amp,speed,seed){proc(t=>{const r=REG[id].cur;r.y+=Math.sin(t*(speed||1.1)+(seed||0))*(amp||10);r.rot+=noise1(t*0.3,(seed||0)+5)*1.5})}

/* ---------- rótulo preto que cresce (Ex4) ---------- */
function labelBox(parent,txt,o){o=o||{};const size=o.size||44,padX=o.padX||26,padY=o.padY||12;
  const wrap=box(parent,10,10,'transform-origin:0 50%');
  const bg=H('div',{style:`position:absolute;left:0;top:0;height:${Math.round(size*1.2+padY*2)}px;background:${o.bg||'#0F1114'};border:${o.border||0}px solid ${o.borderColor||'transparent'};border-radius:${o.radius===undefined?6:o.radius}px;overflow:hidden;width:0px;box-shadow:0 8px 24px rgba(0,0,0,.35)`},wrap);
  const tx=H('div',{style:`position:absolute;left:${padX}px;top:${padY}px;white-space:nowrap;font:${o.weight||400} ${size}px/1.2 ${o.font||FA};color:${o.color||'#fff'};text-transform:${o.upper===false?'none':'uppercase'};letter-spacing:${o.ls||'.03em'}`},bg,txt);
  const t0=o.t0,dur=o.dur||0.38;let W=0;
  proc(t=>{if(!W||o.live)W=tx.scrollWidth+padX*2+12;const p=E.out(clamp((t-t0)/dur,0,1));let w=p*W;if(o.t1!==undefined&&t>o.t1){const q=E.in(clamp((t-o.t1)/0.25,0,1));w=W*(1-q)}bg.style.width=w+'px'});
  wrap._bg=bg;wrap._tx=tx;return wrap}
/* bloco de cor atrás de uma palavra (Ex4: retângulo verde que cresce) */
function colorBar(parent,o){o=o||{};const b=H('div',{style:`position:absolute;left:0;top:0;height:${o.h||70}px;width:0;background:${o.color||C.green};border:${o.border||0}px solid ${o.borderColor||'transparent'};transform-origin:0 50%`},parent);
  proc(t=>{const p=E.out(clamp((t-o.t0)/(o.dur||0.3),0,1));let w=p*(o.w||400);if(o.t1!==undefined&&t>o.t1)w=(o.w||400)*(1-E.in(clamp((t-o.t1)/0.25,0,1)));b.style.width=w+'px'});return b}

/* ---------- balão de fala ---------- */
function bubble(parent,txt,o){o=o||{};const w=o.w||420,bg=o.bg||C.orange;
  const b=H('div',{style:`position:absolute;left:0;top:0;width:${w}px;transform-origin:${o.tail==='left'?'14% 100%':o.tail==='right'?'86% 100%':'50% 100%'};background:${bg};color:${o.color||'#fff'};border-radius:${o.radius||22}px;padding:${o.pad||'18px 26px'};box-sizing:border-box;font:${o.weight||400} ${o.size||40}px/1.05 ${o.font||FA};text-transform:uppercase;text-align:center;box-shadow:0 10px 28px rgba(0,0,0,.35);letter-spacing:.02em`},parent,txt);
  H('div',{style:`position:absolute;left:${o.tail==='left'?'14%':o.tail==='right'?'86%':'50%'};bottom:-22px;width:0;height:0;border-left:16px solid transparent;border-right:16px solid transparent;border-top:26px solid ${bg};transform:translateX(-50%) rotate(${o.tailRot||0}deg)`},b);return b}

/* ---------- cartão-selo picotado (Ex4) ---------- */
function stampCard(parent,html,o){o=o||{};const w=o.w||520,h=o.h||300,st=o.step||26,r=st*0.3,bg=o.bg||'#fff';
  const outer=box(parent,w,h,`transform-origin:50% 50%;background:radial-gradient(circle,transparent ${r}px,${bg} ${r+0.8}px) ${-st/2}px ${-st/2}px / ${st}px ${st}px;filter:drop-shadow(0 10px 22px rgba(0,0,0,.35));${o.style||''}`);
  const inner=H('div',{style:`position:absolute;inset:${st/2}px;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:${o.pad||'18px 28px'};box-sizing:border-box;font:${o.font||`400 46px/1.05 ${FA}`};color:${o.color||'#101214'};text-transform:uppercase;letter-spacing:.02em`},outer,html);
  outer._inner=inner;return outer}

/* ---------- bilhete em papel pautado (Ex4) ---------- */
function note(parent,txt,o){o=o||{};const w=o.w||520,h=o.h||300,line=o.line||38;
  const n=box(parent,w,h,`transform-origin:50% 50%;background:${o.bg||'#fbf7ea'} repeating-linear-gradient(180deg,transparent 0 ${line-1}px,rgba(90,120,180,.35) ${line-1}px ${line}px);box-shadow:0 14px 30px rgba(0,0,0,.35);padding:${o.pad||`${Math.round(line*0.65)}px 30px`};box-sizing:border-box;font:${o.font||`400 ${o.size||32}px/${line}px ${FTW}`};color:${o.color||'#1d1d1d'};${o.style||''}`);
  n.innerHTML=txt;if(o.tape)tape(n,w,h,o.tape,o.seed||2);return n}

/* ---------- jornal facsímile ---------- */
const FILL_PT=['Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu. Cumprimentou-me, sentou-se ao pé de mim, falou da lua e dos ministros, e acabou recitando-me versos. A viagem era curta, e os versos pode ser que não fossem inteiramente maus.','Sucedeu, porém, que, como eu estava cansado, fechei os olhos três ou quatro vezes; tanto bastou para que ele interrompesse a leitura e metesse os versos no bolso. Não é que ele fosse mau rapaz; ao contrário, era de boa índole e de bons modos.','Algum tempo hesitei se devia abrir estas memórias pelo princípio ou pelo fim, isto é, se poria em primeiro lugar o meu nascimento ou a minha morte. Suposto o uso vulgar seja começar pelo nascimento, duas considerações me levaram a adotar diferente método.','A primeira é que eu não sou propriamente um autor defunto, mas um defunto autor, para quem a campa foi outro berço; a segunda é que o escrito ficaria assim mais galante e mais novo. Moisés, que também contou a sua morte, não a pôs no intróito, mas no cabo.'];
const FILL_EN=['It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.','We had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way; in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.','Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation.','Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet, then I account it high time to get to sea as soon as I can.'];
function newspaper(parent,o){o=o||{};const w=o.w||900,h=o.h||1200,m=o.m||34;
  const pg=box(parent,w,h,`transform-origin:50% 50%;background:${o.bg||'#efe6cf'};color:#1b1a17;box-shadow:0 24px 60px rgba(0,0,0,.5);overflow:hidden;${o.style||''}`);
  H('div',{style:`position:absolute;inset:0;background:url(${TEX.paper});background-size:600px;opacity:.5;mix-blend-mode:multiply;pointer-events:none;z-index:2`},pg);
  if(o.age!==false)H('div',{style:`position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(120,90,40,.28) 100%);pointer-events:none;z-index:2`},pg);
  const inner=H('div',{style:`position:absolute;inset:${m}px;display:flex;flex-direction:column;gap:6px`},pg);
  H('div',{style:`font:${o.mastWeight||700} ${o.mastSize||64}px/1.05 ${o.mastFont||FN};text-align:center;letter-spacing:.01em;border-bottom:3px double #1b1a17;padding-bottom:6px;white-space:nowrap;overflow:hidden`},inner,o.masthead||'O CORREIO');
  H('div',{style:`display:flex;justify-content:space-between;font:400 ${o.dateSize||13}px/1.1 ${FS};border-bottom:1px solid #1b1a17;padding-bottom:4px;letter-spacing:.08em;text-transform:uppercase`},inner,`<span>${o.place||''}</span><span>${o.date||''}</span><span>${o.price||''}</span>`);
  const head=H('div',{style:`font:${o.headWeight||900} ${o.headSize||54}px/1.02 ${o.headFont||FP};text-align:center;margin-top:8px;text-transform:${o.headUpper===false?'none':'uppercase'};letter-spacing:-.01em`},inner,o.headline||'');
  if(o.sub)H('div',{style:`font:italic 400 ${o.subSize||20}px/1.2 ${FS};text-align:center;border-top:1px solid #1b1a17;border-bottom:1px solid #1b1a17;padding:6px 0;margin-top:6px`},inner,o.sub);
  const body=H('div',{style:`flex:1;column-count:${o.cols||4};column-gap:14px;column-rule:1px solid rgba(27,26,23,.45);font:400 ${o.bodySize||11.5}px/1.3 ${FS};text-align:justify;overflow:hidden;margin-top:8px;color:#2a2722`},inner);
  if(o.photo){const ph=H('div',{style:`break-inside:avoid;margin:0 0 8px;width:100%`},body);const im=imgEl(o.photo,`display:block;width:100%;height:${o.photoH||220}px;object-fit:cover;object-position:${o.photoPos||'50% 50%'};filter:${o.photoFilter||'grayscale(1) contrast(1.15) sepia(.25)'}`);ph.appendChild(im);if(o.caption)H('div',{style:`font:italic 400 11px/1.25 ${FS};margin-top:3px`},ph,o.caption)}
  const src=o.text?[o.text]:(o.lang==='en'?FILL_EN:FILL_PT);const paras=[];for(let i=0;i<(o.reps||5);i++)paras.push(...src);
  H('div',null,body,paras.map((p,i)=>`<p style="margin:0 0 5px;text-indent:1.2em">${i%6===0&&o.subheads!==false?`<b style="display:block;text-indent:0;font-size:1.15em;margin:4px 0 2px">${o.subhead||'Últimas notícias'}</b>`:''}${p}</p>`).join(''));
  pg._body=body;pg._head=head;return pg}

/* ---------- fundos ---------- */
function bgGrass(parent){H('div',{style:'position:absolute;inset:0;background:linear-gradient(180deg,#2b6fd6 0%,#7fb6ff 46%,#b7dcff 58%,#b7dcff 100%)'},parent);
  for(let i=0;i<7;i++){const x=hash(i*3.1)*1900-100,y=60+hash(i*5.3)*360,s=180+hash(i*7.7)*260;H('div',{style:`position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s*.4}px;border-radius:50%;background:rgba(255,255,255,.9);filter:blur(${8+hash(i)*10}px)`},parent)}
  H('div',{style:'position:absolute;left:-300px;top:620px;width:2600px;height:1000px;border-radius:50%;background:radial-gradient(ellipse at 50% 25%,#62c04a,#2f7d22 68%,#215f17 100%)'},parent)}
function bgRed(parent,c){H('div',{style:`position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,${c||C.red},${C.red2} 70%,#3a0707 100%)`},parent);H('div',{style:`position:absolute;inset:0;background:url(${TEX.paper});background-size:700px;opacity:.25;mix-blend-mode:multiply`},parent)}
function bgGridColor(parent,color,line){return bgGrid(parent,color||C.green,line||'rgba(255,255,255,.35)')}
function bgDarkVignette(parent){H('div',{style:`position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,#2a2c30,#0b0c0e 72%)`},parent);H('div',{style:`position:absolute;inset:0;background:url(${TEX.grain});background-size:300px;opacity:.12;mix-blend-mode:overlay`},parent)}
function bgWood(parent){H('div',{style:`position:absolute;inset:0;background:repeating-linear-gradient(90deg,#5a3a22 0 190px,#6a4629 190px 200px,#4f3119 200px 420px,#5f3f24 420px 430px);`},parent);H('div',{style:`position:absolute;inset:0;background:url(${TEX.paper});background-size:400px;opacity:.5;mix-blend-mode:multiply`},parent);H('div',{style:`position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,transparent 40%,rgba(0,0,0,.55) 100%)`},parent)}
function bgPaperPrint(parent,tone){bgPaper(parent,tone);/* texto impresso esmaecido ao fundo (Ex1) */const d=H('div',{style:`position:absolute;inset:-40px;column-count:5;column-gap:40px;font:400 15px/1.5 ${FS};color:rgba(60,50,35,.16);text-align:justify;transform:rotate(-1.5deg);pointer-events:none`},parent);const ps=[];for(let i=0;i<9;i++)ps.push(...FILL_PT);d.innerHTML=ps.map(p=>`<p style="margin:0 0 10px">${p}</p>`).join('')}
function scanlines(parent,op){return H('div',{style:`position:absolute;inset:0;background:repeating-linear-gradient(180deg,rgba(0,0,0,${op||.18}) 0 2px,transparent 2px 4px);pointer-events:none;mix-blend-mode:multiply`},parent)}

/* ---------- partículas (destroços) ---------- */
function debris(parent,o){o=o||{};const n=o.n||28,cols=o.colors||[C.red,'#101214',C.cream];const ps=[];
  for(let i=0;i<n;i++)ps.push(H('div',{style:`position:absolute;left:0;top:0;width:${4+hash(i*3)*12}px;height:${3+hash(i*5)*8}px;background:${cols[i%cols.length]};opacity:0;will-change:transform`},parent));
  proc(t=>{const p=(t-o.t0)/(o.dur||1.2);ps.forEach((d,i)=>{if(p<0||p>1){d.style.opacity=0;return}const a=hash(i*7.7)*6.283,v=(o.v||420)*(0.35+hash(i*9.1));const x=o.cx+Math.cos(a)*v*p,y=o.cy+Math.sin(a)*v*p*0.7+(o.g===undefined?700:o.g)*p*p*0.5;d.style.transform=`translate(${x}px,${y}px) rotate(${p*720*hash(i)}deg)`;d.style.opacity=1-p*p})})}

/* ---------- selo "fonte" curto e discreto no canto (além de cite()) ---------- */
function dateTag(parent,txt,o){o=o||{};return label(parent,txt,Object.assign({size:22,weight:600,font:FO,color:C.cream,bg:'rgba(11,12,14,.78)',pad:'8px 14px',radius:4,ls:'.12em'},o))}

/* ---------- grande ano 3D (Ex4) ---------- */
function year3d(parent,o){o=o||{};const d=H('div',{style:`position:absolute;left:0;top:0;font:400 ${o.size||300}px/1 ${o.font||FA};color:${o.color||C.yellow3d};letter-spacing:.01em;transform-origin:50% 50%;text-shadow:${extrude(o.dark||C.yellowDk,o.depth||14)},${(o.depth||14)+2}px ${(o.depth||14)+6}px 24px rgba(0,0,0,.45);white-space:nowrap`},parent,String(o.text||o.year));return d}
