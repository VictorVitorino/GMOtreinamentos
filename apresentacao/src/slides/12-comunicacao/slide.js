(()=>{const {$,$$,tone,ding,boing}=DECK, SEC=DECK.el('comunicacao');
/* O plano em movimento: 5 fases que rodam a cada marco do projeto.
   k = 0..4 fase aberta (a 1 já vem aberta) · k = 5 leitura do ciclo fechado · depois disso o deck troca de slide. */
const PH=[
 {n:'Montar',w:'Semanas 1 e 2',
  do:['<b>Mapear os públicos:</b> quem é impactado, por grupo.','<b>Escrever as mensagens-chave:</b> o que muda, por quê, o que eu ganho.','<b>Escolher canais e calendário:</b> e-mail, Teams, site e o líder direto.'],
  ent:'Plano de comunicação.',kind:'crit',ind:['100%','cobertura dos públicos'],calc:'<b>públicos mapeados</b> ÷ públicos impactados'},
 {n:'Validar',w:'Semana 3',
  do:['<b>Sponsor e líderes validam</b> as mensagens.','<b>Agentes da mudança recebem o speech</b> e tiram dúvidas.','<b>Ajustar siglas e jargão:</b> ninguém fica sem entender.'],
  ent:'Mensagens aprovadas + playbook dos agentes.',kind:'crit',ind:['100%','mensagens aprovadas antes do marco'],calc:'<b>mensagens aprovadas</b> ÷ mensagens escritas'},
 {n:'Lançar',w:'No marco: kick-off, demo, treinamento, go-live',
  do:['<b>O líder direto fala primeiro.</b>','<b>Depois e-mail / News, Teams e site.</b>','<b>Registrar quem recebeu.</b>'],
  ent:'Campanha no ar + registro de quem recebeu.',kind:'iec',ind:['≥ 90%','alcance'],calc:'<b>quem recebeu</b> ÷ total de impactados'},
 {n:'Medir',w:'7 dias depois',
  do:['<b>Pulse de clareza, 3 perguntas:</b> o que muda? por quê? o que muda para mim?','<b>Abertura e visualizações</b> por canal.','<b>Dúvidas registradas.</b>'],
  ent:'Leitura do pulse: clareza, engajamento e dúvidas.',kind:'iec',ind:['≥ 80% · ≥ 70%','clareza · engajamento'],calc:'clareza: <b>quem entendeu</b> ÷ respondentes<br>engajamento: <b>quem interagiu</b> ÷ alcançados'},
 {n:'Ajustar',w:'Semana seguinte',
  do:['<b>Reforçar o que não pegou:</b> FAQ, vídeo curto, fala do líder.','<b>Responder as dúvidas em 48h.</b>','<b>Preparar o próximo marco.</b>'],
  ent:'FAQ e reforço publicados + próximo marco planejado.',kind:'iec',ind:['≥ 70%','feedback respondido em 48h'],calc:'<b>dúvidas respondidas em 48h</b> ÷ dúvidas registradas'}];
const MAX=PH.length; /* 5: passo final = leitura do ciclo */
/* IEC real (corte de junho): valor × meta de cada key target */
const REAL=[{n:'Alcance',v:75.5,m:90},{n:'Engajamento',v:71.1,m:70},{n:'Clareza',v:74.6,m:80},{n:'Feedback',v:54.3,m:70}];
const HOJE=0;        /* marco aceso na linha do tempo: Kick-off, onde o ciclo começa */
const panel=$('.fc-panel',SEC),TABS=$$('.fc-tabs button',SEC),MK=$$('.fc-mk',SEC),TL=$('.fc-tl',SEC),LIS=$$('.fc-list li',SEC),CNT=$('.fc-cnt',SEC);
let k=0;
const re=(el,c)=>{el.classList.remove(c);void el.offsetWidth;el.classList.add(c)};
function render(){
 if(k<MAX){const p=PH[k];
  panel.innerHTML=`<div class="fc-ph in"><div class="fc-do"><div class="fc-when"><em>Quando</em><b>${p.w}</b></div><span class="fc-lb">O que fazer</span><ol class="fc-steps">${p.do.map((t,i)=>`<li><i>${i+1}</i><span>${t}</span></li>`).join('')}</ol></div><div class="fc-side"><div class="fc-mini"><span class="fc-lb">📦 Entregável</span><p>${p.ent}</p></div><div class="fc-mini ind"><span class="fc-lb">${p.kind==='iec'?'🎯 Indicador do IEC':'✅ Critério de saída'}</span><p><b>${p.ind[0]}</b>${p.ind[1]}</p><div class="fc-calc"><em>A conta</em><span>${p.calc}</span></div></div></div></div>`}
 else{
  panel.innerHTML=`<div class="fc-sum in"><div class="fc-sl"><span class="fc-lb">Leitura · o ciclo fechado</span><h3>Comunicar não é enviar. É conferir se <b>chegou</b>, se foi <b>entendido</b> e se <b>voltou</b>.</h3><div class="fc-chain"><span>1 Montar</span><i>→</i><span>2 Validar</span><i>→</i><span>3 Lançar</span><i>→</i><span>4 Medir</span><i>→</i><span>5 Ajustar</span><i>↻</i></div><p><b>No próximo marco, começa de novo.</b> Um plano, muitas voltas: é assim que o IEC chega a 80%.</p></div><div class="fc-sr"><span class="fc-lb">No projeto real · corte de junho</span>${REAL.map(r=>`<div class="fc-kr ${r.v>=r.m?'ok':'ko'}"><span>${r.n}<em>meta ${r.m}%</em></span><b>${String(r.v).replace('.',',')}%</b><div class="fc-bar"><i style="--v:${r.v}"></i><u style="--m:${r.m}"></u></div></div>`).join('')}<div class="fc-iec"><b>IEC 70,9%</b><span class="y">amarelo</span><em>Onde agir: <b>feedback</b></em></div></div></div>`}
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
DECK.register('comunicacao',{
 enter(){k=0;LIS.forEach(l=>l.classList.remove('on'));$('b',CNT).textContent='0';CNT.classList.remove('ok');show(false)},
 step(d){const n=k+d;if(n<0||n>MAX)return false;k=n;show(d>0);return true}
});
})();
