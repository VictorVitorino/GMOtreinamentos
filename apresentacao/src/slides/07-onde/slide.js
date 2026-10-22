(()=>{const {$,$$,tone,ding,boing,stage}=DECK, SEC=DECK.el('onde'), FIN=DECK.el('fim');
/* ---------- 07 · onde usar ----------
   passos (→): 0 introdução · 1–7 um cenário por vez (o encerramento virou o slide 'fim') */
const SC=[
 {t:'Transformação cultural ou nova estratégia',d:'mudar o “jeito de ser” da empresa',h:[3,2,1,2],r:'<b>Kotter</b> na frente: urgência, coalizão e visão puxadas pela liderança. <b>ADKAR</b> leva a visão para cada pessoa. <b>CMAK</b> mede a prontidão cultural a cada onda.'},
 {t:'Implantação de sistema (ERP, CRM, IA)',d:'tecnologia nova no dia a dia',h:[1,3,3,3],r:'<b>ADKAR</b> mostra onde cada grupo trava (ponto de barreira). <b>HCMBOK</b> amarra as ações de GMO ao cronograma. <b>CMAK</b> prova a adoção com uso real do sistema × meta.'},
 {t:'Fusão, aquisição ou integração',d:'duas culturas, uma empresa',h:[3,2,2,3],r:'<b>Kotter</b> cria a narrativa única e a coalizão das duas empresas. <b>CMAK</b> monitora resistência, cultura e retenção por área. <b>ADKAR</b> apoia as transições individuais.'},
 {t:'Projeto com PMO e cronograma rígido',d:'entregas, marcos e relatório de status',h:[1,2,3,3],r:'<b>HCMBOK</b> coloca a GMO dentro do plano do projeto: patrocinador, governança e RACI. <b>CMAK</b> leva a GMO ao relatório de status, com metas e semáforo.'},
 {t:'Novo processo ou rotina operacional',d:'o “como fazemos” muda',h:[1,3,2,2],r:'<b>ADKAR</b> é o protagonista: conhecimento e habilidade vêm da prática; o reforço evita a volta ao jeito antigo. <b>HCMBOK</b> organiza as ações no projeto.'},
 {t:'Reestruturação de áreas',d:'papéis, líderes e times mudam',h:[2,3,1,2],r:'<b>ADKAR</b> cuida da transição de cada pessoa: desejo e reforço são críticos. <b>Kotter</b> garante a mensagem da liderança. <b>CMAK</b> acompanha clima e riscos.'},
 {t:'Programa em ondas, com prestação de contas ao conselho',d:'anos de mudança, várias frentes',h:[2,1,2,3],r:'<b>CMAK</b> é a espinha: metas e indicadores por onda. <b>Kotter</b> sustenta a urgência ao longo dos anos. <b>HCMBOK</b> padroniza a execução em cada projeto.'}
];
const LAST=SC.length;

/* ---------- borboleta low-poly (mesmas asas da capa, em SVG) ---------- */
(()=>{const svg=$('#s5Bfly',FIN);if(!svg)return;let sd=23;
 const rnd=()=>{sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
 const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),mix=(a,b,k)=>a.map((v,i)=>v+(b[i]-v)*k),lit=(c,f)=>f>=1?mix(c,[255,255,255],Math.min(1,f-1)):c.map(v=>v*f);
 const rgb=c=>'#'+c.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
 const C={n9:hex('#071A33'),n7:hex('#13315C'),n6:hex('#1B4479'),s6:hex('#3D5F93'),s4:hex('#6E8FBF'),s3:hex('#A3B8D6'),s2:hex('#C9D6E8'),s1:hex('#E4EBF5'),o5:hex('#F26B21'),o4:hex('#FF8A4C'),o2:hex('#FFC7A6')};
 const FW=[[5,-24],[34,-78],[86,-126],[146,-154],[197,-161],[193,-129],[179,-93],[157,-59],[128,-28],[90,-4],[48,7],[5,4]];
 const HW=[[5,-6],[50,-12],[102,-2],[143,27],[161,69],[157,109],[137,141],[104,159],[70,155],[43,132],[23,93],[11,47]];
 const colF=(x,y,r)=>{const j=rnd(),ap=Math.hypot(x-184,(y+150)*1.15);let c=r<.3?mix(C.n7,C.n6,j):r<.52?mix(C.n6,C.s6,j):r<.72?mix(C.s6,C.s4,j):r<.88?mix(C.s4,C.s3,j):mix(C.s3,C.s2,j);
  if(ap<40)c=j<.8?mix(C.o5,C.o4,rnd()):C.o2;else if(ap<64&&j<.3)c=mix(C.s1,[255,255,255],rnd());return lit(c,.9+rnd()*.18-y*.0006)};
 const colH=(x,y,r)=>{const j=rnd();let c=r<.3?mix(C.n7,C.n6,j):r<.58?mix(C.n6,C.s6,j):r<.8?mix(C.s6,C.s4,j):mix(C.s4,C.s3,j);
  if(r>.86&&j<.16)c=mix(C.o5,C.o4,rnd());return lit(c,.88+rnd()*.18-y*.0006)};
 /* asa = contorno subdividido + 2 anéis internos a partir da raiz: facetas triangulares */
 function wing(O,R,col){const P=[];O.forEach((p,i)=>{const q=O[(i+1)%O.length];P.push(p,[(p[0]+q[0])/2,(p[1]+q[1])/2])});
  const n=P.length,ring=(k,j)=>P.map(p=>[R[0]+(p[0]-R[0])*k+(rnd()-.5)*j,R[1]+(p[1]-R[1])*k+(rnd()-.5)*j]),A=ring(.4,8),B=ring(.72,14);
  const T=[],maxR=Math.max(...P.map(p=>Math.hypot(p[0]-R[0],p[1]-R[1])));
  for(let i=0;i<n;i++){const j=(i+1)%n;T.push([R,A[i],A[j]],[A[i],B[i],B[j]],[A[i],B[j],A[j]],[B[i],P[i],P[j]],[B[i],P[j],B[j]])}
  return T.map(v=>{const cx=(v[0][0]+v[1][0]+v[2][0])/3,cy=(v[0][1]+v[1][1]+v[2][1])/3;return {v,c:col(cx,cy,Math.hypot(cx-R[0],cy-R[1])/maxR)}})}
 const F=wing(FW,[12,-8],colF),H=wing(HW,[12,8],colH);
 const poly=(t,s)=>{const a=rnd()*Math.PI*2,d=140+rnd()*170,k=rgb(t.c);return `<polygon points="${t.v.map(([x,y])=>`${(x*s).toFixed(1)},${y.toFixed(1)}`).join(' ')}" fill="${k}" stroke="${k}" stroke-width=".7" stroke-linejoin="round" style="--tx:${(Math.cos(a)*d).toFixed(0)}px;--ty:${(Math.sin(a)*d).toFixed(0)}px;--r:${((rnd()-.5)*240).toFixed(0)}deg;--dl:${(rnd()*420).toFixed(0)}ms"/>`};
 const side=s=>`<g class="wg h">${H.map(t=>poly(t,s)).join('')}</g><g class="wg">${F.map(t=>poly(t,s)).join('')}</g>`;
 const BD='M0 -42C5 -42 7 -37 6 -31C9 -27 8 -18 6 -12C8 0 7 30 4 60C3 78 2 90 0 98C-2 90 -3 78 -4 60C-7 30 -8 0 -6 -12C-8 -18 -9 -27 -6 -31C-7 -37 -5 -42 0 -42Z';
 svg.innerHTML=side(-1)+side(1)+`<g class="bd"><path d="${BD}" fill="#0B2545" stroke="#13315C" stroke-width="1"/><path d="M-3 -8L3 -8L2 40L-2 40Z" fill="#4A6FA5" opacity=".55"/><path d="M-3 -38C-14 -62 -22 -80 -34 -92M3 -38C14 -62 22 -80 34 -92" fill="none" stroke="#A3B8D6" stroke-width="2" stroke-linecap="round"/><circle cx="-34" cy="-92" r="3.6" fill="#FF8A4C"/><circle cx="34" cy="-92" r="3.6" fill="#FF8A4C"/></g>`;
})();

(()=>{const rows=$('#hmRows',SEC),hm=$('#hm',SEC),rec=$('#recipe',SEC),lay=$('#layers',SEC),eye=$('.s5-eye',SEC),h2=$('.s5-h2',SEC),hint=$('.s5-hint',SEC),fin=$('#s5Fin',SEC),bNext=document.getElementById('bNext'),
 NM=['Kotter','ADKAR','HCMBOK','CMAK'],CL=['var(--m-kotter)','var(--m-adkar)','var(--m-hcmbok)','var(--m-cmak)'],LV=['','Pontual','Apoia','Protagonista'];
const HD=[{e:eye.innerHTML,h:h2.innerHTML,n:hint.innerHTML},
 {e:'Encerramento · Para levar',h:'<span class="kw" style="--k:1"><span>A borboleta só voa sozinha</span></span> <span class="kw" style="--k:3"><span class="hl">quando a mudança é adotada.</span></span>',n:'Fim do treinamento · <kbd>←</kbd> volta à matriz'}];
rows.innerHTML=SC.map((s,i)=>`<div class="hm-row" data-i="${i}" role="button" tabindex="0" aria-label="${s.t}"><div class="sc"><b>${s.t}</b><span>${s.d}</span></div>${s.h.map((v,j)=>`<span class="cell l${v}" title="${NM[j]} · ${LV[v]}">${v>1?LV[v]:''}</span>`).join('')}</div>`).join('');
let st=0,hdT=null;

/* receita: a altura acompanha o conteúdo e a troca é animada (o card de camadas absorve a diferença) */
function setRec(html){const vis=SEC.classList.contains('active'),h0=rec.offsetHeight;rec.innerHTML=html;
 if(!vis){rec.style.height='';return}
 rec.style.height='auto';const h1=rec.offsetHeight;rec.style.height=h0+'px';void rec.offsetHeight;rec.style.height=h1+'px';
 rec.classList.remove('swap');void rec.offsetWidth;rec.classList.add('swap')}
const intro=()=>setRec(`<span class="label">Receita da mudança</span><h3>Escolha um cenário e veja a combinação.</h3><p>As quatro abordagens não competem: cada uma enxerga a mudança de uma altura diferente. <b>A pergunta certa não é “qual é a melhor?”, e sim “qual combinação resolve o meu desafio?”</b></p><div class="mix">${NM.map((n,i)=>`<span style="--mc:${CL[i]}"><i></i>${n}</span>`).join('')}</div>`);

/* mostra um cenário (i) ou a introdução (null) */
function pick(i){const r=$$('.hm-row',rows);
 if(i===null){r.forEach(x=>x.classList.remove('on'));hm.classList.remove('sel');lay.classList.remove('sel');$$('.ly',lay).forEach(l=>l.classList.remove('v2','v3'));intro();return}
 if(r[i].classList.contains('on'))return;
 r.forEach((x,j)=>x.classList.toggle('on',j===i));hm.classList.add('sel');lay.classList.add('sel');const s=SC[i];
 $$('.ly',lay).forEach(l=>{const v=s.h[+l.dataset.m];l.classList.toggle('v3',v===3);l.classList.toggle('v2',v===2)});
 const ord=s.h.map((v,j)=>[v,j]).filter(x=>x[0]>1).sort((a,b)=>b[0]-a[0]);
 setRec(`<span class="label">Receita da mudança</span><h3>${s.t}</h3><p>${s.r}</p><div class="mix">${ord.map(([v,j])=>`<span class="${v===3?'k':''}" style="--mc:${CL[j]}"><i></i>${NM[j]}${v===3?' · protagonista':''}</span>`).join('')}</div>`);
 tone(600,.08,'sine',.05)}

/* cabeçalho troca com fade quando entra ou sai do encerramento */
function head(k,instant){clearTimeout(hdT);const H=HD[k];if(h2.dataset.k===String(k))return;h2.dataset.k=k;
 const put=()=>{eye.innerHTML=H.e;h2.innerHTML=H.h;hint.innerHTML=H.n;SEC.classList.remove('swapping')};
 if(instant){put();return}SEC.classList.add('swapping');hdT=setTimeout(put,250)}
function finale(on,instant){if(!fin)return;if(SEC.classList.contains('fin')===on)return;SEC.classList.toggle('fin',on);fin.setAttribute('aria-hidden',!on);head(on?1:0,instant);if(on&&!instant)ding()}

/* o shell desabilita “Avançar” no último slide; aqui ele segue ativo até o encerramento */
const sync=()=>{};
function go(n){st=Math.max(0,Math.min(LAST,n));finale(st===LAST);if(st===0)pick(null);else if(st<=SC.length)pick(st-1);sync()}
function reset(){clearTimeout(hdT);st=0;finale(false,true);SEC.classList.remove('swapping');pick(null);rec.style.height=''}

rows.addEventListener('click',e=>{const r=e.target.closest('.hm-row');if(!r)return;const i=+r.dataset.i;go(r.classList.contains('on')?0:i+1)});
rows.addEventListener('keydown',e=>{if(e.key==='Enter'){const r=e.target.closest('.hm-row');if(r){e.stopPropagation();const i=+r.dataset.i;go(r.classList.contains('on')?0:i+1)}}});
intro();
DECK.register('onde',{
 enter(){reset();setTimeout(sync,0)},
 leave:reset,
 step(d){const n=st+d;if(n<0||n>LAST)return false;go(n);return true}
});
})();
})();
