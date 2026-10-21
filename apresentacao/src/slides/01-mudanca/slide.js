(()=>{const {$,$$,tone,ding,boing,stage}=DECK, SEC=DECK.el('mudanca');
/* ---------- 01 · mudança: o cérebro na mudança (mapa ilustrativo) ---------- */
// time: 'nw' = puxa para o novo · 'kn' = puxa para o conhecido · 'ref' = apita o conflito
const R=[
 {id:'pfc',tm:'nw',tag:'Pré-frontal',deep:0,pin:[596,112],tagAt:[664,34,'l'],say:[668,140,'tr'],
  name:'Córtex pré-frontal',sub:'A voz que pede a mudança',q:'Quero mudar!',where:'Superfície · atrás da testa',
  papel:'Mantém a meta nova ativa e orienta o resto do cérebro a agir de acordo com ela. Na metáfora do slide, é a voz do “eu quero diferente”.',
  sente:'Vontade e clareza, mas também esforço: a memória de trabalho segura <b>pouquíssimas coisas</b> ao mesmo tempo.',
  dica:'Poucas prioridades, claras e repetidas. Uma meta nova de cada vez cabe na cabeça.',
},
 {id:'acc',tm:'ref',tag:'Cingulado anterior',deep:1,pin:[488,132],tagAt:[480,112,'r'],say:[514,62,'tl'],
  name:'Cingulado anterior e ínsula',sub:'O detector do diferente',q:'Opa, algo está diferente!',where:'Profundas · face interna do cérebro',
  papel:'Percebe quando hábito e novo competem e pede mais controle ao pré-frontal. Com a ínsula, forma a rede que destaca o que é relevante no momento.',
  sente:'Estranhamento: aquela sensação de que “tem algo errado aqui”, mesmo quando o novo é melhor.',
  dica:'Antecipe: mostre o que vai mudar, o que não vai mudar e por quê.',
},
 {id:'amy',tm:'kn',tag:'Amígdala',deep:1,pin:[508,304],tagAt:[588,316,'l'],say:[516,352,'br'],
  name:'Amígdala',sub:'O alarme',q:'Cuidado! É ameaça?',where:'Profunda · lobo temporal',
  papel:'Participa da detecção rápida de ameaças e do que é relevante, e dispara reações de defesa, em grande parte sem que a gente perceba.',
  sente:'Tensão e desconfiança. Não saber pesa: <b>a incerteza estressa mais</b> do que a certeza de algo ruim.',
  dica:'Reduza a incerteza: diga o que já se sabe, o que ainda não se sabe e quando haverá resposta.',
},
 {id:'bg',tm:'kn',tag:'Gânglios da base',deep:1,pin:[462,224],tagAt:[344,226,'r'],say:[346,200,'tl'],
  name:'Gânglios da base',sub:'O piloto automático',q:'Deixa como sempre foi.',where:'Profundos · centro do cérebro',
  papel:'Participam da formação de hábitos: com a repetição, o controle passa de um circuito guiado por metas para um circuito automático.',
  sente:'O conforto do “sempre fiz assim”: <b>boa parte do nosso dia</b> se repete sozinha, sempre no mesmo contexto.',
  dica:'Torne o novo o caminho mais fácil e pratique até virar rotina.',
},
 {id:'da',tm:'nw',tag:'Dopamina',deep:1,pin:[386,336],tagAt:[448,428,'l'],say:[384,378,'bl'],
  name:'Dopamina · recompensa',sub:'O professor',q:'Valeu\u00a0a\u00a0pena? Repete.',where:'Circuito profundo · mesencéfalo',
  papel:'Os neurônios de dopamina disparam quando algo sai <i>melhor</i> do que o esperado. Esse sinal ensina o cérebro o que vale a pena repetir.',
  sente:'Surpresa boa e vontade de repetir quando o novo funciona melhor do que se esperava.',
  dica:'Planeje vitórias rápidas e visíveis e celebre cada uma: elas mostram, cedo, que o novo compensa.',
}
];
/* posição do nó, em % da corda: <50 puxa para o conhecido, >50 para o novo */
const KNOT=[50,66,57,40,27,45,80];
const CORD=[222,900], KX=k=>CORD[0]+(CORD[1]-CORD[0])*k/100-561;
const MSG=[
 'Toda mudança puxa o cérebro para dois lados. <em>Quem vence?</em>',
 'O pré-frontal puxa para <em>o novo</em>: ele tem uma meta.',
 'Conflito detectado: o cérebro pede <em>mais controle</em>.',
 'O alarme puxa para o conhecido: <em>incerteza parece ameaça</em>.',
 'Sob estresse, podemos voltar ao <em>piloto automático</em>.',
 'Pequenas vitórias trazem <em>o novo</em> de volta ao jogo.',
 'Com gestão, <em>o novo ganha força</em>: a mudança se conduz.'
];
const N=R.length, LAST=N+1;
const grid=$('.mu-grid',SEC), brain=$('.mu-brain',SEC), pins=$('.mu-pins',SEC), say=$('.mu-say',SEC), pc=$('.mu-pc',SEC),
      tug=$('.mu-tug',SEC), knot=$('.tg-knot',SEC), figL=$('.tg-fig.l',SEC), figR=$('.tg-fig.r',SEC),
      msg=$('.tg-msg',SEC), shout=$('.mu-shout',SEC);
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

/* pinos, etiquetas e linhas de chamada · o desenho usa translate(-8 8) scale(1.05)
   e o SVG é exibido a S do tamanho do viewBox (cérebro ~20% menor) */
const S=.8, V=([x,y])=>[x*1.05-8,y*1.05+8];
let lead='<svg class="mu-lead" viewBox="0 0 780 500" aria-hidden="true">';
R.forEach((r,i)=>{const sR=$(`.mu-r[data-r="${r.id}"]`,SEC);if(sR)sR.style.setProperty('--ri',i);
 const [px,py]=V(r.pin),[tx,ty,side]=r.tagAt,ey=ty+14;
 lead+=`<g data-i="${i+1}" style="--ri:${i}"><line x1="${px}" y1="${py}" x2="${tx}" y2="${ey}"/><circle cx="${tx}" cy="${ey}" r="2.2"/></g>`;
 const b=document.createElement('button');b.type='button';b.className='mu-pin';b.dataset.i=i+1;b.style.cssText=`left:${px*S}px;top:${py*S}px;--ri:${i}`;b.setAttribute('aria-label',`${i+1} · ${r.name}`);b.innerHTML=`<b>${i+1}</b>`;pins.appendChild(b);
 const t=document.createElement('span');t.className='mu-tag '+side;t.dataset.i=i+1;t.style.cssText=`left:${tx*S}px;top:${ty*S}px;--ri:${i}`;t.innerHTML=`<b>${r.tag}</b>${r.deep?'<small>profunda</small>':'<small>superfície</small>'}`;pins.appendChild(t)});
pins.insertAdjacentHTML('afterbegin',lead+'</svg>');
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
  <p class="pc-rs">Incentivo e ameaça raramente sustentam uma mudança no longo prazo. O que muda o cérebro é a <b>atenção focada e repetida no novo</b> — e isso é trabalho de condução, não de anúncio.</p>
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
  <div class="pc-foot"><span class="srcx">Quem resiste é o cérebro, não a pessoa.</span>${nav(i)}</div>`}
const ISA=(()=>{const im=$('.mu-isa-src',SEC);return im?im.getAttribute('src'):'assets/isabella.webp'})();

function sel(i,quiet,late){idx=Math.max(0,Math.min(LAST,i));const r=R[idx-1];clearTimeout(tSay);
 grid.classList.toggle('focus',!!r);brain.classList.toggle('focus',!!r);brain.classList.toggle('all',idx===LAST);brain.classList.toggle('intro',idx===0);
 $$('.mu-r',SEC).forEach(g=>g.classList.toggle('on',!!r&&g.dataset.r===r.id));
 $$('.mu-pin,.mu-tag,.mu-lead g',SEC).forEach(p=>p.classList.toggle('on',+p.dataset.i===idx));
  shout.style.setProperty('--so',idx===0||idx===1||idx===LAST?1:.25);
 // balão da voz
 const sv=r||(idx===0||idx===LAST?R[0]:null);
 say.classList.remove('show','d-tr','d-tl','d-br','d-bl','nw');
 if(sv){say.textContent=sv.q;say.style.left=sv.say[0]*S+'px';say.style.top=sv.say[1]*S+'px';say.classList.add('d-'+sv.say[2]);if(sv.tm==='nw')say.classList.add('nw');void say.offsetWidth;if(late)tSay=setTimeout(()=>say.classList.add('show'),late);else say.classList.add('show')}
 // cabo de guerra: o nó anda para o lado que está puxando e os personagens se inclinam
 const k=KNOT[idx], ln=(50-k)/50;
 knot.style.setProperty('--kx',KX(k).toFixed(1)+'px');
 figL.style.setProperty('--ln',(-ln*7).toFixed(2)+'deg');figL.style.setProperty('--tx',(-ln*11).toFixed(1)+'px');
 figR.style.setProperty('--ln',(-ln*7).toFixed(2)+'deg');figR.style.setProperty('--tx',(-ln*11).toFixed(1)+'px');
 tug.classList.toggle('win-kn',k<49);tug.classList.toggle('win-nw',k>51);
 knot.classList.remove('shake');if(idx===2){void knot.getBoundingClientRect();knot.classList.add('shake')}
 msg.innerHTML=MSG[idx];msg.classList.remove('mu-sw');void msg.offsetWidth;msg.classList.add('mu-sw');
 // painel
 pc.innerHTML=panel(idx);pc.classList.remove('mu-sw');void pc.offsetWidth;pc.classList.add('mu-sw');
 $$('[data-go]',pc).forEach(b=>{const g=+b.dataset.go;if(g<0||g>LAST)b.disabled=true;b.onclick=()=>{b.blur();sel(g)}});
 const cta=$('.mu-cta',pc);if(cta)cta.onclick=()=>{cta.blur();DECK.next()};
 if(!quiet){if(idx===LAST)ding();else if(r)tone([660,520,300,240,780][idx-1],.14,r.tm==='kn'?'triangle':'sine',.07,r.tm==='kn'?[560,430,250,200,900][idx-1]:[880,700,400,320,1040][idx-1]);else tone(440,.08,'sine',.05)}}

pins.addEventListener('click',e=>{const p=e.target.closest('.mu-pin,.mu-tag');if(!p)return;p.blur?.();const i=+p.dataset.i;sel(idx===i?0:i)});
sel(0,true);

DECK.register('mudanca',{
 enter(){sel(0,true,2300)},
 leave(){window.__muAnat?.close(true);sel(0,true);clearTimeout(tSay);say.classList.remove('show')},
 step(d){if(window.__muAnat?.step(d))return true;const n=idx+d;if(n<0||n>LAST)return false;sel(n);return true}});

/* ---------- Anatomia · Córtex: vídeo + marcações ---------- */
(()=>{
const btn=$('#muAnatBtn',SEC), ov=$('#muAnat',SEC), vid=$('#maVid',SEC), zoom=$('#maZoom',SEC), layer=$('#maLayer',SEC), marks=$('#maMarks',SEC), list=$('#maList',SEC), card=$('#maCard',SEC), cap=$('#maCap',SEC);
const SIMPLES={
 pfc:'É o <b>planejador</b>: guarda a meta nova e decide o que fazer para chegar lá. É o “GPS” da mudança.',
 acc:'É o <b>detector do diferente</b>: percebe quando o jeito novo briga com o hábito e avisa o resto do cérebro.',
 amy:'É o <b>alarme</b>: quando não sabe o que vem pela frente, trata a novidade como um possível perigo.',
 bg:'É o <b>piloto automático</b>: guarda o que fazemos sem pensar. Por isso o hábito antigo é tão confortável.',
 da:'É o <b>professor</b>: quando algo dá mais certo do que o esperado, libera um “sinal de recompensa” que ensina o cérebro a repetir.'};
const NS='http://www.w3.org/2000/svg', mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e};
// coordenadas no quadro do vídeo (854×480): pin = marcador; tag = canto do rótulo; lp = ponto de ligação do rótulo
const P={
 pfc:{pin:[236,190],tag:[22,66],lp:[132,82],ti:'superfície'},
 acc:{pin:[330,168],tag:[258,20],lp:[314,44],ti:'profunda'},
 amy:{pin:[338,284],tag:[22,334],lp:[132,346],ti:'profunda'},
 bg:{pin:[416,220],tag:[566,150],lp:[566,162],ti:'profunda'},
 da:{pin:[472,336],tag:[594,398],lp:[594,410],ti:'profunda'}};
const W=[['pfc','acc','nw',-26],['acc','bg','mx',-22],['bg','amy','kn',24],['amy','pfc','kn',30],['da','pfc','nw',-60],['da','bg','nw',-18]];
const T={nw:'o novo',kn:'o conhecido',ref:'o conflito'};
let built=false,A={open:false,sel:0,ready:false};
const pc=(x,y)=>[(x/854*100)+'%',(y/480*100)+'%'];
function build(){ if(built)return; built=true;
 // moldura + brilho do pré-frontal
 const g=mk('g',{});layer.appendChild(g);
 g.appendChild(mk('path',{class:'ma-pf',d:'M150 208 C150 140 196 84 266 66 C318 54 352 90 346 152 C340 212 336 262 298 292 C248 312 176 292 150 208Z'}));
 [[150,70,'M150 92V70H172'],[322,70,'M300 70H322V92'],[150,300,'M150 278V300H172'],[322,300,'M300 300H322V278']].forEach(([x,y,d])=>g.appendChild(mk('path',{class:'ma-corner',d})));
 R.forEach((r,i)=>{const p=P[r.id],k=i;
  const deep=r.id!=='pfc';
  if(deep){g.appendChild(mk('circle',{class:'ma-deep '+(r.tm==='nw'?'nw':''),cx:p.pin[0],cy:p.pin[1],r:i===3?34:26,style:`--k:${k}`,'data-i':i+1}))}
  const lead=mk('path',{class:'ma-lead',d:`M${p.lp[0]} ${p.lp[1]} L${p.pin[0]} ${p.pin[1]}`,'data-i':i+1});g.appendChild(lead)});
 W.forEach(([a,b,t,bend],j)=>{const A_=P[a].pin,B_=P[b].pin,mx=(A_[0]+B_[0])/2,my=(A_[1]+B_[1])/2,dx=B_[0]-A_[0],dy=B_[1]-A_[1],L=Math.hypot(dx,dy)||1,cx=mx-dy/L*bend*2,cy=my+dx/L*bend*2;
  const w=mk('path',{class:'ma-wire '+t,d:`M${A_[0]} ${A_[1]} Q${cx} ${cy} ${B_[0]} ${B_[1]}`,style:`--k:${j}`,'data-a':a,'data-b':b});g.appendChild(w)});
 R.forEach((r,i)=>{const p=P[r.id],[lx,ly]=pc(...p.pin),[tx,ty]=pc(...p.tag);
  const pin=document.createElement('button');pin.type='button';pin.className='ma-pin '+r.tm;pin.dataset.i=i+1;pin.style.cssText=`left:${lx};top:${ly};--k:${i}`;pin.textContent=i+1;pin.setAttribute('aria-label',r.name);
  const tag=document.createElement('button');tag.type='button';tag.className='ma-tag '+r.tm;tag.dataset.i=i+1;tag.style.cssText=`left:${tx};top:${ty};--k:${i}`;tag.innerHTML=`${r.tag}<i>${p.ti}</i>`;
  marks.append(pin,tag);
  const li=document.createElement('li');li.innerHTML=`<button type="button" data-i="${i+1}"><i class="${r.tm}">${i+1}</i><div><b>${r.name}</b><span>${r.sub}</span></div></button>`;list.appendChild(li)});
 marks.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(!b)return;b.blur();const i=+b.dataset.i;selA(A.sel===i?0:i)});
 list.addEventListener('click',e=>{const b=e.target.closest('button[data-i]');if(!b)return;b.blur();const i=+b.dataset.i;selA(A.sel===i?0:i)});
}
function selA(n){A.sel=n;
 $$('.ma-pin,.ma-tag',ov).forEach(e=>e.classList.toggle('on',+e.dataset.i===n));
 $$('.ma-deep,.ma-lead',ov).forEach(e=>e.classList.toggle('on',+e.dataset.i===n));
 const id=n?R[n-1].id:null;
 $$('.ma-wire',ov).forEach(w=>w.classList.toggle('on',!!id&&(w.dataset.a===id||w.dataset.b===id)));
 $$('button[data-i]',list).forEach(b=>b.classList.toggle('on',+b.dataset.i===n));
 zoom.classList.toggle('focus',n>0);zoom.classList.toggle('f0',n===0);
 if(n){const p=P[R[n-1].id].pin;zoom.style.setProperty('--zo','50% 50%');zoom.style.setProperty('--z',1.06)}else{zoom.style.setProperty('--z',1)}
 if(!n){card.innerHTML=`<span class="ct">Visão geral</span><h4>Cinco regiões, uma só mudança</h4><p>Clique numa região, na lista ou use <b>→</b>. As laranjas puxam para <b>o novo</b>; as azuis, para <b>o conhecido</b>.</p><div class="lg"><span><i style="background:var(--orange-400)"></i>o novo</span><span><i style="background:var(--steel-200)"></i>o conhecido</span></div>`}
 else{const r=R[n-1];card.innerHTML=`<span class="ct">Voz ${n} de ${R.length}</span><span class="cw">${r.where||''}</span><h4>${r.name}</h4><q>${r.q}</q><span class="cs">Em palavras simples</span><p>${SIMPLES[r.id]}</p><div class="ctip"><b>Dica de GMO</b>${r.dica}</div>`}
 if(n)tone(560+n*70,.09,'sine',.05)}
const CAPS=[[0,'1 · Superfície'],[2.9,'2 · Músculos e vasos'],[5.6,'3 · Crânio'],[8.2,'4 · O cérebro']];
function showCap(t){const c=[...CAPS].reverse().find(x=>t>=x[0]);if(c&&cap.textContent!==c[1])cap.textContent=c[1]}
function ready(){if(A.ready)return;A.ready=true;ov.classList.add('ready');cap.textContent='Córtex · cinco regiões';selA(0)}
vid.addEventListener('timeupdate',()=>{if(!A.ready)showCap(vid.currentTime)});
vid.addEventListener('ended',ready);
function play(){vid.playbackRate=1.5;A.ready=false;ov.classList.remove('ready');zoom.classList.remove('focus');zoom.style.setProperty('--z',1);selA(0);cap.textContent=CAPS[0][1];try{vid.currentTime=0}catch(e){}const p=vid.play();if(p&&p.catch)p.catch(()=>ready())}
function skip(){try{vid.pause();vid.currentTime=Math.max(0,(vid.duration||12.4)-0.04)}catch(e){}ready()}
function openA(){build();if(A.open)return;A.open=true;ov.classList.add('on');ov.removeAttribute('inert');ov.setAttribute('aria-hidden','false');btn.setAttribute('aria-expanded','true');btn.querySelector('span').textContent='Fechar anatomia';play();tone(420,.18,'triangle',.07,760)}
function closeA(quiet){if(!A.open)return;A.open=false;ov.classList.remove('on');ov.setAttribute('inert','');ov.setAttribute('aria-hidden','true');btn.setAttribute('aria-expanded','false');btn.querySelector('span').textContent='Anatomia · Córtex';try{vid.pause()}catch(e){}if(!quiet)tone(500,.14,'triangle',.06,300)}
btn.addEventListener('click',()=>{btn.blur();A.open?closeA():openA()});
$('#maX',SEC).addEventListener('click',()=>closeA());
$('#maSkip',SEC).addEventListener('click',e=>{e.currentTarget.blur();skip()});
$('#maReplay',SEC).addEventListener('click',e=>{e.currentTarget.blur();play()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&A.open)closeA()});
// ganchos: o slide passa a delegar passos/saída para a anatomia quando ela está aberta
window.__muAnat={open:()=>A.open,step(d){if(!A.open)return false;if(!A.ready){if(d>0)skip();return true}const n=A.sel+d;if(n<0||n>R.length){closeA();return true}selA(n);return true},close:closeA};
})();
})();
