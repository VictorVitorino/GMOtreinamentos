(()=>{const {$,$$,tone,ding,boing,stage}=DECK, SEC=DECK.el('tempo');
if(!SEC)return;
/* ---------- 04 · História da mudança: duas raias (o que mudou × como foi conduzida) ---------- */
const q=s=>SEC.querySelector(s), qa=s=>[...SEC.querySelectorAll(s)];
const IC={
 book:'<path d="M3 5.5c3-1.2 6-1 9 1 3-2 6-2.2 9-1v13c-3-1.2-6-1-9 1-3-2-6-2.2-9-1z"/><path d="M12 6.5v13"/>',
 hammer:'<path d="M14.5 3.5l6 6-2.5 2.5-6-6z"/><path d="M12.2 6.2 3.8 14.6a1.8 1.8 0 0 0 2.6 2.6l8.4-8.4"/><path d="M3 21h9"/>',
 bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
 syringe:'<path d="M17.5 2.5l4 4"/><path d="M19.5 4.5l-3.5 3.5"/><path d="M14 5l5 5-9 9H5v-5z"/><path d="M8 12.5l1.8 1.8M11 9.5l1.8 1.8"/><path d="M5 19l-2.5 2.5"/>',
 car:'<path d="M5 16H3v-4l2.5-5h13L21 12v4h-2"/><circle cx="7.5" cy="16.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/><path d="M9.5 16.5h5M4 12h16"/>',
 group:'<circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="9" r="2.5"/><path d="M2.5 19c.7-3.4 3-5 5.5-5s4.8 1.6 5.5 5"/><path d="M14.2 14.5c.7-.3 1.5-.5 2.3-.5 2.2 0 4.2 1.5 4.8 4.5"/>',
 factory:'<path d="M3 20V11l5 3v-3l5 3V5h5v15z"/><path d="M2 20h20"/><path d="M15.5 9h1M15.5 12.5h1"/>',
 scurve:'<path d="M3 19c7 0 6.5-14 18-14"/><circle cx="6.5" cy="18.2" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="17.5" cy="5.8" r="1.3"/>',
 drop:'<path d="M12 3c4 5 6.5 8.2 6.5 11.3a6.5 6.5 0 0 1-13 0C5.5 11.2 8 8 12 3z"/><path d="M9 14.5a3 3 0 0 0 3 3"/>',
 steps:'<path d="M3 20h4.5v-4.5H12V11h4.5V6.5H21"/><path d="M18 3.5l3 3-3 3"/>',
 server:'<rect x="4" y="3.5" width="16" height="7" rx="1.5"/><rect x="4" y="13.5" width="16" height="7" rx="1.5"/><path d="M7.5 7h.01M7.5 17h.01"/><path d="M13 7l2-1.5M13 17l2 1.5"/>',
 badge:'<circle cx="12" cy="9" r="5.5"/><path d="M8.6 13.4 7 21l5-2.6 5 2.6-1.6-7.6"/><path d="M9.8 9l1.5 1.5 3-3"/>',
 phone:'<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M12 8.2l3.2 3.3-3.2 3.3-3.2-3.3z"/><path d="M10.5 18.5h3"/>',
 fly:'<path d="M4 15h16l-1.6 3H5.6z"/><path d="M12 15v-3.5M6 9h12M9 9V7.5M15 9V7.5"/><path d="M4.5 7.5h3M16.5 7.5h3"/>',
 spark:'<path d="M11 3l1.9 5.6 5.6 1.9-5.6 1.9L11 18l-1.9-5.6-5.6-1.9 5.6-1.9z"/><path d="M19 3v4M17 5h4"/>'
};
const KIND={sem:'Sem método',com:'Com método',met:'Como aprendemos',abr:'Em aberto'};
/* l: raia (1 = o que mudou, 2 = como foi conduzida) · k: sem | com | met | abr · f: atrito ilustrativo (0–1)
   a/b: paralelo lado a lado (a = sem método, b = com método) · on: lado em destaque */
const M=[
 {l:1,k:'sem',ic:'bolt',f:.84,y:'1882',yy:'1882 → anos 1920',nm:'Eletrificação<br>das fábricas',
  t:'Eletrificação: trocaram o motor, não o processo',
  w:'A eletricidade chegou às fábricas nos anos 1880, mas o ganho de produtividade só apareceu nos anos 1920.',
  a:{h:'Sem método',t:'primeiras décadas',p:'Trocaram o motor a vapor pelo elétrico e mantiveram o mesmo layout e o mesmo jeito de trabalhar: décadas sem o ganho esperado.',g:["só tecnologia", "processo antigo"]},
  b:{h:'Com método',t:'anos 1920',p:'Redesenharam o chão de fábrica (um motor por máquina), reorganizaram o trabalho e treinaram as pessoas. Aí veio o salto.',g:["redesenho de processo", "treinamento"]},on:'a',
  n:'~40 anos',nk:'entre a usina de Pearl Street (1882) e o ganho de produtividade nas fábricas, nos anos 1920.',
  s:'Paul A. David (1990), American Economic Review 80(2)',
  les:'Tecnologia nova em processo velho não gera resultado.'},
 {l:1,k:'sem',ic:'car',f:.9,y:'1913',yy:'1913–1914',nm:'Ford: linha<br>de montagem',
  t:'Ford: eficiência imposta, gente indo embora',
  w:'A linha de montagem reduziu a montagem do Model T de cerca de 12,5 horas para 93 minutos, mas chegou em ritmo de máquina, sem preparar as pessoas.',
  a:{h:'Sem método',t:'1913',p:'Mudança de processo imposta de cima. A resistência veio em forma de demissões, faltas e recontratações.',g:["imposição", "ritmo de máquina"]},
  b:{h:'Correção tardia',t:'jan/1914',p:'Não houve método, houve remédio caro: a diária foi de US$ 2,34 por 9 horas para US$ 5 por 8 horas, com condições. A rotatividade despencou.',g:["x:preparo das pessoas", "correção reativa"]},on:'a',
  n:'370%',nk:'de rotatividade na Ford em 1913: cerca de 52 mil contratações em um ano para manter uns 14 mil postos.',
  s:'The Henry Ford, “Ford’s Five-Dollar Day” · Raff & Summers (1987)',
  les:'Quem não prepara as pessoas paga a conta depois, e mais caro.'},
 {l:2,k:'met',ic:'steps',f:.32,y:'1994–96',yy:'1994–1996',nm:'Kotter e<br>Prosci/ADKAR',
  t:'Nascem os métodos: Kotter e Prosci/ADKAR',
  w:'Jeff Hiatt funda a Prosci (1994) e cria o ADKAR (1996). Em 1995, Kotter publica na HBR os 8 erros que derrubam transformações; em 1996, as 8 etapas.',
  a:{h:'Os 8 erros',t:'Kotter, 1995',p:'Complacência, coalizão fraca, visão pouco comunicada e vitória declarada cedo demais, observados em mais de 100 empresas.',g:["complacência", "visão mal comunicada"]},
  b:{h:'Com método',t:'1995–1996',p:'Kotter: 8 etapas, da urgência à cultura. ADKAR: Consciência, Desejo, Conhecimento, Habilidade e Reforço, pessoa a pessoa.',g:["8 etapas (Kotter)", "ADKAR"]},on:'b',
  n:'8 + 5',nk:'as 8 etapas de Kotter (a organização) e os 5 elementos do ADKAR (cada pessoa).',
  s:'Kotter, HBR (1995) e Leading Change (1996) · Prosci (ADKAR)',
  les:'A mudança vira disciplina: dá para planejar, e não só torcer.'},
 {l:2,k:'met',ic:'badge',f:.26,y:'2014',yy:'2009 · 2014',nm:'ACMP:<br>profissão',
  t:'A gestão da mudança vira profissão',
  w:'Em 2009, mais de 200 praticantes se reuniram para discutir o que faltava para a gestão da mudança ser reconhecida como profissão. Daí nasceu a ACMP, formalizada em 2011.',
  a:{h:'Antes',t:'cada um por si',p:'Sem padrão comum de práticas e sem certificação profissional.',g:["sem padrão"]},
  b:{h:'Com padrão',t:'set/2014',p:'Standard for Change Management, base da certificação CCMP, construído por consenso internacional. 2ª edição em ago/2025.',g:["padrão comum", "certificação"]},on:'b',
  n:'200+',nk:'praticantes reunidos em 2009 na origem da ACMP. O Standard for Change Management saiu em setembro de 2014.',
  s:'ACMP, “About ACMP” e “Standard for Change Management”',
  les:'Mudar deixa de ser talento individual e vira prática profissional.'},
 {l:1,k:'com',ic:'phone',f:.1,y:'2020',yy:'2018 → 2020',nm:'Pix:<br>pagamentos',
  t:'Pix: um país inteiro, preparado com método',
  w:'O Banco Central preparou o Pix por mais de dois anos. Smartphones e gratuidade ajudaram; a preparação garantiu que milhões já tivessem chave no dia do lançamento.',
  a:{h:'O desafio',t:'um país inteiro',p:'Mudar o jeito de pagar de um país inteiro, com centenas de instituições financeiras no mesmo padrão.',g:["escala nacional", "centenas de instituições"]},
  b:{h:'Com método',t:'2018 → 2020',p:'Patrocínio do BC, mercado ouvido (grupo de trabalho em 2018, Fórum Pix em 2019), adesão obrigatória para as grandes instituições, marca própria e cadastro de chaves 6 semanas antes.',g:["patrocínio", "escuta do mercado", "regra clara", "marca", "preparação"]},on:'b',
  n:'10 mi',nk:'de chaves cadastradas em 2 dias, antes do lançamento. No fim de 2025, 148 milhões de pessoas e 12,8 milhões de empresas já usavam o Pix.',
  s:'Banco Central, Relatório de Gestão do Pix (2026) · imprensa, out/2020',
  les:'A adoção se prepara antes do go-live.'},
 {l:1,k:'abr',ic:'spark',f:.42,y:'2022+',yy:'2022 → 2025',nm:'IA<br>generativa',
  t:'IA generativa: adoção recorde, valor em aberto',
  w:'A IA generativa teve uma das adoções mais rápidas já medidas, em ritmo igual ou maior que o do PC e o da internet. Mas adotar não é capturar valor.',
  a:{h:'Sem método',t:'muito uso',p:'Muito uso, pouco valor: 74% das empresas ainda não tinham valor tangível com IA (BCG, 2024).',g:["distribuir e esperar"]},
  b:{h:'Com método',t:'pessoas e processos',p:'Redesenhar fluxos de trabalho, capacitar, patrocinar e medir. Para a BCG, as líderes seguem a regra 10-20-70: cerca de 70% do esforço em pessoas e processos.',g:["redesenho", "capacitação", "patrocínio", "medição"]},on:'',
  n:'39%',nk:'dos adultos de 18 a 64 anos nos EUA já usavam IA generativa em ago/2024, menos de 2 anos depois do ChatGPT.',
  s:'Bick, Blandin & Deming (2024), NBER w32966 · BCG (out/2024)',
  les:'Adotar a ferramenta não é capturar valor: o resto é gestão da mudança.'},
 {l:1,k:'abr',kl:'Previsão',ic:'fly',f:.38,y:'Futuro?',yy:'Futuro · hipótese',nm:'Carro<br>voador',
  t:'Carro voador: o futuro já tem roteiro',
  w:'Ninguém sabe se, nem quando, o carro voador vai fazer parte do dia a dia. Mas a história mostra o que decide se uma tecnologia assim é adotada ou rejeitada.',
  a:{h:'Sem método',t:'um cenário',p:'Lançam o veículo e esperam a adoção: sem regras claras, sem treinamento e sem confiança. Cada cidade improvisa e o medo cresce.',g:["só tecnologia","regra improvisada","medo"]},
  b:{h:'Com método',t:'o outro cenário',p:'Preparam as pessoas antes: regras e rotas claras, treinamento e certificação, pilotos em pequena escala, comunicação aberta e reforço do uso seguro.',g:["regras claras","treinamento","piloto pequeno","confiança"]},on:'',
  n:'Hipótese',nt:1,nk:'um exercício para discutir, não um fato: vale o que a história já mostrou nos outros marcos.',
  s:'Hipótese ilustrativa do treinamento, sem dado',
  les:'A tecnologia chega rápido; a confiança chega com método.'}
];

/* ---------- geometria (px do palco; .hx-tl tem 1520 × 330) ---------- */
const N=M.length, X0=196, X1=1468, AX=204, RX0=150, RX1=1514, D=(X1-X0)/(N-1);
const XS=M.map((_,i)=>X0+i*D), F=M.map(m=>m.f);
function fAt(x){if(x<=XS[0])return F[0];if(x>=XS[N-1])return F[N-1];const i=Math.min(N-2,Math.floor((x-X0)/D)),t=(x-XS[i])/D,s=(1-Math.cos(Math.PI*t))/2;return F[i]+(F[i+1]-F[i])*s}
function hAt(x){const hb=5+18*fAt(x),d=Math.min(x-RX0,RX1-x);if(d>=hb)return hb;const t=Math.max(0,d/hb);return Math.max(.6,hb*Math.sqrt(1-(1-t)*(1-t)))}
/* cor do atrito: navy calmo → laranja → vermelho-alaranjado intenso */
const RAMP=[[0,[42,90,150]],[.3,[74,111,165]],[.5,[163,128,140]],[.66,[242,138,76]],[.82,[242,107,33]],[1,[226,66,34]]];
function col(f){for(let i=1;i<RAMP.length;i++)if(f<=RAMP[i][0]){const [a,ca]=RAMP[i-1],[b,cb]=RAMP[i],t=(f-a)/(b-a);return 'rgb('+ca.map((v,j)=>Math.round(v+(cb[j]-v)*t)).join(',')+')'}return 'rgb(226,66,34)'}

const tl=q('#hxTl'), ghost=q('#hxGhost'), lit=q('#hxLit'), onL=q('#hxOn'), isa=q('#hxIsa'), det=q('#hxDet');
function ribbonD(){const top=[],bot=[];for(let x=RX0;x<=RX1;x+=(x-RX0<30||RX1-x<30?1:4)){const h=hAt(x);top.push(x.toFixed(1)+' '+(AX-h).toFixed(1));bot.unshift(x.toFixed(1)+' '+(AX+h).toFixed(1))}return {d:'M'+top.join('L')+'L'+bot.join('L')+'Z',edge:'M'+top.join('L')}}
(function draw(){const r=ribbonD(),stops=M.map((m,i)=>`<stop offset="${((XS[i]-RX0)/(RX1-RX0)).toFixed(4)}" stop-color="${col(m.f)}"/>`).join('');
 const grad=id=>`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${RX0}" y1="0" x2="${RX1}" y2="0"><stop offset="0" stop-color="${col(F[0])}"/>${stops}<stop offset="1" stop-color="${col(F[N-1])}"/></linearGradient>`;
 const brk='';
 let st='';M.forEach((m,i)=>{const x=XS[i],h=hAt(x);
  if(m.l===1)st+=`<line class="st l1 k-${m.k}" data-i="${i}" style="--hl:${Math.max(0,AX-h-86-95).toFixed(1)}px" x1="${x}" y1="95" x2="${x}" y2="${(AX-h-3).toFixed(1)}"/>`;
  else st+=`<line class="st k-${m.k}" data-i="${i}" x1="${x}" y1="${(AX+h+3).toFixed(1)}" x2="${x}" y2="237"/>`;
  if(i<=1)st+=`<line class="st sp k-sem" data-i="${i}" x1="${x}" y1="${(AX+h+3).toFixed(1)}" x2="${x}" y2="251"/>`});
 ghost.innerHTML=`<defs>${grad('hxGg')}</defs><line x1="${RX0}" y1="${AX}" x2="${RX1}" y2="${AX}" stroke="rgba(163,184,214,.25)" stroke-width="1"/>
  <path d="${r.d}" fill="url(#hxGg)" opacity=".3"/>${st}`;
 lit.innerHTML=`<defs>${grad('hxGl')}<filter id="hxBlur" x="-5%" y="-200%" width="110%" height="500%"><feGaussianBlur stdDeviation="7"/></filter></defs>
  <path d="${r.d}" fill="url(#hxGl)" opacity=".55" filter="url(#hxBlur)"/><path d="${r.d}" fill="url(#hxGl)"/><path d="${r.edge}" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.2"/>${brk}`})();

/* chips e nós */
M.forEach((m,i)=>{const c=document.createElement('button');c.type='button';c.className=`hx-chip l${m.l} k-${m.k}`;c.style.left=XS[i]+'px';c.dataset.i=i;
 c.setAttribute('aria-label',`${m.yy}: ${m.t}`);
 c.innerHTML=`<span class="ic"><svg viewBox="0 0 24 24">${IC[m.ic]}</svg></span><span class="y">${m.y}</span><span class="n">${m.nm}</span>`;c.onclick=()=>sel(i);tl.appendChild(c);
 const n=document.createElement('button');n.type='button';n.className=`hx-node k-${m.k}`;n.style.left=XS[i]+'px';n.dataset.i=i;n.setAttribute('aria-label',m.yy);n.onclick=()=>sel(i);tl.appendChild(n)});
const spanA=q('#hxSpanA'),spanB=q('#hxSpanB');
spanA.style.left=(XS[0]-46)+'px';spanA.style.width=(XS[1]-XS[0]+92)+'px';
spanB.style.left=(XS[4]-46)+'px';spanB.style.width=(RX1-XS[4]+46)+'px';
const note=document.createElement('div');note.className='hx-note';note.style.left=(XS[2]-44)+'px';note.style.width=(XS[3]-XS[2]+88)+'px';
note.innerHTML='<b>Enquanto isso, a ciência estuda como as pessoas mudam</b><span>veja a raia de baixo ↓</span>';tl.appendChild(note);
const chips=qa('.hx-chip'),nodes=qa('.hx-node'),stems=()=>qa('.hx-svg .st');

/* ---------- Isabella caminha sobre a faixa ---------- */
let ix=XS[0],raf=0;
const place=x=>{isa.style.transform=`translate(${(x-18).toFixed(1)}px,${(AX-hAt(x)-82).toFixed(1)}px)`};
const reveal=(x,ms)=>{onL.style.transitionDuration=ms+'ms';onL.style.width=Math.min(1556,x+44).toFixed(0)+'px'};
function walk(x,instant,rx){cancelAnimationFrame(raf);isa.classList.remove('walk','hop');const R=rx||x;
 if(instant){ix=x;place(x);reveal(R,0);return}
 const x0=ix,dx=x-x0,dur=420+Math.min(1100,Math.abs(dx)*2.4),t0=performance.now();reveal(Math.max(R,x0),dur);
 if(!dx){isa.classList.add('hop');return}
 isa.classList.add('walk');
 const f=t=>{const k=Math.min(1,(t-t0)/dur),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;ix=x0+dx*e;place(ix);
  if(k<1)raf=requestAnimationFrame(f);else{isa.classList.remove('walk');void isa.offsetWidth;isa.classList.add('hop');reveal(R,300)}};
 raf=requestAnimationFrame(f)}

/* ---------- filtro (Data Highlight) ---------- */
let flt='all';
const match=m=>flt==='all'||(flt==='sem'?m.k==='sem':(m.k==='com'||m.k==='met'));
const HINT={all:'Clique num marco ou avance com <kbd>→</kbd>',sem:'2 mudanças sem preparar as pessoas',com:'3 marcos com método: participação, comunicação, patrocínio'};
function setFlt(f,quiet){flt=f;qa('.hx-flt button').forEach(b=>b.classList.toggle('on',b.dataset.f===f));
 M.forEach((m,i)=>{const ok=match(m),act=f!=='all';chips[i].classList.toggle('dim',act&&!ok);chips[i].classList.toggle('hx-hl',act&&ok);nodes[i].classList.toggle('dim',act&&!ok)});
 stems().forEach(s=>s.classList.toggle('dim',f!=='all'&&!match(M[+s.dataset.i])));
 spanA.classList.toggle('dim',f==='com');spanB.classList.toggle('dim',f==='sem');note.classList.toggle('dim',f==='sem');
 det.classList.toggle('f-sem',f==='sem');det.classList.toggle('f-com',f==='com');
 q('#hxHint').innerHTML=HINT[f];sides();if(!quiet)tone(f==='sem'?330:f==='com'?660:520,.12,'sine',.06)}
qa('.hx-flt button').forEach(b=>b.onclick=()=>setFlt(b.dataset.f));
function sides(){const m=M[idx]||{},A=q('.hx-side.a'),B=q('.hx-side.b');let on=m.on||'';if(flt==='sem')on='a';if(flt==='com')on='b';
 A.classList.toggle('on',on==='a');B.classList.toggle('on',on==='b');A.classList.toggle('off',flt==='com');B.classList.toggle('off',flt==='sem')}

/* ---------- seleção ---------- */
let idx=0;
const setT=(id,v,html)=>{const el=q(id);if(html)el.innerHTML=v;else el.textContent=v};
function fitN(el){let fs=76;el.style.fontSize='';if(el.classList.contains('txt'))return;el.style.fontSize=fs+'px';while(el.scrollWidth>el.clientWidth+1&&fs>40){fs-=4;el.style.fontSize=fs+'px'}}
const tags=g=>(g||[]).map(t=>t.startsWith('x:')?`<span class="x">faltou: ${t.slice(2)}</span>`:`<span>${t}</span>`).join('');
function meter(f){const W=q('#hxMt');W.innerHTML=Array.from({length:10},(_,j)=>`<i style="${j<Math.round(f*10)?'background:'+col(f)+';box-shadow:0 0 8px '+col(f):''}"></i>`).join('');
 q('#hxMv').textContent=f>=.8?'alto':f>=.6?'médio-alto':f>=.4?'médio':'baixo';q('#hxMv').style.color=col(Math.max(f,.35))}
function anim(){qa('.hx-det .hx-sw').forEach((el,j)=>{el.classList.remove('swap','d1','d2','d3');void el.offsetWidth;el.classList.add('swap','d'+Math.min(3,j))})}
function sel(i,quiet,instant){idx=i;const fin=i===N;det.classList.toggle('fin',fin);q('#hxFin').setAttribute('aria-hidden',!fin);
 chips.forEach((c,j)=>c.classList.toggle('on',j===i));nodes.forEach((n,j)=>{n.classList.toggle('on',j===i);n.classList.toggle('past',j<i)});
 stems().forEach(s=>s.classList.toggle('on',+s.dataset.i===i));
 spanB.classList.toggle('lit',fin);
 if(fin){qa('.hx-det .hx-sw').forEach(el=>el.classList.remove('swap','d1','d2','d3'));walk(RX1-24,instant,1556);if(!quiet)ding();return}
 const m=M[i];
 const K=q('#hxK');K.className='hx-kind k-'+m.k;K.textContent=m.kl||KIND[m.k];
 setT('#hxY',m.yy);setT('#hxT',m.t);setT('#hxW',m.w);
 setT('#hxAh',m.a.h);setT('#hxAt',m.a.t);setT('#hxAp',m.a.p);setT('#hxBh',m.b.h);setT('#hxBt',m.b.t);setT('#hxBp',m.b.p);
 q('#hxAg').innerHTML=tags(m.a.g);q('#hxBg').innerHTML=tags(m.b.g);meter(m.f);
 setT('#hxL',m.les);const n=q('#hxN');n.classList.toggle('txt',!!m.nt);setT('#hxN',m.n);fitN(n);setT('#hxNk',m.nk);setT('#hxS','Fonte: '+m.s);
 sides();anim();walk(XS[i],instant);
 if(!quiet)tone(m.k==='sem'?300+i*14:520+i*22,.11,m.k==='sem'?'triangle':'sine',.06)}

DECK.register('tempo',{
 enter(){setFlt('all',true);sel(0,true,true)},
 leave(){cancelAnimationFrame(raf);isa.classList.remove('walk','hop');setFlt('all',true)},
 step(d){const n=idx+d;if(n<0||n>N)return false;sel(n);return true}
});
sel(0,true,true);
})();
