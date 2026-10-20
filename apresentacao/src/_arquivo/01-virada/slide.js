(()=>{const {$,$$,tone,ding,boing,stage}=DECK, SEC=DECK.el('virada');
/* ---------- 01 · virada de chave + equação ---------- */
(()=>{const s=SEC,flip=$('#flip');let on=false;
const set=v=>{on=v;flip.classList.toggle('on',v);s.classList.toggle('flipped',v);$('.kt',flip).textContent=v?'Voltar à expectativa':'Virar a chave';tone(v?520:420,.12,'triangle',.08,v?880:300)};
$('#keyBtn').onclick=()=>set(!on);
DECK.register('virada',{step:d=>{if(d>0&&!on){set(true);return true}if(d<0&&on){set(false);return true}return false},leave:()=>set(false)});
const inp=$('#eqIn'),msgs=[[0,'Adoção zero: a solução perfeita entrega zero.'],[1,'Quase ninguém usa: o investimento vira custo.'],[40,'A solução perfeita com pouca adoção entrega pouco.'],[70,'Metade do caminho: o ROI ainda está na mesa.'],[90,'Agora sim: a adoção transforma a solução em resultado.'],[100,'Adoção total: o resultado que o projeto prometeu.']];
const upd=()=>{const v=+inp.value;$('#eqA').textContent=v+'%';$('#eqR').textContent=v+'%';$('#eqBar').style.width=v+'%';let m=msgs[0][1];for(const [k,t] of msgs)if(v>=k)m=t;$('#eqMsg').textContent=m};
inp.addEventListener('input',upd);inp.addEventListener('keydown',e=>e.stopPropagation());upd()})();
})();
