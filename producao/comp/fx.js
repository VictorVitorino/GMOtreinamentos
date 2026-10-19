/* ==== v3 · framework visual: paleta, letterbox, blocos de cor, tipografia cinética, gravura, transições ==== */
"use strict";
const C={ink:'#1B1E21',ink2:'#25282C',graphite:'#54575C',olive:'#7F8C0E',olive2:'#5C6808',lime:'#AEB800',yellow:'#D8D63A',teal:'#3F7B72',teal2:'#2C5953',paper:'#F4F6F1',paper2:'#EDE8D8',sepia:'#E3D6B4',sepia2:'#C9B990',bad:'#B3402D',bad2:'#7E2A1C',white:'#FFFFFF',cream:'#FBF7E8'};
const FH="'Barlow Condensed','Arial Narrow',sans-serif", FB="'Inter','Segoe UI',sans-serif", FM="'Playfair Display',Georgia,serif", FT="'Special Elite','Courier New',monospace";
const stage=document.getElementById('stage');
const SCENES={}; let UID=0;
function R(node,base,opts){const id='e'+(UID++);reg(id,node,base,opts);return id}
function box(parent,w,h,extra){return H('div',{style:`position:absolute;left:0;top:0;width:${w}px;height:${h}px;${extra||''}`},parent)}
function mkScene(id,bg,t0,t1){const root=H('div',{class:'scene',style:`position:absolute;inset:0;overflow:hidden;background:${bg||C.ink}`},stage);const cam=H('div',{style:'position:absolute;inset:0;transform-origin:50% 50%'},root);const over=H('div',{style:'position:absolute;inset:0;pointer-events:none'},root);reg(id,root,{},{noTransform:true});reg(id+'cam',cam,{});SCENES[id]={root,cam,over,t0,t1};if(t0!==undefined)showBetween(id,t0,t1);return SCENES[id]}
function pop(id,t,dur,from,ease){setAt(id,0,{o:0});setAt(id,t,{o:1,sx:from===undefined?0.5:from,sy:from===undefined?0.5:from});tw(id,t,dur||0.4,{sx:1,sy:1},ease||'back')}
function fadeIn(id,t,dur){setAt(id,0,{o:0});kf(id,'o',t,0,'lin');kf(id,'o',t+(dur||0.4),1,'out')}
function fadeOut(id,t,dur){tw(id,t,dur||0.4,{o:0},'in')}
function flyIn(id,t,dur,from,to,ease){setAt(id,0,{o:0});setAt(id,t,{o:1,x:from.x,y:from.y,rot:from.rot||0});tw(id,t,dur,{x:to.x,y:to.y,rot:to.rot||0},ease||'backSoft')}
function slam(id,t,from,rot){setAt(id,0,{o:0});setAt(id,t,{o:1,sx:from||2.2,sy:from||2.2,rot:(rot||0)-5});tw(id,t,0.14,{sx:1,sy:1,rot:rot||0},'in');tw(id,t+0.14,0.16,{sx:1.04,sy:1.04},'out');tw(id,t+0.3,0.2,{sx:1,sy:1},'out')}
function camTo(sid,t,dur,s,px,py,ease){tw(sid+'cam',t,dur,{sx:s,sy:s,x:(960-px)*(s-1),y:(540-py)*(s-1)},ease||'inOut')}
function camSet(sid,t,s,px,py){setAt(sid+'cam',t,{sx:s,sy:s,x:(960-px)*(s-1),y:(540-py)*(s-1)})}
function camBump(sid,t,amt){const id=sid+'cam';amt=amt||0.014;proc(tt=>{const p=(tt-t)/0.42;if(p<0||p>1)return;const k=p<0.16?E.out(p/0.16):1-E.inOut((p-0.16)/0.84);const r=REG[id].cur;const f=1+amt*k;r.sx*=f;r.sy*=f})}
function shake(sid,t0,dur,amp){const id=sid+'cam';proc(t=>{if(t<t0||t>t0+dur)return;const k=1-(t-t0)/dur;const r=REG[id].cur;r.x+=noise1(t*40,11)*amp*k;r.y+=noise1(t*37,12)*amp*k})}
function fmtInt(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')}
function counter(el,t0,dur,target,prefix,suffix,ease){proc(t=>{const p=(ease||E.out)(clamp((t-t0)/dur,0,1));el.textContent=(prefix||'')+fmtInt(target*p)+(suffix||'')})}
function typed(el,txt,t0,cps){proc(t=>{const n=clamp((t-t0)*(cps||40),0,txt.length);el.textContent=txt.slice(0,Math.floor(n))})}

/* ---------- pós-produção: letterbox, vignette, grão, flash, leak, fade ---------- */
const post=H('div',{style:'position:absolute;inset:0;pointer-events:none'},stage);
const leak=H('div',{style:'position:absolute;left:-500px;top:-500px;width:1500px;height:1500px;border-radius:50%;background:radial-gradient(circle,rgba(255,222,160,.45),rgba(255,190,110,.14) 42%,transparent 70%);mix-blend-mode:screen'},post);reg('leak',leak,{o:.35});
proc(t=>{const r=REG.leak.cur;r.x=500+Math.sin(t*0.21)*520+noise1(t*0.3,3)*120;r.y=120+Math.cos(t*0.17)*260});
H('div',{style:'position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,transparent 50%,rgba(10,12,14,.5) 100%)'},post);
const grain=H('div',{style:`position:absolute;inset:-64px;background:url(${TEX.grain});background-size:256px;opacity:.10;mix-blend-mode:overlay`},post);
proc(t=>{const f=Math.floor(t*30);grain.style.backgroundPosition=`${Math.floor(hash(f)*256)}px ${Math.floor(hash(f+99)*256)}px`});
const LB=62;const barT=H('div',{style:`position:absolute;left:0;top:0;width:1920px;height:${LB}px;background:#050607`},post),barB=H('div',{style:`position:absolute;left:0;bottom:0;width:1920px;height:${LB}px;background:#050607`},post);
const flash=H('div',{style:'position:absolute;inset:0;background:#fff'},post);reg('flash',flash,{o:0});
function flashAt(t,amt,dur,color){setAt('flash',t,{o:amt||.5});tw('flash',t,dur||.3,{o:0},'out');if(color)proc(tt=>{if(tt>=t&&tt<t+(dur||.3))flash.style.background=color;else if(tt>=t+(dur||.3)&&tt<t+(dur||.3)+0.05)flash.style.background='#fff'})}
const fade=H('div',{style:'position:absolute;inset:0;background:#000'},post);reg('fade',fade,{o:0});
/* legenda de fonte (canto inferior direito, acima da barra) */
const citeEl=H('div',{style:`position:absolute;right:48px;bottom:${LB+16}px;max-width:900px;text-align:right;font:500 19px/1.3 ${FB};color:rgba(244,246,241,.78);letter-spacing:.02em;text-shadow:0 1px 2px rgba(0,0,0,.6)`},post);reg('cite',citeEl,{o:0},{noTransform:true});
const CITES=[];function cite(text,t0,t1){CITES.push({text,t0,t1})}
proc(t=>{const c=CITES.find(x=>t>=x.t0&&t<x.t1);const r=REG.cite.cur;if(!c){r.o=0;return}citeEl.textContent=c.text;const a=clamp((t-c.t0)/0.35,0,1),b=clamp((c.t1-t)/0.35,0,1);r.o=Math.min(a,b)*0.95});
/* glitch: fatias horizontais coloridas + jitter rápido do palco */
const glitchL=H('div',{style:'position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen'},post);const gl=[];for(let i=0;i<14;i++)gl.push(H('div',{style:'position:absolute;left:0;width:1920px;height:10px;background:#AEB800;opacity:0'},glitchL));
const GLITCH=[];function glitchAt(t0,dur){GLITCH.push({t0,dur:dur||0.28})}
proc(t=>{const g=GLITCH.find(x=>t>=x.t0&&t<x.t0+x.dur);const f=Math.floor(t*30);if(!g){gl.forEach(d=>d.style.opacity=0);stage.style.transform=stage.style.transform.replace(/ translate\([^)]*\)$/,'');return}
  const p=(t-g.t0)/g.dur;const k=Math.sin(p*Math.PI);gl.forEach((d,i)=>{const on=hash(f*7+i)<0.65*k;d.style.opacity=on?0.25+hash(f+i)*0.5:0;d.style.top=(hash(f*3+i*13)*1080)+'px';d.style.height=(2+hash(f*5+i)*28)+'px';d.style.background=['#AEB800','#3F7B72','#D8D63A','#B3402D','#ffffff'][i%5];d.style.transform=`translateX(${(hash(f*11+i)-.5)*120*k}px)`})});
/* transições */
function tearIn(sid,t0,dur,dir){const root=SCENES[sid].root;const rows=22;const jit=[];for(let i=0;i<=rows;i++)jit.push((hash(i*7.1+t0*3)-.5)*110);
  proc(t=>{if(t<t0||t>t0+dur){if(root.style.clipPath)root.style.clipPath='none';return}const p=E.inOut(clamp((t-t0)/dur,0,1));const pts=[];
    if(dir==='left'){const x=-130+p*(1920+260);pts.push('0px 0px');for(let i=0;i<=rows;i++)pts.push(`${x+jit[i]}px ${i/rows*1080}px`);pts.push('0px 1080px')}
    else if(dir==='right'){const x=2050-p*(1920+260);pts.push('1920px 0px');for(let i=0;i<=rows;i++)pts.push(`${x+jit[i]}px ${i/rows*1080}px`);pts.push('1920px 1080px')}
    else if(dir==='down'){const y=-130+p*(1080+260);pts.push('0px 0px','1920px 0px');for(let i=rows;i>=0;i--)pts.push(`${i/rows*1920}px ${y+jit[i]}px`)}
    else {const y=1210-p*(1080+260);pts.push('0px 1080px','1920px 1080px');for(let i=rows;i>=0;i--)pts.push(`${i/rows*1920}px ${y+jit[i]}px`)}
    root.style.clipPath=`polygon(${pts.join(',')})`})}
function irisIn(sid,t0,dur,cx,cy){const root=SCENES[sid].root;proc(t=>{if(t<t0||t>t0+dur){if(root.style.clipPath)root.style.clipPath='none';return}const p=E.inOut(clamp((t-t0)/dur,0,1));root.style.clipPath=`circle(${p*1500}px at ${cx||960}px ${cy||540}px)`})}
function wipeIn(sid,t0,dur,dir,color){/* bloco de cor atravessa a tela e revela a cena */const blk=H('div',{style:`position:absolute;left:0;top:0;width:1920px;height:1080px;background:${color||C.lime}`},stage);stage.insertBefore(blk,post);const id=R(blk,{o:0});
  const root=SCENES[sid].root;const from=dir==='left'?-1920:1920;setAt(id,t0-dur/2,{o:1,x:from});tw(id,t0-dur/2,dur/2,{x:0},'in');tw(id,t0,dur/2,{x:-from},'out');setAt(id,t0+dur/2+0.01,{o:0});
  proc(t=>{if(t<t0-dur/2||t>t0+dur/2){if(root.style.clipPath)root.style.clipPath='none';return}if(t<t0){root.style.clipPath='inset(0 0 0 100%)';return}const p=E.out(clamp((t-t0)/(dur/2),0,1));root.style.clipPath=dir==='left'?`inset(0 ${(1-p)*100}% 0 0)`:`inset(0 0 0 ${(1-p)*100}%)`})}
function zoomThrough(sidOut,sidIn,t0,dur,px,py){/* a cena sai mergulhando num ponto; a nova nasce do centro */camTo(sidOut,t0,dur,3.2,px||960,py||540,'in');tw(sidOut,t0+dur*0.45,dur*0.55,{o:0},'in');
  const cin=sidIn+'cam';setAt(cin,t0,{sx:.55,sy:.55});tw(cin,t0,dur*1.1,{sx:1,sy:1,x:0,y:0},'out');setAt(sidIn,0,{o:0});kf(sidIn,'o',t0+dur*0.2,0,'lin');kf(sidIn,'o',t0+dur*0.6,1,'out')}

/* ---------- fundos ---------- */
function bgGrid(parent,color,line,persp){const d=H('div',{style:`position:absolute;inset:-200px;background:${color};background-image:linear-gradient(${line} 2px,transparent 2px),linear-gradient(90deg,${line} 2px,transparent 2px);background-size:96px 96px;transform-origin:50% 50%;${persp?'transform:perspective(1200px) rotateX(28deg) scale(1.4)':''}`},parent);return d}
function bgPaper(parent,tone){H('div',{style:`position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,${tone||C.sepia},${C.sepia2} 85%)`},parent);H('div',{style:`position:absolute;inset:0;background:url(${TEX.paper});background-size:640px;opacity:.7;mix-blend-mode:multiply`},parent)}
function bgInk(parent,glow){H('div',{style:`position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,#2b2f34,${C.ink} 75%)`},parent);if(glow)H('div',{style:`position:absolute;inset:0;background:radial-gradient(ellipse at ${glow.x||50}% ${glow.y||50}%,${glow.c||'rgba(174,184,0,.18)'},transparent 55%)`},parent)}
function bgBlock(parent,color){H('div',{style:`position:absolute;inset:0;background:${color};`},parent);H('div',{style:`position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(255,255,255,.08),transparent 60%),radial-gradient(ellipse at 50% 120%,rgba(0,0,0,.35),transparent 60%)`},parent)}

/* ---------- tipografia cinética ---------- */
/* K(parent,{line,seg,text?,x,y,w,size,color,em,align,style:'slam'|'rise'|'type'|'drop',hold}) */
function wordTimes(lineId,segIdx,n){const L=LINES[lineId];const sg=L.segs[Math.min(segIdx,L.segs.length-1)];const t0=L.start+sg.t0,t1=L.start+sg.t1;const words=sg.text.split(/\s+/);const total=words.reduce((a,w)=>a+w.length+1,0);let acc=0;const out=[];words.forEach(w=>{out.push(t0+(acc/total)*(t1-t0));acc+=w.length+1});return {times:out,t0,t1,words}}
function K(parent,o){let txt=(o.text!==undefined?o.text:LINES[o.line].segs[o.seg].text);txt=txt.replace(/\*([^*]+)\*/g,(m,s)=>s.trim().split(/\s+/).map(w=>'*'+w+'*').join(' ')).replace(/_([^_]+)_/g,(m,s)=>s.trim().split(/\s+/).map(w=>'_'+w+'_').join(' '));const toks=txt.replace(/[.!?;:,…]+$/,'').split(/\s+/).filter(Boolean);
  const w=box(parent,o.w||1400,10,'transform-origin:50% 50%');const inner=H('div',{style:`font:800 ${o.size||104}px/1.02 ${o.font||FH};color:${o.color||C.paper};text-transform:${o.upper===false?'none':'uppercase'};letter-spacing:${o.ls||'-.005em'};text-align:${o.align||'center'};width:${o.w||1400}px;${o.inner||''}`},w);
  const spans=[];toks.forEach((tk,i)=>{let word=tk,cls='';const mm=tk.match(/^(\*|_)(.+?)\1([.,;:!?…»)]*)$/);if(mm){word=mm[2]+mm[3];cls=mm[1]==='*'?'em':'em2'}const br=word.endsWith('|');if(br)word=word.slice(0,-1);
    const sp=H('span',{style:`display:inline-block;margin:0 .13em;opacity:0;will-change:transform,opacity;${cls==='em'?`color:${o.emColor||C.lime};text-shadow:${extrude(o.emShadow||C.olive2,o.extrude===false?0:6)}`:cls==='em2'?`color:${C.yellow}`:''}`},inner,word);spans.push(sp);if(br)H('br',null,inner)});
  // tempos por palavra: do segmento (se line) ou proporcionais entre t0..t1
  let times;if(o.line!==undefined&&o.times===undefined){const wt=wordTimes(o.line,o.seg||0);times=spans.map((_,i)=>wt.times[Math.min(i,wt.times.length-1)]-(o.lead===undefined?0.08:o.lead))}else{const t0=o.t0,t1=o.t1||t0+1;times=spans.map((_,i)=>t0+(i/spans.length)*(t1-t0))}
  if(o.times)times=o.times;const style=o.style||'slam';const hold=o.hold;const outT=o.out;
  proc(t=>{spans.forEach((sp,i)=>{const p=clamp((t-times[i])/(o.dur||0.22),0,1);let op=p,tr='';if(style==='slam'){const s=1.7-0.7*E.out(p);tr=`scale(${s})`;op=p}else if(style==='rise'){tr=`translateY(${(1-E.out(p))*44}px)`}else if(style==='drop'){tr=`translateY(${(1-E.bounce(p))*-70}px)`}else if(style==='type'){op=p>0?1:0}else if(style==='blur'){sp.style.filter=`blur(${(1-p)*14}px)`}
      if(outT!==undefined&&t>outT){const q=clamp((t-outT)/0.3,0,1);op*=1-q;tr+=` translateY(${-q*30}px)`}
      sp.style.opacity=op;sp.style.transform=tr})});
  const id=R(w,{x:o.x||260,y:o.y||440});if(o.o0!==undefined)setAt(id,0,{o:o.o0});w._id=id;w._spans=spans;w._times=times;return w}
function extrude(color,n){const a=[];for(let i=1;i<=n;i++)a.push(`${i}px ${i}px 0 ${color}`);return a.join(',')||'none'}
/* carimbo de ano grande (odômetro) */
function yearStamp(parent,o){const d=H('div',{style:`position:absolute;left:0;top:0;font:800 ${o.size||260}px/1 ${FH};color:${o.color||C.paper};letter-spacing:-.02em;transform-origin:50% 50%;text-shadow:${o.extrude?extrude(o.extrude,10):'none'};${o.outline?`-webkit-text-stroke:3px ${o.outline};color:transparent;`:''}`},parent,String(o.from||o.year));
  const id=R(d,{x:o.x||120,y:o.y||120});if(o.from!==undefined&&o.at!==undefined){proc(t=>{const p=E.out(clamp((t-o.at)/(o.dur||1.0),0,1));d.textContent=String(Math.round(o.from+(o.year-o.from)*p))})}d._id=id;return d}
function label(parent,txt,o){o=o||{};return H('div',{style:`position:absolute;left:0;top:0;transform-origin:50% 50%;font:${o.weight||700} ${o.size||26}px/1.15 ${o.font||FB};color:${o.color||C.paper};${o.upper===false?'':'text-transform:uppercase;'}letter-spacing:${o.ls||'.14em'};${o.bg?`background:${o.bg};padding:${o.pad||'10px 16px'};border-radius:${o.radius||8}px;`:''}${o.w?`width:${o.w}px;`:''}${o.style||''}`},parent,txt)}
function serif(parent,txt,o){o=o||{};return H('div',{style:`position:absolute;left:0;top:0;transform-origin:50% 50%;font:${o.weight||400} ${o.italic===false?'':'italic '}${o.size||44}px/1.25 ${FM};color:${o.color||C.ink};${o.w?`width:${o.w}px;`:''}text-align:${o.align||'left'};${o.style||''}`},parent,txt)}
function stamp(parent,txt,o){o=o||{};const col=o.color||C.bad;return H('div',{style:`position:absolute;left:0;top:0;transform-origin:50% 50%;padding:${o.pad||'8px 22px'};border:${o.border||6}px double ${col};color:${col};font:800 ${o.size||72}px/1 ${FH};text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;mix-blend-mode:${o.blend||'multiply'};opacity:.92;border-radius:6px`},parent,txt)}
function card(parent,html,o){o=o||{};return H('div',{style:`position:absolute;left:0;top:0;width:${o.w||520}px;transform-origin:50% 50%;background:${o.bg||C.paper};color:${o.color||C.ink};border-radius:${o.radius||18}px;padding:${o.pad||'22px 26px'};box-sizing:border-box;font:${o.font||`600 28px/1.25 ${FB}`};box-shadow:0 18px 40px rgba(0,0,0,.35);${o.style||''}`},parent,html)}

/* ---------- gravura: padrões de hachura e estilo de tinta ---------- */
const DEFSVG=S('svg',{width:0,height:0,style:'position:absolute'},stage);const DEFS=S('defs',null,DEFSVG);
function hatch(id,color,angle,gap,wid){const p=S('pattern',{id,patternUnits:'userSpaceOnUse',width:gap||7,height:gap||7,patternTransform:`rotate(${angle||45})`},DEFS);S('rect',{width:gap||7,height:gap||7,fill:'transparent'},p);S('line',{x1:0,y1:0,x2:0,y2:gap||7,stroke:color,'stroke-width':wid||2},p);return `url(#${id})`}
const HATCH={ink:hatch('h-ink',C.ink,45,7,2.2),ink2:hatch('h-ink2',C.ink,-45,5,1.6),sepia:hatch('h-sepia',C.sepia2,45,6,2.4),olive:hatch('h-olive',C.olive2,45,7,2.4),teal:hatch('h-teal',C.teal2,45,7,2.4),bad:hatch('h-bad',C.bad2,45,7,2.4),paper:hatch('h-paper','rgba(244,246,241,.55)',45,6,1.8),lime:hatch('h-lime',C.olive,-45,6,2)};
const INK={stroke:C.ink,'stroke-width':4,'stroke-linejoin':'round','stroke-linecap':'round'};
function ink(attrs){return Object.assign({},INK,attrs||{})}
/* elemento SVG posicionado (wrapper HTML) */
function svgBox(parent,w,h,vb){const wrap=box(parent,w,h,'transform-origin:50% 50%');const svg=S('svg',{viewBox:vb||`0 0 ${w} ${h}`,width:w,height:h,style:'overflow:visible;display:block'},wrap);wrap._svg=svg;return wrap}
/* moldura de foto antiga (sépia) */
function photoFrame(parent,w,h,draw,o){o=o||{};const wrap=box(parent,w,h,`transform-origin:50% 50%;background:${o.bg||'#e9dfc5'};box-shadow:0 20px 60px rgba(0,0,0,.45);border:${o.border===undefined?14:o.border}px solid ${o.frame||'#f7f2e4'};box-sizing:border-box;overflow:hidden`);
  H('div',{style:`position:absolute;inset:0;background:url(${TEX.paper});background-size:500px;opacity:.5;mix-blend-mode:multiply`},wrap);
  const svg=S('svg',{viewBox:`0 0 ${w} ${h}`,width:'100%',height:'100%',style:'position:absolute;inset:0;display:block'},wrap);draw(svg,w,h);
  H('div',{style:'position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(60,40,10,.45) 100%);mix-blend-mode:multiply'},wrap);
  if(o.caption)H('div',{style:`position:absolute;left:0;right:0;bottom:0;padding:10px 16px;background:rgba(27,30,33,.85);color:${C.paper};font:600 20px/1.2 ${FB};letter-spacing:.06em`},wrap,o.caption);
  wrap._svg=svg;return wrap}
/* silhueta humana genérica (perfil/frente) para multidões e cenas */
function person(g,x,y,s,o){o=o||{};const col=o.fill||C.ink;const p=S('g',{transform:`translate(${x} ${y}) scale(${s||1})`},g);S('circle',{cx:0,cy:-78,r:16,fill:col},p);if(o.hat==='top')S('path',{d:'M-14 -92 h28 v-26 h-28z M-22 -92 h44',fill:col,stroke:col,'stroke-width':4},p);if(o.hat==='cap')S('path',{d:'M-18 -90 q18 -14 36 0 l10 2 h-46z',fill:col},p);if(o.hat==='bonnet')S('path',{d:'M-20 -84 q20 -30 40 0 z',fill:col},p);
  S('path',{d:o.dress?'M-16 -62 q16 -8 32 0 l14 62 h-60z':'M-16 -62 q16 -8 32 0 l6 60 h-44z',fill:col},p);if(o.arm==='up')S('path',{d:'M10 -56 l24 -34',stroke:col,'stroke-width':8,'stroke-linecap':'round'},p);if(o.arm==='hammer'){S('path',{d:'M12 -56 l28 -30',stroke:col,'stroke-width':8,'stroke-linecap':'round'},p);S('rect',{x:34,y:-100,width:22,height:12,fill:col,transform:'rotate(-40 45 -94)'},p)}
  if(!o.dress){S('path',{d:'M-12 0 l-4 40 M12 0 l4 40',stroke:col,'stroke-width':9,'stroke-linecap':'round'},p)}return p}
