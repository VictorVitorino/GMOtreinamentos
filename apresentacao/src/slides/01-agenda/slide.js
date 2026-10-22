(()=>{const {$,$$,tone}=DECK, SEC=DECK.el('agenda'), svg=$('.ag-art',SEC), NS='http://www.w3.org/2000/svg';
const el=(t,a,p,txt)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;(p||svg).appendChild(e);return e};
/* ---------- céu, nuvens e morros ---------- */
const defs=el('defs',{});
const g1=el('linearGradient',{id:'agSky',x1:0,y1:0,x2:0,y2:1},defs);
[['0','#1E2D63'],['.55','#3D5F93'],['1','#8FA8D2']].forEach(([o,c])=>el('stop',{offset:o,'stop-color':c},g1));
el('rect',{x:0,y:0,width:1600,height:900,fill:'url(#agSky)'});
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
[[1110,150,1,46],[1340,70,.75,60],[1060,300,.55,38]].forEach(([x,y,s,d])=>{const c=el('g',{class:'cloud',style:`animation-duration:${d}s`});
 [[0,0,34],[38,-14,40],[80,0,32],[40,10,36]].forEach(([dx,dy,r])=>el('circle',{cx:x+dx*s,cy:y+dy*s,r:r*s},c));el('rect',{x:x-30*s,y:y,width:140*s,height:30*s,rx:15*s},c)});
const hill=(base,amp,step,fill,bump)=>{let d=`M600 900 L600 ${base}`;for(let x=600;x<=1620;x+=step){const y=base-amp*Math.sin(x/170+base)-rnd()*bump;d+=` Q${x+step/2} ${y-bump*.8} ${x+step} ${y}`}el('path',{d:d+' L1620 900 Z',fill})};
/* ---------- torres (um capítulo cada) ---------- */
const ARMS=[[-300,92],[-350,112],[-400,80]];
const hw=y=>y>=-300?62-48*(y/-300):14-3*((-y-300)/100);
function tower(cx,base,s,i){const g=el('g',{class:'tw',transform:`translate(${cx} ${base}) scale(${s})`,'stroke-width':(1+.55*s).toFixed(2)});g.style.setProperty('--t',i);
 const P=d=>el('path',{d,pathLength:1,'vector-effect':'non-scaling-stroke'},g);
 P('M-62 0 L-14 -300 L-11 -400 L0 -440 L11 -400 L14 -300 L62 0');
 const L=[0,-48,-92,-132,-168,-200,-228,-254,-278,-300,-325,-350,-375,-400];
 let d='';for(let k=0;k<L.length-1;k++){const a=L[k],b=L[k+1];d+=`M${-hw(a)} ${a}L${hw(b)} ${b}M${hw(a)} ${a}L${-hw(b)} ${b}M${-hw(b)} ${b}H${hw(b)}`}P(d);
 d='';ARMS.forEach(([y,l])=>{[-1,1].forEach(sd=>{const w=hw(y);d+=`M${sd*w} ${y}H${sd*l}L${sd*w} ${y-22}`;for(let x=w+18;x<l-6;x+=18)d+=`M${sd*x} ${y}L${sd*(x+9)} ${y-22*(1-(x+9-w)/(l-w))}`})});
 d+='M-24 -428H24';P(d);
 const ins=el('g',{class:'ins'},g);ARMS.forEach(([y,l])=>[-1,1].forEach(sd=>{el('path',{d:`M${sd*l} ${y}v26M${sd*l-5} ${y+8}h10M${sd*l-5} ${y+14}h10M${sd*l-5} ${y+20}h10`,pathLength:1,'vector-effect':'non-scaling-stroke'},ins)}));
 const b=el('g',{class:'bcn'});el('circle',{class:'halo',cx:cx,cy:base-447*s,r:11},b);el('circle',{cx:cx,cy:base-447*s,r:13},b);el('text',{x:cx,y:base-446*s},b,String(i+1));
 const pts=[];ARMS.forEach(([y,l])=>[-1,1].forEach(sd=>pts.push([cx+sd*l*s,base+(y+26)*s])));pts.push([cx-24*s,base-428*s],[cx+24*s,base-428*s]);
 return {g,pts}}
hill(720,10,70,'#5D7CB0',8);
const TW=[tower(1035,742,.62,0),tower(1240,812,.98,1)];
hill(800,14,60,'#33508A',14);
TW.push(tower(1468,940,1.68,2));
/* morro da frente com copas de árvores */
(()=>{let d='M600 900 L600 850';for(let x=600;x<1620;x+=26){const r=10+rnd()*16;d+=` a${r} ${r*.9} 0 0 1 26 ${(rnd()-.5)*8}`}el('path',{d:d+' L1620 900 Z',fill:'#1A2C5E'})})();
/* ---------- cabos e pulsos de energia (do capítulo 1 até o 3) ---------- */
const cab=el('g',{});const pul=el('g',{});
const cable=(a,b,id,dur,beg)=>{const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2+Math.abs(b[0]-a[0])*.1;el('path',{id,d:`M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`,class:'cab'},cab);
 if(dur){const c=el('circle',{r:3.2,class:'pulse'},pul);const m=el('animateMotion',{dur:dur+'s',repeatCount:'indefinite',begin:beg+'s'},c);el('mpath',{href:'#'+id},m)}};
let n=0;
TW[0].pts.forEach((p,k)=>cable([p[0]-260,p[1]-30],p,'agc'+n++,k<6?3.2:0,-k*.4));
for(let t=0;t<2;t++)TW[t].pts.forEach((p,k)=>cable(p,TW[t+1].pts[k],'agc'+n++,k<6?2.4+t*.5:0,-(k*.37+t)));
TW[2].pts.forEach((p,k)=>cable(p,[p[0]+420,p[1]+40],'agc'+n++,k<6?2.6:0,-k*.3));
svg.insertBefore(cab,svg.querySelector('.tw'));
/* ---------- interação ---------- */
const hot=i=>{svg.classList.toggle('pea',i===3);TW.forEach((t,k)=>t.g.classList.toggle('hot',k===i));$$('.ag-it',SEC).forEach((li,k)=>li.classList.toggle('hot',k===i))};
$$('.ag-it',SEC).forEach((li,i)=>{li.addEventListener('mouseenter',()=>{hot(i);tone(440+i*120,.1,'sine',.04,880)});li.addEventListener('mouseleave',()=>hot(-1));li.addEventListener('focusin',()=>hot(i))});
TW.forEach((t,i)=>{t.g.style.pointerEvents='stroke';t.g.style.cursor='pointer';t.g.addEventListener('mouseenter',()=>hot(i));t.g.addEventListener('mouseleave',()=>hot(-1));t.g.addEventListener('click',()=>DECK.go($$('.ag-main',SEC)[i].dataset.go))});
$$('[data-go]',SEC).forEach(b=>b.addEventListener('click',()=>{tone(660,.1,'sine',.05,990);DECK.go(b.dataset.go)}));
DECK.register('agenda',{enter(){hot(-1)},leave(){hot(-1)}});
})();
