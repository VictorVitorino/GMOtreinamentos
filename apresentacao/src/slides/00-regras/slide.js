(()=>{const {$,$$,tone,ding,boing}=DECK, SEC=DECK.el('regras');
const C=$$('.rg-c',SEC),SAY=$('.rg-say',SEC);
let k=0; /* 0 = todos visíveis (entrada) · 1..4 = combinados abertos até o k */
function show(snd=true){C.forEach((c,i)=>{c.classList.toggle('hide',i>=k&&k>0);c.classList.toggle('cur',i===k-1)});
 if(snd&&k>0){k===4?ding():tone(480+k*90,.14,'sine',.05,900)}}
C.forEach((c,i)=>c.addEventListener('click',()=>{k=i+1;show();boing()}));
$$('.rg-em button',SEC).forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();SAY.textContent=b.textContent+' '+b.dataset.t;SAY.classList.remove('in');void SAY.offsetWidth;SAY.classList.add('in');tone(700,.1,'sine',.05,1000)}));
DECK.register('regras',{
 enter(){k=0;SAY.textContent='';show(false)},
 step(d){const n=k+d;if(n<0||n>4)return false;k=n;show();return true}
});
})();
