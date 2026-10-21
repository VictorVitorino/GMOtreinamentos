(()=>{const {$,$$,tone,ding,boing,stage}=DECK, SEC=DECK.el('caixa');
/* ---------- 06 · caixa de ferramentas ---------- */
(()=>{const tk=$('#tk'),tb=$('#tb'),cards=$$('.mcard',tk),burst=$('#burst'),hint=$('#cxHint');let open=false,timers=[];
const BX=800,BY=455, CX=800+700,CY=455-312, TOP=184,H=602;
const HINT_C='Clique na caixa para abrir · ou <kbd>→</kbd>',HINT_O='Clique num card para destacar · <kbd>→</kbd> onde usar cada uma';
cards.forEach((c,i)=>{const cx=parseFloat(c.style.left)+183,cy=TOP+H/2;c.style.setProperty('--bx',(BX-cx)+'px');c.style.setProperty('--by',(BY-cy)+'px');c.style.setProperty('--bx2',(CX-cx)+'px');c.style.setProperty('--by2',(CY-cy)+'px');c.style.setProperty('--sx',((BX-cx)*.45+(i-1.5)*60)+'px');c.style.setProperty('--sy',(-120-Math.random()*80)+'px');c.style.setProperty('--r',((i-1.5)*14)+'deg');
 c.addEventListener('click',()=>{if(!open)return;const f=c.classList.contains('f');cards.forEach(x=>x.classList.remove('f'));tk.classList.toggle('focus',!f);if(!f)c.classList.add('f')})});
for(let i=0;i<36;i++){const s=document.createElement('i');const a=Math.random()*Math.PI*2,d=160+Math.random()*260;s.style.setProperty('--x',Math.cos(a)*d+'px');s.style.setProperty('--y',Math.sin(a)*d-80+'px');s.style.setProperty('--i',i);if(i%3===0)s.style.background='#fff';if(i%3===1)s.style.background='var(--steel-300)';burst.appendChild(s)}
/* o estado "open" muda na hora; animações em curso são interrompidas, nunca ignoradas */
const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
function reset(){timers.forEach(clearTimeout);timers=[];tk.classList.remove('opening','closing','focus');burst.classList.remove('go');cards.forEach(x=>x.classList.remove('f'))}
function setOpen(v){open=v;SEC.classList.toggle('cx-open',v);hint.innerHTML=v?HINT_O:HINT_C;tb.setAttribute('aria-label',v?'Fechar a caixa de ferramentas':'Abrir a caixa de ferramentas')}
function doOpen(){if(open)return;reset();setOpen(true);tk.classList.add('open','opening');void burst.offsetWidth;burst.classList.add('go');boing();cards.forEach((c,i)=>later(()=>tone(500+i*120,.12,'triangle',.06),420+i*130));later(()=>tk.classList.remove('opening'),1900)}
function doClose(){if(!open)return;reset();setOpen(false);tk.classList.add('closing');tone(700,.25,'triangle',.08,200);later(()=>tk.classList.remove('open','closing'),900)}
tb.addEventListener('click',()=>open?doClose():doOpen());tb.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();open?doClose():doOpen()}});
DECK.register('caixa',{step:d=>{if(d>0&&!open){doOpen();return true}if(d<0&&open){doClose();return true}return false},leave:()=>{reset();tk.classList.remove('open');setOpen(false)}})})();
})();
