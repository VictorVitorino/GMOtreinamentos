(()=>{const {$,$$,tone,ding,boing}=DECK, SEC=DECK.el('pea');
const COLS=$$('.pe-col',SEC),PH=$$('.pe-ph',SEC);
let k=-1; /* -1 = nenhuma aberta · 0..2 = palavra em destaque */
function show(snd=true){
 COLS.forEach((c,i)=>{c.classList.toggle('open',i<=k);c.classList.toggle('on',i===k);c.classList.toggle('dim',k>=0&&i>k)});
 PH.forEach((p,i)=>p.classList.toggle('on',i===k));
 if(snd&&k>=0){k===2?ding():tone(520+k*90,.14,'sine',.05,900)}}
COLS.forEach((c,i)=>c.addEventListener('click',()=>{k=i;show();boing()}));
DECK.register('pea',{
 enter(){k=-1;show(false)},
 step(d){const n=k+d;if(n<-1||n>2)return false;k=n;show(d>0);return true}
});
})();
