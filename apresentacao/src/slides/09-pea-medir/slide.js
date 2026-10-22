(()=>{const {$,$$,tone,ding}=DECK, SEC=DECK.el('pea-medir');
const PEO=[['Ana','#13315C'],['Beto','#2A5A96'],['Caio','#4A6FA5'],['Duda','#D9521A'],['Edu','#1B4479'],['Fabi','#F26B21'],['Gui','#3D5F93'],['Helô','#0B2545']];
const ADK=[['A','Consciência','Repita o porquê, na voz do líder direto: o que muda e o que acontece se não mudar.'],
 ['D','Desejo','Mostre o “o que eu ganho com isso”, ouça as resistências e envolva quem influencia o time.'],
 ['K','Conhecimento','Treino prático, na tarefa real, com exercício: menos slide, mais mão na massa.'],
 ['A','Habilidade','Suporte no dia a dia: key users por perto, tira-dúvidas e tempo para praticar.'],
 ['R','Reforço','Reconheça quem usa, desligue a planilha paralela e meça de novo em 30 dias.']];
const META=.7;
/* semanas do exemplo (sistema novo): cada pessoa = 5 marcas na ordem A·D·K·A·R */
const PRE=[
 {n:'😒 Semana 1 · cara fechada',d:['11000','11100','11000','11000','11000','11100','11000','01000']},
 {n:'📊 Semana 3 · voltou à planilha',d:['11110','11110','11111','11110','11100','11110','11110','11100']},
 {n:'🎉 Semana 8 · adotou',d:['11111','11111','11111','11111','11011','11111','11111','10111']}];
let G=[],cur=0;
const body=$('.pm-body',SEC),ft=$('.pm-ft',SEC),pre=$('.pm-pre',SEC);
pre.innerHTML=PRE.map((p,i)=>`<button type="button" data-i="${i}">${p.n}</button>`).join('');
body.innerHTML=PEO.map(([n,c],r)=>`<div class="pm-row pm-pr"><span class="pm-who"><i style="--c:${c}">${n[0]}</i>${n}</span>${[0,1,2,3,4].map(j=>`<button type="button" class="pm-c" data-r="${r}" data-j="${j}" aria-label="${n}: ${ADK[j][1]}"></button>`).join('')}<span class="pm-tr"></span></div>`).join('');
ft.innerHTML='<span class="label">% do time</span>'+[0,1,2,3,4].map(()=>'<div class="pm-pc"><b>0%</b><i><s></s></i></div>').join('')+'<span></span>';
const cells=$$('.pm-c',SEC),trs=$$('.pm-tr',SEC),pcs=$$('.pm-pc',SEC);
const pct=x=>Math.round(x*100);
function count(el,to,suf='%'){const from=+(el.dataset.v||0);el.dataset.v=to;const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/700),e=1-Math.pow(1-k,3);el.textContent=Math.round(from+(to-from)*e)+suf;if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
let lastB=-2;
function calc(){const N=G.length,col=[0,1,2,3,4].map(j=>G.filter(r=>r[j]).length/N);
 const P=G.filter(r=>r[0]&&r[1]).length/N,E=col[2],A=G.filter(r=>r[3]&&r[4]).length/N;
 cells.forEach(c=>{const v=G[+c.dataset.r][+c.dataset.j];c.classList.toggle('y',!!v);c.textContent=v?'✓':'·'});
 trs.forEach((t,r)=>{const b=G[r].indexOf(0);t.classList.toggle('ok',b<0);t.textContent=b<0?'✓ adotou':ADK[b][0]+' · '+ADK[b][1]});
 const B=col.findIndex(v=>v<META);
 pcs.forEach((p,j)=>{count($('b',p),pct(col[j]));$('s',p).style.setProperty('--w',pct(col[j])+'%');p.classList.toggle('low',col[j]<META);p.classList.toggle('bar',j===B)});
 $$('.pm-hh>div',SEC).forEach((h,j)=>h.classList.toggle('bar',j===B));
 cells.forEach(c=>c.classList.toggle('bc',+c.dataset.j===B&&!G[+c.dataset.r][B]));
 [['p',P],['e',E],['a',A]].forEach(([k,v])=>{const b=$(`.pm-bar[data-k="${k}"]`,SEC);$('i b',b).style.width=pct(v)+'%';count($('em',b),pct(v))});
 count($('.pm-ring b',SEC),pct(A));$('.pm-ring .fg',SEC).style.strokeDasharray=`${pct(A)} 100`;
 const bl=$('.pm-bl',SEC);bl.classList.toggle('ok',B<0);bl.textContent=B<0?'✓':ADK[B][0];
 $('.pm-bn',SEC).textContent=B<0?'Sem barreira: adoção sustentada':`${ADK[B][0]} · ${ADK[B][1]} (${pct(col[B])}%, meta 70%)`;
 $('.pm-ba',SEC).textContent=B<0?'Reconheça o time, mantenha a medição e cuide de quem ainda trava.':ADK[B][2];
 if(B!==lastB){bl.classList.remove('in');void bl.offsetWidth;bl.classList.add('in');lastB=B}
 return A}
function load(i,snd=true){cur=i;G=PRE[i].d.map(s=>[...s].map(Number));$$('button',pre).forEach((b,k)=>b.classList.toggle('on',k===i));
 cells.forEach((c,n)=>{c.classList.remove('flip');void c.offsetWidth;c.style.animationDelay=(n%5)*40+Math.floor(n/5)*30+'ms';c.classList.add('flip')});
 const A=calc();if(snd)A>=META?ding():tone(300+i*120,.15,'sine',.05,700)}
pre.addEventListener('click',e=>{const b=e.target.closest('button');if(b)load(+b.dataset.i)});
body.addEventListener('click',e=>{const c=e.target.closest('.pm-c');if(!c)return;const r=+c.dataset.r,j=+c.dataset.j;G[r][j]=G[r][j]?0:1;$$('button',pre).forEach(b=>b.classList.remove('on'));
 c.classList.remove('flip');c.style.animationDelay='0ms';void c.offsetWidth;c.classList.add('flip');tone(G[r][j]?700:380,.08,'sine',.05);calc()});
DECK.register('pea-medir',{
 enter(){lastB=-2;$$('[data-v]',SEC).forEach(x=>x.dataset.v=0);load(0,false)},
 step(d){const n=cur+d;if(n<0||n>=PRE.length)return false;load(n);return true}
});
})();
