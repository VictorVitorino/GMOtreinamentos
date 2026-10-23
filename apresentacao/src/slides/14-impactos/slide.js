(()=>{const {$,$$,tone,ding,boing}=DECK, SEC=DECK.el('impactos');
/* A matriz se monta em 4 passos: k = 1 categoria · 2 severidade · 3 status · 4 as três linhas de exemplo + leitura do ICI real (hoje × meta).
   k = 0 (ao entrar): visões esmaecidas e a faixa navy mostra o modelo do índice (peso e meta de cada medida).
   Depois do passo 4, um → a mais vira a página (.pl-open: a Matriz de Impactos escrita); mais um → e o deck troca de slide.
   Todo número tem rótulo: "hoje" (corte de junho, projeto real) × "meta" × "faltam". */
const MAX=4;
let k=0, mode='', open=false;
const V=$$('.fi-v',SEC), TAB=$('.fi-tab',SEC), ROWS=$$('.fi-row',SEC), READ=$('.fi-read',SEC),
      BTN=$('.pgbtn.flip',SEC), BTNT=$('span',BTN), HINT=$('.hint',SEC), HINT0=HINT.innerHTML, BACK=$('.pgbtn.back',SEC), PLT=$('.fi-doc .pltab',SEC), DROWS=$$('.fi-doc .plr:not(.hd)',SEC);
const re=(el,c)=>{el.classList.remove(c);void el.offsetWidth;el.classList.add(c)};
const fmt=v=>(Math.round(v*10)/10).toString().replace('.',',');
/* contagem animada (0 → n); dec = casas decimais; sufixo opcional */
function count(el,to,dec=0,suf=''){const t0=performance.now();const f=t=>{const p=Math.min(1,(t-t0)/800),e=1-Math.pow(1-p,3);el.textContent=(to*e).toFixed(dec).replace('.',',')+suf;if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
/* as 4 medidas do ICI: peso · meta · hoje (corte de junho) */
const KT=[{n:'Identificação',p:20,m:95,v:20},{n:'Priorização',p:20,m:90,v:100},{n:'Execução das mitigações',s:'Execução',p:30,m:95,v:18.2},{n:'Eficácia',p:30,m:70,v:66.7}];
/* faixa navy · modelo: ICI = 4 medidas, cada uma com peso e meta (texto, sem barra) */
const MODELO=`<div class="fi-mo"><div class="fi-moh"><span class="fi-lb">O índice desta frente · como se calcula</span><span class="fi-mh">avance com <kbd>→</kbd> até o fim para ver o índice real</span></div>
 <div class="fi-mor"><b>ICI</b><small>meta ≥ 70%</small><i class="fi-eq">=</i>${KT.map((t,i)=>`${i?'<i>+</i>':''}<div class="fi-kt"><b>${t.n}</b><span>peso ${t.p}%</span><em>meta ≥ ${t.m}%</em></div>`).join('')}</div></div>`;
/* faixa navy · real · linha 1: anel (marca da meta em 70) + ICI 49,5% hoje + semáforo · onde agir · legenda · linha 2: 4 medidas "hoje × meta" */
const bul=t=>{const ok=t.v>=t.m;return `<div class="fi-kr ${ok?'ok':'ko'}"><div class="fi-kh"><span>${t.s||t.n}</span><b><em>hoje</em>${fmt(t.v)}%</b></div><div class="fi-bul"><i style="--v:${t.v}"></i><u style="--m:${t.m}"${t.m>=85?' class="edge"':t.m<80?' class="rt"':''}><s>meta ${t.m}%</s></u></div><small>${ok?'✓ bateu a meta':'faltam '+fmt(t.m-t.v)+' pts'}</small></div>`};
const REAL=`<div class="fi-re"><div class="fi-r1"><div class="fi-ring"><svg viewBox="0 0 120 120"><g transform="rotate(-90 60 60)"><circle class="bg" cx="60" cy="60" r="50"/><circle class="fg" cx="60" cy="60" r="50" pathLength="100"/><line x1="98" y1="60" x2="131" y2="60" transform="rotate(252 60 60)"/></g><text x="47" y="63">70</text></svg></div>
 <div class="fi-idx"><div class="fi-rr"><b class="big"><em>hoje · jun</em>ICI 49,5%</b><span class="fi-rp">vermelho</span></div><small>meta ≥ 70% · faltam <b>20,5 pts</b></small></div>
 <div class="fi-act"><p><span class="fi-lb">Onde agir ·</span>Só <b>4 de 22</b> mitigações saíram do papel. Fazer <b>uma por semana</b>, com dono e prazo.</p></div>
 <div class="fi-leg"><span><i class="b"></i>barra = hoje</span><span><i class="t"></i>traço = meta</span></div></div>
 <div class="fi-r2">${KT.map(bul).join('')}</div></div>`;
function show(snd=true){
 V.forEach((v,i)=>{const on=i<k,was=v.classList.contains('on');v.classList.toggle('on',on);
  if(on&&!was)$$('b[data-n]',v).forEach(b=>count(b,+b.dataset.n));
  if(!on)$$('b[data-n]',v).forEach(b=>b.textContent='–')});
 TAB.classList.toggle('on',k>=MAX);
 if(k<MAX){ROWS.forEach(r=>r.classList.remove('on'));TAB.classList.remove('sel')}
 const m=k>=MAX?'real':'modelo';
 if(m!==mode){mode=m;READ.innerHTML=m==='real'?REAL:MODELO;re(READ,'swap')}
 if(snd){k>=MAX?ding():tone(420+k*90,.14,'sine',.05,900)}}
/* clique numa linha destaca (clicar de novo solta) · clique numa visão revela até ela */
ROWS.forEach(r=>r.addEventListener('click',()=>{const was=r.classList.contains('on');ROWS.forEach(x=>x.classList.remove('on'));if(!was)r.classList.add('on');TAB.classList.toggle('sel',!was);boing()}));
V.forEach((v,i)=>v.addEventListener('click',()=>{if(k<i+1){k=i+1;show()}}));
/* verso: clicar numa linha da matriz escrita também destaca */
function clearDoc(){DROWS.forEach(x=>x.classList.remove('on'));PLT.classList.remove('sel')}
DROWS.forEach(r=>r.addEventListener('click',()=>{const was=r.classList.contains('on');clearDoc();if(!was){r.classList.add('on');PLT.classList.add('sel')}boing()}));
/* virar a página: a Matriz de Impactos escrita (classe global .pl-open) · botão do cabeçalho e "Voltar" do documento */
function flip(on,snd=true){open=on;SEC.classList.toggle('pl-open',on);BTN.setAttribute('aria-pressed',on);BTNT.textContent=on?'Voltar ao slide':'Virar a página · ver a matriz';
 HINT.innerHTML=on?'Clique numa linha destaca · <kbd>←</kbd> volta ao slide · <kbd>→</kbd> próximo slide':HINT0;
 if(snd){on?tone(520,.12,'sine',.05,760):tone(380,.1,'sine',.04)}}
BTN.addEventListener('click',()=>flip(!open));
BACK.addEventListener('click',()=>flip(false));
DECK.register('impactos',{
 enter(){k=0;mode='';flip(false,false);clearDoc();show(false)},
 leave(){flip(false,false)},
 step(d){
  if(d>0){if(open)return false;              /* matriz aberta: → sai do slide */
   if(k<MAX){k++;show(true);return true}      /* passos 1..4: visões e as três linhas + leitura */
   flip(true);return true}                    /* depois da leitura: → vira a página */
  if(open){flip(false);return true}           /* ← com a matriz aberta: volta ao slide */
  if(k>0){k--;show(false);return true}return false}
});
})();
