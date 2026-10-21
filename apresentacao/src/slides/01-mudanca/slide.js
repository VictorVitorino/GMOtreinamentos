(()=>{const {$,$$,tone,ding,boing,stage}=DECK, SEC=DECK.el('mudanca');
/* ---------- 01 · mudança: o cérebro na mudança (mapa ilustrativo) ---------- */
// time: 'nw' = puxa para o novo · 'kn' = puxa para o conhecido · 'ref' = apita o conflito
const R=[
 {id:'pfc',tm:'nw',tag:'Pré-frontal',deep:0,pin:[596,112],tagAt:[664,34,'l'],say:[668,140,'tr'],
  name:'Córtex pré-frontal',sub:'A voz que pede a mudança',q:'Quero mudar!',where:'Superfície · logo atrás da testa',
  papel:'Mantém a meta nova ativa e orienta o resto do cérebro a agir de acordo com ela. Na metáfora do slide, é a voz do “eu quero diferente”.',
  sente:'Vontade e clareza, mas também esforço: a memória de trabalho segura só <b>cerca de 4 blocos</b> de informação por vez.',
  dica:'Poucas prioridades, claras e repetidas. Uma meta nova de cada vez cabe na cabeça.',
  src:'Miller &amp; Cohen (2001) · Cowan (2001) · NINDS'},
 {id:'acc',tm:'ref',tag:'Cingulado anterior',deep:1,pin:[488,132],tagAt:[480,112,'r'],say:[514,62,'tl'],
  name:'Cingulado anterior e ínsula',sub:'O detector do diferente',q:'Opa, algo está diferente!',where:'Profundas · face interna e fundo do sulco lateral',
  papel:'Segundo uma teoria influente, o cingulado anterior percebe quando hábito e novo competem e pede mais controle ao pré-frontal. Com a ínsula, forma a rede que destaca o que é relevante.',
  sente:'Estranhamento: aquela sensação de que “tem algo errado aqui”, mesmo quando o novo é melhor.',
  dica:'Antecipe: mostre o que vai mudar, o que não vai mudar e por quê.',
  src:'Botvinick et&nbsp;al. (2001) · Seeley et&nbsp;al. (2007)'},
 {id:'amy',tm:'kn',tag:'Amígdala',deep:1,pin:[508,304],tagAt:[588,316,'l'],say:[516,352,'br'],
  name:'Amígdala',sub:'O alarme',q:'Cuidado! É ameaça?',where:'Profunda · no lobo temporal',
  papel:'Participa da detecção rápida de ameaças e do que é relevante, e dispara reações de defesa, em grande parte sem que a gente perceba.',
  sente:'Tensão e desconfiança. Não saber pesa: num experimento, <b>50% de chance</b> de levar um choque leve estressou mais do que 0% ou 100%.',
  dica:'Reduza a incerteza: diga o que já se sabe, o que ainda não se sabe e quando haverá resposta.',
  src:'LeDoux &amp; Pine (2016) · de Berker et&nbsp;al. (2016)'},
 {id:'bg',tm:'kn',tag:'Gânglios da base',deep:1,pin:[462,224],tagAt:[344,226,'r'],say:[346,200,'tl'],
  name:'Gânglios da base',sub:'O piloto automático',q:'Deixa como sempre foi.',where:'Profundos · no centro do cérebro',
  papel:'Participam da formação de hábitos: com a repetição, o controle passa de um circuito guiado por metas para um circuito automático.',
  sente:'O conforto do “sempre fiz assim”: num estudo com diários, <b>cerca de 4 em cada 10</b> ações se repetiam quase todo dia, no mesmo contexto.',
  dica:'Torne o novo o caminho mais fácil e pratique até virar rotina.',
  src:'Yin &amp; Knowlton (2006) · Wood, Quinn &amp; Kashy (2002) · Schwabe &amp; Wolf (2009)'},
 {id:'da',tm:'nw',tag:'Dopamina',deep:1,pin:[386,336],tagAt:[448,428,'l'],say:[384,378,'bl'],
  name:'Dopamina · recompensa',sub:'O professor',q:'Valeu\u00a0a\u00a0pena? Repete.',where:'Circuito profundo · do mesencéfalo ao estriado e ao pré-frontal',
  papel:'Neurônios de dopamina sinalizam o erro de previsão de recompensa: disparam quando algo sai melhor do que o esperado. Esse sinal ajuda o cérebro a aprender o que vale repetir.',
  sente:'Surpresa boa e vontade de repetir quando o novo funciona melhor do que se esperava.',
  dica:'Planeje vitórias rápidas e visíveis e celebre cada uma: elas mostram, cedo, que o novo compensa.',
  src:'Schultz, Dayan &amp; Montague (1997)'}
];
const KNOT=[50,66,57,40,27,45,80];
const MSG=[
 'Toda mudança puxa o cérebro para dois lados. <em>Quem vence?</em>',
 'O pré-frontal puxa para <em>o novo</em>: ele tem uma meta.',
 'Conflito detectado: o cérebro pede <em>mais controle</em>.',
 'O alarme puxa para trás: <em>incerteza parece ameaça</em>.',
 'Sob estresse, podemos voltar ao <em>piloto automático</em>.',
 'Pequenas vitórias trazem <em>o novo</em> de volta ao jogo.',
 'Com gestão, <em>o novo ganha força</em>: a mudança se conduz.'
];
const N=R.length, LAST=N+1;
const grid=$('.mu-grid',SEC), brain=$('.mu-brain',SEC), pins=$('.mu-pins',SEC), say=$('.mu-say',SEC), pc=$('.mu-pc',SEC),
      rope=$('.tg-rope',SEC), msg=$('.tg-msg',SEC), shout=$('.mu-shout',SEC);
let idx=0,tSay=0;

/* facetas low-poly (eco da capa): Delaunay determinístico, recortado pelo contorno */
(()=>{let s=20261;const rnd=()=>(s=s*16807%2147483647)/2147483647;const P=[];
 for(let y=22,r=0;y<=372;y+=30,r++)for(let x=70+(r%2)*19;x<=650;x+=38)P.push([x+(rnd()-.5)*24,y+(rnd()-.5)*20]);
 [[604,262],[624,222],[626,168],[606,112],[560,66],[490,40],[410,32],[330,38],[252,58],[182,96],[126,150],[96,208],[98,262],[130,302],[190,324],[262,336],[340,348],[420,356],[486,348],[530,326],[544,302],[552,286],[574,280]].forEach(p=>P.push(p));
 const n=P.length,pts=P.concat([[-4e3,-4e3],[4e3,-4e3],[0,4e3]]);
 const cc=t=>{const [a,b,c]=t.map(i=>pts[i]),d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1])),A=a[0]*a[0]+a[1]*a[1],B=b[0]*b[0]+b[1]*b[1],C=c[0]*c[0]+c[1]*c[1],ux=(A*(b[1]-c[1])+B*(c[1]-a[1])+C*(a[1]-b[1]))/d,uy=(A*(c[0]-b[0])+B*(a[0]-c[0])+C*(b[0]-a[0]))/d;return [ux,uy,(a[0]-ux)**2+(a[1]-uy)**2]};
 let T=[[n,n+1,n+2]],Cc=T.map(cc);
 for(let i=0;i<n;i++){const p=pts[i],E=new Map(),nT=[],nC=[];
  T.forEach((t,j)=>{const c=Cc[j];if((p[0]-c[0])**2+(p[1]-c[1])**2<c[2]){[[t[0],t[1]],[t[1],t[2]],[t[2],t[0]]].forEach(([a,b])=>{const k=a<b?a+'_'+b:b+'_'+a;E.has(k)?E.delete(k):E.set(k,[a,b])})}else{nT.push(t);nC.push(c)}});
  E.forEach(([a,b])=>{const t=[a,b,i];nT.push(t);nC.push(cc(t))});T=nT;Cc=nC}
 const g=$('.mu-facets',SEC);let h='',k=0;
 T.filter(t=>t.every(i=>i<n)).forEach(t=>{const q=t.map(i=>pts[i]),cx=(q[0][0]+q[1][0]+q[2][0])/3,cy=(q[0][1]+q[1][1]+q[2][1])/3;
  const L=30-cy/372*11-Math.abs(cx-380)/380*3+(rnd()-.5)*6, S=52+(rnd()-.5)*10;
  h+=`<path d="M${q.map(v=>v[0].toFixed(1)+' '+v[1].toFixed(1)).join('L')}Z" fill="hsl(214 ${S.toFixed(0)}% ${L.toFixed(1)}%)" fill-opacity=".78" style="--i:${k++}"/>`});
 g.innerHTML=h})();

/* pinos, etiquetas e linhas de chamada · o desenho usa translate(-8 8) scale(1.05) */
const XY=([x,y])=>[x*1.05-8,y*1.05+8];
let lead='<svg class="mu-lead" viewBox="0 0 780 500" aria-hidden="true">';
R.forEach((r,i)=>{const sR=$(`.mu-r[data-r="${r.id}"]`,SEC);if(sR)sR.style.setProperty('--ri',i);
 const [px,py]=XY(r.pin),[tx,ty,side]=r.tagAt,ey=ty+14;
 lead+=`<g data-i="${i+1}" style="--ri:${i}"><line x1="${px}" y1="${py}" x2="${tx}" y2="${ey}"/><circle cx="${tx}" cy="${ey}" r="2.2"/></g>`;
 const b=document.createElement('button');b.type='button';b.className='mu-pin';b.dataset.i=i+1;b.style.cssText=`left:${px}px;top:${py}px;--ri:${i}`;b.setAttribute('aria-label',`${i+1} · ${r.name}`);b.innerHTML=`<b>${i+1}</b>`;pins.appendChild(b);
 const t=document.createElement('span');t.className='mu-tag '+side;t.dataset.i=i+1;t.style.cssText=`left:${tx}px;top:${ty}px;--ri:${i}`;t.innerHTML=`<b>${r.tag}</b>${r.deep?'<small>profunda</small>':'<small>superfície</small>'}`;pins.appendChild(t)});
pins.insertAdjacentHTML('afterbegin',lead+'</svg>');
const chip=(r,i)=>`<span class="tc" data-i="${i+1}"><i></i>${r.tag}</span>`;
$('.tm.l',SEC).innerHTML=R.map((r,i)=>r.tm==='kn'?chip(r,i):'').join('');
$('.tm.c',SEC).innerHTML=R.map((r,i)=>r.tm==='ref'?chip(r,i).replace(r.tag,r.tag+' · apita o conflito'):'').join('');
$('.tm.r',SEC).innerHTML=R.map((r,i)=>r.tm==='nw'?chip(r,i):'').join('');

/* painel da direita */
const dots=i=>`<span class="pc-dots">${R.map((_,j)=>`<i class="${j+1===i?'on':''}"></i>`).join('')}</span>`;
const nav=(i,end)=>`<div class="pc-nav"><button type="button" data-go="${i-1}" aria-label="Anterior">←</button>${end?'':`<button type="button" data-go="${i+1}" aria-label="Próximo">→</button>`}</div>`;
function panel(i){
 if(i===0)return `<div class="pc-top"><span class="pc-n">Mapa da mudança</span>${dots(0)}</div>
  <h3 class="pc-h">Quando algo muda, cinco “vozes” do cérebro falam ao mesmo tempo.</h3>
  <div class="pc-list">${R.map((r,j)=>`<button type="button" class="pc-li ${r.tm==='nw'?'nw':''}" data-go="${j+1}"><i>${j+1}</i><span><b>${r.tag}</b><span>“${r.q}”</span></span></button>`).join('')}</div>
  <div class="pc-isa"><div class="char"><div class="idle"><img src="${ISA}" alt="Isabella"></div><i class="floor"></i></div><div class="bubble tail-l"><span class="who">Isabella</span>Qual foi a última mudança que o <b>seu cérebro</b> tentou sabotar?</div></div>
  <div class="pc-foot"><span class="srcx">Simplificação didática: cada região tem muitas funções e trabalha em rede.</span>${nav(0)}</div>`;
 if(i===LAST)return `<div class="pc-top"><span class="pc-n">Síntese</span>${dots(0)}</div>
  <h3 class="pc-big">Mudança não se impõe ao cérebro: <em>se conduz.</em></h3>
  <div class="pc-syn">
   <div><i>1</i><span><b>Clareza</b><span>para o pré-frontal: uma meta nova de cada vez.</span></span></div>
   <div><i>2</i><span><b>Antecipação</b><span>para o detector do diferente: mostrar antes o que muda e por quê.</span></span></div>
   <div><i>3</i><span><b>Previsibilidade</b><span>para o alarme: o que se sabe, o que não se sabe e quando.</span></span></div>
   <div><i>4</i><span><b>Repetição</b><span>para o piloto automático: praticar até virar rotina.</span></span></div>
   <div><i>5</i><span><b>Vitórias visíveis</b><span>para a recompensa: mostrar cedo que o novo funciona.</span></span></div>
  </div>
  <p class="pc-rs">Segundo Rock &amp; Schwartz (2006), incentivo e ameaça raramente sustentam uma mudança no longo prazo. Para eles, o que muda o cérebro é a <b>atenção focada e repetida no novo</b>.<span class="srcx">Rock &amp; Schwartz · strategy+business (2006) · tese dos autores</span></p>
  <div class="pc-foot"><button type="button" class="mu-cta">Vamos testar isso agora? <span>→</span></button>${nav(LAST,1)}</div>`;
 const r=R[i-1];
 return `<div class="pc-top"><span class="pc-n">Voz ${i} de ${N}</span>${dots(i)}</div>
  <h3 class="pc-name">${r.name}</h3><p class="pc-sub">${r.sub}</p>
  <span class="pc-where ${r.deep?'dp':''}"><i></i>${r.where}</span>
  <p class="pc-q ${r.tm==='kn'?'kn':''}">“${r.q}”</p>
  <div class="pc-rows">
   <div class="pc-row"><span class="label">Papel na mudança</span><p>${r.papel}</p></div>
   <div class="pc-row"><span class="label">O que você sente</span><p>${r.sente}</p></div>
   <div class="pc-row pc-tip"><span class="label">Dica de GMO</span><p>${r.dica}</p></div>
  </div>
  <div class="pc-foot"><span class="srcx">${r.src}</span>${nav(i)}</div>`}
const ISA=(()=>{const im=$('.mu-isa-src',SEC);return im?im.getAttribute('src'):'assets/isabella.webp'})();

function sel(i,quiet,late){idx=Math.max(0,Math.min(LAST,i));const r=R[idx-1];clearTimeout(tSay);
 grid.classList.toggle('focus',!!r);brain.classList.toggle('focus',!!r);brain.classList.toggle('all',idx===LAST);brain.classList.toggle('intro',idx===0);
 $$('.mu-r',SEC).forEach(g=>g.classList.toggle('on',!!r&&g.dataset.r===r.id));
 $$('.mu-pin,.mu-tag,.mu-lead g',SEC).forEach(p=>p.classList.toggle('on',+p.dataset.i===idx));
 $$('.tc',SEC).forEach(c=>{c.classList.toggle('on',+c.dataset.i<=idx);c.classList.toggle('cur',+c.dataset.i===idx)});
 shout.style.setProperty('--so',idx===0||idx===1||idx===LAST?1:.25);
 // balão da voz
 const sv=r||(idx===0||idx===LAST?R[0]:null);
 say.classList.remove('show','d-tr','d-tl','d-br','d-bl','nw');
 if(sv){say.textContent=sv.q;say.style.left=sv.say[0]+'px';say.style.top=sv.say[1]+'px';say.classList.add('d-'+sv.say[2]);if(sv.tm==='nw')say.classList.add('nw');void say.offsetWidth;if(late)tSay=setTimeout(()=>say.classList.add('show'),late);else say.classList.add('show')}
 // cabo de guerra
 rope.style.setProperty('--k',KNOT[idx]+'%');rope.classList.remove('shake');if(idx===2){void rope.offsetWidth;rope.classList.add('shake')}
 msg.innerHTML=MSG[idx];msg.classList.remove('mu-sw');void msg.offsetWidth;msg.classList.add('mu-sw');
 // painel
 pc.innerHTML=panel(idx);pc.classList.remove('mu-sw');void pc.offsetWidth;pc.classList.add('mu-sw');
 $$('[data-go]',pc).forEach(b=>{const g=+b.dataset.go;if(g<0||g>LAST)b.disabled=true;b.onclick=()=>{b.blur();sel(g)}});
 const cta=$('.mu-cta',pc);if(cta)cta.onclick=()=>{cta.blur();DECK.next()};
 if(!quiet){if(idx===LAST)ding();else if(r)tone([660,520,300,240,780][idx-1],.14,r.tm==='kn'?'triangle':'sine',.07,r.tm==='kn'?[560,430,250,200,900][idx-1]:[880,700,400,320,1040][idx-1]);else tone(440,.08,'sine',.05)}}

pins.addEventListener('click',e=>{const p=e.target.closest('.mu-pin,.mu-tag');if(!p)return;p.blur?.();const i=+p.dataset.i;sel(idx===i?0:i)});
$('.mu-tug',SEC).addEventListener('click',e=>{const c=e.target.closest('.tc');if(c)sel(+c.dataset.i)});
sel(0,true);

DECK.register('mudanca',{
 enter(){sel(0,true,2300)},
 leave(){sel(0,true);clearTimeout(tSay);say.classList.remove('show')},
 step(d){const n=idx+d;if(n<0||n>LAST)return false;sel(n);return true}});
})();
