/* ==== puppet.js · bonecos de papel articulados (recorte de revista + colchete de latão) ====
   puppet(parent,{costume,face,code,name,scale,flip,x,y,tag}) → {id,wrap,svg,parts:{torso,head,armL,armR,legL,legR},cfg}
   Unidades locais: chão em y=0; quadril y=-250; ombros y≈-445; pescoço y=-475; topo da cabeça y≈-715.
   Partes registradas no engine com svg:true + pivot → kf/tw/proc funcionam em cada articulação.      */
"use strict";
const PP={ink:'#1b1e21',paper:'#f6f1e4',brass:'#c9a24a',brass2:'#8a6a22',skin:'#e8b996',skin2:'#c98a62',white:'#ffffff'};
const SKINS=['#f1c9a5','#e8b996','#c98a62','#9c6240','#6b3f25'];
let PUP_UID=0;
/* peça de papel: borda branca grossa por baixo (papel) + traço de nanquim por cima */
function piece(g,d,fill,o){o=o||{};S('path',{d,fill:'none',stroke:PP.white,'stroke-width':o.edge||10,'stroke-linejoin':'round','stroke-linecap':'round'},g);
  const p=S('path',{d,fill:fill||PP.paper,stroke:o.stroke||PP.ink,'stroke-width':o.sw===undefined?3.2:o.sw,'stroke-linejoin':'round','stroke-linecap':'round'},g);if(o.opacity)p.setAttribute('opacity',o.opacity);return p}
function rrect(x,y,w,h,r){r=Math.min(r,w/2,h/2);return `M${x+r} ${y} h${w-2*r} a${r} ${r} 0 0 1 ${r} ${r} v${h-2*r} a${r} ${r} 0 0 1 ${-r} ${r} h${-(w-2*r)} a${r} ${r} 0 0 1 ${-r} ${-r} v${-(h-2*r)} a${r} ${r} 0 0 1 ${r} ${-r}z`}
function ell(cx,cy,rx,ry){return `M${cx-rx} ${cy} a${rx} ${ry} 0 1 0 ${2*rx} 0 a${rx} ${ry} 0 1 0 ${-2*rx} 0z`}
function rivet(g,x,y){S('circle',{cx:x,cy:y,r:9,fill:PP.brass,stroke:PP.brass2,'stroke-width':2.5},g);S('circle',{cx:x-2,cy:y-2,r:3,fill:'rgba(255,255,255,.7)'},g);S('path',{d:`M${x-5} ${y} h10 M${x} ${y-5} v10`,stroke:PP.brass2,'stroke-width':1.6},g)}
function dots(g,x,y,w,h,col,gap){/* bolinhas (vestido) */for(let yy=y+8;yy<y+h;yy+=gap||22)for(let xx=x+8+((yy/22)%2?11:0);xx<x+w;xx+=gap||22)S('circle',{cx:xx,cy:yy,r:4,fill:col},g)}
function stripes(g,x,y,w,h,col,gap){for(let xx=x;xx<x+w;xx+=gap||18)S('rect',{x:xx,y,width:7,height:h,fill:col},g)}

/* ---------- figurinos ---------- */
const COSTUMES={
  motorista1908:{nome:'Motorista 1908',coat:'#c8b48a',coatStyle:'long',shirt:'#f3eadb',pants:'#6b5a43',shoes:'#3b2b1b',hat:'cap',glasses:'goggles',prop:'wheel',tie:'bow',gloves:'#e9dcc3'},
  dama1908:{nome:'Dama 1908',coat:'#6d3b63',coatStyle:'dress',shirt:'#f6efe6',pants:'#4a2a44',shoes:'#2d1a28',hat:'bonnet',prop:'parasol',brooch:'#d8b24a'},
  carroceiro:{nome:'Carroceiro',coat:'#8a5a34',coatStyle:'vest',shirt:'#efe3c8',pants:'#5a4a3a',shoes:'#3b2b1b',hat:'straw',prop:'hay',suspenders:'#3a2a1a'},
  mecanico:{nome:'Mecânico',coat:'#3d5a80',coatStyle:'overalls',shirt:'#e9e4d6',pants:'#3d5a80',shoes:'#2b2b2b',hat:'capback',prop:'wrench',smudge:true},
  fordista:{nome:'Operário da linha',coat:'#8b8f94',coatStyle:'apron',shirt:'#d9e3ee',pants:'#4b4f55',shoes:'#2b2b2b',hat:'flat',prop:'bolt',sleeves:true},
  senhor1950:{nome:'Senhor 1950',coat:'#6f4e37',coatStyle:'jacket',shirt:'#f6f6f2',pants:'#5a4030',shoes:'#2b1b10',hat:'fedora',prop:'newspaper',tie:'tie',tieColor:'#a3362a'},
  dona1960:{nome:'Dona 1960',coat:'#c8322b',coatStyle:'dress',shirt:'#ffffff',pants:'#c8322b',shoes:'#2b2b2b',hat:'bouffant',glasses:'cateye',prop:'handbag',polka:'#ffffff',belt:'#222'},
  marty1985:{nome:'Jovem 1985',coat:'#d7342b',coatStyle:'vest',shirt:'#3f6ea6',pants:'#3a5f9a',shoes:'#ffffff',hat:null,prop:'skate',sneakers:true,denim:true},
  doc:{nome:'Cientista',coat:'#f5f5f2',coatStyle:'labcoat',shirt:'#f2c14e',pants:'#4a4a4a',shoes:'#2b2b2b',hat:'wig',glasses:'gogglesUp',prop:'remote',pocket:true},
  engenheiro_hoje:{nome:'Engenheira(o) hoje',coat:'#f2a900',coatStyle:'hivis',shirt:'#dfe6ee',pants:'#3c4652',shoes:'#5a3a1a',hat:'hardhat',prop:'tablet',reflect:'#d9d9d9'},
  hoodie_hoje:{nome:'Hoodie hoje',coat:'#8f949b',coatStyle:'hoodie',shirt:'#8f949b',pants:'#2f3338',shoes:'#f2f2f2',hat:'headphones',prop:'phone',sneakers:true},
  guarda:{nome:'Guarda de trânsito 1920',coat:'#2e3a55',coatStyle:'jacket',shirt:'#ffffff',pants:'#2e3a55',shoes:'#1b1b1b',hat:'guardcap',prop:'paddle',gloves:'#ffffff',buttons:'#d8b24a',belt:'#1b1b1b'},
  piloto:{nome:'Piloto',coat:'#5b3a21',coatStyle:'jacket',shirt:'#e8e0cc',pants:'#8a7a5a',shoes:'#3b2b1b',hat:'aviator',glasses:'goggles',prop:null,scarf:'#f1f1f1',fur:'#d9c7a6'},
  vovo:{nome:'Vovó',coat:'#b9a0cf',coatStyle:'cardigan',shirt:'#fff6e8',pants:'#6a5a7a',shoes:'#3b2b1b',hat:'bun',glasses:'round',prop:'knitting',buttons:'#fff',skirt:'#6a5a7a'},
  entregador:{nome:'Entregador(a)',coat:'#f2c200',coatStyle:'jacket',shirt:'#1b1b1b',pants:'#1b1b1b',shoes:'#2b2b2b',hat:'helmet',prop:'phone',backpack:'#f2c200',sneakers:true},
  executivo:{nome:'Executiva(o)',coat:'#1f2a44',coatStyle:'jacket',shirt:'#ffffff',pants:'#1f2a44',shoes:'#1b1b1b',hat:null,prop:'briefcase',tie:'tie',tieColor:'#2a7f62',lanyard:'#c8322b'},
  passageiro:{nome:'Passageiro(a) de hoje',coat:'#2f6f4e',coatStyle:'jacket',shirt:'#ffffff',pants:'#2b2f36',shoes:'#2b2b2b',hat:'beanie',prop:'coffee',sneakers:true},
};

/* ---------- desenho do corpo ---------- */
function drawLeg(g,cfg,side){/* origem no quadril; perna desce até y=240; sapato aponta para fora */
  const dir=side==='L'?-1:1;
  if(cfg.coatStyle==='dress'||cfg.skirt){/* meias/pernas finas */piece(g,rrect(-16,0,32,232,14),cfg.pants,{edge:8})}
  else piece(g,rrect(-23,0,46,236,16),cfg.pants,{edge:9});
  if(cfg.sneakers){piece(g,`M${-26} 220 h52 v26 a10 10 0 0 1 -10 10 h${dir*22-22+(dir>0?0:0)} h-42 a10 10 0 0 1 -10 -10z`,cfg.shoes);S('path',{d:`M-20 236 h${dir>0?60:40}`,stroke:PP.ink,'stroke-width':2.2,fill:'none'},g);S('circle',{cx:dir*8,cy:243,r:3,fill:PP.ink},g)}
  else piece(g,`M-24 226 h48 v20 ${dir>0?'h30 a10 10 0 0 1 0 14 h-78':'h-30 a10 10 0 0 0 0 14 h78'} z`,cfg.shoes);
}
function drawTorso(g,cfg){/* origem no quadril (0,0); ombros y=-205 */
  const W=cfg.coatStyle==='dress'?150:160;
  // tronco base (camisa)
  piece(g,`M${-W/2+6} 0 L${-W/2} -205 Q0 -225 ${W/2} -205 L${W/2-6} 0z`,cfg.shirt);
  if(cfg.coatStyle==='dress'){
    piece(g,`M-60 -120 L60 -120 L120 150 Q0 170 -120 150z`,cfg.coat);
    piece(g,`M-75 -205 Q0 -222 75 -205 L62 -115 Q0 -100 -62 -115z`,cfg.coat);
    if(cfg.polka)dots(g,-110,-200,220,340,cfg.polka,24);
    if(cfg.belt)S('rect',{x:-66,y:-130,width:132,height:16,fill:cfg.belt,stroke:PP.ink,'stroke-width':2.5},g);
    if(cfg.brooch)S('circle',{cx:0,cy:-170,r:9,fill:cfg.brooch,stroke:PP.ink,'stroke-width':2},g);
  }else if(cfg.coatStyle==='long'){
    piece(g,`M-82 -205 L-98 150 Q0 165 98 150 L82 -205 L40 -200 L0 -120 L-40 -200z`,cfg.coat);
    S('path',{d:'M0 -120 v270',stroke:PP.ink,'stroke-width':2.2,fill:'none'},g);
    [-70,-20,30,80].forEach(y=>S('circle',{cx:0,cy:y,r:5,fill:PP.ink},g));
  }else if(cfg.coatStyle==='vest'){
    piece(g,`M-72 -205 L-78 10 L-10 10 L0 -60 L10 10 L78 10 L72 -205 L36 -198 L0 -130 L-36 -198z`,cfg.coat,{edge:8});
    if(cfg.suspenders){S('path',{d:'M-40 -200 L-34 10 M40 -200 L34 10',stroke:cfg.suspenders,'stroke-width':10,fill:'none','stroke-linecap':'round'},g)}
    if(cfg.denim){S('path',{d:'M-78 -150 h150 M-80 -40 h160',stroke:'rgba(255,255,255,.35)','stroke-width':3,fill:'none','stroke-dasharray':'6 6'},g)}
  }else if(cfg.coatStyle==='overalls'){
    piece(g,`M-74 10 L-80 -120 L-52 -120 L-46 -200 L-26 -200 L-30 -120 L30 -120 L26 -200 L46 -200 L52 -120 L80 -120 L74 10z`,cfg.coat);
    piece(g,rrect(-34,-96,68,52,6),'rgba(0,0,0,.18)',{edge:0,sw:2.2});
    if(cfg.smudge){S('path',{d:'M-50 -40 q12 -10 20 4 q10 10 -4 14 q-14 2 -16 -18z',fill:'rgba(27,30,33,.55)'},g)}
    rivet(g,-38,-120);rivet(g,38,-120);
  }else if(cfg.coatStyle==='apron'){
    piece(g,`M-60 -150 h120 L92 10 h-184z`,cfg.coat);
    S('path',{d:'M-60 -150 L-72 -200 M60 -150 L72 -200',stroke:PP.ink,'stroke-width':3,fill:'none'},g);
    piece(g,rrect(-30,-80,60,70,6),'rgba(0,0,0,.16)',{edge:0,sw:2});
  }else if(cfg.coatStyle==='labcoat'){
    piece(g,`M-84 -205 L-100 140 Q0 160 100 140 L84 -205 L44 -198 L0 -70 L-44 -198z`,cfg.coat);
    S('path',{d:'M0 -70 v210',stroke:PP.ink,'stroke-width':2.2,fill:'none'},g);
    piece(g,rrect(-78,-20,44,52,4),cfg.coat,{edge:0,sw:2.2});S('path',{d:'M-66 -16 v-6 h8 v6',stroke:'#2a7f62','stroke-width':3,fill:'none'},g);S('path',{d:'M-56 -16 v-6 h8 v6',stroke:'#c8322b','stroke-width':3,fill:'none'},g);
  }else if(cfg.coatStyle==='hivis'){
    piece(g,`M-80 -205 L-86 30 L-12 30 L-12 -40 L0 -120 L12 -40 L12 30 L86 30 L80 -205 L40 -198 L0 -150 L-40 -198z`,cfg.coat);
    [-120,-60].forEach(y=>S('path',{d:`M-84 ${y} L-14 ${y+4} M14 ${y+4} L84 ${y}`,stroke:cfg.reflect,'stroke-width':12,fill:'none'},g));
  }else if(cfg.coatStyle==='hoodie'){
    piece(g,`M-86 -200 L-92 40 Q0 60 92 40 L86 -200 Q0 -240 -86 -200z`,cfg.coat);
    piece(g,`M-60 -210 Q0 -150 60 -210 Q40 -236 0 -238 Q-40 -236 -60 -210z`,cfg.coat,{edge:0});
    S('path',{d:'M-14 -165 v60 M14 -165 v60',stroke:PP.paper,'stroke-width':5,fill:'none'},g);
    piece(g,rrect(-60,-30,120,56,18),'rgba(0,0,0,.14)',{edge:0,sw:2.2});
  }else if(cfg.coatStyle==='cardigan'){
    piece(g,`M-82 -205 L-90 60 L-16 60 L-16 -40 L0 -110 L16 -40 L16 60 L90 60 L82 -205 L40 -198 L0 -150 L-40 -198z`,cfg.coat);
    [-20,20,50].forEach(y=>S('circle',{cx:0,cy:y,r:5,fill:cfg.buttons||'#fff',stroke:PP.ink,'stroke-width':2},g));
    if(cfg.skirt)piece(g,`M-80 40 L80 40 L104 170 Q0 186 -104 170z`,cfg.skirt);
  }else{/* jacket */
    piece(g,`M-84 -205 L-92 60 L-18 60 L-18 -40 L0 -120 L18 -40 L18 60 L92 60 L84 -205 L46 -198 L0 -140 L-46 -198z`,cfg.coat);
    S('path',{d:'M-46 -198 L-70 -120 L-18 -40 M46 -198 L70 -120 L18 -40',stroke:PP.ink,'stroke-width':2.2,fill:'none'},g);
    if(cfg.buttons)[-20,20].forEach(y=>S('circle',{cx:0,cy:y,r:6,fill:cfg.buttons,stroke:PP.ink,'stroke-width':2},g));
    if(cfg.belt)S('rect',{x:-90,y:40,width:180,height:16,fill:cfg.belt,stroke:PP.ink,'stroke-width':2.2},g);
  }
  if(cfg.tie==='tie')piece(g,`M-10 -196 h20 L8 -120 L14 -40 L0 -20 L-14 -40 L-8 -120z`,cfg.tieColor||'#a3362a',{edge:0,sw:2.2});
  if(cfg.tie==='bow'){piece(g,`M-30 -190 L-6 -180 L-30 -170z M30 -190 L6 -180 L30 -170z`,'#2b2b2b',{edge:0,sw:2});S('circle',{cx:0,cy:-180,r:6,fill:'#2b2b2b'},g)}
  if(cfg.lanyard){S('path',{d:'M-30 -200 L-6 -90 M30 -200 L6 -90',stroke:cfg.lanyard,'stroke-width':6,fill:'none'},g);piece(g,rrect(-20,-92,40,54,5),'#fff',{edge:0,sw:2.2});S('rect',{x:-13,y:-80,width:26,height:7,fill:PP.ink},g)}
  if(cfg.scarf){piece(g,`M-60 -210 Q0 -170 60 -210 L70 -180 Q0 -140 -70 -180z`,cfg.scarf,{edge:0});piece(g,`M30 -175 L50 -70 L22 -75z`,cfg.scarf,{edge:0})}
  if(cfg.fur)piece(g,`M-84 -205 Q0 -240 84 -205 Q60 -175 0 -185 Q-60 -175 -84 -205z`,cfg.fur,{edge:0,sw:2.2});
  if(cfg.backpack){piece(g,rrect(-110,-170,70,110,10),cfg.backpack);S('path',{d:'M-105 -170 L-60 -200 M-45 -170 L-60 -200',stroke:PP.ink,'stroke-width':3,fill:'none'},g)}
  // pescoço
  piece(g,rrect(-22,-262,44,70,14),cfg.skin,{edge:7});
}
function drawArm(g,cfg,side){/* origem no ombro; mão em (0,205) */
  const sleeve=cfg.coatStyle==='vest'||cfg.coatStyle==='overalls'||cfg.coatStyle==='apron'||cfg.sleeves?cfg.shirt:cfg.coat;
  const short=cfg.sleeves||cfg.coatStyle==='apron';
  piece(g,`M-20 -10 L-24 ${short?60:150} Q-24 ${short?70:160} -14 ${short?70:160} L14 ${short?70:160} Q24 ${short?70:160} 24 ${short?60:150} L20 -10 Q0 -20 -20 -10z`,sleeve,{edge:8});
  if(short)piece(g,rrect(-17,66,34,106,14),cfg.skin,{edge:7});
  if(cfg.coatStyle==='hivis')S('path',{d:'M-22 60 h44',stroke:cfg.reflect,'stroke-width':10,fill:'none'},g);
  if(cfg.coatStyle==='dress'&&!short)S('path',{d:'M-24 150 Q0 170 24 150',stroke:PP.ink,'stroke-width':2,fill:'none'},g);
  piece(g,ell(0,190,24,27),cfg.gloves||cfg.skin,{edge:8});
  S('path',{d:'M-10 184 q6 -6 12 0 M2 196 q6 -6 12 0',stroke:PP.ink,'stroke-width':1.6,fill:'none',opacity:.5},g);
}
/* adereços na mão direita (origem = mão, (0,190) do braço) */
function drawProp(g,kind,cfg){const p=S('g',{transform:'translate(0 190)'},g);
  switch(kind){
    case 'wheel':piece(p,ell(0,0,56,56),'#3b2b1b',{edge:8});piece(p,ell(0,0,40,40),PP.paper,{edge:0,sw:2.2});S('path',{d:'M-40 0 h80 M0 -40 v80 M-28 -28 L28 28 M-28 28 L28 -28',stroke:'#3b2b1b','stroke-width':6,fill:'none'},p);S('circle',{cx:0,cy:0,r:9,fill:'#3b2b1b'},p);break;
    case 'parasol':S('path',{d:'M0 10 L0 -260',stroke:PP.ink,'stroke-width':5,fill:'none'},p);piece(p,`M-120 -250 Q0 -340 120 -250 Q60 -270 0 -250 Q-60 -270 -120 -250z`,'#e9d3b7');S('path',{d:'M-120 -250 Q0 -340 120 -250 M0 -250 L0 -320',stroke:PP.ink,'stroke-width':2.5,fill:'none'},p);break;
    case 'wrench':piece(p,`M-10 40 L-10 -60 a24 24 0 1 1 20 0 L10 40 a10 10 0 0 1 -20 0z`,'#9a9ea3',{edge:7});S('path',{d:'M-8 -88 h16',stroke:PP.ink,'stroke-width':2,fill:'none'},p);break;
    case 'bolt':piece(p,`M-22 -24 L22 -24 L34 0 L22 24 L-22 24 L-34 0z`,'#9a9ea3',{edge:7});S('circle',{cx:0,cy:0,r:9,fill:'none',stroke:PP.ink,'stroke-width':2.4},p);break;
    case 'newspaper':piece(p,rrect(-18,-40,110,70,4),'#efe8d6',{edge:7});S('path',{d:'M-8 -28 h90 M-8 -16 h90 M-8 -4 h60 M-8 8 h90 M-8 20 h70',stroke:'rgba(27,30,33,.45)','stroke-width':3,fill:'none'},p);S('text',{x:38,y:-30,'font-family':FN,'font-size':16,'text-anchor':'middle',fill:PP.ink},p).textContent='Diário';break;
    case 'handbag':S('path',{d:'M-14 0 q14 -40 28 0',stroke:PP.ink,'stroke-width':4,fill:'none'},p);piece(p,rrect(-40,0,80,62,10),'#2b2b2b',{edge:7});S('circle',{cx:0,cy:30,r:6,fill:PP.brass},p);break;
    case 'tablet':piece(p,rrect(-40,-70,80,110,8),'#2b2f36',{edge:7});S('rect',{x:-32,y:-62,width:64,height:94,rx:3,fill:'#9fd2ff'},p);S('path',{d:'M-24 -48 h48 M-24 -34 h30 M-24 -20 h40',stroke:'#fff','stroke-width':3,fill:'none'},p);break;
    case 'phone':piece(p,rrect(-22,-50,44,78,8),'#1b1b1b',{edge:7});S('rect',{x:-17,y:-44,width:34,height:60,rx:3,fill:'#7fd1ff'},p);break;
    case 'paddle':S('path',{d:'M0 0 L0 -150',stroke:PP.ink,'stroke-width':6,fill:'none'},p);piece(p,`M-26 -230 L26 -230 L52 -204 L52 -152 L26 -126 L-26 -126 L-52 -152 L-52 -204z`,'#c8322b',{edge:8});S('text',{x:0,y:-168,'font-family':FA,'font-size':30,'text-anchor':'middle',fill:'#fff'},p).textContent='PARE';break;
    case 'cane':S('path',{d:'M0 0 L0 60 M0 0 q0 -20 18 -20',stroke:'#3b2b1b','stroke-width':7,fill:'none','stroke-linecap':'round'},p);break;
    case 'briefcase':S('path',{d:'M-14 0 q14 -18 28 0',stroke:PP.ink,'stroke-width':4,fill:'none'},p);piece(p,rrect(-56,0,112,78,8),'#5b3a21',{edge:7});S('rect',{x:-56,y:30,width:112,height:8,fill:PP.ink,opacity:.35},p);S('rect',{x:-10,y:26,width:20,height:16,rx:2,fill:PP.brass,stroke:PP.ink,'stroke-width':2},p);break;
    case 'coffee':piece(p,`M-22 -20 h44 l-6 60 h-32z`,'#fff',{edge:7});S('path',{d:'M-24 -20 h48',stroke:PP.ink,'stroke-width':6,fill:'none'},p);S('path',{d:'M-6 -30 q6 -10 0 -18 M6 -30 q6 -10 0 -18',stroke:'rgba(27,30,33,.5)','stroke-width':2.4,fill:'none'},p);break;
    case 'remote':piece(p,rrect(-24,-40,48,90,6),'#d9d9d9',{edge:7});S('circle',{cx:0,cy:-20,r:8,fill:'#c8322b',stroke:PP.ink,'stroke-width':2},p);S('path',{d:'M0 -40 L0 -120 M-12 -120 h24',stroke:PP.ink,'stroke-width':4,fill:'none'},p);[0,18,36].forEach(y=>S('rect',{x:-14,y,width:28,height:8,rx:2,fill:'#2b2b2b'},p));break;
    case 'skate':piece(p,`M-16 20 q0 -14 14 -14 h12 q14 0 14 14 v150 q0 14 -14 14 h-12 q-14 0 -14 -14z`,'#2f9e6d',{edge:7});[50,140].forEach(y=>{S('circle',{cx:-18,cy:y,r:9,fill:'#c8322b',stroke:PP.ink,'stroke-width':2},p);S('circle',{cx:18,cy:y,r:9,fill:'#c8322b',stroke:PP.ink,'stroke-width':2},p)});break;
    case 'knitting':S('path',{d:'M-30 20 L30 -60 M30 20 L-30 -60',stroke:'#8a8a8a','stroke-width':4,fill:'none'},p);piece(p,ell(0,30,26,26),'#c8322b',{edge:7});S('path',{d:'M-18 20 q18 -12 36 0 M-18 38 q18 12 36 0',stroke:'rgba(0,0,0,.35)','stroke-width':2.4,fill:'none'},p);break;
    case 'hay':S('path',{d:'M-10 0 L-40 -50 M-5 0 L-10 -60 M0 0 L20 -58 M4 0 L40 -44 M-8 0 L-30 -20 M6 0 L30 -14',stroke:'#d8b24a','stroke-width':5,fill:'none','stroke-linecap':'round'},p);break;
    case 'megaphone':piece(p,`M-10 -20 L40 -60 L40 40 L-10 0z`,'#c8322b',{edge:7});piece(p,rrect(-40,-16,30,32,6),'#2b2b2b',{edge:0,sw:2});break;
  }
  return p}
/* cabeça: foto (recorte do face_prep) ou cara de papel com crachá do código */
function drawHead(g,o,cfg){/* origem = pescoço (0,0); caixa da cabeça x∈[-100,100], y∈[-240,0] */
  const hb=o.face?{x:-128,y:-300,w:256,h:306}:{x:-100,y:-242,w:200,h:242};
  if(o.face){const im=S('image',{href:o.face,x:hb.x,y:hb.y,width:hb.w,height:hb.h,preserveAspectRatio:'xMidYMax meet'},g);im.setAttributeNS('http://www.w3.org/1999/xlink','href',o.face);PRELOAD.push(im)}
  else{/* placeholder: papel com rosto simples + badge */
    piece(g,ell(0,-118,88,108),'#f2e6d3',{edge:10});
    S('path',{d:'M-60 -118 a60 108 0 0 0 120 0',fill:'none',stroke:'rgba(27,30,33,.18)','stroke-width':2,'stroke-dasharray':'6 6'},g);
    S('circle',{cx:-30,cy:-130,r:5,fill:PP.ink},g);S('circle',{cx:30,cy:-130,r:5,fill:PP.ink},g);
    S('path',{d:'M-26 -80 q26 24 52 0',stroke:PP.ink,'stroke-width':3.5,fill:'none','stroke-linecap':'round'},g);
    S('path',{d:'M0 -118 q10 10 0 18',stroke:PP.ink,'stroke-width':2.4,fill:'none'},g);
    const t=S('text',{x:0,y:-26,transform:o.flip?'scale(-1 1)':'','font-family':FO,'font-size':17,'font-weight':600,'text-anchor':'middle',fill:'rgba(27,30,33,.55)','letter-spacing':'1.5'},g);t.textContent='RECORTE AQUI';
    if(o.code){S('circle',{cx:86,cy:-48,r:30,fill:'#f2c200',stroke:PP.ink,'stroke-width':3},g);const c=S('text',{x:86,y:-39,transform:o.flip?'translate(172 0) scale(-1 1)':'','font-family':FA,'font-size':26,'text-anchor':'middle',fill:PP.ink},g);c.textContent=o.code}
  }
  const hatY=o.face?-284:-236;/* topo da cabeça */
  switch(cfg.hat){
    case 'cap':piece(g,`M-96 ${hatY+22} Q0 ${hatY-60} 96 ${hatY+22} L140 ${hatY+34} Q50 ${hatY+40} -96 ${hatY+36}z`,'#6b5a43');S('path',{d:`M-96 ${hatY+30} Q0 ${hatY+12} 96 ${hatY+30}`,stroke:PP.ink,'stroke-width':2,fill:'none'},g);break;
    case 'capback':piece(g,`M-96 ${hatY+22} Q0 ${hatY-60} 96 ${hatY+22} L96 ${hatY+36} L-96 ${hatY+36}z`,'#c8322b');piece(g,`M-96 ${hatY+30} L-150 ${hatY+40} L-96 ${hatY+44}z`,'#c8322b',{edge:6});break;
    case 'flat':piece(g,`M-100 ${hatY+30} Q-80 ${hatY-30} 0 ${hatY-36} Q80 ${hatY-30} 100 ${hatY+30} L132 ${hatY+40} L-100 ${hatY+40}z`,'#5a4a3a');break;
    case 'top':piece(g,rrect(-72,hatY-110,144,130,8),'#1b1e21',{edge:9});piece(g,rrect(-110,hatY+14,220,16,8),'#1b1e21',{edge:9});S('rect',{x:-72,y:hatY-6,width:144,height:14,fill:'#5a1f1f'},g);break;
    case 'fedora':piece(g,`M-72 ${hatY+18} L-64 ${hatY-80} Q0 ${hatY-100} 64 ${hatY-80} L72 ${hatY+18}z`,'#4b3a2a',{edge:9});piece(g,rrect(-124,hatY+10,248,20,10),'#4b3a2a',{edge:9});S('rect',{x:-70,y:hatY-10,width:140,height:16,fill:'#1b1e21'},g);break;
    case 'straw':piece(g,`M-74 ${hatY+18} L-66 ${hatY-70} Q0 ${hatY-90} 66 ${hatY-70} L74 ${hatY+18}z`,'#e4c56a',{edge:9});piece(g,rrect(-150,hatY+10,300,18,9),'#e4c56a',{edge:9});S('rect',{x:-72,y:hatY-8,width:144,height:16,fill:'#1b1e21'},g);S('path',{d:`M-60 ${hatY-40} h120 M-64 ${hatY-20} h128`,stroke:'rgba(27,30,33,.25)','stroke-width':2,fill:'none'},g);break;
    case 'bonnet':piece(g,ell(0,hatY+20,170,28),'#4a2a44',{edge:10});piece(g,`M-90 ${hatY+20} Q-80 ${hatY-80} 0 ${hatY-88} Q80 ${hatY-80} 90 ${hatY+20}z`,'#4a2a44',{edge:9});S('rect',{x:-92,y:hatY-12,width:184,height:18,fill:'#d8b24a'},g);[[-60,hatY-40,'#e85d8a'],[-30,hatY-62,'#f2c200'],[0,hatY-50,'#e85d8a']].forEach(([x,y,c])=>{for(let i=0;i<6;i++)S('circle',{cx:x+Math.cos(i)*12,cy:y+Math.sin(i)*12,r:9,fill:c,stroke:PP.ink,'stroke-width':1.5},g);S('circle',{cx:x,cy:y,r:7,fill:'#fff'},g)});break;
    case 'hardhat':piece(g,`M-96 ${hatY+30} Q-96 ${hatY-80} 0 ${hatY-84} Q96 ${hatY-80} 96 ${hatY+30}z`,'#f2c200',{edge:9});piece(g,rrect(-124,hatY+22,248,18,9),'#f2c200',{edge:9});S('path',{d:`M-30 ${hatY-70} h60 v60 h-60z`,fill:'rgba(255,255,255,.35)'},g);break;
    case 'helmet':piece(g,`M-100 ${hatY+60} Q-104 ${hatY-80} 0 ${hatY-86} Q104 ${hatY-80} 100 ${hatY+60} L60 ${hatY+70} L60 ${hatY+30} L-60 ${hatY+30} L-60 ${hatY+70}z`,'#1b1e21',{edge:9});S('path',{d:`M-100 ${hatY+30} h200`,stroke:'#7fd1ff','stroke-width':8,fill:'none'},g);S('path',{d:`M-60 ${hatY-30} q60 -30 120 0`,stroke:'#f2c200','stroke-width':6,fill:'none'},g);break;
    case 'aviator':piece(g,`M-104 ${hatY+140} L-104 ${hatY+40} Q-100 ${hatY-60} 0 ${hatY-64} Q100 ${hatY-60} 104 ${hatY+40} L104 ${hatY+140} L80 ${hatY+150} L80 ${hatY+60} Q0 ${hatY+30} -80 ${hatY+60} L-80 ${hatY+150}z`,'#5b3a21',{edge:9});S('path',{d:`M-100 ${hatY+90} q-20 50 10 70 M100 ${hatY+90} q20 50 -10 70`,stroke:'#5b3a21','stroke-width':16,fill:'none','stroke-linecap':'round'},g);break;
    case 'bun':piece(g,`M-104 ${hatY+90} Q-110 ${hatY-40} 0 ${hatY-50} Q110 ${hatY-40} 104 ${hatY+90} Q60 ${hatY+40} 0 ${hatY+50} Q-60 ${hatY+40} -104 ${hatY+90}z`,'#d9d9d9',{edge:9});piece(g,ell(0,hatY-50,50,42),'#d9d9d9',{edge:9});S('path',{d:`M-30 ${hatY-60} q30 -20 60 0 M-34 ${hatY-40} q34 -16 68 0`,stroke:'rgba(27,30,33,.3)','stroke-width':2.4,fill:'none'},g);break;
    case 'wig':{let d='';const n=15;for(let i=0;i<=n;i++){const a=Math.PI*(1.05-i/n*1.1);const r=i%2?150:110;const x=Math.cos(a)*r,y=hatY+30-Math.abs(Math.sin(a))*r*0.95-(i%2?20:0);d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' '}d+=`L104 ${hatY+70} Q0 ${hatY+40} -104 ${hatY+70}z`;piece(g,d,'#f4f4f4',{edge:9});S('path',{d:`M-60 ${hatY-30} q20 -40 40 -10 M10 ${hatY-60} q20 -30 40 0`,stroke:'rgba(27,30,33,.25)','stroke-width':3,fill:'none'},g);break}
    case 'guardcap':piece(g,`M-96 ${hatY+30} L-90 ${hatY-40} Q0 ${hatY-70} 90 ${hatY-40} L96 ${hatY+30}z`,'#2e3a55',{edge:9});piece(g,rrect(-100,hatY+22,200,22,6),'#1b1e21',{edge:9});piece(g,`M-60 ${hatY+44} L60 ${hatY+44} L50 ${hatY+66} L-50 ${hatY+66}z`,'#1b1e21',{edge:7});S('circle',{cx:0,cy:hatY-10,r:14,fill:PP.brass,stroke:PP.ink,'stroke-width':2},g);break;
    case 'beanie':piece(g,`M-96 ${hatY+40} Q-100 ${hatY-60} 0 ${hatY-70} Q100 ${hatY-60} 96 ${hatY+40}z`,'#c8322b',{edge:9});piece(g,rrect(-100,hatY+20,200,32,8),'#a3281f',{edge:9});S('circle',{cx:0,cy:hatY-74,r:16,fill:'#f2f2f2',stroke:PP.ink,'stroke-width':2.5},g);break;
    case 'bouffant':piece(g,`M-110 ${hatY+110} Q-124 ${hatY-60} 0 ${hatY-80} Q124 ${hatY-60} 110 ${hatY+110} Q70 ${hatY+60} 0 ${hatY+40} Q-70 ${hatY+60} -110 ${hatY+110}z`,'#3b2b1b',{edge:9});S('path',{d:`M-70 ${hatY-20} q30 -30 60 -10 M20 ${hatY-50} q30 -10 50 20`,stroke:'rgba(255,255,255,.25)','stroke-width':4,fill:'none'},g);break;
    case 'headphones':S('path',{d:`M-104 -120 Q-104 ${hatY-30} 0 ${hatY-36} Q104 ${hatY-30} 104 -120`,stroke:'#1b1e21','stroke-width':12,fill:'none'},g);piece(g,rrect(-124,-150,34,64,12),'#c8322b',{edge:7});piece(g,rrect(90,-150,34,64,12),'#c8322b',{edge:7});break;
  }
  const eyeY=-150;
  switch(o.face&&cfg.glasses!=='gogglesUp'?null:cfg.glasses){
    case 'goggles':piece(g,ell(-42,eyeY,34,30),'rgba(140,200,230,.55)',{edge:7,sw:5,stroke:'#5a4a3a'});piece(g,ell(42,eyeY,34,30),'rgba(140,200,230,.55)',{edge:7,sw:5,stroke:'#5a4a3a'});S('path',{d:`M-8 ${eyeY} h16 M-76 ${eyeY} h-28 M76 ${eyeY} h28`,stroke:'#5a4a3a','stroke-width':6,fill:'none'},g);break;
    case 'gogglesUp':{const y=hatY+34;piece(g,ell(-42,y,32,26),'rgba(140,200,230,.55)',{edge:7,sw:5,stroke:'#5a4a3a'});piece(g,ell(42,y,32,26),'rgba(140,200,230,.55)',{edge:7,sw:5,stroke:'#5a4a3a'});S('path',{d:`M-10 ${y} h20 M-74 ${y} h-28 M74 ${y} h28`,stroke:'#5a4a3a','stroke-width':6,fill:'none'},g);break}
    case 'cateye':piece(g,`M-82 ${eyeY-18} L-10 ${eyeY-4} L-14 ${eyeY+22} L-70 ${eyeY+18}z`,'rgba(255,255,255,.25)',{edge:5,sw:4,stroke:'#1b1e21'});piece(g,`M82 ${eyeY-18} L10 ${eyeY-4} L14 ${eyeY+22} L70 ${eyeY+18}z`,'rgba(255,255,255,.25)',{edge:5,sw:4,stroke:'#1b1e21'});S('path',{d:`M-10 ${eyeY} h20`,stroke:'#1b1e21','stroke-width':4,fill:'none'},g);break;
    case 'round':S('circle',{cx:-38,cy:eyeY,r:28,fill:'rgba(255,255,255,.2)',stroke:'#1b1e21','stroke-width':3.5},g);S('circle',{cx:38,cy:eyeY,r:28,fill:'rgba(255,255,255,.2)',stroke:'#1b1e21','stroke-width':3.5},g);S('path',{d:`M-10 ${eyeY} h20 M-66 ${eyeY} h-30 M66 ${eyeY} h30`,stroke:'#1b1e21','stroke-width':3.5,fill:'none'},g);break;
  }
}

/* ---------- montagem ---------- */
function puppet(parent,o){o=o||{};const cfg=Object.assign({skin:SKINS[(o.skin===undefined?1:o.skin)%SKINS.length]},COSTUMES[o.costume||'executivo']);if(o.skin!==undefined)cfg.skin=typeof o.skin==='string'?o.skin:SKINS[o.skin%SKINS.length];
  const uid=PUP_UID++;const sc=o.scale||0.6;const VW=560,VH=860;/* viewBox: x∈[-280,280], y∈[-840,20] */
  const wrap=H('div',{class:'puppet',style:`position:absolute;left:0;top:0;width:${VW*sc}px;height:${VH*sc}px;transform-origin:50% ${(840/860*100).toFixed(2)}%;`},parent);
  const inner=H('div',{style:`position:absolute;inset:0;transform:${o.flip?'scaleX(-1)':'none'};filter:drop-shadow(${o.flip?-6:6}px 10px 10px rgba(0,0,0,.35))`},wrap);
  const svg=S('svg',{viewBox:`-280 -840 ${VW} ${VH}`,width:VW*sc,height:VH*sc,style:'overflow:visible;display:block'},inner);
  const root=S('g',null,svg);const k='pp'+uid;const ids={};
  const legL=S('g',{transform:'translate(-34 -250)'},root),legR=S('g',{transform:'translate(34 -250)'},root);
  const lL=S('g',null,legL),lR=S('g',null,legR);drawLeg(lL,cfg,'L');drawLeg(lR,cfg,'R');
  const torsoG=S('g',{transform:'translate(0 -250)'},root);const torso=S('g',null,torsoG);drawTorso(torso,cfg);
  const armLG=S('g',{transform:'translate(-82 -195)'},torso),armRG=S('g',{transform:'translate(82 -195)'},torso);
  const aL=S('g',null,armLG),aR=S('g',null,armRG);drawArm(aL,cfg,'L');drawArm(aR,cfg,'R');
  if(cfg.prop)drawProp(aR,cfg.prop,cfg);
  const headG=S('g',{transform:'translate(0 -228)'},torso);const head=S('g',null,headG);drawHead(head,o,cfg);
  // colchetes de latão nas articulações (por cima)
  rivet(torso,-82,-195);rivet(torso,82,-195);rivet(torso,0,-228);rivet(root,-34,-250);rivet(root,34,-250);
  reg(k+'legL',lL,{},{svg:true});reg(k+'legR',lR,{},{svg:true});reg(k+'torso',torso,{},{svg:true});
  reg(k+'armL',aL,{},{svg:true});reg(k+'armR',aR,{},{svg:true});reg(k+'head',head,{},{svg:true});
  const id=R(wrap,{x:o.x||0,y:o.y||0});
  const p={id,wrap,svg,cfg,k,uid,parts:{legL:k+'legL',legR:k+'legR',torso:k+'torso',armL:k+'armL',armR:k+'armR',head:k+'head'},scale:sc,w:VW*sc,h:VH*sc,feetY:840*sc};
  if(o.tag){const tg=H('div',{style:`position:absolute;left:50%;top:${840*sc+10}px;transform:translateX(-50%);white-space:nowrap;font:600 ${o.tagSize||20}px/1 ${FO};color:${o.tagColor||C.ink};letter-spacing:.06em;text-transform:uppercase;background:${o.tagBg||'rgba(255,255,255,.75)'};padding:6px 12px;border-radius:4px`},wrap,o.tag)}
  if(o.idle!==false)puppetIdle(p,uid*1.7+(o.seed||0));
  return p}

/* ---------- animação ---------- */
function puppetIdle(p,seed){/* respiração + balanço leve de cabeça e braços */
  proc(t=>{const s=seed||0;const br=Math.sin(t*1.6+s)*0.012;const T=REG[p.parts.torso].cur;T.sy+=br;T.rot+=noise1(t*0.35,s+3)*1.2;
    REG[p.parts.head].cur.rot+=Math.sin(t*1.1+s*2)*2.4+noise1(t*0.5,s+7)*2;
    REG[p.parts.armL].cur.rot+=Math.sin(t*1.3+s)*2.2;REG[p.parts.armR].cur.rot-=Math.sin(t*1.3+s+1)*2.2})}
function puppetWalk(p,t0,t1,o){o=o||{};const sp=o.speed||2.6,amp=o.amp||26;const ramp=o.ramp||0.4;
  proc(t=>{if(t<t0||t>t1)return;const k=Math.min(1,(t-t0)/ramp,(t1-t)/ramp);const ph=(t-t0)*sp*Math.PI*2;const sw=Math.sin(ph)*amp*k;
    REG[p.parts.legL].cur.rot+=sw;REG[p.parts.legR].cur.rot-=sw;REG[p.parts.armL].cur.rot-=sw*0.7;REG[p.parts.armR].cur.rot+=sw*0.7;
    const r=REG[p.id].cur;r.y-=Math.abs(Math.sin(ph))*8*k;REG[p.parts.torso].cur.rot+=Math.sin(ph)*1.5*k})}
function puppetWave(p,t0,dur,o){o=o||{};const arm=p.parts[o.arm||'armR'];const sgn=(o.arm||'armR')==='armR'?-1:1;
  tw(arm,t0,0.35,{rot:sgn*150},'backSoft');proc(t=>{if(t<t0+0.3||t>t0+dur-0.3)return;REG[arm].cur.rot+=Math.sin((t-t0)*14)*14});tw(arm,t0+dur-0.3,0.4,{rot:0},'inOut')}
function puppetNod(p,t0,t1,o){o=o||{};proc(t=>{if(t<t0||t>t1)return;REG[p.parts.head].cur.rot+=Math.sin((t-t0)*(o.speed||9))*(o.amp||5)})}
function puppetPoint(p,t0,dur,o){o=o||{};const arm=p.parts[o.arm||'armR'];const sgn=(o.arm||'armR')==='armR'?-1:1;tw(arm,t0,0.3,{rot:sgn*(o.angle||95)},'backSoft');if(dur)tw(arm,t0+dur,0.35,{rot:0},'inOut')}
function puppetShrug(p,t0,dur){tw(p.parts.armL,t0,0.3,{rot:70},'backSoft');tw(p.parts.armR,t0,0.3,{rot:-70},'backSoft');tw(p.parts.torso,t0,0.3,{sy:0.96},'out');tw(p.parts.head,t0,0.3,{rot:-12},'backSoft');
  tw(p.parts.armL,t0+dur,0.35,{rot:0},'inOut');tw(p.parts.armR,t0+dur,0.35,{rot:0},'inOut');tw(p.parts.torso,t0+dur,0.35,{sy:1},'out');tw(p.parts.head,t0+dur,0.35,{rot:0},'inOut')}
function puppetFacepalm(p,t0,dur){tw(p.parts.armR,t0,0.35,{rot:-150},'in');tw(p.parts.head,t0+0.2,0.25,{rot:18},'out');tw(p.parts.armR,t0+dur,0.4,{rot:0},'inOut');tw(p.parts.head,t0+dur,0.4,{rot:0},'inOut')}
function puppetJump(p,t0,o){o=o||{};const h=o.h||70;tw(p.parts.torso,t0,0.14,{sy:0.9},'in');tw(p.parts.torso,t0+0.14,0.16,{sy:1.06},'out');tw(p.parts.torso,t0+0.3,0.2,{sy:1},'out');
  proc(t=>{const q=(t-t0-0.14)/0.55;if(q<0||q>1)return;REG[p.id].cur.y-=Math.sin(q*Math.PI)*h;const s=Math.sin(q*Math.PI);REG[p.parts.legL].cur.rot-=s*20;REG[p.parts.legR].cur.rot+=s*20;REG[p.parts.armL].cur.rot+=s*120;REG[p.parts.armR].cur.rot-=s*120})}
function puppetScared(p,t0,dur){tw(p.parts.armL,t0,0.18,{rot:160},'out');tw(p.parts.armR,t0,0.18,{rot:-160},'out');tw(p.parts.head,t0,0.18,{sy:1.08,sx:0.96},'out');proc(t=>{if(t<t0||t>t0+dur)return;const r=REG[p.id].cur;r.x+=noise1(t*30,p.uid)*3});tw(p.parts.armL,t0+dur,0.4,{rot:0},'inOut');tw(p.parts.armR,t0+dur,0.4,{rot:0},'inOut');tw(p.parts.head,t0+dur,0.4,{sy:1,sx:1},'inOut')}
