(()=>{const {$,$$,tone,ding,boing,stage}=DECK, SEC=DECK.el('numeros');
/* ---------- 03 · indicadores ---------- */
const BARS=[
 {nm:'Transformação corporativa',src:'McKinsey · 2026 · multissetorial',v:30,dim:1},
 {nm:'Mudança organizacional',src:'Gartner · iniciativas de mudança',v:34,dim:1},
 {nm:'Fusões & aquisições',src:'Christensen et al. · HBR · 2011',r:[10,30],dim:1},
 {nm:'Transformação digital',src:'BCG · 2020 · com 6 fatores críticos',v:30,to:80},
 {nm:'Projetos (todos os setores)',src:'Prosci · 2023 · GMO ruim → excelente',v:13,to:88}
];
(()=>{const s=SEC,chart=$('#chart'),box=$('#bars');let on=false,ready=false;
box.innerHTML=BARS.map(b=>`<div class="brow ${b.dim?'dim':'boost-row'}"><div class="nm"><b>${b.nm}</b><span>${b.src}</span></div><div class="btrack">${b.r?`<i class="range" style="left:${b.r[0]}%;width:${b.r[1]-b.r[0]}%"></i>`:`<i class="base" data-w="${b.v}"></i>`}${b.to?`<i class="boost" style="left:${b.v}%;--bw:${b.to-b.v}%"></i><span class="gap" style="left:${(b.v+b.to)/2}%">+${b.to-b.v} p.p.</span>`:''}</div><div class="val" data-v="${b.v}" data-to="${b.to||''}">${b.r?`${b.r[0]}–${b.r[1]}%<small>criam valor</small>`:b.v+'%'}</div></div>`).join('')+`<div class="base-line" style="left:calc(244px + (100% - 350px) * .3)"><span>~30%</span></div>`;
const setOn=v=>{on=v;chart.classList.toggle('on',v);$('#gmoTg').classList.toggle('on',v);
$$('.boost-row .val',box).forEach(el=>{const a=+el.dataset.v,b=+el.dataset.to;count(el,v?a:b,v?b:a,900)});
$('#chartMsg').innerHTML=v?'Quando o lado humano é gerido, o sucesso salta para <em>80% a 88%</em>: de 2,7× a 7× mais.':'Sem as pessoas no centro, <em>cerca de 3 em cada 10</em> mudanças entregam o que prometeram.';
if(v){ding();burstStage()}};
$('#gmoTg').onclick=()=>setOn(!on);
function count(el,a,b,ms){const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-k,3);el.firstChild.nodeValue=Math.round(a+(b-a)*e)+'%';if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function burstStage(){}
DECK.register('numeros',{enter:()=>{setOn(false);chart.classList.remove('ready');$$('.base',box).forEach(b=>b.style.width='0');$$('.range',box).forEach(r=>r.style.opacity=0);
 $('#ringF').style.strokeDashoffset=540.4;$('#ringF2').style.strokeDashoffset=389.6;$('#seal').classList.remove('stamp');
 setTimeout(()=>{$$('.base',box).forEach(b=>b.style.width=b.dataset.w+'%');$$('.range',box).forEach(r=>r.style.opacity=1);chart.classList.add('ready')},700);
 setTimeout(()=>{$('#ringF').style.strokeDashoffset=540.4*(1-.88);$('#ringF2').style.strokeDashoffset=389.6*(1-.13);const v=$('#ringV');const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/1800),e=1-Math.pow(1-k,3);v.textContent=Math.round(88*e)+'%';if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)},600);
 setTimeout(()=>{$('#seal').classList.add('stamp');setTimeout(()=>{s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');tone(90,.25,'square',.12,40)},420)},2500)},
 step:d=>{if(d>0&&!on){setOn(true);return true}if(d<0&&on){setOn(false);return true}return false}})})();
})();
