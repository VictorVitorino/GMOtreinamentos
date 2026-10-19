/* ==== motion.js · morphing de formas, parallax por profundidade, virada de página, manchete-que-vira-cenário, match cut circular, whip pan ==== */
"use strict";
/* --- morphing: reamostra dois paths em N pontos (via getPointAtLength) e interpola --- */
function samplePath(d,n){const tmp=S('path',{d},DEFSVG);const L=tmp.getTotalLength();const pts=[];for(let i=0;i<n;i++){const p=tmp.getPointAtLength(L*i/n);pts.push([p.x,p.y])}tmp.remove();return pts}
function morphShape(parent,shapes,o){/* shapes: [{d,fill,stroke}] ; retorna {el,setT(k)} onde k∈[0,shapes.length-1] */o=o||{};const n=o.n||160;const samp=shapes.map(s=>{let pts=samplePath(s.d,n);let area=0;for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];area+=a[0]*b[1]-b[0]*a[1]}return area<0?pts.reverse():pts});
  // alinha o ponto inicial de cada forma com o mais próximo do primeiro ponto da anterior (evita giro)
  for(let i=1;i<samp.length;i++){const a=samp[i-1][0];let best=0,bd=1e18;samp[i].forEach((p,j)=>{const dd=(p[0]-a[0])**2+(p[1]-a[1])**2;if(dd<bd){bd=dd;best=j}});samp[i]=samp[i].slice(best).concat(samp[i].slice(0,best))}
  const svg=svgBox(parent,o.w||400,o.h||400,o.vb);const path=S('path',{d:'',fill:shapes[0].fill||C.ink,stroke:shapes[0].stroke||'none','stroke-width':o.sw||3,'stroke-linejoin':'round',filter:o.filter||''},svg._svg);
  const hex=c=>{const m=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(c);return m?[parseInt(m[1],16),parseInt(m[2],16),parseInt(m[3],16)]:[0,0,0]};
  function setT(k){k=clamp(k,0,shapes.length-1);const i=Math.min(shapes.length-2,Math.floor(k)),f=k-i;const A=samp[i],B=samp[i+1]||samp[i];const e=E.inOut(f);let d='';for(let j=0;j<n;j++){const x=A[j][0]+(B[j][0]-A[j][0])*e,y=A[j][1]+(B[j][1]-A[j][1])*e;d+=(j?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' '}path.setAttribute('d',d+'z');
    const ca=hex(shapes[i].fill||'#000'),cb=hex((shapes[i+1]||shapes[i]).fill||'#000');path.setAttribute('fill',`rgb(${ca.map((v,q)=>Math.round(v+(cb[q]-v)*e)).join(',')})`)}
  setT(0);return {el:svg,path,setT,svg:svg._svg}}
function morphAt(m,t0,t1,from,to){proc(t=>{if(t<t0-0.01||t>t1+0.01)return;const p=clamp((t-t0)/(t1-t0),0,1);m.setT(from+(to-from)*p)})}
/* --- parallax: desloca o elemento conforme a câmera da cena, por profundidade (0 = fundo parado, 1 = colado na câmera) --- */
function parallaxLayer(sid,id,depth,o){o=o||{};proc(t=>{const cam=REG[sid+'cam'].cur;const r=REG[id].cur;const k=(o.gain||0.6)*(1-depth);r.x+=-cam.x*k;r.y+=-cam.y*k*(o.ygain===undefined?0.6:o.ygain)})}
/* --- virada de página (3D): a página gira no eixo Y e revela o conteúdo de baixo --- */
function pageFlip(id,t0,dur,o){o=o||{};const r=REG[id];r.node.style.transformOrigin=o.origin||'0% 50%';r.node.style.backfaceVisibility='hidden';proc(t=>{if(t<t0||t>t0+dur+0.05){if(t>t0+dur)r.node.style.visibility='hidden';return}const p=E.inOut(clamp((t-t0)/dur,0,1));r.node.style.transform+=` perspective(1800px) rotateY(${-p*170}deg)`;r.node.style.filter=`brightness(${1-p*0.35})`})}
/* --- manchete vira cenário: a câmera mergulha num retângulo (px,py,w) da cena A e a cena B nasce por dentro --- */
function headlineToScene(sidA,sidB,t0,dur,px,py,w){const s=1920/Math.max(60,w);camTo(sidA,t0,dur,s,px,py,'in');tw(sidA,t0+dur*0.55,dur*0.45,{o:0},'in');camSet(sidB,t0,1.25,960,540);camTo(sidB,t0+dur*0.5,dur*0.9,1.0,960,540,'out');setAt(sidB,0,{o:0});setAt(sidB,t0+dur*0.5,{o:0});tw(sidB,t0+dur*0.5,dur*0.35,{o:1},'out')}
/* --- match cut circular: a cena B entra por um círculo que nasce no ponto (cx,cy) --- */
function matchCutCircle(sidB,t0,dur,cx,cy){const root=SCENES[sidB].root;proc(t=>{if(t<t0||t>t0+dur){if(t>t0+dur&&root.style.clipPath)root.style.clipPath='none';return}const p=E.inOut(clamp((t-t0)/dur,0,1));root.style.clipPath=`circle(${p*1600}px at ${cx}px ${cy}px)`})}
/* --- whip pan: cena A sai chicoteada para a esquerda (com rastro), cena B entra pela direita --- */
function whipPan(sidA,sidB,t0,dur,dir){dir=dir||-1;const a=SCENES[sidA].cam,b=SCENES[sidB].cam;proc(t=>{if(t<t0||t>t0+dur){if(t>t0+dur){b.style.filter='';}return}const p=E.inOut(clamp((t-t0)/dur,0,1));a.style.transform+=` translateX(${dir*p*1920}px)`;a.style.filter=`blur(${Math.sin(p*Math.PI)*22}px)`;b.style.transform+=` translateX(${-dir*(1-p)*1920}px)`;b.style.filter=`blur(${Math.sin(p*Math.PI)*22}px)`});setAt(sidB,0,{o:0});setAt(sidB,t0,{o:1})}
/* --- tipografia cinética: palavras da frase caem no ritmo da fala, com peso/escala por ênfase --- */
function kineticLine(parent,lid,o){o=o||{};const L=LINES[lid];if(!L)return null;const box=H('div',{style:`position:absolute;left:0;top:0;width:${o.w||1400}px;display:flex;flex-wrap:wrap;gap:${o.gap||'0 18px'};justify-content:${o.align||'center'};font:${o.weight||400} ${o.size||72}px/1.05 ${o.font||FA};color:${o.color||C.ink};text-transform:${o.upper===false?'none':'uppercase'};letter-spacing:.01em`},parent);
  const words=L.text.replace(/[«»]/g,'').split(/\s+/).filter(Boolean);const n=words.length;const ids=words.map((w,i)=>{const hold=H('span',{style:'display:inline-block'},box);const sp=H('span',{style:`display:inline-block;position:relative;transform-origin:50% 100%;${/\*/.test(w)?`color:${o.accent||C.red};`:''}`},hold,w.replace(/\*/g,''));const id=R(sp,{o:0});const t=L.start+L.dur*(i/n)*0.92;pop(id,t,0.28,0.4,'back');return id});
  const id=R(box,{x:o.x||260,y:o.y||440});if(o.t1!==undefined)fadeOut(id,o.t1-0.3,0.3);return {id,ids,box}}
