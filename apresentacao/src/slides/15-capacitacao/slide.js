(()=>{const {$,$$,tone,ding,boing}=DECK, SEC=DECK.el('capacitacao');
/* passos: 0 = nada revelado · 1..4 = degraus do funil · 5 = medidores + leitura do IPT */
const MAX=5;
const ROWS=$$('.ft-row',SEC),CONS=$$('.ft-con',SEC),GS=$$('.ft-g',SEC),READ=$('.ft-read',SEC),RV=$('.ft-rv b',SEC);
let k=0;
const ease=t=>1-Math.pow(1-t,3);
/* contador animado; cada elemento guarda o seu token para cancelar uma contagem antiga */
function count(el,to,fmt){const from=+(el.dataset.v||0);el.dataset.v=to;const t0=performance.now();el._t=t0;
 const f=t=>{if(el._t!==t0)return;const p=Math.min(1,(t-t0)/850);el.textContent=fmt(from+(to-from)*ease(p));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function reset(el){el._t=0;el.dataset.v=0;el.textContent='–'}
function show(prev){
 ROWS.forEach((r,i)=>{const on=k>=i+1,n=$('.ft-n',r);
  if(on&&!r.classList.contains('on')){r.classList.add('on');count(n,+r.dataset.n,v=>Math.round(v))}
  if(!on){r.classList.remove('on','open');reset(n)}});
 CONS.forEach((c,i)=>c.classList.toggle('on',k>=i+2));
 const g=k>=MAX;
 GS.forEach(x=>{const b=$('.ft-ring b',x),fg=$('.ft-ring .fg',x),was=x.classList.contains('on');x.classList.toggle('on',g);
  if(g&&!was){fg.style.strokeDasharray=`${x.dataset.p} 100`;const dec=+(x.dataset.dec||0);count(b,+x.dataset.v,v=>dec?v.toFixed(dec).replace('.',','):Math.round(v)+'%')}
  if(!g){fg.style.strokeDasharray='0 100';reset(b)}});
 READ.classList.toggle('on',g);
 if(g&&prev<MAX)count(RV,65,v=>Math.round(v)+'%');
 if(!g)reset(RV)}
function go(n,snd=true){const prev=k;k=Math.max(0,Math.min(MAX,n));show(prev);
 if(snd&&k>prev){k===MAX?ding():tone(380+k*90,.14,'sine',.05,760)}}
/* clique num degrau: revela até ele; se já está aberto, mostra o número absoluto e a % dos convidados */
ROWS.forEach((r,i)=>r.addEventListener('click',()=>{if(k<i+1){go(i+1)}else{r.classList.toggle('open');boing()}}));
DECK.register('capacitacao',{
 enter(){k=0;show(0)},
 step(d){const n=k+d;if(n<0||n>MAX)return false;go(n,d>0);return true}
});
})();
