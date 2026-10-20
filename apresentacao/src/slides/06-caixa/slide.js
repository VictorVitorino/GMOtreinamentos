(()=>{const {$,$$,tone,ding,boing,stage}=DECK, SEC=DECK.el('caixa');
/* ---------- 04 · caixa de ferramentas ---------- */
(()=>{const tk=$('#tk'),tb=$('#tb'),cards=$$('.mcard',tk),burst=$('#burst');let open=false,anim=false;
const BX=800,BY=455, CX=800+700,CY=455-337;
cards.forEach((c,i)=>{const cx=parseFloat(c.style.left)+176,cy=178+287;c.style.setProperty('--bx',(BX-cx)+'px');c.style.setProperty('--by',(BY-cy)+'px');c.style.setProperty('--bx2',(CX-cx)+'px');c.style.setProperty('--by2',(CY-cy)+'px');c.style.setProperty('--sx',((BX-cx)*.45+(i-1.5)*60)+'px');c.style.setProperty('--sy',(-120-Math.random()*80)+'px');c.style.setProperty('--r',((i-1.5)*14)+'deg');
 c.addEventListener('click',()=>{if(!open)return;const f=c.classList.contains('f');cards.forEach(x=>x.classList.remove('f'));tk.classList.toggle('focus',!f);if(!f)c.classList.add('f')})});
for(let i=0;i<36;i++){const s=document.createElement('i');const a=Math.random()*Math.PI*2,d=160+Math.random()*260;s.style.setProperty('--x',Math.cos(a)*d+'px');s.style.setProperty('--y',Math.sin(a)*d-80+'px');s.style.setProperty('--i',i);if(i%3===0)s.style.background='#fff';if(i%3===1)s.style.background='var(--steel-300)';burst.appendChild(s)}
function doOpen(){if(anim||open)return;anim=true;open=true;tk.classList.add('open','opening');burst.classList.remove('go');void burst.offsetWidth;burst.classList.add('go');boing();cards.forEach((c,i)=>setTimeout(()=>tone(500+i*120,.12,'triangle',.06),420+i*130));setTimeout(()=>{tk.classList.remove('opening');anim=false},1900)}
function doClose(){if(anim||!open)return;anim=true;tk.classList.remove('focus');cards.forEach(x=>x.classList.remove('f'));tk.classList.add('closing');tone(700,.25,'triangle',.08,200);setTimeout(()=>{tk.classList.remove('open','closing');open=false;anim=false},900)}
tb.addEventListener('click',()=>open?doClose():doOpen());tb.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();open?doClose():doOpen()}});
DECK.register('caixa',{step:d=>{if(d>0&&!open){doOpen();return true}if(d<0&&open){doClose();return true}return false},leave:()=>{tk.classList.remove('open','opening','closing','focus');cards.forEach(x=>x.classList.remove('f'));open=false;anim=false}})})();
})();
