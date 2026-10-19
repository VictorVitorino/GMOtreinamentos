"use strict";
function buildAll(){Array.from({length:17},(_,i)=>'buildS'+String(i+1).padStart(2,'0')).forEach(n=>{if(typeof window[n]==='function')window[n]()});tw('fade',TL.total-0.6,0.6,{o:1},'in')}
function animaticCaptions(){if(!TL.mock)return;const box=H('div',{style:`position:absolute;left:0;right:0;bottom:0;padding:10px 40px;background:rgba(0,0,0,.62);color:#fff;font:500 30px/1.25 ${FB};text-align:center;min-height:52px;z-index:50`},stage);
  const ids=Object.keys(LINES).sort((a,b)=>LINES[a].start-LINES[b].start);proc(t=>{let cur=null;for(const id of ids){const L=LINES[id];if(t>=L.start-0.15&&t<=L.start+L.dur+0.4)cur=L}box.textContent=cur?((cur.voice==='M'?'🤖 ':'')+cur.text):'';box.style.opacity=cur?1:0});
  const tc=H('div',{style:'position:absolute;left:14px;top:8px;color:#fff;font:600 22px/1 monospace;background:rgba(0,0,0,.5);padding:4px 8px;z-index:50'},stage);proc(t=>{tc.textContent='ANIMATIC · '+t.toFixed(1)+'s'})}
buildAll();animaticCaptions();render(0);imagesReady().then(()=>{render(0);window.__ready=true});
(function(){if(location.hash!=='#ui')return;const ui=document.getElementById('ui');ui.hidden=false;const sl=document.getElementById('sl'),tc=document.getElementById('tc'),btn=document.getElementById('play');sl.max=TL.total;document.getElementById('dur').textContent=TL.total.toFixed(2)+'s';
  const fit=()=>{const k=Math.min(innerWidth/1920,(innerHeight-50)/1080);stage.style.transform=`scale(${k})`};fit();addEventListener('resize',fit);let playing=false,t=0,last=0;const audio=document.getElementById('mix');
  function show(v){t=v;sl.value=v;tc.textContent=v.toFixed(2);render(v)}sl.addEventListener('input',()=>{show(parseFloat(sl.value));if(audio)audio.currentTime=t});
  function loop(ts){if(!playing)return;const dt=(ts-last)/1000;last=ts;show(Math.min(TL.total,t+dt));if(t>=TL.total){playing=false;btn.textContent='▶';if(audio)audio.pause();return}requestAnimationFrame(loop)}
  btn.addEventListener('click',()=>{playing=!playing;btn.textContent=playing?'❚❚':'▶';if(playing){last=performance.now();if(audio){audio.currentTime=t;audio.play().catch(()=>{})}requestAnimationFrame(loop)}else if(audio)audio.pause()});
  addEventListener('keydown',e=>{if(e.key===' '){btn.click();e.preventDefault()}if(e.key==='ArrowRight')show(Math.min(TL.total,t+(e.shiftKey?1:1/30)));if(e.key==='ArrowLeft')show(Math.max(0,t-(e.shiftKey?1:1/30)))})})();
