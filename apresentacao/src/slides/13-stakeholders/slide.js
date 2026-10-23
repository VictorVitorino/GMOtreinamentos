(()=>{const {$,$$,tone,ding,boing}=DECK, SEC=DECK.el('stakeholders');
/* Passos de →: -1 (como ler o mapa) → pessoas 0..5 (6 passos) → página virada com o mapa escrito da FE (7º passo) → mais um → sai do slide.
   ← com o mapa escrito aberto fecha o mapa; com ele fechado volta as pessoas. */
/* 5 papéis (cor no mapa: Champion/Engajador verde · Neutro steel · Resistente/Boicotador laranja) */
const ROLE={ch:'Champion',en:'Engajador',ne:'Neutro',ra:'Resistente aberto',bv:'Boicotador velado'};
const RS={ch:'a',en:'a',ne:'n',ra:'r',bv:'r'};
const QN={gp:'Gerenciar de perto',ms:'Manter satisfeito',mi:'Manter informado',mo:'Monitorar'};
/* 6 papéis genéricos da FE (sem nomes), os mesmos da tabela do verso: inicial, papel, papel hoje (h) e alvo (t), quadrante,
   o que precisa, ação da GMO, dono (od = forma curta no painel), quando, sinal de que funcionou */
const P=[
 {i:'FE',r:'Gerente executivo da FE',  h:'ch',t:'ch',q:'gp',n:'Ver a GMO rodando nas 4 gerências, com números.',                          a:'Patrocinar e cobrar os índices no comitê mensal.', o:'Donos de GMO',       w:'Mensal',     ok:'Cobra no comitê o índice abaixo da meta, sem ninguém pedir.'},
 {i:'G', r:'Gerente de gerência',      h:'ne',t:'en',q:'gp',n:'Saber o que cabe à gerência dele e quanto tempo custa.',   a:'Indicar o dono de GMO da gerência; combinar as metas das 4 frentes.',      o:'FE',                 w:'Mensal',     ok:'Plano de GMO da gerência entregue e revisto todo mês.'},
 {i:'C', r:'Líder de comunidade',      h:'en',t:'ch',q:'mi',n:'Espaço e ferramentas para a comunidade ter cara própria.',                  a:'Lançar a identidade, a intranet e o onboarding da comunidade.',            o:'Dono de GMO',        w:'Meses 1 e 2',ok:'Intranet no ar; quem chega passa pelo onboarding da comunidade.'},
 {i:'E', r:'Especialista técnico sênior',h:'bv',t:'ne',q:'ms',n:'Ser ouvido. Boicotador velado pesa mais que o quadrante: cuidar de perto.',a:'1:1 para ouvir a crítica; dar um papel no fórum técnico.',              o:'Gerente da gerência',w:'Quinzenal',  ok:'Leva a crítica ao fórum técnico em vez de travar nos bastidores.'},
 {i:'AC',r:'Representante do negócio', h:'ne',t:'en',q:'gp',n:'Saber o que muda para a área cliente, quando e a quem procurar.',           a:'Ponto focal e conversa mensal; comunicado antes de cada entrega.',         o:'Dono de GMO',        w:'Mensal',     ok:'Procura o ponto focal antes de escalar um problema.'},
 {i:'N', r:'Novo integrante',          h:'en',t:'en',q:'mi',n:'Entender a matriz: com quem atua na vertical e na horizontal.',             a:'Onboarding de cultura do modelo matricial na primeira semana.',            o:'Dono de GMO',        w:'Na chegada', ok:'No 1º mês, sabe a quem recorrer na gerência e na comunidade.'}];
P.forEach(p=>p.s=RS[p.h]);
let k=-1, open=false; /* k: -1 = ninguém em destaque (como ler o mapa) · 0..5 = pessoa · open = mapa escrito aberto */
const plot=$('.fs-plot',SEC),PW=$$('.fs-pw',SEC),Q=$$('.fs-q',SEC),panel=$('.fs-panel',SEC),
      BTN=$('.pgbtn.flip',SEC),BTNT=$('span',BTN),BACK=$('.pgbtn.back',SEC),HINT=$('.hint',SEC),HINT0=HINT.innerHTML,
      HINT1='<kbd>←</kbd> volta ao slide · <kbd>→</kbd> próximo slide';
const re=(el,c)=>{el.classList.remove(c);void el.offsetWidth;el.classList.add(c)};
/* estado inicial: mini-mapa 2×2 com quem está em cada quadrante */
const dot=p=>`<i data-s="${p.s}" class="${p.i.length>1?'two':''}">${p.i}</i>`;
const inQ=q=>{const l=P.filter(p=>p.q===q);return l.length?l.map(dot).join(''):'<em>ninguém hoje</em>'};
const INTRO=`<span class="fs-lb">Como ler o mapa</span>
 <b class="fs-pt">O quadrante diz <b>o quanto cuidar</b>. O papel diz <b>como</b>.</b>
 <div class="fs-qg">
  <div data-q="ms"><b>Manter satisfeito</b><span>sem surpresas</span><div class="fs-qd">${inQ('ms')}</div></div>
  <div data-q="gp"><b>Gerenciar de perto</b><span>envolver na decisão</span><div class="fs-qd">${inQ('gp')}</div></div>
  <div data-q="mo"><b>Monitorar</b><span>olhar de vez em quando</span><div class="fs-qd">${inQ('mo')}</div></div>
  <div data-q="mi"><b>Manter informado</b><span>comunicar sempre</span><div class="fs-qd">${inQ('mi')}</div></div>
 </div>
 <p class="fs-pn"><b>Influência</b> = poder de decidir. <b>Interesse</b> = o quanto é afetado. Avance com <kbd>→</kbd> ou clique numa pessoa.</p>`;
const ARW='<svg class="fs-arw" viewBox="0 0 24 24"><path d="M4 12h15M14 6l6 6-6 6"/></svg>';
const person=(p,i)=>`<div class="fs-ph"><i class="fs-pi${p.i.length>1?' two':''}" data-s="${p.s}">${p.i}</i><div><span class="fs-lb">${i+1} de 6 · ${QN[p.q]}</span><b>${p.r}</b></div></div>
 <div class="fs-tr"><span class="fs-lb">Papel hoje → alvo</span><div class="fs-rr"><span class="fs-rc" data-s="${p.s}">${ROLE[p.h]}</span>${ARW}${p.h===p.t?'<em>manter o papel</em>':`<span class="fs-rc to">${ROLE[p.t]}</span>`}</div></div>
 <div class="fs-pr"><div><span class="fs-lb">O que essa pessoa precisa</span><p>${p.n}</p></div><div class="act"><div class="fs-alh"><span class="fs-lb">Ação</span><em>dono: <b>${p.od||p.o}</b> · ${p.w.toLowerCase()}</em></div><p>${p.a}</p></div><div class="ok"><span class="fs-lb">Sinal de que funcionou</span><p>${p.ok}</p></div></div>`;
function show(snd=true){
 PW.forEach((w,i)=>w.classList.toggle('on',i===k));plot.classList.toggle('sel',k>=0);
 Q.forEach(q=>q.classList.toggle('on',k>=0&&q.dataset.q===P[k].q));
 panel.innerHTML=k<0?INTRO:person(P[k],k);re(panel,'swap');
 if(snd&&k>=0){k===P.length-1?ding():tone(480+k*70,.14,'sine',.05,900)}}
PW.forEach((w,i)=>$('.fs-p',w).addEventListener('click',()=>{k=i;show(false);boing()}));
/* virar a página: mapa escrito da FE (classe global .pl-open) · botão do cabeçalho e "Voltar" do documento · hint troca com o plano aberto */
function flip(on,snd=true){open=on;SEC.classList.toggle('pl-open',on);BTN.setAttribute('aria-pressed',on);BTNT.textContent=on?'Voltar ao slide':'Virar a página · ver o mapa';HINT.innerHTML=on?HINT1:HINT0;
 if(snd){on?tone(520,.12,'sine',.05,760):tone(380,.1,'sine',.04)}}
BTN.addEventListener('click',()=>flip(!open));
BACK.addEventListener('click',()=>flip(false));
DECK.register('stakeholders',{
 enter(){k=-1;flip(false,false);show(false)},
 leave(){flip(false,false)},
 step(d){
  if(d>0){if(open)return false;                      /* mapa escrito aberto: → sai do slide */
   if(k<P.length-1){k++;show(true);return true}      /* pessoas 1..6 */
   flip(true);return true}                           /* depois da 6ª pessoa: → vira a página */
  if(open){flip(false);return true}                  /* ← com o mapa aberto: volta ao slide */
  if(k>-1){k--;show(false);return true}return false}
});
})();
