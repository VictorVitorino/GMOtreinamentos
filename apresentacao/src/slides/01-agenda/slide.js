(()=>{const {$,$$,tone,boing}=DECK, SEC=DECK.el('agenda');
const KEY='gmo-agenda-nomes';
const FALAS=[['Presente!','Oi, gente!','Bora mudar?'],['Cheguei!','Já vi esse filme…','Ansiosa pra começar!'],['Estou pronta!','Quem trouxe café?','Vamos nessa!'],['Aqui!','Posso perguntar?','Bora!']];
let T=[],last=[0,0,0,0];
const P=$$('.ag-p',SEC);
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(_){return[]}};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify($$('.ag-badge b',SEC).map(b=>b.textContent.trim())))}catch(_){}};
function say(i,txt){const s=$('.ag-say',P[i]);s.textContent=txt;s.classList.add('on');clearTimeout(s._t);s._t=setTimeout(()=>s.classList.remove('on'),1700)}
function hop(i,sound=true){const im=$('.ag-img',P[i]);im.animate([{transform:'translateY(0) scale(1,1)'},{transform:'translateY(6px) scale(1.04,.95)',offset:.15},{transform:'translateY(-34px) scale(.97,1.04)',offset:.5},{transform:'translateY(0) scale(1.03,.97)',offset:.82},{transform:'translateY(0) scale(1,1)'}],{duration:620,easing:'ease-out'});
 if(sound)tone(420+i*90,.12,'sine',.05,700)}
P.forEach((p,i)=>{
 p.addEventListener('click',e=>{if(e.target.closest('.ag-badge'))return;last[i]=(last[i]+1)%3;say(i,FALAS[i][last[i]]);hop(i);boing&&boing()});
});
$$('.ag-badge b',SEC).forEach(b=>{
 b.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();b.blur()}});
 b.addEventListener('keyup',e=>e.stopPropagation());
 b.addEventListener('input',()=>{if(b.textContent.length>14)b.textContent=b.textContent.slice(0,14);save()});
 b.addEventListener('paste',e=>{e.preventDefault();const t=(e.clipboardData||window.clipboardData).getData('text').replace(/\s+/g,' ').slice(0,14);document.execCommand('insertText',false,t)});
});
$$('.ag-c',SEC).forEach(c=>c.addEventListener('click',()=>{tone(660,.1,'sine',.05,900);DECK.go(c.dataset.go)}));
DECK.register('agenda',{
 enter(){const n=load();$$('.ag-badge b',SEC).forEach((b,i)=>{b.textContent=n[i]||''});
  T.forEach(clearTimeout);T=[];
  P.forEach((p,i)=>{T.push(setTimeout(()=>{say(i,FALAS[i][0]);hop(i,false)},1900+i*420))});
 },
 leave(){T.forEach(clearTimeout);T=[];$$('.ag-say',SEC).forEach(s=>s.classList.remove('on'))}
});
})();
