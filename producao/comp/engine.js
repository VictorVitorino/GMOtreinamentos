/* ==== Mini motion engine: deterministic render(t) with keyframes ==== */
"use strict";
const VW=1920,VH=1080;
const E={
  lin:t=>t,
  out:t=>1-Math.pow(1-t,3),
  in:t=>t*t*t,
  inOut:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,
  outQuint:t=>1-Math.pow(1-t,5),
  inQuint:t=>t*t*t*t*t,
  back:t=>{const c=1.70158,d=c+1;return 1+d*Math.pow(t-1,3)+c*Math.pow(t-1,2)},
  backSoft:t=>{const c=0.9,d=c+1;return 1+d*Math.pow(t-1,3)+c*Math.pow(t-1,2)},
  elastic:t=>t===0?0:t===1?1:Math.pow(2,-10*t)*Math.sin((t*10-0.75)*(2*Math.PI/3))+1,
  bounce:t=>{const n=7.5625,d=2.75;if(t<1/d)return n*t*t;if(t<2/d)return n*(t-=1.5/d)*t+.75;if(t<2.5/d)return n*(t-=2.25/d)*t+.9375;return n*(t-=2.625/d)*t+.984375},
  step:t=>t<1?0:1,
  expo:t=>t===1?1:1-Math.pow(2,-10*t)
};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,p)=>a+(b-a)*p;
const mix=lerp;
/* deterministic hash noise */
function hash(n){let x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function noise1(t,seed){const i=Math.floor(t),f=t-i,u=f*f*(3-2*f);return lerp(hash(i+seed*97.3),hash(i+1+seed*97.3),u)*2-1}

const REG={};           // id -> {node, base, kf:{prop:[{t,v,e}]}, apply, svg, pivot}
const ORDER=[];
function reg(id,node,base,opts){
  opts=opts||{};
  const base2=Object.assign({x:0,y:0,rot:0,sx:1,sy:1,o:1},base||{});
  REG[id]={node,base:base2,kf:{},apply:opts.apply||null,svg:!!opts.svg,pivot:opts.pivot||null,noTransform:!!opts.noTransform,cur:{}};
  ORDER.push(id);
  if(node&&!opts.svg&&!opts.noTransform){node.style.position=node.style.position||'absolute';node.style.left='0px';node.style.top='0px';node.style.willChange='transform,opacity'}
  return id;
}
function lastVal(id,prop){const r=REG[id];const a=r.kf[prop];if(a&&a.length)return a[a.length-1].v;return r.base[prop]!==undefined?r.base[prop]:0}
function kf(id,prop,t,v,ease){const r=REG[id];if(!r){console.warn('no el',id);return}(r.kf[prop]=r.kf[prop]||[]).push({t,v,e:ease||'out'});r.kf[prop].sort((a,b)=>a.t-b.t)}
/* tween: from current value (at t0) to target over dur */
function tw(id,t0,dur,to,ease){const r=REG[id];if(!r){console.warn('no el',id);return}for(const p in to){const a=r.kf[p]||[];const has=a.some(k=>Math.abs(k.t-t0)<1e-6);if(!has)kf(id,p,t0,lastVal(id,p),'lin');kf(id,p,t0+dur,to[p],ease||'out')}}
function setAt(id,t,props){for(const p in props){kf(id,p,t,props[p],'step')}}
/* hold then hide helper */
function showBetween(id,t0,t1,fadeIn,fadeOut){fadeIn=fadeIn||0;fadeOut=fadeOut||0;setAt(id,0,{o:0});if(fadeIn>0){kf(id,'o',t0,0,'lin');kf(id,'o',t0+fadeIn,1,'out')}else setAt(id,t0,{o:1});if(t1!==undefined){if(fadeOut>0){kf(id,'o',t1-fadeOut,1,'lin');kf(id,'o',t1,0,'in')}else setAt(id,t1,{o:0})}}
function valueAt(r,prop,t){const a=r.kf[prop];const b=r.base[prop]!==undefined?r.base[prop]:0;if(!a||!a.length)return b;if(t<=a[0].t)return a[0].t===t?a[0].v:(a[0].e==='step'?b:a[0].v);for(let i=a.length-1;i>=0;i--){if(t>=a[i].t){const k=a[i];const n=a[i+1];if(!n)return k.v;if(n.e==='step')return k.v;const p=clamp((t-k.t)/Math.max(1e-6,n.t-k.t),0,1);const f=E[n.e]||E.out;return lerp(k.v,n.v,f(p))}}return b}
const PROCS=[]; // procedural per-frame functions
function proc(fn){PROCS.push(fn)}
let CURT=0;
function render(t){
  CURT=t;
  for(const id of ORDER){const r=REG[id];const c=r.cur;
    const keys=new Set(Object.keys(r.base));for(const p in r.kf)keys.add(p);
    for(const p of keys)c[p]=valueAt(r,p,t);
  }
  for(const fn of PROCS)fn(t);
  for(const id of ORDER){const r=REG[id];const c=r.cur;const n=r.node;if(!n)continue;
    if(r.svg){const px=r.pivot?r.pivot[0]:0,py=r.pivot?r.pivot[1]:0;if(!r.noTransform)n.setAttribute('transform',`translate(${c.x} ${c.y}) translate(${px} ${py}) rotate(${c.rot}) scale(${c.sx} ${c.sy}) translate(${-px} ${-py})`);n.setAttribute('opacity',c.o);n.style.visibility=c.o<=0.002?'hidden':'visible'}
    else{if(!r.noTransform)n.style.transform=`translate(${c.x}px,${c.y}px) rotate(${c.rot}deg) scale(${c.sx},${c.sy})`;n.style.opacity=c.o;n.style.visibility=c.o<=0.002?'hidden':'visible'}
    if(r.apply)r.apply(n,c,t);
  }
}
/* DOM helpers */
function H(tag,attrs,parent,html){const e=document.createElement(tag);if(attrs)for(const k in attrs){if(k==='class')e.className=attrs[k];else if(k==='style')e.style.cssText=attrs[k];else e.setAttribute(k,attrs[k])}if(html!=null)e.innerHTML=html;if(parent)parent.appendChild(e);return e}
const NS='http://www.w3.org/2000/svg';
function S(tag,attrs,parent){const e=document.createElementNS(NS,tag);if(attrs)for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
function T(parent,x,y,txt,attrs){const e=S('text',Object.assign({x,y},attrs||{}),parent);e.textContent=txt;return e}
function SVG(w,h,parent,vb){const s=S('svg',{viewBox:vb||`0 0 ${w} ${h}`,width:w,height:h,style:'overflow:visible;display:block'},parent);return s}
function torn(w,h,seed,amp){/* polygon points string with jagged edges for clip-path */amp=amp||6;const pts=[];const n=Math.max(6,Math.round(w/22)),m=Math.max(6,Math.round(h/22));let k=seed*13.7;const j=()=>{k+=1;return (hash(k)-.5)*2*amp};for(let i=0;i<=n;i++)pts.push(`${(i/n*w).toFixed(1)}px ${(j()).toFixed(1)}px`);for(let i=1;i<=m;i++)pts.push(`${(w+j()).toFixed(1)}px ${(i/m*h).toFixed(1)}px`);for(let i=n-1;i>=0;i--)pts.push(`${(i/n*w).toFixed(1)}px ${(h+j()).toFixed(1)}px`);for(let i=m-1;i>=1;i--)pts.push(`${(j()).toFixed(1)}px ${(i/m*h).toFixed(1)}px`);return `polygon(${pts.join(',')})`}
/* word timing inside a line: proportional to character offset */
function wt(lineId,word,lead,segIdx){const L=LINES[lineId];if(!L){console.warn('no line',lineId);return 0}lead=(lead===undefined?0.12:lead);
  if(L.segs&&L.segs.length){let si=-1;if(segIdx!==undefined){si=segIdx}else{si=L.segs.findIndex(s=>s.text.indexOf(word)>=0)}
    if(si>=0){const sg=L.segs[si];let i=sg.text.indexOf(word);if(i<0)i=0;const p=i/Math.max(1,sg.text.length);return L.start+sg.t0+p*(sg.t1-sg.t0)-lead}}
  const txt=L.text;let i=txt.indexOf(word);if(i<0){console.warn('word not found',lineId,word);i=0}const p=i/txt.length;return L.start+p*L.dur-lead}
function segT(lineId,idx){const L=LINES[lineId];const sg=L.segs[Math.min(idx,L.segs.length-1)];return L.start+sg.t0}
function segEndT(lineId,idx){const L=LINES[lineId];const sg=L.segs[Math.min(idx,L.segs.length-1)];return L.start+sg.t1}
function lineEnd(id){const L=LINES[id];return L.start+L.dur}
function lineStart(id){return LINES[id].start}
/* envelope value (0..1) of a line at time t */
function envAt(id,t){const L=LINES[id];if(!L)return 0;const i=(t-L.start)*30;if(i<0||i>=L.env.length)return 0;const a=L.env[Math.floor(i)],b=L.env[Math.min(L.env.length-1,Math.floor(i)+1)];return lerp(a,b,i-Math.floor(i))}
function speakingAmp(voice,t){let m=0;for(const id in LINES){if(LINES[id].voice!==voice)continue;m=Math.max(m,envAt(id,t))}return m}
