(()=>{const {$,$$,tone,ding,boing}=DECK, SEC=DECK.el('capacitacao');
/* passos da frente: 0 = nada revelado · 1..4 = degraus do funil · 5 = medidores (hoje × meta) + leitura do IPT.
   Depois do 5, um → a mais vira a página (.pl-open: o Plano de Capacitação escrito) · mais um → e o deck troca de slide.
   ← com o plano aberto fecha o plano; com o plano fechado volta os passos. enter() sempre reinicia: plano fechado, k = 0. */
const MAX=5;
const ROWS=$$('.ft-row',SEC),CONS=$$('.ft-con',SEC),GSW=$('.ft-gs',SEC),GS=$$('.ft-g',SEC),READ=$('.ft-read',SEC),RV=$('.ft-rn b',SEC),
      BTN=$('.pgbtn.flip',SEC),BTNT=$('span',BTN),BACK=$('.pgbtn.back',SEC);
let k=0, open=false;
const ease=t=>1-Math.pow(1-t,3);
/* contador animado; cada elemento guarda o seu token para cancelar uma contagem antiga */
function count(el,to,fmt){const from=+(el.dataset.v||0);el.dataset.v=to;const t0=performance.now();el._t=t0;
 const f=t=>{if(el._t!==t0)return;const p=Math.min(1,(t-t0)/850);el.textContent=fmt(from+(to-from)*ease(p));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function reset(el){el._t=0;el.dataset.v=0;el.textContent='–'}
function show(prev){
 ROWS.forEach((r,i)=>{const on=k>=i+1,n=$('.ft-n',r);
  if(on&&!r.classList.contains('on')){r.classList.add('on');count(n,+r.dataset.n,v=>Math.round(v))}
  if(!on){r.classList.remove('on','open');reset(n)}});
 CONS.forEach((c,i)=>{const on=k>=i+2;c.classList.toggle('on',on);const b=$('.ft-cp b',c);b.textContent=on?'↓ '+b.dataset.p:'↓ –'}); /* a % do conector só aparece quando ele acende (modelo primeiro, hoje depois) */
 const g=k>=MAX;
 GSW.classList.toggle('on',g);
 GS.forEach(x=>{const b=$('.ft-rc b',x),fg=$('.ft-ring .fg',x),was=x.classList.contains('on');x.classList.toggle('on',g);
  if(g&&!was){fg.style.strokeDasharray=`${x.dataset.p} 100`;const dec=+(x.dataset.dec||0);count(b,+x.dataset.v,v=>dec?v.toFixed(dec).replace('.',','):Math.round(v)+'%')}
  if(!g){fg.style.strokeDasharray='0 100';reset(b)}});
 READ.classList.toggle('on',g);
 if(g&&prev<MAX)count(RV,65,v=>Math.round(v)+'%');
 if(!g)reset(RV)}
function go(n,snd=true){const prev=k;k=Math.max(0,Math.min(MAX,n));show(prev);
 if(snd&&k>prev){k===MAX?ding():tone(380+k*90,.14,'sine',.05,760)}}
/* clique num degrau: revela até ele; se já está aberto, mostra o número absoluto e a % dos convidados */
ROWS.forEach((r,i)=>r.addEventListener('click',()=>{if(k<i+1){go(i+1)}else{r.classList.toggle('open');boing()}}));
/* virar a página: o Plano de Capacitação escrito (classe global .pl-open) · botão do cabeçalho e "Voltar" do documento */
function flip(on,snd=true){open=on;SEC.classList.toggle('pl-open',on);BTN.setAttribute('aria-pressed',on);BTNT.textContent=on?'Voltar ao slide':'Virar a página · ver o plano';
 if(snd){on?tone(520,.12,'sine',.05,760):tone(380,.1,'sine',.04)}}
BTN.addEventListener('click',()=>flip(!open));
BACK.addEventListener('click',()=>flip(false));
DECK.register('capacitacao',{
 enter(){k=0;flip(false,false);show(0)},
 leave(){flip(false,false)},
 step(d){
  if(d>0){if(open)return false;             /* plano aberto: → sai do slide */
   if(k<MAX){go(k+1,true);return true}       /* degraus 1..4 e os medidores + leitura */
   flip(true);return true}                   /* depois da leitura: → vira a página */
  if(open){flip(false);return true}          /* ← com o plano aberto: volta ao slide */
  if(k>0){go(k-1,false);return true}return false}
});
})();
