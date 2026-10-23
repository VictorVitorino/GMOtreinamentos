(()=>{const {$,$$,tone,ding}=DECK, SEC=DECK.el('cmak');
/* 4 cards: frente = MODELO (o que medimos) · verso = HOJE (como estamos).
   → vira o próximo card; ← desvira o último virado; clique vira/desvira o card. Após os 4, → devolve false (troca de slide). */
const CARDS=$$('.ck-card',SEC);
const isF=c=>c.classList.contains('flip');
const fmt=(v,dec)=>v.toFixed(dec).replace('.',',');
const zero=n=>{n.textContent='0'};
function count(el,to){const dec=1,t0=performance.now();
 const f=t=>{if(!el.closest('.flip'))return;const k=Math.min(1,(t-t0)/600),e=1-Math.pow(1-k,3);el.textContent=fmt(to*e,dec);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function mark(){let last=-1;CARDS.forEach((c,j)=>{if(isF(c))last=j});CARDS.forEach((c,j)=>c.classList.toggle('on',j===last));const g=CARDS[0].parentElement.parentElement;g.classList.toggle('has-on',last>=0)}
function flip(i,on,snd=true){const c=CARDS[i];if(isF(c)===on)return;c.classList.toggle('flip',on);if(snd){const n=$('.ck-inner',c);n.classList.remove('turn');void n.offsetWidth;n.classList.add('turn')}
 const n=$('.ck-n',c);
 if(on)setTimeout(()=>count(n,+n.dataset.v),240);
 else if(SEC.classList.contains('ck-snap'))zero(n);            /* ao entrar: reinicia na hora, sem animação */
 else setTimeout(()=>{if(!isF(c))zero(n)},400);                /* ao desvirar: só zera depois que o verso saiu de vista */
 mark();
 if(snd){if(on){CARDS.every(isF)?ding():tone(460+i*110,.16,'sine',.06,920)}else tone(420,.1,'sine',.04,260)}}
CARDS.forEach((c,i)=>c.addEventListener('click',()=>flip(i,!isF(c))));
DECK.register('cmak',{
 enter(){SEC.classList.add('ck-snap');CARDS.forEach((c,i)=>flip(i,false,false));mark();requestAnimationFrame(()=>requestAnimationFrame(()=>SEC.classList.remove('ck-snap')))},
 step(d){if(d>0){const i=CARDS.findIndex(c=>!isF(c));if(i<0)return false;flip(i,true);return true}
  let i=-1;CARDS.forEach((c,j)=>{if(isF(c))i=j});if(i<0)return false;flip(i,false);return true}
});
})();
