(()=>{const {tone,ding}=DECK, SEC=DECK.el('numeros');
const q=s=>SEC.querySelector(s), qa=s=>[...SEC.querySelectorAll(s)];
/* ---------- 05 · números: sem × com gestão da mudança ----------
   a = sem (ou com pouca/ruim) GMO · b = com GMO. Fontes no data-src do slide. */
const BARS=[
 {nm:'Projetos atingem ou superam os objetivos',src:'Prosci · 2023',cmp:'GMO ruim × excelente',a:13,b:88,la:'GMO ruim',lb:'GMO excelente'},
 {nm:'Iniciativas batem a meta original',src:'PMI · 2014',cmp:'pouco × muito eficaz em GMO',a:31,b:65,la:'pouco eficaz',lb:'muito eficaz'},
 {nm:'Transformação bem-sucedida',src:'McKinsey · 2017',cmp:'sem × com engajar a linha de frente',a:3,b:28,la:'sem engajar',lb:'engajando'},
 {nm:'Resultado financeiro forte',src:'BCG · 2018 · transformação digital',cmp:'sem × com foco em cultura',a:17,b:90,la:'sem foco',lb:'com foco'}
];
const MSG_OFF='Com gestão da mudança fraca ou ausente, os estudos ficam <em>entre 3% e 31%</em>.';
const MSG_ON='Com a mudança gerida, todas sobem: <em>de ≈2× a ≈9× mais chance</em>. Métricas diferentes, mesma direção.';
const chart=q('.n5-chart'),box=q('.n5-bars'),tg=q('.n5-tg'),ring=q('.n5-ring'),seal=q('.n5-seal'),rv=q('.n5-rv'),msg=q('.n5-cf .msg'),hint=q('.hd-r .hint');
const HINT_OFF=hint.innerHTML,HINT_ON='Próximo: a caixa de ferramentas · <kbd>→</kbd>';
box.innerHTML=BARS.map(r=>`<div class="n5-row"><div class="nm"><b>${r.nm}</b><span>${r.cmp}</span></div><div class="trk"><i class="base" data-w="${r.a}"></i><i class="boost" style="left:${r.a}%;--bw:${r.b-r.a}%"></i><span class="gap" style="left:${(r.a+r.b)/2}%">+${r.b-r.a} p.p. · ≈${Math.round(r.b/r.a)}×</span></div><div class="val"><b data-v0="${r.a}" data-v1="${r.b}">${r.a}%</b><small data-l0="${r.la}" data-l1="${r.lb}">${r.la}</small></div></div>`).join('');
const fmtX=v=>(v===1?'1':(Math.round(v*10)/10).toString().replace('.',','))+'×';
let on=false,timers=[],raf=new Set();
const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
/* anim: contagem com easing; com 'el', uma nova contagem no mesmo elemento cancela a anterior (cliques rápidos não brigam) */
function anim(ms,cb,el){const t0=performance.now(),tok={};if(el)el._n5=tok;const f=t=>{if(el&&el._n5!==tok)return;const k=Math.min(1,(t-t0)/ms);cb(1-Math.pow(1-k,3));if(k<1){const id=requestAnimationFrame(f);raf.add(id)}};raf.add(requestAnimationFrame(f))}
function stopAll(){timers.forEach(clearTimeout);timers=[];raf.forEach(cancelAnimationFrame);raf.clear()}
function paint(v,animate){
 qa('.n5-row .val b').forEach(el=>{const a=+el.dataset.v0,b=+el.dataset.v1,from=v?a:b,to=v?b:a;if(!animate){el._n5=null;el.textContent=to+'%';return}anim(900,e=>el.textContent=Math.round(from+(to-from)*e)+'%',el)});
 qa('.n5-row .val small').forEach(el=>el.textContent=v?el.dataset.l1:el.dataset.l0);
 qa('.n5-mult .chip b').forEach(el=>{const to=+el.dataset.to,A=v?1:to,B=v?to:1;if(!animate){el._n5=null;el.textContent=(v?'≈':'')+fmtX(B);return}
  anim(900,e=>{const x=A+(B-A)*e,r=B%1||A%1?Math.round(x*10)/10:Math.round(x);el.textContent=(x>1.04?'≈':'')+fmtX(r)},el)});
 msg.innerHTML=v?MSG_ON:MSG_OFF}
function setOn(v,animate=true){on=v;chart.classList.toggle('on',v);tg.classList.toggle('on',v);tg.setAttribute('aria-pressed',v);hint.innerHTML=v?HINT_ON:HINT_OFF;paint(v,animate);if(v&&animate)ding()}
tg.onclick=()=>setOn(!on);
function reset(){stopAll();setOn(false,false);
 qa('.n5-row .base').forEach(b=>b.style.width='0');
 ring.classList.add('n5-now');ring.classList.remove('on');void ring.offsetWidth;ring.classList.remove('n5-now');rv.textContent='0%';
 seal.classList.remove('stamp');SEC.classList.remove('n5-shake')}
DECK.register('numeros',{
 enter(){reset();
  later(()=>{qa('.n5-row .base').forEach(b=>b.style.width=b.dataset.w+'%')},700);
  later(()=>{ring.classList.add('on');anim(1800,e=>rv.textContent=Math.round(88*e)+'%')},600);
  later(()=>{seal.classList.add('stamp');later(()=>{SEC.classList.remove('n5-shake');void SEC.offsetWidth;SEC.classList.add('n5-shake');tone(90,.25,'square',.12,40)},420)},2700)},
 leave(){reset()},
 step(d){if(d>0&&!on){setOn(true);return true}if(d<0&&on){setOn(false);return true}return false}});
})();
