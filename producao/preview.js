// uso: node preview.js out/index.html <outdir> t1 t2 t3 ...  -> PNGs em meia resolução + folha de contato
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');const {execSync}=require('child_process');
(async()=>{const [,,html,outdir,...times]=process.argv;fs.mkdirSync(outdir,{recursive:true});
const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1920,height:1080}});
pg.on('console',m=>{if(m.type()==='error'||m.type()==='warning')console.log('[console]',m.text())});pg.on('pageerror',e=>console.log('[pageerror]',e.message));
await pg.goto('file://'+path.resolve(html));await pg.waitForFunction(()=>window.__ready===true,{timeout:30000});await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(500);
const files=[];for(const ts of times){const t=parseFloat(ts);await pg.evaluate(t=>render(t),t);const f=path.join(outdir,`p_${t.toFixed(2).replace('.','_')}.png`);await pg.screenshot({path:f,type:'png'});files.push(f)}
await b.close();
// folha de contato (até 12 por folha, 3 colunas)
for(let i=0;i<files.length;i+=12){const chunk=files.slice(i,i+12);const inputs=chunk.map(f=>`-i "${f}"`).join(' ');const n=chunk.length;const cols=Math.min(3,n),rows=Math.ceil(n/cols);
 const sheet=path.join(outdir,`sheet_${i/12}.png`);const filt=chunk.map((_,k)=>`[${k}:v]scale=640:360[v${k}]`).join(';')+';'+chunk.map((_,k)=>`[v${k}]`).join('')+`xstack=inputs=${n}:layout=${chunk.map((_,k)=>`${(k%cols)*640}_${Math.floor(k/cols)*360}`).join('|')}:fill=black[out]`;
 execSync(`/usr/bin/ffmpeg -v error -y ${inputs} -filter_complex "${filt}" -map "[out]" "${sheet}"`);console.log('sheet',sheet,chunk.map(f=>path.basename(f)).join(' '))}
})().catch(e=>{console.error(e);process.exit(1)});
