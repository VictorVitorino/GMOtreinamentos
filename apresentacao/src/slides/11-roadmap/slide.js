(()=>{const {$,$$,tone,ding}=DECK, SEC=DECK.el('roadmap');
const WAVES=$$('.rm-wave',SEC), CELLS=$$('.rm-cell',SEC), HINT=$('.hint',SEC), MAX=WAVES.length; /* 3 ondas */
const H0='Clique numa onda ou avance com <kbd>→</kbd>', H1='Tudo aberto · <kbd>→</kbd> Frente 1 · Comunicação';
let k=0; /* 0 = nenhuma onda aberta · 1..3 = ondas 1..k abertas, a k em destaque */
const re=(el,c)=>{el.classList.remove(c);void el.offsetWidth;el.classList.add(c)};
function show(anim=true){
 WAVES.forEach((w,i)=>{w.classList.toggle('ghost',i>=k);w.classList.toggle('on',i<k);w.classList.toggle('cur',i===k-1);w.classList.toggle('past',i<k-1)});
 CELLS.forEach(c=>{const i=+c.dataset.w;c.classList.toggle('ghost',i>=k);c.classList.toggle('cur',i===k-1);c.classList.toggle('past',i<k-1);
  if(i===k-1&&anim)re(c,'in');else if(i>=k)c.classList.remove('in')});
 if(HINT)HINT.innerHTML=k===MAX?H1:H0;
 if(anim&&k>0){k===MAX?ding():tone(420+k*110,.14,'sine',.05,900)}}
WAVES.forEach((w,i)=>w.addEventListener('click',()=>{k=i+1;show()})); /* só show(): o bip já vem dele */
DECK.register('roadmap',{
 enter(){k=0;show(false)},
 step(d){const n=k+d;if(n<0||n>MAX)return false;k=n;show(d>0);return true}
});
})();
