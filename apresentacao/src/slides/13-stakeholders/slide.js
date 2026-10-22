(()=>{const {$,$$,tone,ding,boing}=DECK, SEC=DECK.el('stakeholders');
const POST={a:'Apoiador',n:'Neutro',r:'Resistente'};
const QN={gp:'Gerenciar de perto',ms:'Manter satisfeito',mi:'Manter informado',mo:'Monitorar'};
/* 6 papéis de exemplo (sem nomes reais): inicial, papel, postura, quadrante, o que precisa, ação da GMO, sinal de que funcionou */
const P=[
 {i:'D', r:'Diretor patrocinador',      s:'a',q:'gp',n:'Ver resultado e decidir rápido.',          a:'Termômetro P·E·A no comitê mensal; abre e fecha os eventos-chave.',       ok:'Decide no comitê o que o termômetro apontou, sem a GMO pedir.'},
 {i:'G', r:'Gerente da área impactada', s:'n',q:'gp',n:'Saber o que muda no time dele, e quando.',  a:'1:1 mensal com o plano da área; valida o calendário de treinos.',         ok:'Time inteiro no treino; ninguém diz “não fui avisado”.'},
 {i:'S', r:'Supervisor da operação',    s:'r',q:'ms',n:'Previsibilidade e voz. Resistente pesa mais que o quadrante.',                    a:'Tratar como gerenciar de perto: 1:1 quinzenal, envolver no desenho do fluxo, dar o papel de validador.',  ok:'Apresenta o fluxo novo ao time.'},
 {i:'K', r:'Key user',                  s:'a',q:'mi',n:'Tempo na agenda e reconhecimento.',         a:'Papel oficial de multiplicador; ritual quinzenal com a GMO.',             ok:'Tira as dúvidas dos colegas sem chamar a GMO.'},
 {i:'TI',r:'Líder de TI',               s:'n',q:'ms',n:'Prazos claros e menos retrabalho.',         a:'Prioriza junto os impactos de TI; comunicado assinado em dupla.', ok:'Prazos dos impactos de TI combinados e cumpridos.'},
 {i:'A', r:'Analista entusiasta',       s:'a',q:'mi',n:'Um papel para ajudar.',                     a:'Vira agente da mudança na área; conta a história no News.',               ok:'Outros colegas pedem para virar agentes também.'}];
let k=-1; /* -1 = ninguém em destaque (como ler o mapa) · 0..5 = pessoa */
const plot=$('.fs-plot',SEC),PW=$$('.fs-pw',SEC),Q=$$('.fs-q',SEC),panel=$('.fs-panel',SEC);
const re=(el,c)=>{el.classList.remove(c);void el.offsetWidth;el.classList.add(c)};
/* estado inicial: mini-mapa 2×2 com quem está em cada quadrante */
const dot=p=>`<i data-s="${p.s}" class="${p.i.length>1?'two':''}">${p.i}</i>`;
const inQ=q=>{const l=P.filter(p=>p.q===q);return l.length?l.map(dot).join(''):'<em>ninguém hoje</em>'};
const INTRO=`<span class="fs-lb">Como ler o mapa</span>
 <b class="fs-pt">O quadrante diz <b>o quanto cuidar</b>. A postura diz <b>como</b>.</b>
 <div class="fs-qg">
  <div data-q="ms"><b>Manter satisfeito</b><span>sem surpresas</span><div class="fs-qd">${inQ('ms')}</div></div>
  <div data-q="gp"><b>Gerenciar de perto</b><span>envolver na decisão</span><div class="fs-qd">${inQ('gp')}</div></div>
  <div data-q="mo"><b>Monitorar</b><span>olhar de vez em quando</span><div class="fs-qd">${inQ('mo')}</div></div>
  <div data-q="mi"><b>Manter informado</b><span>comunicar sempre</span><div class="fs-qd">${inQ('mi')}</div></div>
 </div>
 <p class="fs-pn"><b>Influência</b> = poder de decidir. <b>Interesse</b> = o quanto é afetado. Avance com <kbd>→</kbd> ou clique numa pessoa.</p>`;
const person=(p,i)=>`<div class="fs-ph"><i class="fs-pi${p.i.length>1?' two':''}" data-s="${p.s}">${p.i}</i><div><span class="fs-lb">${i+1} de 6 · ${QN[p.q]}</span><b>${p.r}</b></div></div>
 <div class="fs-tr"><span class="fs-lb">Postura hoje</span><div class="fs-trk">${['r','n','a'].map(s=>`<i data-s="${s}" class="${s===p.s?'on':''}">${POST[s]}</i>`).join('')}</div></div>
 <div class="fs-pr"><div><span class="fs-lb">O que essa pessoa precisa</span><p>${p.n}</p></div><div class="act"><span class="fs-lb">Ação da GMO</span><p>${p.a}</p></div><div class="ok"><span class="fs-lb">Sinal de que funcionou</span><p>${p.ok}</p></div></div>`;
function show(snd=true){
 PW.forEach((w,i)=>w.classList.toggle('on',i===k));plot.classList.toggle('sel',k>=0);
 Q.forEach(q=>q.classList.toggle('on',k>=0&&q.dataset.q===P[k].q));
 panel.innerHTML=k<0?INTRO:person(P[k],k);re(panel,'swap');
 if(snd&&k>=0){k===P.length-1?ding():tone(480+k*70,.14,'sine',.05,900)}}
PW.forEach((w,i)=>$('.fs-p',w).addEventListener('click',()=>{k=i;show(false);boing()}));
DECK.register('stakeholders',{
 enter(){k=-1;show(false)},
 step(d){const n=k+d;if(n<-1||n>P.length-1)return false;k=n;show(d>0);return true}
});
})();
