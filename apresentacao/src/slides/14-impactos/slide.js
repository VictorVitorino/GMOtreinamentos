(()=>{const {$,$$,tone,ding,boing}=DECK, SEC=DECK.el('impactos');
/* A matriz se monta em 4 passos: k = 1 categoria · 2 severidade · 3 status · 4 as três linhas de exemplo + leitura do ICI real.
   k = 0 (ao entrar): visões esmaecidas e a faixa navy mostra o modelo do índice. Depois do passo 4 o deck troca de slide. */
const MAX=4;
let k=0, mode='';
const V=$$('.fi-v',SEC), TAB=$('.fi-tab',SEC), ROWS=$$('.fi-row',SEC), READ=$('.fi-read',SEC);
const re=(el,c)=>{el.classList.remove(c);void el.offsetWidth;el.classList.add(c)};
/* contagem animada (0 → n); dec = casas decimais; sufixo opcional */
function count(el,to,dec=0,suf=''){const t0=performance.now();const f=t=>{const p=Math.min(1,(t-t0)/800),e=1-Math.pow(1-p,3);el.textContent=(to*e).toFixed(dec).replace('.',',')+suf;if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
/* faixa navy · modelo: ICI = 4 medidas com peso */
const MODELO=`<div class="fi-mo"><div class="fi-moh"><span class="fi-lb">O índice desta frente · como se calcula</span><span class="fi-mh">avance com <kbd>→</kbd> até o fim para ver o índice real</span></div>
 <div class="fi-mor"><b>ICI</b><small>meta ≥ 70%</small><i class="fi-eq">=</i><div class="fi-kt"><b>Identificação</b><span>peso 20%</span></div><i>+</i><div class="fi-kt"><b>Priorização</b><span>peso 20%</span></div><i>+</i><div class="fi-kt"><b>Execução das mitigações</b><span>peso 30%</span></div><i>+</i><div class="fi-kt"><b>Eficácia</b><span>peso 30%</span></div></div></div>`;
/* faixa navy · real: ICI 49,5% (vermelho) → leitura → onde agir */
const REAL=`<div class="fi-re"><div class="fi-rh"><div class="fi-ring"><svg viewBox="0 0 120 120"><circle class="bg" cx="60" cy="60" r="50"/><circle class="fg" cx="60" cy="60" r="50" pathLength="100"/></svg></div><div><span class="fi-lb">Leitura · corte de junho</span><b class="big">ICI 49,5%</b><div class="fi-rr"><span class="fi-rp">vermelho</span><small>meta ≥ 70%</small></div></div></div>
 <div class="fi-rs"><p>Só <b>4 de 22</b> mitigações executadas.</p><span>Execução em <b>18%</b> (peso 30%) puxa o índice para baixo.</span></div>
 <div class="fi-act"><span class="fi-lb">Onde agir</span><p>Tirar as ações do papel, <b>uma por semana</b>, com dono e prazo.</p></div></div>`;
function show(snd=true){
 V.forEach((v,i)=>{const on=i<k,was=v.classList.contains('on');v.classList.toggle('on',on);
  if(on&&!was)$$('b[data-n]',v).forEach(b=>count(b,+b.dataset.n));
  if(!on)$$('b[data-n]',v).forEach(b=>b.textContent='–')});
 TAB.classList.toggle('on',k>=MAX);
 if(k<MAX){ROWS.forEach(r=>r.classList.remove('on'));TAB.classList.remove('sel')}
 const m=k>=MAX?'real':'modelo';
 if(m!==mode){mode=m;READ.innerHTML=m==='real'?REAL:MODELO;re(READ,'swap')}
 if(snd){k>=MAX?ding():tone(420+k*90,.14,'sine',.05,900)}}
/* clique numa linha destaca (clicar de novo solta) · clique numa visão revela até ela */
ROWS.forEach(r=>r.addEventListener('click',()=>{const was=r.classList.contains('on');ROWS.forEach(x=>x.classList.remove('on'));if(!was)r.classList.add('on');TAB.classList.toggle('sel',!was);boing()}));
V.forEach((v,i)=>v.addEventListener('click',()=>{if(k<i+1){k=i+1;show()}}));
DECK.register('impactos',{
 enter(){k=0;mode='';show(false)},
 step(d){const n=k+d;if(n<0||n>MAX)return false;k=n;show(d>0);return true}
});
})();
