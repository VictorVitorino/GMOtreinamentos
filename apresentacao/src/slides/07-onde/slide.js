(()=>{const {$,$$,tone,ding,boing,stage}=DECK, SEC=DECK.el('onde');
/* ---------- 05 · onde usar ---------- */
const SC=[
 {t:'Transformação cultural ou nova estratégia',d:'mudar o “jeito de ser” da empresa',h:[3,2,1,2],r:'Kotter na frente: urgência, coalizão e visão puxadas pela liderança. <b>ADKAR</b> leva a visão para cada pessoa. <b>CMAK</b> mede a prontidão cultural a cada onda.'},
 {t:'Implantação de sistema (ERP, CRM, IA)',d:'tecnologia nova no dia a dia',h:[1,3,3,3],r:'<b>ADKAR</b> mostra onde cada grupo trava (ponto de barreira). <b>HCMBOK</b> amarra as ações de GMO ao cronograma. <b>CMAK</b> prova a adoção com uso real do sistema × meta.'},
 {t:'Fusão, aquisição ou integração',d:'duas culturas, uma empresa',h:[3,2,2,3],r:'<b>Kotter</b> cria a narrativa única e a coalizão das duas empresas. <b>CMAK</b> monitora resistência, cultura e retenção por área. <b>ADKAR</b> apoia as transições individuais.'},
 {t:'Projeto com PMO e cronograma rígido',d:'entregas, marcos e status report',h:[1,2,3,3],r:'<b>HCMBOK</b> coloca a GMO dentro do plano do projeto: patrocinador, governança e RACI. <b>CMAK</b> leva a GMO ao status report, com metas e semáforo.'},
 {t:'Novo processo ou rotina operacional',d:'o “como fazemos” muda',h:[1,3,2,2],r:'<b>ADKAR</b> é o protagonista: conhecimento e habilidade vêm de prática; o reforço evita a volta ao jeito antigo. <b>HCMBOK</b> organiza as ações no projeto.'},
 {t:'Reestruturação de áreas',d:'papéis, líderes e times mudam',h:[2,3,1,2],r:'<b>ADKAR</b> cuida da transição de cada pessoa: desejo e reforço são críticos. <b>Kotter</b> garante a mensagem da liderança. <b>CMAK</b> acompanha clima e riscos.'},
 {t:'Programa multiondas com reporte ao board',d:'anos de mudança, várias frentes',h:[2,1,2,3],r:'<b>CMAK</b> é a espinha: metas e indicadores por onda. <b>Kotter</b> sustenta a urgência ao longo dos anos. <b>HCMBOK</b> padroniza a execução em cada projeto.'}
];
(()=>{const rows=$('#hmRows'),hm=$('#hm'),rec=$('#recipe'),lay=$('#layers'),NM=['Kotter','ADKAR','HCMBOK','CMAK'],CL=['var(--m-kotter)','var(--m-adkar)','var(--m-hcmbok)','var(--m-cmak)'],LV=['','Pontual','Apoia','Protagonista'];
rows.innerHTML=SC.map((s,i)=>`<div class="hm-row" data-i="${i}" role="button" tabindex="0"><div class="sc"><b>${s.t}</b><span>${s.d}</span></div>${s.h.map(v=>`<span class="cell l${v}">${LV[v]}</span>`).join('')}</div>`).join('');
const intro=()=>{rec.innerHTML=`<span class="label">Receita da mudança</span><h3>Escolha um cenário e veja a combinação.</h3><p>As quatro abordagens não competem: cada uma enxerga a mudança de uma altura diferente. <b>A pergunta certa não é “qual é a melhor?”, e sim “qual combinação resolve o meu desafio?”</b></p><div class="mix">${NM.map((n,i)=>`<span style="--mc:${CL[i]}"><i></i>${n}</span>`).join('')}</div>`};
function sel(i){const r=$$('.hm-row',rows);if(i===null||r[i].classList.contains('on')){r.forEach(x=>x.classList.remove('on'));hm.classList.remove('sel');lay.classList.remove('sel');$$('.ly',lay).forEach(l=>l.classList.remove('v2','v3'));intro();return}
r.forEach((x,j)=>x.classList.toggle('on',j===i));hm.classList.add('sel');lay.classList.add('sel');const s=SC[i];
$$('.ly',lay).forEach(l=>{const v=s.h[+l.dataset.m];l.classList.toggle('v3',v===3);l.classList.toggle('v2',v===2)});
const ord=s.h.map((v,j)=>[v,j]).filter(x=>x[0]>1).sort((a,b)=>b[0]-a[0]);
rec.innerHTML=`<span class="label">Receita da mudança</span><h3>${s.t}</h3><p>${s.r}</p><div class="mix">${ord.map(([v,j])=>`<span class="${v===3?'k':''}" style="--mc:${CL[j]}"><i></i>${NM[j]}${v===3?' · protagonista':''}</span>`).join('')}</div>`;
rec.classList.remove('swap');void rec.offsetWidth;rec.classList.add('swap');tone(600,.08,'sine',.05)}
rows.addEventListener('click',e=>{const r=e.target.closest('.hm-row');if(r)sel(+r.dataset.i)});
rows.addEventListener('keydown',e=>{if(e.key==='Enter'){const r=e.target.closest('.hm-row');if(r){e.stopPropagation();sel(+r.dataset.i)}}});
intro();DECK.register('onde',{leave:()=>sel(null)})})();
})();
