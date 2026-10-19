// Renderiza todos os quadros em paralelo: node render.js out/index.html frames <fps> <workers>
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
(async()=>{const [,,html,outdir,fpsS,wS]=process.argv;const fps=parseInt(fpsS||'30'),workers=parseInt(wS||'4');fs.mkdirSync(outdir,{recursive:true});
const b=await chromium.launch({args:['--disable-gpu','--font-render-hinting=none']});
const probe=await b.newPage({viewport:{width:1920,height:1080}});await probe.goto('file://'+path.resolve(html));await probe.waitForFunction(()=>window.__ready===true,{timeout:60000});
const total=await probe.evaluate(()=>TL.total);await probe.close();const n=Math.ceil(total*fps);console.log('total',total,'frames',n);
let next=0;const t0=Date.now();
async function worker(id){const pg=await b.newPage({viewport:{width:1920,height:1080}});pg.on('pageerror',e=>console.log('[pageerror]',e.message));
  await pg.goto('file://'+path.resolve(html));await pg.waitForFunction(()=>window.__ready===true,{timeout:60000});await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(300);
  while(true){const f=next++;if(f>=n)break;const t=f/fps;await pg.evaluate(t=>render(t),t);await pg.screenshot({path:path.join(outdir,`f${String(f).padStart(5,'0')}.jpg`),type:'jpeg',quality:94});
    if(f%300===0)console.log(`w${id} frame ${f}/${n} ${(Date.now()-t0)/1000|0}s`)}
  await pg.close()}
await Promise.all(Array.from({length:workers},(_,i)=>worker(i)));await b.close();console.log('done',n,'frames in',(Date.now()-t0)/1000|0,'s')})().catch(e=>{console.error(e);process.exit(1)});
