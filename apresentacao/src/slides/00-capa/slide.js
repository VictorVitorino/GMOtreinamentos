(()=>{const {$,$$,tone,ding,boing,stage}=DECK, SEC=DECK.el('capa');
/* =====================================================================
   CAPA · metamorfose low-poly em loop: lagarta → casulo → borboleta → voo → (céu) → lagarta
   Cada forma é uma malha triangulada (Delaunay) e cada fragmento é um triângulo que viaja
   entre as malhas. A borboleta bate as asas (rotação no eixo do corpo) e voa para fora do palco.
   ===================================================================== */
const cv=$('.cv-cv',SEC), x=cv.getContext('2d');
const CX=1180, CY=430, CYC=482, CHY=300;          // centro da borboleta, linha da lagarta, ponto de fixação do casulo
const PI=Math.PI, TAU=PI*2, clamp=(v,a=0,b=1)=>v<a?a:v>b?b:v;
const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2, eOut=k=>1-Math.pow(1-k,3);
let sd=11;const rnd=()=>{sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const C={n9:hex('#071A33'),n8:hex('#0B2545'),n7:hex('#13315C'),n6:hex('#1B4479'),n5:hex('#2A5A96'),s6:hex('#3D5F93'),s5:hex('#4A6FA5'),s4:hex('#6E8FBF'),s3:hex('#A3B8D6'),s2:hex('#C9D6E8'),s1:hex('#E4EBF5'),o6:hex('#D9521A'),o5:hex('#F26B21'),o4:hex('#FF8A4C'),o2:hex('#FFC7A6'),w:[255,255,255]};
const mix=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];
const lit=(c,f)=>f>=1?mix(c,C.w,Math.min(1,f-1)):[c[0]*f,c[1]*f,c[2]*f];

/* ---------- geometria: spline fechada, ponto-no-polígono, Delaunay, malha ---------- */
function spline(P,sharp,step){const n=P.length,o=[];for(let i=0;i<n;i++){const a=P[(i-1+n)%n],b=P[i],c=P[(i+1)%n],d=P[(i+2)%n],t1=sharp.includes(i)?0:.5,t2=sharp.includes((i+1)%n)?0:.5,
 m1=[(c[0]-a[0])*t1,(c[1]-a[1])*t1],m2=[(d[0]-b[0])*t2,(d[1]-b[1])*t2],k=Math.max(1,Math.round(Math.hypot(c[0]-b[0],c[1]-b[1])/step));
 for(let j=0;j<k;j++){const s=j/k,s2=s*s,s3=s2*s,h1=2*s3-3*s2+1,h2=-2*s3+3*s2,h3=s3-2*s2+s,h4=s3-s2;o.push([h1*b[0]+h2*c[0]+h3*m1[0]+h4*m2[0],h1*b[1]+h2*c[1]+h3*m1[1]+h4*m2[1]])}}return o}
const inPoly=(px,py,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const xi=P[i][0],yi=P[i][1],xj=P[j][0],yj=P[j][1];if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))c=!c}return c};
function delaunay(P){const n=P.length;let a0=1e9,b0=1e9,a1=-1e9,b1=-1e9;for(const [a,b] of P){a0=Math.min(a0,a);b0=Math.min(b0,b);a1=Math.max(a1,a);b1=Math.max(b1,b)}
 const d=Math.max(a1-a0,b1-b0)*20,mx=(a0+a1)/2,my=(b0+b1)/2,Q=P.concat([[mx-d,my-d],[mx+d,my-d],[mx,my+d]]);
 const cc=(a,b,c)=>{const [ax,ay]=Q[a],[bx,by]=Q[b],[cx,cy]=Q[c],D=2*(ax*(by-cy)+bx*(cy-ay)+cx*(ay-by));if(Math.abs(D)<1e-9)return {a,b,c,x:0,y:0,r:Infinity};
  const A=ax*ax+ay*ay,B=bx*bx+by*by,Cc=cx*cx+cy*cy,ux=(A*(by-cy)+B*(cy-ay)+Cc*(ay-by))/D,uy=(A*(cx-bx)+B*(ax-cx)+Cc*(bx-ax))/D;return {a,b,c,x:ux,y:uy,r:(ax-ux)**2+(ay-uy)**2}};
 let T=[cc(n,n+1,n+2)];
 for(let i=0;i<n;i++){const [px,py]=Q[i],E=new Map(),K=[];
  for(const t of T){if((px-t.x)**2+(py-t.y)**2<t.r){for(const [u,v] of [[t.a,t.b],[t.b,t.c],[t.c,t.a]]){const k=u<v?u*65536+v:v*65536+u;E.has(k)?E.delete(k):E.set(k,[u,v])}}else K.push(t)}
  T=K;for(const [u,v] of E.values())T.push(cc(u,v,i))}
 return T.filter(t=>t.a<n&&t.b<n&&t.c<n).map(t=>[t.a,t.b,t.c])}
function mesh(out,sp,inner=.74){const P=out.map(p=>p.slice()),B=P.length;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const [a,b] of P){x0=Math.min(x0,a);y0=Math.min(y0,b);x1=Math.max(x1,a);y1=Math.max(y1,b)}
 for(let i=0,n=Math.ceil((x1-x0)*(y1-y0)/(sp*sp)*40);i<n;i++){const q=[x0+rnd()*(x1-x0),y0+rnd()*(y1-y0)];if(!inPoly(q[0],q[1],out))continue;let ok=1;
  for(let j=0;j<P.length;j++){if(Math.hypot(P[j][0]-q[0],P[j][1]-q[1])<(j<B?sp*inner:sp)){ok=0;break}}if(ok)P.push(q)}
 return delaunay(P).map(t=>{const v=t.map(i=>P[i].slice());return {v,c:[(v[0][0]+v[1][0]+v[2][0])/3,(v[0][1]+v[1][1]+v[2][1])/3],edge:t.some(i=>i<B)}}).filter(t=>inPoly(t.c[0],t.c[1],out))}

/* ---------- BORBOLETA (coordenadas locais: corpo em x=0, centro visual em 0,0) ---------- */
const FW=spline([[5,-24],[34,-78],[86,-126],[146,-154],[197,-161],[193,-129],[179,-93],[157,-59],[128,-28],[90,-4],[48,7],[5,4]],[0,4,11],16);
const HW=spline([[5,-6],[50,-12],[102,-2],[143,27],[161,69],[157,109],[137,141],[104,159],[70,155],[43,132],[23,93],[11,47]],[0],16);
const BP=[[-41,0],[-39,3.5],[-35,6.5],[-30,6],[-27,5],[-23,7],[-13,8],[-2,7],[4,5.2],[14,6.4],[40,5.4],[68,3.8],[88,2.2],[97,0]];
const BODY=[...BP.map(([y,w])=>[w,y]),...BP.slice(1,-1).reverse().map(([y,w])=>[-w,y])];
function colFore(cx,cy,edge){const r=Math.hypot(cx*.92,cy*1.06)/226,j=rnd(),ap=Math.hypot(cx-188,(cy+152)*1.15);let c;
 if(r<.3)c=mix(C.n7,C.n6,j);else if(r<.52)c=mix(C.n6,C.s6,j);else if(r<.72)c=mix(C.s6,C.s4,j);else if(r<.88)c=mix(C.s4,C.s3,j);else c=mix(C.s3,C.s2,j);
 if(edge)c=mix(c,C.s2,.3);
 if(ap<38)c=j<.8?mix(C.o5,C.o4,rnd()):C.o2;else if(ap<62&&j<.3)c=mix(C.s1,C.w,rnd());
 return lit(c,.9+rnd()*.18-cy*.0006)}
function colHind(cx,cy,edge){const r=Math.hypot(cx,cy*.96)/166,j=rnd();let c;
 if(r<.3)c=mix(C.n7,C.n6,j);else if(r<.58)c=mix(C.n6,C.s6,j);else if(r<.8)c=mix(C.s6,C.s4,j);else c=mix(C.s4,C.s3,j);
 if(edge)c=r>.86&&j<.13?mix(C.o5,C.o4,rnd()):mix(c,C.s2,.3);
 return lit(c,.88+rnd()*.18-cy*.0006)}
const B=[];
{const fm=mesh(FW,25),hm=mesh(HW,25),bm=mesh(BODY,6.5,.7);
 for(const side of [-1,1]){for(const t of hm)B.push({w:0,side,v:t.v.map(([a,b])=>[a*side,b]),c:[t.c[0]*side,t.c[1]],col:colHind(t.c[0],t.c[1],t.edge),edge:t.edge});}
 const fc=fm.map(t=>colFore(t.c[0],t.c[1],t.edge));
 for(const side of [-1,1])fm.forEach((t,i)=>B.push({w:1,side,v:t.v.map(([a,b])=>[a*side,b]),c:[t.c[0]*side,t.c[1]],col:fc[i],edge:t.edge}));
 for(const t of bm)B.push({w:2,side:0,v:t.v,c:t.c,col:lit(t.c[1]<-26?mix(C.n9,C.n7,rnd()):rnd()<.25?mix(C.s5,C.s4,rnd()):mix(C.n9,C.n7,rnd()),.95+rnd()*.2-Math.max(0,t.c[0])*.03),edge:t.edge});}
// pinta a asa direita a partir da esquerda já sorteada: simetria perfeita
{const hl=B.filter(b=>b.w===0),hn=hl.length/2;for(let i=0;i<hn;i++)hl[hn+i].col=hl[i].col}
const N=B.length;

/* ---------- LAGARTA (malha contínua, cabeça à direita; a onda de rastejar desloca cada vértice) e CASULO ---------- */
const CATO=(()=>{const H=x=>20*Math.min(1,Math.pow(Math.max(.004,(x+146)/230),.32)),top=[],bot=[],head=[];
 for(let x=-144;x<=112;x+=8){const k=(x+144)/23,b=.88+.12*Math.abs(Math.cos(PI*k));top.push([x,-H(x)*b]);bot.unshift([x,H(x)*.76])}
 for(let a=-112;a<=108;a+=16){const r=a*PI/180;head.push([131+Math.cos(r)*20.5,-1+Math.sin(r)*20.5])}
 return [[-150,0],...top,...head,...bot]})();
const CT=mesh(CATO,10.5,.7).map(t=>{const [cx,cy]=t.c,j=rnd(),k=Math.floor((cx+144)/23),hd=cx>114;let col;
 if(hd)col=cy<-8?mix(C.s6,C.s5,j):mix(C.n7,C.n6,j);
 else if(k%2)col=cy<-8?mix(C.s3,C.s2,j*.7):cy<6?mix(C.s4,C.s3,j):mix(C.s6,C.s5,j);
 else col=cy<-8?mix(C.s5,C.s4,j):cy<6?mix(C.n5,C.s6,j):mix(C.n7,C.n6,j);
 if(!hd&&k%2&&k>0&&Math.abs(cy)<5&&j<.34)col=mix(C.o5,C.o4,rnd());
 return {v:t.v,c:t.c,col:lit(col,.92+rnd()*.14-cy*.004)}});
const catQ=vx=>T*2.3-(vx+146)*.023, KC=1.16,catP=(vx,vy)=>{const q=catQ(vx);return [CX+(vx+Math.cos(q)*2)*KC,CYC+(vy-Math.pow(Math.max(0,Math.sin(q)),2)*10)*KC]};
const HP=[[0,3],[10,6.5],[22,14],[44,30],[78,42],[112,46],[146,44],[174,36],[196,24],[212,12],[220,0]];
const CHR=spline([...HP.map(([y,w])=>[w,y]),...HP.slice(1,-1).reverse().map(([y,w])=>[-w,y]),[-3,0]],[0],12);
const HT=mesh(CHR,15.5,.72).map(t=>{const [cx,cy]=t.c,j=rnd();let col;
 if(cy<14)col=mix(C.n6,C.s6,j);else if(cy>58&&cy<74)col=j<.8?mix(C.o5,C.o4,rnd()):C.o2;else if(cy>30&&cy<42&&j<.3)col=mix(C.o4,C.o2,rnd());
 else col=mix(cx<0?C.s2:C.s3,cx<0?C.s1:C.s4,j*(.5+cy/444));
 return {v:t.v,c:t.c,col:lit(col,.9+rnd()*.14-Math.max(0,cx)*.0025)}});

/* ---------- correspondência fragmento ↔ triângulo (vizinho mais próximo em espaço normalizado) ---------- */
function assign(fk,tk){const M=tk.length,res=new Int32Array(N).fill(-1),free=new Set([...Array(N).keys()]),ord=[...Array(M).keys()];
 for(let i=M-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[ord[i],ord[j]]=[ord[j],ord[i]]}
 for(const t of ord){if(!free.size)break;let best=-1,bd=1e9;for(const i of free){const d=(fk[i][0]-tk[t][0])**2+(fk[i][1]-tk[t][1])**2;if(d<bd){bd=d;best=i}}res[best]=t;free.delete(best)}
 for(const i of free){let best=0,bd=1e9;for(let t=0;t<M;t++){const d=(fk[i][0]-tk[t][0])**2+(fk[i][1]-tk[t][1])**2;if(d<bd){bd=d;best=t}}res[i]=best}return res}
const AH=assign(B.map(b=>[b.c[0]/200,b.c[1]/165]),HT.map(h=>[h.c[0]/46,(h.c[1]-111)/111]));
const AC=assign([...AH].map(h=>[HT[h].c[0]/46,(HT[h].c[1]-111)/111]),CT.map(c=>[c.c[1]/19,c.c[0]/150]));
const RND=Float32Array.from({length:N},()=>rnd()),SPIN=Float32Array.from({length:N},()=>(rnd()-.5)*4.4);

/* ---------- estado ---------- */
const DUR={cat:4.6,chr:3.8,bfly:4.6,fly:3.5,sky:1.0};
const W=new Float32Array(N*6),WC=new Float32Array(N*3),WA=new Float32Array(N),WZ=new Float32Array(N),F=new Float32Array(N*6),FC=new Float32Array(N*3),FA=new Float32Array(N),FZ=new Float32Array(N),DEL=new Float32Array(N),OX=new Float32Array(N),OY=new Float32Array(N);
const ORD=[...Array(N).keys()],tv=new Float32Array(6),D=[],BG=[];
for(let i=0;i<54;i++)BG.push({x:Math.random()*1600,y:Math.random()*900,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,r:Math.random()*1.5+.4,a:.2+Math.random()*.35});
let T=0,mt=-9,last=0,run=false,stg=0,sT0=0,shape='scat',prev='scat',m0=0,mDur=1.5,bulge=40,durB=DUR.bfly,ck=1,mx=-999,my=-999;
let ph=0,fF=.7,fA=.46,fB=0,fx=CX,fy=CY,phi=0,S=1,tau=0,vx=0,vy=0,thF=1.5,thH=1.5;
const go$=$('.cv-go',SEC),sts=$$('.cv-st',SEC);

function snapshot(){F.set(W);FC.set(WC);FA.set(WA);FZ.set(WZ)}
function scatter(){for(let i=0;i<N;i++){const a=Math.random()*TAU,r=70+Math.random()*250,cx=CX+Math.cos(a)*r*1.12,cy=CYC-40+Math.sin(a)*r*.68,s=2+Math.random()*3.5;
 for(let j=0;j<3;j++){const b=a*3+j*2.094+Math.random();F[i*6+j*2]=cx+Math.cos(b)*s;F[i*6+j*2+1]=cy+Math.sin(b)*s}FC[i*3]=163;FC[i*3+1]=184;FC[i*3+2]=214;FA[i]=0;FZ[i]=0}}
function morph(to,o={}){prev=shape;shape=to;m0=T;mDur=o.dur||1.5;bulge=o.bulge??40;for(let i=0;i<N;i++)DEL[i]=o.del?o.del(i):RND[i]*.5}
function resetFly(){ph=0;fF=.7;fA=.46;fB=0;fx=CX;fy=CY;phi=0;S=1;tau=0;vx=vy=0}
function setStage(n,manual){
 if(n===3&&shape!=='bfly'){setStage(2,manual);durB=2.6;return}
 if(n===0){if(stg===4||shape==='scat'){scatter();morph('cat',{dur:1.6,bulge:0,del:i=>Math.random()*.9})}else{snapshot();morph('cat',{dur:1.6,bulge:70})}}
 else if(n===1){snapshot();morph('chr',{dur:1.5,bulge:26,del:i=>(1-(CT[AC[i]].c[0]+150)/300)*.55+RND[i]*.25})}
 else if(n===2){snapshot();resetFly();durB=DUR.bfly;morph('bfly',{dur:1.4,bulge:22,del:i=>Math.min(1,Math.hypot(B[i].c[0],B[i].c[1])/200)*.4+RND[i]*.2})}
 else if(n===3){for(let i=0;i<10;i++)shed(Math.floor(Math.random()*N),(Math.random()-.5)*110,30+Math.random()*50,.8+Math.random()*.7)}
 stg=n;sT0=T;
 if(manual)tone([392,494,587,740][n]||440,.2,'triangle',.05,[523,659,784,988][n]||600);
 ui()}
function ui(){const cur=stg===4?3:stg;sts.forEach(b=>{const s=+b.dataset.s;b.classList.toggle('on',s===cur);b.classList.toggle('done',s<cur);if(s!==cur)b.style.setProperty('--p',0)});go$.textContent=stg>=3?'↺ Recomeçar':'✦ Evoluir'}
function evolve(manual){setStage(stg>=3?0:stg+1,manual)}
const unfocus=e=>{if(e.detail)e.currentTarget.blur()};
go$.addEventListener('click',e=>{e.stopPropagation();unfocus(e);evolve(true)});
sts.forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();unfocus(e);const s=+b.dataset.s;if(s===stg||(s===3&&stg===4))return;setStage(s,true)}));
cv.addEventListener('pointermove',e=>{[mx,my]=DECK.toStage(e);mt=T});
cv.addEventListener('pointerleave',()=>{mx=my=-999});
cv.addEventListener('click',e=>{const [px,py]=DECK.toStage(e),[gx,gy]=figC();if(stg<3&&Math.hypot(px-gx,py-gy)<240)evolve(true)});
function figC(){return shape==='cat'?[CX,CYC]:shape==='chr'?[CX,CHY+112]:[fx,fy]}

/* fragmentos que se soltam (rastro) */
function shed(i,vx0,vy0,life,k=.42){if(D.length>200)return;const o=i*6,cx=(W[o]+W[o+2]+W[o+4])/3,cy=(W[o+1]+W[o+3]+W[o+5])/3;if(!WA[i])return;
 D.push({cx,cy,p:[(W[o]-cx)*k,(W[o+1]-cy)*k,(W[o+2]-cx)*k,(W[o+3]-cy)*k,(W[o+4]-cx)*k,(W[o+5]-cy)*k],vx:vx0,vy:vy0,r:0,vr:(Math.random()-.5)*5,life,max:life,c:`${WC[i*3]|0},${WC[i*3+1]|0},${WC[i*3+2]|0}`})}

/* ---------- quadro ---------- */
function tick(dt){const el=T-sT0;
 if(stg===0&&el>DUR.cat)setStage(1);else if(stg===1&&el>DUR.chr)setStage(2);else if(stg===2&&el>durB)setStage(3);else if(stg===3&&tau>=1)setStage(4);else if(stg===4&&el>DUR.sky)setStage(0);
 // asas: frequência (Hz), amplitude e base (rad) suavizadas
 let tF=.7,tA=.46,tB=0;if(stg===2&&el>durB-.7){tF=2.2;tA=1.0;tB=.05}if(stg>=3){tF=3.1;tA=1.22;tB=.1}
 const k=Math.min(1,dt*3);fF+=(tF-fF)*k;fA+=(tA-fA)*k;fB+=(tB-fB)*k;ph+=TAU*fF*dt;
 const flap=q=>fB+fA*(.5-.5*Math.cos(q));let close=0;if(shape==='bfly'&&stg===2)close=1.5*(1-eOut(clamp((el-.75)/1.3)));
 thF=Math.max(flap(ph),close);thH=Math.max(flap(ph-.38),close);
 if(stg===3&&shape==='bfly'){const s=clamp((T-sT0)/DUR.fly),q=Math.pow(s,1.6),u=1-q,P=[[CX,CY],[1010,320],[1360,400],[2260,320]];
  const bx=u*u*u*P[0][0]+3*u*u*q*P[1][0]+3*u*q*q*P[2][0]+q*q*q*P[3][0],by=u*u*u*P[0][1]+3*u*u*q*P[1][1]+3*u*q*q*P[2][1]+q*q*q*P[3][1];
  const dx=3*u*u*(P[1][0]-P[0][0])+6*u*q*(P[2][0]-P[1][0])+3*q*q*(P[3][0]-P[2][0]),dy=3*u*u*(P[1][1]-P[0][1])+6*u*q*(P[2][1]-P[1][1])+3*q*q*(P[3][1]-P[2][1]);
  const nx=bx+Math.sin(q*PI*3)*16*(1-q),ny=by-Math.cos(ph)*9+Math.sin(q*PI*2)*10;vx=(nx-fx)/Math.max(dt,.001);vy=(ny-fy)/Math.max(dt,.001);fx=nx;fy=ny;tau=s;
  const tg=clamp(Math.atan2(dy,dx)+PI/2,-.9,.9)*.62;phi+=(tg-phi)*Math.min(1,dt*3.5);S=1+.12*Math.pow(q,1.4);
  if(Math.random()<dt*22)D.push({dot:1,cx:fx+(Math.random()-.5)*160*S,cy:fy+(Math.random()-.3)*140*S,vx:-vx*.12+(Math.random()-.5)*40,vy:-vy*.12+(Math.random()-.5)*40,life:.7+Math.random()*.8,max:1.5,rad:1+Math.random()*1.4,c:Math.random()<.4?'255,138,76':'228,235,245'});
  if(Math.random()<dt*14*(1-s*.5))shed(Math.floor(Math.random()*N),-vx*.15+(Math.random()-.5)*60,-vy*.15+(Math.random()-.5)*60+16,.8+Math.random()*.8)}
 else if(shape==='bfly'&&stg<3){fy=CY-Math.cos(ph)*2.2;fx=CX}
 if(shape==='bfly'&&stg===2&&el>2.1&&Math.random()<dt*2.5){const i=Math.floor(Math.random()*N);if(B[i].edge&&B[i].w<2&&(B[i].side>0||Math.random()<.3))shed(i,B[i].side*(16+Math.random()*44),-34+Math.random()*30,2.2+Math.random()*1.2)}
}
function target(i,o){let col,a=1,z=0;
 if(shape==='cat'){const t=CT[AC[i]];for(let j=0;j<3;j++){const p=catP(t.v[j][0],t.v[j][1]);o[j*2]=p[0];o[j*2+1]=p[1]}col=t.col}
 else if(shape==='chr'){const t=HT[AH[i]],ang=Math.sin(T*1.15)*.035,ca=Math.cos(ang),sa=Math.sin(ang),br=1+Math.sin(T*2.4)*.012;
  for(let j=0;j<3;j++){const u=t.v[j][0]*br,v=t.v[j][1]*br;o[j*2]=CX+u*ca-v*sa;o[j*2+1]=CHY+u*sa+v*ca}
  const tint=stg===1?clamp((T-sT0-(DUR.chr-1.7))/1.6)*.55:0;col=tint?mix(t.col,B[i].col,tint):t.col}
 else if(shape==='bfly'){const b=B[i],cp=Math.cos(phi),sp=Math.sin(phi);let sh=1;
  if(b.w<2){const th=b.w?thF:thH,c=Math.max(.06,Math.cos(th)),s=Math.sin(th),sk=1+b.side*.22*sp;sh=.7+.3*c;
   for(let j=0;j<3;j++){const u=b.v[j][0]*c*sk,v=b.v[j][1]-Math.abs(b.v[j][0])*s*.12;o[j*2]=fx+S*(u*cp-v*sp);o[j*2+1]=fy+S*(u*sp+v*cp)}}
  else for(let j=0;j<3;j++){const u=b.v[j][0],v=b.v[j][1];o[j*2]=fx+S*(u*cp-v*sp);o[j*2+1]=fy+S*(u*sp+v*cp)}
  col=lit(b.col,sh);z=b.w;if(stg===4)a=0}
 else{for(let j=0;j<6;j++)o[j]=F[i*6+j];col=[FC[i*3],FC[i*3+1],FC[i*3+2]];a=FA[i]}
 return [col,a,z]}
function weight(name,lag=0,len=.9){return shape===name?clamp((T-m0-lag)/len):prev===name?1-clamp((T-m0)/.45):0}
function line(x0,y0,x1,y1,w,col,a){const g=x.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(.2,`rgba(${col},${a})`);g.addColorStop(.8,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);x.strokeStyle=g;x.lineWidth=w;x.beginPath();x.moveTo(x0,y0);x.quadraticCurveTo((x0+x1)/2,(y0+y1)/2+4,x1,y1);x.stroke()}
function draw(dt){x.setTransform(ck,0,0,ck,0,0);x.clearRect(0,0,1600,900);
 for(const b of BG){b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<0||b.x>1600)b.vx*=-1;if(b.y<0||b.y>900)b.vy*=-1;x.fillStyle=`rgba(201,214,232,${b.a})`;x.beginPath();x.arc(b.x,b.y,b.r,0,TAU);x.fill()}
 // brilho atrás da figura
 const [gx,gy]=figC(),ga=(shape==='bfly'?(stg>=3?.2*(1-clamp(tau*1.6)):.2):shape==='scat'?0:.16)*clamp((T-m0)/1.2+.2),gc=shape==='bfly'?'110,143,191':'74,111,165';
 if(ga>.005){const rg=x.createRadialGradient(gx,gy,8,gx,gy,shape==='bfly'?290:230);rg.addColorStop(0,`rgba(${gc},${ga})`);rg.addColorStop(1,`rgba(${gc},0)`);x.fillStyle=rg;x.fillRect(gx-300,gy-300,600,600)}
 // galho da lagarta e graveto do casulo
 const wc=weight('cat',.2),wh=weight('chr',.2);
 if(wc>.01){line(CX-270,CYC+25,CX+280,CYC+23,2.2,'110,143,191',.55*wc)}
 if(wh>.01){line(CX-130,CHY-5,CX+115,CHY-9,3,'110,143,191',.65*wh);x.strokeStyle=`rgba(228,235,245,${.6*wh})`;x.lineWidth=1.4;x.beginPath();x.moveTo(CX,CHY-7);x.lineTo(CX,CHY+3);x.stroke()}
 // segmentos da lagarta (onda de rastejar)
 // patinhas da lagarta (atrás do corpo)
 const wg=weight('cat',1.1,.5);if(wg>.01){x.lineCap='round';x.lineWidth=3;x.strokeStyle=`rgba(42,90,150,${.95*wg})`;
  for(const lx of [-98,-75,-52,-29,52,75,98]){const a=catP(lx,10),b=catP(lx+2,21.5);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()}}
 // rastro (atrás)
 for(let i=D.length-1;i>=0;i--){const d=D[i];d.life-=dt;if(d.life<=0){D.splice(i,1);continue}d.cx+=d.vx*dt;d.cy+=d.vy*dt;d.vx*=1-dt*.6;d.vy=d.vy*(1-dt*.6)+14*dt;d.r+=d.vr*dt;
  if(d.dot){x.fillStyle=`rgba(${d.c},${Math.min(1,d.life/d.max*1.6)*.9})`;x.beginPath();x.arc(d.cx,d.cy,d.rad,0,TAU);x.fill();continue}
  const k=d.life/d.max,s=.35+.65*k,c=Math.cos(d.r)*s,sn=Math.sin(d.r)*s,p=d.p;x.beginPath();for(let j=0;j<3;j++){const u=p[j*2],v=p[j*2+1],X=d.cx+u*c-v*sn,Y=d.cy+u*sn+v*c;j?x.lineTo(X,Y):x.moveTo(X,Y)}x.closePath();x.fillStyle=`rgba(${d.c},${Math.pow(k,1.3)*.9})`;x.fill()}
 // fragmentos (o empurrão do cursor some ~0,7 s depois que ele para)
 const cxF=figC(),mk=clamp(1-(T-mt-.15)/.6);
 for(let i=0;i<N;i++){const [col,a,z]=target(i,tv),e=ease(clamp((T-m0-DEL[i])/mDur)),o=i*6,bu=Math.sin(PI*e),rot=bu*SPIN[i]*(shape==='cat'&&prev==='scat'?.4:1);
  let gx=0,gy=0;for(let j=0;j<3;j++){const X=F[o+j*2]+(tv[j*2]-F[o+j*2])*e,Y=F[o+j*2+1]+(tv[j*2+1]-F[o+j*2+1])*e;W[o+j*2]=X;W[o+j*2+1]=Y;gx+=X/3;gy+=Y/3}
  let dx=gx-cxF[0],dy=gy-cxF[1];const dd=Math.hypot(dx,dy)||1,bb=bu*bulge*(.4+.6*RND[i]);dx=dx/dd*bb;dy=dy/dd*bb;
  const md=Math.hypot(gx-mx,gy-my);if(md<100&&mk>0){const f=(100-md)/100*3.2*mk;OX[i]+=(gx-mx)/md*f;OY[i]+=(gy-my)/md*f}OX[i]*=.92;OY[i]*=.92;
  const cr=Math.cos(rot),sr=Math.sin(rot);for(let j=0;j<3;j++){const u=W[o+j*2]-gx,v=W[o+j*2+1]-gy;W[o+j*2]=gx+u*cr-v*sr+dx+OX[i];W[o+j*2+1]=gy+u*sr+v*cr+dy+OY[i]}
  WC[i*3]=FC[i*3]+(col[0]-FC[i*3])*e;WC[i*3+1]=FC[i*3+1]+(col[1]-FC[i*3+1])*e;WC[i*3+2]=FC[i*3+2]+(col[2]-FC[i*3+2])*e;WA[i]=FA[i]+(a-FA[i])*e;WZ[i]=FZ[i]+(z-FZ[i])*e}
 ORD.sort((a,b)=>WZ[a]-WZ[b]);
 x.lineJoin='round';
 for(const i of ORD){const a=WA[i];if(a<.01)continue;const o=i*6,c=`${WC[i*3]|0},${WC[i*3+1]|0},${WC[i*3+2]|0}`;
  x.beginPath();x.moveTo(W[o],W[o+1]);x.lineTo(W[o+2],W[o+3]);x.lineTo(W[o+4],W[o+5]);x.closePath();
  x.fillStyle=`rgba(${c},${a})`;x.fill();x.strokeStyle=`rgba(${c},${a})`;x.lineWidth=.9;x.stroke();x.strokeStyle=`rgba(255,255,255,${.1*a})`;x.lineWidth=.6;x.stroke()}
 // antenas da borboleta
 const wa=stg===4?0:weight('bfly',1,.6);
 if(wa>.01){const cp=Math.cos(phi),sp=Math.sin(phi),tr=(u,v)=>[fx+S*(u*cp-v*sp),fy+S*(u*sp+v*cp)];x.lineWidth=1.5*S;x.lineCap='round';
  for(const sg of [-1,1]){const a=tr(sg*2.5,-39),b=tr(sg*9,-66),c=tr(sg*27,-85);x.strokeStyle=`rgba(201,214,232,${.85*wa})`;x.beginPath();x.moveTo(a[0],a[1]);x.quadraticCurveTo(b[0],b[1],c[0],c[1]);x.stroke();x.fillStyle=`rgba(255,138,76,${wa})`;x.beginPath();x.arc(c[0],c[1],2.7*S,0,TAU);x.fill()}}
 // filamentos da lagarta
 const wl=weight('cat',1.1,.5);
 if(wl>.01){x.lineCap='round';x.lineWidth=1.4;x.strokeStyle=`rgba(201,214,232,${.8*wl})`;
  for(const [a,b,c,d] of [[130,-19,136,-36],[140,-16,153,-31],[-145,-4,-158,-15]]){const P=catP(a,b),Q=catP(c,d);x.beginPath();x.moveTo(P[0],P[1]);x.quadraticCurveTo((P[0]+Q[0])/2+3,(P[1]+Q[1])/2,Q[0],Q[1]);x.stroke()}
  const ey=catP(141,-5);x.fillStyle=`rgba(228,235,245,${.9*wl})`;x.beginPath();x.arc(ey[0],ey[1],2.3,0,TAU);x.fill()}
 // progresso do estágio atual (Progress Motion)
 const on=sts[stg===4?3:stg];if(on)on.style.setProperty('--p',stg===0?clamp((T-sT0)/DUR.cat):stg===1?clamp((T-sT0)/DUR.chr):stg===2?clamp((T-sT0)/durB):stg===3?tau:1)}

function fit(){const k=Math.min(2,Math.max(1,(window.devicePixelRatio||1)*DECK.scale()));if(Math.abs(k-ck)>.04||cv.width!==Math.round(1600*k)){ck=k;cv.width=Math.round(1600*k);cv.height=Math.round(900*k)}}
function loop(now){if(!SEC.classList.contains('active')){run=false;return}requestAnimationFrame(loop);const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;T+=dt;tick(dt);draw(dt)}
function start(){fit();if(!run){run=true;last=performance.now();requestAnimationFrame(loop)}}
let rz=0;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{if(run)fit()},150)});
DECK.register('capa',{
 enter(){D.length=0;stg=4;shape='scat';prev='scat';OX.fill(0);OY.fill(0);WA.fill(0);setStage(0);sT0=T-.3;start()},
 leave(){D.length=0;mx=my=-999}
});
})();
