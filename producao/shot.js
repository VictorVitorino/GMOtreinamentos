// node shot.js out/index.html <t> <png> [w h]
const {chromium}=require('playwright');const path=require('path');
(async()=>{const [,,html,tS,png,wS,hS]=process.argv;const b=await chromium.launch({args:['--disable-gpu','--font-render-hinting=none']});
const pg=await b.newPage({viewport:{width:1920,height:1080}});pg.on('pageerror',e=>console.log('[pageerror]',e.message));pg.on('console',m=>{if(m.type()==='error'||m.type()==='warning')console.log('[console]',m.text())});
await pg.goto('file://'+path.resolve(html));await pg.waitForFunction(()=>window.__ready===true,{timeout:60000});await pg.evaluate(()=>document.fonts.ready);
const ts=String(tS).split(',');for(let i=0;i<ts.length;i++){await pg.evaluate(t=>render(t),parseFloat(ts[i]));const out=ts.length>1?png.replace(/\.(png|jpg)$/,`_${ts[i].replace('.','_')}.$1`):png;await pg.screenshot({path:out,type:out.endsWith('.jpg')?'jpeg':'png',quality:out.endsWith('.jpg')?88:undefined});console.log(out)}
await b.close()})().catch(e=>{console.error(e);process.exit(1)});
