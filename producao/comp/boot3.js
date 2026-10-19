"use strict";
function buildAll(){Array.from({length:17},(_,i)=>'buildS'+String(i+1).padStart(2,'0')).forEach(n=>{if(typeof window[n]==='function')window[n]()});tw('fade',TL.total-0.6,0.6,{o:1},'in')}
buildAll();render(0);imagesReady().then(()=>{render(0);window.__ready=true});
(function(){if(location.hash!=='#ui')return;const ui=document.getElementById('ui');ui.hidden=false;const sl=document.getElementById('sl'),tc=document.getElementById('tc'),btn=document.getElementById('play');sl.max=TL.total;document.getElementById('dur').textContent=TL.total.toFixed(2)+'s';
  const fit=()=>{const k=Math.min(innerWidth/1920,(innerHeight-50)/1080);stage.style.transform=`scale(${k})`};fit();addEventListener('resize',fit);let playing=false,t=0,last=0;const audio=document.getElementById('mix');
  function show(v){t=v;sl.value=v;tc.textContent=v.toFixed(2);render(v)}sl.addEventListener('input',()=>{show(parseFloat(sl.value));if(audio)audio.currentTime=t});
  function loop(ts){if(!playing)return;const dt=(ts-last)/1000;last=ts;show(Math.min(TL.total,t+dt));if(t>=TL.total){playing=false;btn.textContent='▶';if(audio)audio.pause();return}requestAnimationFrame(loop)}
  btn.addEventListener('click',()=>{playing=!playing;btn.textContent=playing?'❚❚':'▶';if(playing){last=performance.now();if(audio){audio.currentTime=t;audio.play().catch(()=>{})}requestAnimationFrame(loop)}else if(audio)audio.pause()});
  addEventListener('keydown',e=>{if(e.key===' '){btn.click();e.preventDefault()}if(e.key==='ArrowRight')show(Math.min(TL.total,t+(e.shiftKey?1:1/30)));if(e.key==='ArrowLeft')show(Math.max(0,t-(e.shiftKey?1:1/30)))})})();
