(()=>{const {$,$$,tone,ding,boing,stage}=DECK, SEC=DECK.el('capa');
/* ---------- CAPA: metamorfose low-poly (lagarta → casulo → borboleta) ---------- */
(()=>{const cv=$('#cvFly'),x=cv.getContext('2d'),N=560,CX=1180,CY=400,rnd=Math.random;
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const C={n9:hex('#071A33'),n6:hex('#1B4479'),n5:hex('#2A5A96'),s5:hex('#4A6FA5'),s4:hex('#6E8FBF'),s3:hex('#A3B8D6'),s2:hex('#C9D6E8'),s1:hex('#E4EBF5'),o6:hex('#D9521A'),o5:hex('#F26B21'),o4:hex('#FF8A4C'),o2:hex('#FFC7A6'),w:[255,255,255]};
const mix=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];
const P=[];for(let i=0;i<N;i++){const w=i<44?4:(rnd()<.66?(rnd()<.5?0:1):(rnd()<.5?2:3));
 P.push({u:rnd(),v:rnd()*2-1,a:rnd()*Math.PI*2,w,seg:i%9,sh:rnd(),fl:rnd(),sz:12+rnd()*9,a0:rnd()*6.28,rj:[.7+rnd()*.6,.7+rnd()*.6,.7+rnd()*.6],aj:[rnd()*.6,rnd()*.6,rnd()*.6],spin:(rnd()-.5)*.4,
 tr:rnd()<.2,ph:rnd(),dl:rnd()*.55,bx:(rnd()-.5)*320,by:(rnd()-.5)*320,sx:900+rnd()*620,sy:80+rnd()*700,ox:0,oy:0})}
const BG=[];for(let i=0;i<46;i++)BG.push({x:rnd()*1600,y:rnd()*900,vx:(rnd()-.5)*.25,vy:(rnd()-.5)*.25,r:rnd()*1.6+.5});
/* formas: devolvem [x,y,cor,escala] */
function scat(p,t){return [p.sx+Math.sin(t*.4+p.ph*6)*14,p.sy+Math.cos(t*.5+p.ph*6)*14,mix(C.n6,C.s3,p.sh),.55]}
function cat(p,t){const sg=p.seg,R=sg===8?44:31+(sg%2)*3,cx=CX-250+sg*60,lift=Math.max(0,Math.sin(t*2.6-sg*.75))*30,cy=CY+170-lift,r=Math.sqrt(p.u)*R;
 let c=mix(C.n5,C.s4,p.sh*.8);if(p.fl<.16&&p.u>.25)c=mix(C.o5,C.o4,p.sh);if(sg===8)c=mix(C.s5,C.s3,p.sh);return [cx+Math.cos(p.a)*r,cy+Math.sin(p.a)*r*.92,c,.6]}
function chr(p,t){const u=p.u,y=150+u*440,w=96*Math.pow(Math.sin(Math.PI*Math.min(1,u*1.06+.02)),.7)*(1-.18*u),lx=p.v*w,ang=Math.sin(t*1.3)*.05,ly=y-138,br=1+Math.sin(t*3)*.015;
 let c=mix(C.s4,C.s1,p.sh*.85);if(Math.abs(p.v)<.1)c=mix(C.o5,C.o2,p.sh);else if(p.fl<.05)c=C.o4;
 return [CX+(lx*Math.cos(ang)-ly*Math.sin(ang))*br,138+(lx*Math.sin(ang)+ly*Math.cos(ang))*br,c,.7]}
const UP=[[6,-14],[40,-90],[110,-168],[200,-214],[268,-222],[300,-196],[292,-140],[258,-82],[196,-36],[110,-6],[10,6]],LO=[[8,12],[96,8],[176,40],[214,98],[204,160],[160,210],[100,230],[52,204],[22,140],[8,70]];
const inPoly=(x,y,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c}return c};
const onPoly=P=>{const i=Math.floor(rnd()*P.length),A=P[i],B=P[(i+1)%P.length],k=rnd();return [A[0]+(B[0]-A[0])*k,A[1]+(B[1]-A[1])*k]};
for(const p of P){if(p.w===4)continue;const poly=p.w<2?UP:LO,sg=p.w%2?-1:1;let q;
 if(rnd()<.24){q=onPoly(poly);p.edge=1}else{do{q=[rnd()*300,(p.w<2?-230:0)+rnd()*235]}while(!inPoly(q[0],q[1],poly))}
 p.lx=q[0]*sg;p.ly=q[1];p.k=Math.min(1,Math.hypot(q[0],q[1]*(p.w<2?.9:1.2))/290)}
function fly(p,t){const fl=.42+.58*(.5+.5*Math.cos(t*2.6)),fx=CX+Math.sin(t*.7)*12,fy=CY+Math.sin(t*1.1)*10+20,S=.98;let lx,ly,c,sc=.98;
 if(p.w===4){lx=p.v*9*(1-Math.abs(p.u-.5));ly=-120+p.u*230;c=mix(C.n9,C.s5,p.sh*.55);sc=.6}
 else{lx=p.lx*fl;ly=p.ly-(1-fl)*Math.abs(p.lx)*.12;const k=p.k;
  if(p.edge)c=p.fl<.3?C.w:mix(C.n6,C.s5,p.sh*.5);else if(k>.72)c=p.fl<.18?mix(C.o5,C.o4,p.sh):mix(C.s4,C.s2,p.sh);else if(k>.35)c=mix(C.s3,C.s1,p.sh);else c=mix(C.s5,C.s3,p.sh);if(p.edge)sc=.74}
 let X=fx+lx*S,Y=fy+ly*S,a=1;
 if(p.tr&&p.w<4){const q=(t*.15+p.ph)%1;if(q>.55){const z=(q-.55)/.45;X+=-360*z+Math.sin(z*6+p.ph*9)*28;Y+=210*z+70*z*z;sc*=1-z*.55;c=mix(c,C.s3,z*.6);a=1-z}}
 return [X,Y,c,sc,a]}
const SH=[cat,chr,fly],GLOW=[[74,111,165,.22],[201,214,232,.2],[242,107,33,.16]];
let st=-1,pst=-1,t0=0,timers=[],T=0;
const lbls=['Toda mudança começa onde estamos.','A transição é a parte invisível, e a mais importante.','Mudança adotada é transformação.'];
function setStage(n){pst=st;st=n;t0=T;$$('.cv-evo .st').forEach(b=>b.classList.toggle('on',+b.dataset.s===n));$('#cvGo').textContent=n===2?'↺ Recomeçar':'✦ Evoluir';const q=$('#cvQ');q.style.opacity=0;setTimeout(()=>{q.textContent=lbls[n]||'';q.style.opacity=1},300);if(n>=0)tone(380+n*170,.18,'triangle',.06,520+n*220)}
function auto(){timers.forEach(clearTimeout);st=-1;pst=-1;t0=T;timers=[setTimeout(()=>setStage(0),400),setTimeout(()=>setStage(1),3800),setTimeout(()=>setStage(2),7000)]}
$('#cvGo').onclick=()=>{timers.forEach(clearTimeout);setStage(st>=2?0:st+1)};
$$('.cv-evo .st').forEach(b=>b.onclick=()=>{timers.forEach(clearTimeout);setStage(+b.dataset.s)});
let mx=-999,my=-999;cv.addEventListener('mousemove',e=>{const r=stage.getBoundingClientRect(),k=r.width/1600;mx=(e.clientX-r.left)/k;my=(e.clientY-r.top)/k});cv.addEventListener('mouseleave',()=>{mx=my=-999});
const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
let last=performance.now();
function frame(now){requestAnimationFrame(frame);if(!SEC.classList.contains('active'))return;T+=Math.min(.05,(now-last)/1000);last=now;x.clearRect(0,0,1600,900);
 for(const b of BG){b.x+=b.vx;b.y+=b.vy;if(b.x<0||b.x>1600)b.vx*=-1;if(b.y<0||b.y>900)b.vy*=-1;x.fillStyle='rgba(201,214,232,.45)';x.beginPath();x.arc(b.x,b.y,b.r,0,7);x.fill()}
 const from=s=>s<0?scat:SH[s],kk=Math.min(1,(T-t0)/1.6);
 const g0=GLOW[Math.max(0,pst)],g1=GLOW[Math.max(0,st)],gk=ease(kk),gc=mix(g0,g1,gk),ga=(st<0?0:g0[3]+(g1[3]-g0[3])*gk);
 const rg=x.createRadialGradient(CX,CY+20,10,CX,CY+20,380);rg.addColorStop(0,`rgba(${gc[0]|0},${gc[1]|0},${gc[2]|0},${ga})`);rg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=rg;x.fillRect(CX-400,CY-380,800,800);
 const wB=st===1?gk:(pst===1?1-gk:0);if(wB>.01){x.strokeStyle=`rgba(163,184,214,${.5*wB})`;x.lineWidth=3;x.beginPath();x.moveTo(CX-200,132);x.lineTo(CX+190,128);x.stroke();x.lineWidth=1.5;x.beginPath();x.moveTo(CX,130);x.lineTo(CX,150);x.stroke()}
 const wF=st===2?gk:(pst===2?1-gk:0);if(wF>.01){const fx=CX+Math.sin(T*.7)*12,fy=CY+Math.sin(T*1.1)*10+20;x.strokeStyle=`rgba(201,214,232,${.8*wF})`;x.lineWidth=2;for(const sgn of [-1,1]){x.beginPath();x.moveTo(fx,fy-108);x.quadraticCurveTo(fx+sgn*14,fy-170,fx+sgn*44,fy-200);x.stroke();x.fillStyle=`rgba(255,138,76,${wF})`;x.beginPath();x.arc(fx+sgn*44,fy-200,4,0,7);x.fill()}}
 for(const p of P){const e=ease(Math.max(0,Math.min(1,(T-t0-p.dl)/1.5)));const A=from(pst)(p,T),B=from(st)(p,T),bu=Math.sin(Math.PI*e)*(st===2&&pst===1?1.2:.45);
  let X=A[0]+(B[0]-A[0])*e+p.bx*bu,Y=A[1]+(B[1]-A[1])*e+p.by*bu;const col=mix(A[2],B[2],e),sc=A[3]+(B[3]-A[3])*e,al=(A[4]??1)+((B[4]??1)-(A[4]??1))*e;
  const dx=X-mx,dy=Y-my,d=Math.hypot(dx,dy);if(d<110){p.ox+=dx/d*2.6;p.oy+=dy/d*2.6}p.ox*=.93;p.oy*=.93;X+=p.ox;Y+=p.oy;
  const R=p.sz*sc,rot=p.a0+T*p.spin;x.beginPath();for(let j=0;j<3;j++){const an=rot+j*2.094+p.aj[j],rr=R*p.rj[j],px=X+Math.cos(an)*rr,py=Y+Math.sin(an)*rr;j?x.lineTo(px,py):x.moveTo(px,py)}x.closePath();
  x.fillStyle=`rgba(${col[0]|0},${col[1]|0},${col[2]|0},${.88*al})`;x.fill();x.strokeStyle=`rgba(255,255,255,${.14*al})`;x.lineWidth=.6;x.stroke()}}
requestAnimationFrame(frame);DECK.register('capa',{enter:auto});auto()})();
})();
