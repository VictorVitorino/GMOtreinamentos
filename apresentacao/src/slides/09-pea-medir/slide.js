(()=>{const {$,$$,tone,ding}=DECK, SEC=DECK.el('pea-medir');
const META=70;
/* momentos do exemplo (sistema novo): v = [P,E,A] em %, null = ainda não se mede */
const PRE=[
 {n:'📣 Antes do go-live',v:[58,null,null],st:['Pouca gente entende o porquê','ainda não se mede','ainda não se mede'],
  r:'Só metade do time sabe por que vamos mudar. Treinar agora seria ensinar a usar algo que ninguém entendeu por que existe.',
  a:'<b>Prontidão.</b> O líder direto explica o que muda e por quê, antes de qualquer treino.',f:0},
 {n:'💻 Semana 2 · go-live',v:[82,71,38],st:['O porquê pegou','Participaram de verdade','O trabalho continua na planilha'],
  r:'Entenderam e participaram, mas o sistema está no ar e o trabalho segue na planilha de sempre.',
  a:'<b>Adoção.</b> Suporte na tarefa real: key users por perto, tira-dúvidas e desligar a planilha paralela.',f:2},
 {n:'🎉 Semana 8',v:[90,78,84],st:['Todo mundo sabe o porquê','Time dentro do jogo','O novo virou o normal'],
  r:'Os três números passaram da meta. O novo jeito virou o jeito normal de trabalhar.',
  a:'<b>Manter.</b> Reconhecer quem usa, continuar medindo e cuidar de quem ainda trava.',f:-1}];
let cur=0;
const pre=$('.pm-pre',SEC),COLS=$$('.pm-col',SEC),rt=$('.pm-rt',SEC),at=$('.pm-at',SEC);
pre.innerHTML=PRE.map((p,i)=>`<button type="button" data-i="${i}">${p.n}</button>`).join('');
const re=(el,c)=>{el.classList.remove(c);void el.offsetWidth;el.classList.add(c)};
function count(el,to){const from=+(el.dataset.v||0);el.dataset.v=to;const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/800),e=1-Math.pow(1-k,3);el.textContent=Math.round(from+(to-from)*e)+'%';if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function load(i,snd=true){cur=i;const p=PRE[i];$$('button',pre).forEach((b,k)=>b.classList.toggle('on',k===i));
 COLS.forEach((c,k)=>{const v=p.v[k],b=$('.pm-ring b',c),fg=$('.pm-ring .fg',c),st=$('.pm-st',c);
  c.classList.toggle('na',v===null);c.classList.toggle('ok',v!==null&&v>=META);c.classList.toggle('focus',k===p.f);
  if(v===null){b.dataset.v=0;b.textContent='–';fg.style.strokeDasharray='0 100'}else{count(b,v);fg.style.strokeDasharray=`${v} 100`}
  st.textContent=p.st[k];re(st,'in')});
 rt.textContent=p.r;re(rt,'in');at.innerHTML=p.a;re(at,'in');
 if(snd)p.f<0?ding():tone(300+i*120,.15,'sine',.05,700)}
pre.addEventListener('click',e=>{const b=e.target.closest('button');if(b)load(+b.dataset.i)});
DECK.register('pea-medir',{
 enter(){$$('[data-v]',SEC).forEach(x=>x.dataset.v=0);load(0,false)},
 step(d){const n=cur+d;if(n<0||n>=PRE.length)return false;load(n);return true}
});
})();
