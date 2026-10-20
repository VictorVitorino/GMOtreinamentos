(()=>{const {$,$$,tone,ding,boing,stage}=DECK, SEC=DECK.el('gestao');
/* ---------- 03 · Gestão da Mudança: mudar é um evento, sustentar é gestão ----------
   passos (→): 1 junta as palavras · 2 curva sem gestão · 3 curva com gestão · 4 destaca as razões */
const NS='http://www.w3.org/2000/svg';
const plot=$('.gs-plot',SEC), svg=$('.gs-svg',SEC), bub=$('.gs-bub',SEC), say=$('.gs-say',SEC), who=$('.who',bub);
const SAY=[
 ['Isabella pergunta','A sala ficou linda. <b>E daqui a 15 dias?</b> Quem já arrumou o armário e viu a bagunça voltar?'],
 ['Isabella','<b>Gerir</b> vem de <i>gerere</i>: levar adiante. Não basta começar a mudança: é preciso levá-la até o fim.'],
 ['Isabella','Sem ninguém cuidando, a bagunça volta. É o <b>efeito sanfona</b>: arruma, desarruma, arruma de novo.'],
 ['Isabella','Arrumar foi o evento. <b>Manter arrumada é a gestão:</b> conduzir, medir e reforçar até virar hábito.'],
 ['Isabella','Na empresa, a “sala” é o sistema novo: sem adoção, ele entrega zero. <b>E como a humanidade aprendeu a gerir isso?</b>']
];
/* curvas ILUSTRATIVAS: [dia, % do estado novo] */
const SEM=[[1,100],[6,90],[12,73],[18,60],[24,51],[29,47],[32,84],[37,70],[44,55],[52,43],[58,38],[62,60],[67,47],[74,34],[82,26],[90,21]];
const COM=[[1,100],[5,92],[10,84],[15,87],[22,91],[30,93.5],[40,95],[52,96],[66,97],[78,97.5],[90,98]];
let st=0, view='none', G=null, drawn={sem:false,com:false}, anim={sem:0,com:0}, timers=[];
const tw=(t,f)=>{try{const L=t.getComputedTextLength();return L>4?L:f}catch(e){return f}};
const el=(tag,attrs,parent,txt)=>{const n=document.createElementNS(NS,tag);for(const k in attrs)n.setAttribute(k,attrs[k]);if(txt!=null)n.textContent=txt;if(parent)parent.appendChild(n);return n};
/* curva monotônica (Fritsch–Carlson): suave e sem ultrapassar os pontos */
function mono(P){const n=P.length,dx=[],m=[],t=[];for(let i=0;i<n-1;i++){dx[i]=P[i+1][0]-P[i][0];m[i]=(P[i+1][1]-P[i][1])/dx[i]}
 t[0]=m[0];t[n-1]=m[n-2];for(let i=1;i<n-1;i++)t[i]=m[i-1]*m[i]<=0?0:3*(dx[i-1]+dx[i])/((2*dx[i]+dx[i-1])/m[i-1]+(dx[i]+2*dx[i-1])/m[i]);
 let d=`M${P[0][0].toFixed(1)} ${P[0][1].toFixed(1)}`;for(let i=0;i<n-1;i++){const h=dx[i]/3;d+=`C${(P[i][0]+h).toFixed(1)} ${(P[i][1]+t[i]*h).toFixed(1)} ${(P[i+1][0]-h).toFixed(1)} ${(P[i+1][1]-t[i+1]*h).toFixed(1)} ${P[i+1][0].toFixed(1)} ${P[i+1][1].toFixed(1)}`}return d}
function yOn(path,X){const L=path.getTotalLength();let a=0,b=L;for(let i=0;i<24;i++){const c=(a+b)/2;if(path.getPointAtLength(c).x<X)a=c;else b=c}return path.getPointAtLength((a+b)/2).y}

function build(){const W=plot.clientWidth,H=plot.clientHeight;if(!W||!H)return;
 svg.setAttribute('width',W);svg.setAttribute('height',H);svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML='';
 const P={l:74,r:110,t:28,b:24},X=d=>P.l+(d-1)/89*(W-P.l-P.r),Y=v=>P.t+(100-v)/100*(H-P.t-P.b),X1=W-P.r,Y0=Y(100),Yb=Y(0);
 const defs=el('defs',{},svg),lg=el('linearGradient',{id:'gsAreaG',x1:0,y1:0,x2:0,y2:1},defs);el('stop',{offset:0,'stop-color':'#F26B21','stop-opacity':.2},lg);el('stop',{offset:1,'stop-color':'#F26B21','stop-opacity':.05},lg);
 /* grade e eixos */
 const g0=el('g',{},svg);[25,50,75].forEach(v=>el('line',{class:'gs-gl',x1:P.l,x2:X1,y1:Y(v),y2:Y(v)},g0));
 el('line',{class:'gs-ax',x1:P.l,x2:X1,y1:Y0,y2:Y0,'stroke-dasharray':'2 4'},g0);el('line',{class:'gs-ax',x1:P.l,x2:X1,y1:Yb,y2:Yb},g0);
 el('text',{class:'gs-yl t',x:P.l-12,y:Y0+3.5,'text-anchor':'end'},g0,'arrumada');
 el('text',{class:'gs-yl',x:P.l-12,y:Yb+3.5,'text-anchor':'end'},g0,'bagunça');
 [1,30,45,60,75,90].forEach(d=>el('text',{x:X(d),y:Yb+17,'text-anchor':'middle'},g0,d===1?'dia 1':String(d)));
 el('text',{x:X1+10,y:Yb+17},g0,'dias');
 /* plano vazio (passos 0–1): a pergunta que o gráfico vai responder */
 {const ph=el('g',{class:'gs-ph'},svg),cx=(X(15)+X1)/2+10,cy=(Y0+Yb)/2;el('text',{class:'q',x:cx,y:cy-9,'text-anchor':'middle'},ph,'O que acontece depois do evento?');el('text',{x:cx,y:cy+19,'text-anchor':'middle'},ph,'sem gestão × com gestão')}
 /* pergunta da Isabella: dia 15 (no próprio eixo) */
 const q=el('g',{class:'gs-q'},svg),qx=X(15);el('line',{x1:qx,x2:qx,y1:Y0,y2:Yb+4},q);
 const qr=el('rect',{y:Yb+5,height:18,rx:9},q),qd=el('circle',{class:'p',cy:Yb+14,r:3},q),qd2=el('circle',{cy:Yb+14,r:3},q),qtx=el('text',{y:Yb+17.6},q,'E daqui a 15 dias?');
 {const L=tw(qtx,118),w=L+27,x0=qx-w/2+5;qr.setAttribute('x',x0);qr.setAttribute('width',w);qd.setAttribute('cx',x0+10);qd2.setAttribute('cx',x0+10);qtx.setAttribute('x',x0+18)}
 /* área entre as curvas (a diferença) */
 const area=el('path',{class:'gs-area',d:mono(COM.map(([d,v])=>[X(d),Y(v)]))+'L'+[...SEM].reverse().map(([d,v])=>`${X(d).toFixed(1)} ${Y(v).toFixed(1)}`).join('L')+'Z'},svg);
 /* nota 66 dias (fato: Lally et al., 2010) */
 const l6=el('g',{class:'gs-an gs-l66'},svg),x66=X(66);el('line',{x1:x66,x2:x66,y1:Y(96)+6,y2:Yb},l6);
 el('text',{class:'b',x:x66-8,y:Yb-34,'text-anchor':'end'},l6,'66 dias');
 el('text',{x:x66-8,y:Yb-20,'text-anchor':'end'},l6,'mediana para um hábito novo');
 el('text',{x:x66-8,y:Yb-7,'text-anchor':'end'},l6,'virar automático · Lally et al. (2010)');
 /* o evento: dia 1, sala arrumada */
 const s0=el('g',{class:'gs-st'},svg);
 /* curvas */
 const sem=el('path',{class:'gs-cv sem',d:mono(SEM.map(([d,v])=>[X(d),Y(v)])),pathLength:1},svg);
 const com=el('path',{class:'gs-cv com',d:mono(COM.map(([d,v])=>[X(d),Y(v)])),pathLength:1},svg);
 const dot=c=>{const g=el('g',{class:'gs-dot '+c},svg);el('circle',{class:'h',r:9},g);el('circle',{r:4.6},g);return g};
 /* anotações SEM */
 const aS=[];const an=(cls,x,parent)=>{const g=el('g',{class:'gs-an '+cls,'data-x':x},parent||svg);aS.push(g);return g};
 [[32,84],[62,60]].forEach(([d,v])=>{const g=an('sem',X(d));el('text',{class:'k',x:X(d),y:Y(v)-12,'text-anchor':'middle'},g,'mutirão')});
 {const g=an('sem',X(48));el('text',{class:'k',x:X(46),y:Y(44)+26,'text-anchor':'middle'},g,'efeito sanfona')}
 {const g=an('sem gs-end',X(89));el('text',{x:X1+10,y:Y(21)-2},g,'de volta ao');el('text',{x:X1+10,y:Y(21)+12},g,'jeito antigo')}
 /* marcos COM: os verbos da gestão */
 /* uma única linha de marcos acima do teto (o rótulo do evento some quando a curva com gestão entra) */
 const aC=[];const mk=(d,v,t)=>{const g=el('g',{class:'gs-an com gs-mk','data-x':X(d)},svg);aC.push(g);const x=X(d),y=Y(v),by=Y0-25;
  el('line',{x1:x,x2:x,y1:by+16,y2:y-5},g);const r=el('rect',{y:by,height:16,rx:5},g),tx=el('text',{x,y:by+11.4,'text-anchor':'middle'},g,t);const w=tw(tx,t.length*7)+14;r.setAttribute('x',x-w/2);r.setAttribute('width',w);el('circle',{cx:x,cy:y,r:4.4},g);return g};
 mk(10,84,'conduzir');mk(30,93.5,'medir');mk(52,96,'reforçar');
 {const g=el('g',{class:'gs-an com gs-end','data-x':X(89)},svg);aC.push(g);el('text',{x:X1+10,y:Y(98)+4},g,'novo normal')}
 /* rótulo da diferença */
 const gp=el('g',{class:'gs-an gs-gap'},svg),gx=X(76),ya=yOn(com,gx)+10,yb=yOn(sem,gx)-10;
 el('path',{d:`M${gx-4} ${ya}h8M${gx} ${ya}V${yb}M${gx-4} ${yb}h8`},gp);
 el('text',{x:gx+10,y:(ya+yb)/2-4},gp,'a diferença');el('text',{class:'b',x:gx+10,y:(ya+yb)/2+12},gp,'= Gestão da Mudança');
 /* pontos no dia 15 */
 const p15=(path,c)=>{const g=el('g',{class:'gs-an '+c+' gs-p15','data-x':qx},svg);el('circle',{cx:qx,cy:yOn(path,qx),r:4.2,fill:'#fff',stroke:c==='sem'?'#4A6FA5':'#F26B21','stroke-width':2.4},g);return g};
 aS.push(p15(sem,'sem'));aC.push(p15(com,'com'));
 el('circle',{cx:X(1),cy:Y0,r:5.2},s0);el('text',{x:X(1)+10,y:Y0-12},s0,'o evento: sala arrumada');svg.appendChild(s0);
 G={sem,com,area,l6,gp,dS:dot('sem'),dC:dot('com'),aS,aC};drawn={sem:false,com:false}}

const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
function drawCurve(c,on,dur,done,quiet){if(!G)return;const p=G[c],d=c==='sem'?G.dS:G.dC,ann=c==='sem'?G.aS:G.aC,L=p.getTotalLength(),tok=++anim[c];
 const so=p.style.strokeDashoffset,from=1-(so===''?1:parseFloat(so)),to=on?1:0;drawn[c]=on;
 if(!dur){p.style.strokeDashoffset=1-to;if(!quiet)ann.forEach(a=>a.classList.toggle('on',on));d.style.opacity=0;done&&done();return}
 const t0=performance.now();const f=t=>{if(tok!==anim[c])return;const k=Math.min(1,(t-t0)/dur),e=from+(to-from)*ease(k),pt=p.getPointAtLength(L*e);
  p.style.strokeDashoffset=1-e;d.setAttribute('transform',`translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})`);d.style.opacity=e>0.002&&k<1?1:0;
  if(!quiet)ann.forEach(a=>a.classList.toggle('on',on?+a.dataset.x<=pt.x+1:+a.dataset.x<pt.x-1));
  if(k<1)requestAnimationFrame(f);else{d.style.opacity=on?1:0;if(on){d.setAttribute('transform',`translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})`)}done&&done()}};requestAnimationFrame(f)}
function clearT(){timers.forEach(clearTimeout);timers=[]}
function setView(v,animate=true){view=v;clearT();
 SEC.classList.toggle('gs-ghost',v==='com');SEC.classList.toggle('gs-v-sem',v!=='none');
 $$('.gs-seg button',SEC).forEach(b=>b.classList.toggle('on',b.dataset.v===v));
 if(!G)build();if(!G)return;
 const sp=animate?1:0;
 if(v==='none'){drawCurve('com',false,sp*300);drawCurve('sem',false,sp*300);G.area.style.opacity=0;G.l6.classList.remove('on');G.gp.classList.remove('on');return}
 if(v==='sem'){drawCurve('com',false,sp*350);G.area.style.opacity=0;G.l6.classList.remove('on');G.gp.classList.remove('on');
  if(!drawn.sem){drawCurve('sem',true,sp*1900);if(animate)tone(520,.9,'sine',.05,200)}else G.aS.forEach(a=>a.classList.add('on'));return}
 /* com */
 G.aS.forEach(a=>a.classList.remove('on'));
 const goCom=()=>{if(view!=='com')return;if(!drawn.com){drawCurve('com',true,sp*1700,()=>{if(view!=='com')return;G.area.style.opacity='';G.area.style.opacity=1;G.gp.classList.add('on')});if(animate)tone(330,.9,'sine',.05,880)}else{G.area.style.opacity=1;G.gp.classList.add('on')}
  timers.push(setTimeout(()=>{if(view==='com')G.l6.classList.add('on')},animate?900:0))};
 if(!drawn.sem){drawCurve('sem',true,sp*600,goCom,true)}else goCom()}

function talk(i){who.textContent=SAY[i][0];say.innerHTML=SAY[i][1];bub.classList.remove('gs-pop');void bub.offsetWidth;bub.classList.add('gs-pop')}
function setStep(n,animate=true){const was=st;st=n;
 SEC.classList.toggle('gs-s1',n>=1);SEC.classList.toggle('gs-s4',n===4);
 if(n>=1&&was<1&&animate)ding();
 setView(n>=3?'com':n===2?'sem':'none',animate);
 if(n===4&&was<4&&animate){[660,784,988,1175].forEach((f,i)=>setTimeout(()=>tone(f,.12,'sine',.045),i*110))}
 $$('.gs-steps button',SEC).forEach(b=>{const s=+b.dataset.s;b.classList.toggle('on',s===n);b.classList.toggle('past',s<n)});
 $('.gs-hint',SEC).innerHTML=n<4?'Avance para montar · <kbd>→</kbd>':'Próximo: como a humanidade aprendeu · <kbd>→</kbd>';
 if(n!==was||!animate)talk(n)}

/* controles */
$$('.gs-steps button',SEC).forEach(b=>b.onclick=e=>{const s=+b.dataset.s;setStep(s===st?s-1:s);b.blur()});
$$('.gs-seg button',SEC).forEach(b=>b.onclick=()=>{const v=b.dataset.v;b.blur();
 if(st<4){setStep(v==='sem'?2:3)}else{setView(v)}});
/* Resultado = Solução × Adoção (ilustrativo) */
const rng=$('.gs-rng',SEC),MSG=[[0,'Adoção zero: a solução perfeita entrega zero.'],[1,'Quase ninguém usa: o investimento vira custo.'],[30,'A solução perfeita com pouca adoção entrega pouco.'],[60,'Metade do caminho: o retorno ainda está na mesa.'],[85,'Agora sim: a adoção transforma a solução em resultado.'],[100,'Adoção total: o resultado que o projeto prometeu.']];
const upd=()=>{const v=+rng.value;$('.gs-eqa',SEC).textContent=v+'%';$('.gs-eqr',SEC).textContent=v+'%';rng.style.setProperty('--p',v+'%');let m=MSG[0][1];for(const [k,t] of MSG)if(v>=k)m=t;$('.gs-eq-m',SEC).textContent=m};
rng.addEventListener('input',upd);rng.addEventListener('keydown',e=>e.stopPropagation());rng.addEventListener('change',()=>tone(500+(+rng.value)*4,.08,'sine',.04));upd();

function reset(){clearT();anim.sem++;anim.com++;view='none';G=null;svg.innerHTML='';SEC.classList.remove('gs-s1','gs-s4','gs-ghost','gs-v-sem');rng.value=40;upd()}
DECK.register('gestao',{
 enter(){reset();build();setStep(0,false)},
 leave(){reset();st=0;setStep(0,false)},
 step(d){if(d>0&&st<4){setStep(st+1);return true}if(d<0&&st>0){setStep(st-1);return true}return false}});
})();
