(()=>{const {$,$$,tone,ding,boing}=DECK, SEC=DECK.el('comunicacao');
/* O plano em movimento: 5 fases que rodam a cada marco (na FE: novo desenvolvimento, evento/fórum,
   newsletter, comunicado à área cliente, sustentação).
   k = 0..4 fase aberta (a 1 já vem aberta) · k = 5 leitura do ciclo fechado · depois disso, → vira a página
   (Plano de Comunicação da FE, .pl-open) · mais um → e o deck troca de slide.
   Todo número tem rótulo: "hoje" × "meta" × "faltam". Os valores de hoje são de OUTRO projeto (exemplo):
   a FE ainda vai medir o ponto de partida no mês 3. */
const PH=[
 {n:'Montar',w:'Semanas 1 e 2',
  do:['<b>Mapear os públicos:</b> quem é impactado, por grupo.','<b>Escrever as mensagens-chave:</b> o que muda, por quê, o que eu ganho.','<b>Escolher canais e calendário:</b> intranet, newsletter, Teams e o líder direto.'],
  ent:'Plano de comunicação (veja a página virada).',kind:'crit',crit:{m:'100%',t:'<b>Cobertura dos públicos.</b> Todo grupo impactado tem linha no plano antes de seguir.'},calc:'<b>públicos mapeados</b> ÷ públicos impactados'},
 {n:'Validar',w:'Semana 3',
  do:['<b>A FE e os gerentes validam</b> as mensagens.','<b>Os porta-vozes recebem o speech</b> e tiram dúvidas.','<b>Ajustar siglas e jargão:</b> ninguém fica sem entender.'],
  ent:'Mensagens aprovadas + speech dos porta-vozes.',kind:'crit',crit:{m:'100%',t:'<b>Mensagens aprovadas</b> antes do marco. Nada sai sem o aval de quem assina.'},calc:'<b>mensagens aprovadas</b> ÷ mensagens escritas'},
 {n:'Lançar',w:'No marco: entrega, evento, newsletter, comunicado',
  do:['<b>O líder direto fala primeiro.</b>','<b>Depois newsletter, intranet e Teams.</b>','<b>Registrar quem recebeu.</b>'],
  ent:'Campanha no ar + registro de quem recebeu.',kind:'iec',ind:[{n:'Alcance',v:75.5,m:90}],calc:'<b>quem recebeu</b> ÷ total de impactados · <b>538 de 713</b>'},
 {n:'Medir',w:'7 dias depois',
  do:['<b>Pulse de clareza, 3 perguntas:</b> o que muda? por quê? o que muda para mim?','<b>Abertura e visualizações</b> por canal.','<b>Dúvidas registradas.</b>'],
  ent:'Leitura do pulse e das dúvidas.',kind:'iec',ind:[{n:'Clareza',v:74.6,m:80},{n:'Engajamento',v:71.1,m:70}],calc:'clareza: <b>entenderam</b> ÷ respondentes<br>engajamento: <b>interagiram</b> ÷ alcançados'},
 {n:'Ajustar',w:'Semana seguinte',
  do:['<b>Reforçar o que não pegou:</b> FAQ, vídeo curto, fala do líder.','<b>Responder as dúvidas em 48h.</b>','<b>Preparar o próximo marco.</b>'],
  ent:'FAQ e reforço publicados + próximo marco planejado.',kind:'iec',ind:[{n:'Feedback em 48h',v:54.3,m:70}],calc:'<b>respondidas em 48h</b> ÷ dúvidas registradas · <b>165 de 304</b>'}];
const MAX=PH.length; /* 5: passo final da frente = leitura do ciclo */
/* IEC de outro projeto (exemplo): hoje × meta de cada key target */
const REAL=[{n:'Alcance',v:75.5,m:90},{n:'Engajamento',v:71.1,m:70},{n:'Clareza',v:74.6,m:80},{n:'Feedback',v:54.3,m:70}];
const HOJE=0;        /* marco aceso na linha do tempo: Novo desenvolvimento, onde o ciclo começa */
const panel=$('.fc-panel',SEC),TABS=$$('.fc-tabs button',SEC),MK=$$('.fc-mk',SEC),TL=$('.fc-tl',SEC),LIS=$$('.fc-list li',SEC),CNT=$('.fc-cnt',SEC),
      BTN=$('.pgbtn.flip',SEC),BTNT=$('span',BTN),BACK=$('.pgbtn.back',SEC),HINT=$('.hint',SEC),HINT0=HINT.innerHTML,
      HINT1='<kbd>←</kbd> volta ao slide · <kbd>→</kbd> próximo slide';
let k=0, open=false;
/* reinicia uma animação de entrada e tira a classe quando acaba: nada fica com transform em repouso (texto nítido) */
const re=(el,c,ms=700)=>{el.classList.remove(c);void el.offsetWidth;el.classList.add(c);setTimeout(()=>el.classList.remove(c),ms)};
const settle=()=>{const el=panel.firstElementChild;if(el)setTimeout(()=>el.classList.remove('in'),900)};
const fmt=v=>(Math.round(v*10)/10).toString().replace('.',',');
const gap=r=>r.v>=r.m?'✓ bateu':`faltam ${fmt(r.m-r.v)} pts`;
/* gráfico "hoje × meta": barra = hoje (verde se bateu, laranja se não) · traço com etiqueta = meta */
const bar=r=>`<div class="fc-bar"><i style="--v:${r.v}"></i><u style="--m:${r.m}"${r.m>=88?' class="edge"':''}><s>meta ${r.m}%</s></u></div>`;
const tiles=r=>`<div class="fc-kr ${r.v>=r.m?'ok':'ko'}"><div class="fc-kh"><span>${r.n}</span></div><div class="fc-st"><div class="now"><em>hoje</em><b>${fmt(r.v)}%</b></div><div><em>meta</em><b>≥ ${r.m}%</b></div><div class="gap"><em>${r.v>=r.m?'resultado':'faltam'}</em><b>${r.v>=r.m?'✓ bateu':fmt(r.m-r.v)+' pts'}</b></div></div>${bar(r)}</div>`;
const row=r=>`<div class="fc-kr cmp ${r.v>=r.m?'ok':'ko'}"><div class="fc-kh"><span>${r.n}<small>${gap(r)}</small></span><b><em>hoje</em>${fmt(r.v)}%</b></div>${bar(r)}</div>`;
function indCard(p){
 if(p.kind==='crit')return `<div class="fc-mini ind"><span class="fc-lb">✅ Critério de saída</span><div class="fc-cr"><span class="fc-mt">meta</span><b>${p.crit.m}</b></div><p>${p.crit.t}</p><div class="fc-calc"><em>A conta</em><span>${p.calc}</span></div></div>`;
 return `<div class="fc-mini ind"><span class="fc-lb">🎯 IEC · exemplo de outro projeto</span><span class="fc-leg">barra = hoje · traço = meta</span>${p.ind.map(p.ind.length>1?row:tiles).join('')}<div class="fc-calc"><em>A conta</em><span>${p.calc}</span></div></div>`}
function render(){
 if(k<MAX){const p=PH[k];
  panel.innerHTML=`<div class="fc-ph in"><div class="fc-do"><div class="fc-when"><em>Quando</em><b>${p.w}</b></div><span class="fc-lb">O que fazer</span><ol class="fc-steps">${p.do.map((t,i)=>`<li><i>${i+1}</i><span>${t}</span></li>`).join('')}</ol></div><div class="fc-side"><div class="fc-mini"><span class="fc-lb">📦 Entregável</span><p>${p.ent}</p></div>${indCard(p)}</div></div>`}
 else{
  panel.innerHTML=`<div class="fc-sum in"><div class="fc-sl"><span class="fc-lb">Leitura · o ciclo fechado</span><h3>Comunicar não é enviar. É conferir se <b>chegou</b>, se foi <b>entendido</b> e se <b>voltou</b>.</h3><div class="fc-chain"><span>1 Montar</span><i>→</i><span>2 Validar</span><i>→</i><span>3 Lançar</span><i>→</i><span>4 Medir</span><i>→</i><span>5 Ajustar</span><i>↻</i></div><p><b>No próximo marco, começa de novo.</b> Um plano, muitas voltas: é assim que o IEC chega à meta de 80%. Quer ver o plano da FE? <b>Vire a página.</b></p></div><div class="fc-sr"><span class="fc-lb">IEC · exemplo de outro projeto</span><span class="fc-leg">barra = hoje · traço = meta</span>${REAL.map(row).join('')}<div class="fc-iec"><b><em>hoje</em>IEC 70,9%</b><span class="y">amarelo</span><span>meta ≥ 80% · faltam 9,1 pts</span><span class="ag">Onde agir: <b>feedback</b></span></div></div></div>`}
 settle();
 TABS.forEach((b,i)=>{b.classList.toggle('on',i===k);b.classList.toggle('done',i<k);b.setAttribute('aria-selected',i===k)});
 TL.classList.toggle('all',k===MAX);
 MK.forEach((m,i)=>{const s=$('span',m),lit=k<MAX&&i===HOJE;m.classList.toggle('lit',lit);
  s.textContent=k===MAX?'↻ 5 fases':lit?`fase ${k+1} · ${PH[k].n}`:'↻';if(lit||k===MAX)re(s,'in')});
}
function show(snd=true){render();if(snd){k===MAX?ding():tone(440+k*100,.14,'sine',.05,900)}}
TABS.forEach((b,i)=>b.addEventListener('click',()=>{k=i;show(false);boing()}));
/* checklist: clicar marca ✓ · 7/7 toca o ding */
function tick(li){li.classList.toggle('on');const n=LIS.filter(l=>l.classList.contains('on')).length;$('b',CNT).textContent=n;CNT.classList.toggle('ok',n===LIS.length);n===LIS.length?ding():tone(500+n*70,.1,'sine',.05,980)}
LIS.forEach(li=>li.addEventListener('click',()=>tick(li)));
/* virar a página: plano escrito (classe global .pl-open) · botão do cabeçalho e "Voltar" do documento */
function flip(on,snd=true){open=on;SEC.classList.toggle('pl-open',on);BTN.setAttribute('aria-pressed',on);BTNT.textContent=on?'Voltar ao slide':'Virar a página · ver o plano';HINT.innerHTML=on?HINT1:HINT0;
 if(snd){on?tone(520,.12,'sine',.05,760):tone(380,.1,'sine',.04)}}
BTN.addEventListener('click',()=>flip(!open));
BACK.addEventListener('click',()=>flip(false));
DECK.register('comunicacao',{
 enter(){k=0;flip(false,false);LIS.forEach(l=>l.classList.remove('on'));$('b',CNT).textContent='0';CNT.classList.remove('ok');show(false)},
 leave(){flip(false,false)},
 step(d){
  if(d>0){if(open)return false;             /* plano aberto: → sai do slide */
   if(k<MAX){k++;show(true);return true}     /* fases 2..5 e a leitura */
   flip(true);return true}                   /* depois da leitura: → vira a página */
  if(open){flip(false);return true}          /* ← com o plano aberto: volta ao slide */
  if(k>0){k--;show(false);return true}return false}
});
})();
