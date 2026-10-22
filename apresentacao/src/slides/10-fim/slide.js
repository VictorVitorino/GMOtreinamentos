(()=>{const {$,ding}=DECK, SEC=DECK.el('fim');
$('#s5Wheel',SEC).addEventListener('click',()=>document.getElementById('bWheel')?.click());
DECK.register('fim',{enter(){setTimeout(ding,500)}});
})();
