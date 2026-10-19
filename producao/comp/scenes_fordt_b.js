/* ==== cenas S07–S17 · por enquanto cartões de construção (substituídos na próxima iteração) ==== */
"use strict";
function stubScene(sid,nome,bg){const sc=mkScene(sid,bg||C.paper2,T0(sid),T1(sid));bgPaperPrint(sc.cam,'#efe7d4');const c=captionBox(sc.cam,`${sid} · ${nome}`,{size:40,font:FA});R(c,{x:120,y:120});const t=captionBox(sc.cam,'cena em construção — ver storyboard',{size:24,font:FO});R(t,{x:120,y:210});return sc}
const STUBS={S07:'Disca 1965',S08:'Chegada: 1965 — e a solução óbvia',S09:'A dor mudou de lugar + CONFIAR',S10:'1985: glitch — a rota, resolvida',S11:'2026: atualização instalada (hipoteticamente)',S12:'Ninguém entra (o silêncio)',S13:'Alguém ensina + APRENDER',S14:'O corredor das ideias geniais que ninguém usou',S15:'Quem aperta o botão? → ADOTAR',S16:'Revelação — GESTÃO DA MUDANÇA',S17:'Cartela final — próxima parada: esta sala'};
Object.keys(STUBS).forEach(sid=>{window['build'+sid]=()=>stubScene(sid,STUBS[sid])});
