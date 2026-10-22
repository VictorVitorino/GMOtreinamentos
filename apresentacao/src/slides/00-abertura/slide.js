(()=>{const {$,tone}=DECK, SEC=DECK.el('previa');
/* centro da tela da TV dentro da imagem (coordenadas do palco, sem as faixas) e zoom que a faz cobrir o palco */
const CX=1398,CY=270,S=3.9;
let T=0,zoomed=false;
function enterTV(){if(zoomed)return;zoomed=true;SEC.classList.add('zoom');
 $('.pv-cam',SEC).style.transform=`translate(${800-CX*S}px,${450-29-CY*S}px) scale(${S})`;
 tone(330,.9,'sine',.05,990);T=setTimeout(()=>DECK.go('capa'),1300)}
$('.pv-tv',SEC).addEventListener('click',enterTV);
$('.pv-play',SEC).addEventListener('click',enterTV);
DECK.register('previa',{
 enter(){clearTimeout(T);zoomed=false;SEC.classList.remove('zoom');$('.pv-cam',SEC).style.transform=''},
 leave(){clearTimeout(T)},
 step(d){if(d>0){enterTV();return true}return false}
});
})();
