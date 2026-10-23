(()=>{const {$,$$,tone,ding}=DECK, SEC=DECK.el('pea-medir');
const META=75;
/* momentos do exemplo (sistema novo): v = [P,E,A] em %, null = ainda não se mede */
const PRE=[
 {n:'📣 Antes do go-live',v:[58,null,null],ex:['Ex.: 100 convidados → 58 responderam = 58%','ainda sem dado: ninguém participou','ainda sem dado: o sistema não está no ar'],st:['Pouca gente respondeu ao chamado','ainda não se mede','ainda não se mede'],
  say:['Só 58% responderam ao convite: quase metade do time ainda não está disponível.','Ainda não dá para medir: ninguém participou de nada.','Ainda não dá para medir: o sistema não está no ar.'],
  a:'<b>Agir na Prontidão.</b> Antes de treinar, o líder direto explica o que muda e por quê. Reenvia o convite, com nome e prazo.',f:0},
 {n:'💻 Semana 2 · go-live',v:[82,76,38],ex:['Ex.: 100 convidados → 82 responderam = 82%','Ex.: 82 presentes → 62 participaram = 76%','Ex.: 100 deveriam usar → 38 usam = 38%'],st:['O chamado pegou','Participaram de verdade','O trabalho continua na planilha'],
  say:['82% responderam e apareceram: o time está disponível.','76% participaram de verdade: fizeram o exercício e deram opinião.','Só 38% usam o sistema: a maioria ainda vive na planilha antiga.'],
  a:'<b>Agir na Adoção.</b> Suporte na tarefa real: key users por perto, tira-dúvidas diário e desligar a planilha paralela.',f:2},
 {n:'🎉 Semana 8',v:[90,78,84],ex:['Ex.: 100 convidados → 90 responderam = 90%','Ex.: 90 presentes → 70 participaram = 78%','Ex.: 100 deveriam usar → 84 usam = 84%'],st:['Todo mundo responde','Time dentro do jogo','O novo virou o normal'],
  say:['90% respondem e aparecem: convite virou rotina.','78% participam de verdade: perguntam, testam, sugerem.','84% usam o novo jeito, sem planilha: o novo virou o normal.'],
  a:'<b>Manter.</b> Reconhecer quem usa, continuar medindo todo mês e cuidar de quem ainda trava.',f:-1}];
let cur=0;
const pre=$('.pm-pre',SEC),COLS=$$('.pm-col',SEC),SAY=$$('.pm-says li',SEC),at=$('.pm-at',SEC);
pre.innerHTML=PRE.map((p,i)=>`<button type="button" data-i="${i}">${p.n}</button>`).join('');
const re=(el,c)=>{el.classList.remove(c);void el.offsetWidth;el.classList.add(c)};
function count(el,to){const from=+(el.dataset.v||0);el.dataset.v=to;const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/800),e=1-Math.pow(1-k,3);el.textContent=Math.round(from+(to-from)*e)+'%';if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function load(i,snd=true){cur=i;const p=PRE[i];$$('button',pre).forEach((b,k)=>b.classList.toggle('on',k===i));
 COLS.forEach((c,k)=>{const v=p.v[k],b=$('.pm-ring b',c),fg=$('.pm-ring .fg',c),st=$('.pm-st',c);
  c.classList.toggle('na',v===null);c.classList.toggle('ok',v!==null&&v>=META);c.classList.toggle('focus',k===p.f);
  if(v===null){b.dataset.v=0;b.textContent='–';fg.style.strokeDasharray='0 100'}else{count(b,v);fg.style.strokeDasharray=`${v} 100`}
  st.textContent=p.st[k];re(st,'in');const ex=$('.pm-ex',c);ex.textContent=p.ex[k];re(ex,'in')});
 SAY.forEach((l,k)=>{const v=p.v[k];l.classList.toggle('na',v===null);l.classList.toggle('ok',v!==null&&v>=META);l.classList.toggle('ko',v!==null&&v<META);$('span',l).textContent=p.say[k];l.style.animationDelay=k*90+'ms';re(l,'in')});at.innerHTML=p.a;re(at,'in');
 if(snd)p.f<0?ding():tone(300+i*120,.15,'sine',.05,700)}
pre.addEventListener('click',e=>{const b=e.target.closest('button');if(b)load(+b.dataset.i)});
DECK.register('pea-medir',{
 enter(){$$('[data-v]',SEC).forEach(x=>x.dataset.v=0);load(0,false)},
 step(d){const n=cur+d;if(n<0||n>=PRE.length)return false;load(n);return true}
});
})();
