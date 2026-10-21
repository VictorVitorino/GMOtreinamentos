(()=>{const {$,$$,tone,ding,boing,stage}=DECK, SEC=DECK.el('exercicio');
/* =====================================================================
   02 · EXERCÍCIO · a sala bagunçada (editável) + antes/depois
   Cenário em SVG gerado aqui: os desenhos (D) ficam centrados em (0,0) e
   as posições ficam nas tabelas MESSY (bagunça inicial, arrastável) e ORG
   (sala arrumada). Para mudar a bagunça inicial, edite MESSY.
   ===================================================================== */
const W=980,H=560;
const C={n9:'#071A33',n8:'#0B2545',n7:'#13315C',n6:'#1B4479',n5:'#2A5A96',s6:'#3D5F93',s5:'#4A6FA5',s4:'#6E8FBF',s3:'#A3B8D6',s2:'#C9D6E8',s1:'#E4EBF5',
 o6:'#D9521A',o5:'#F26B21',o4:'#FF8A4C',o2:'#FFC7A6',o1:'#FDE8DC',off:'#F6F8FB',g5:'#6B7A90',g3:'#B6C0CD',
 wd:'#A88D70',wdD:'#8C7358',wdL:'#C2A98B',lf:'#7FA58A',lfD:'#5E8A6C',lfL:'#A6C4AE',soil:'#6E5747',
 dg:'#E3C8A0',dgD:'#C29D72',dgL:'#F3E4CC',ct:'#8C97A6',ctD:'#677284',ctL:'#D6DCE4',cof:'#7A5A44'};

/* ---------- gradientes ---------- */
const DEFS=`<defs>
<linearGradient id="ex-g-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F5FA"/><stop offset="1" stop-color="#E3E9F2"/></linearGradient>
<linearGradient id="ex-g-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D6C7B0"/><stop offset="1" stop-color="#C0AC8F"/></linearGradient>
<linearGradient id="ex-g-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B7CEE9"/><stop offset="1" stop-color="#EAF2FB"/></linearGradient>
<linearGradient id="ex-g-tvoff" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1D3A63"/><stop offset="1" stop-color="#050F1E"/></linearGradient>
<linearGradient id="ex-g-tvon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86A8D3"/><stop offset="1" stop-color="#EEF3FA"/></linearGradient>
<radialGradient id="ex-g-glow"><stop offset="0" stop-color="#FFD3AD" stop-opacity=".95"/><stop offset=".45" stop-color="#FFE1C8" stop-opacity=".45"/><stop offset="1" stop-color="#FFE1C8" stop-opacity="0"/></radialGradient>
<linearGradient id="ex-g-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFDDBB" stop-opacity=".95"/><stop offset="1" stop-color="#FFDDBB" stop-opacity="0"/></linearGradient>
<radialGradient id="ex-g-shade" cx=".5" cy=".9" r=".85"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFDDBD"/></radialGradient>
</defs>`;

/* ---------- desenhos (cada um centrado em 0,0) ---------- */
const spine=(x,yb,w,h,c)=>`<rect x="${x}" y="${yb-h}" width="${w}" height="${h}" rx="1.5" fill="${c}"/><rect x="${x}" y="${yb-h+6}" width="${w}" height="2" fill="#fff" opacity=".45"/><rect x="${x}" y="${yb-9}" width="${w}" height="2" fill="#fff" opacity=".3"/>`;
const flat=(x,yb,w,h,c)=>`<rect x="${x}" y="${yb-h}" width="${w}" height="${h}" rx="1.5" fill="${c}"/><rect x="${x+w-4}" y="${yb-h+1.5}" width="3" height="${h-3}" fill="#F3EEE4"/>`;
const D={
 chair:()=>`<rect x="-23" y="8" width="5" height="50" rx="2" fill="${C.wdD}"/><rect x="18" y="8" width="5" height="50" rx="2" fill="${C.wdD}"/>
  <rect x="-26" y="-26" width="6" height="26" fill="${C.wdD}"/><rect x="20" y="-26" width="6" height="26" fill="${C.wdD}"/>
  <rect x="-31" y="-65" width="62" height="44" rx="11" fill="${C.s5}"/><rect x="-24" y="-59" width="48" height="7" rx="3.5" fill="#fff" opacity=".2"/>
  <path d="M-20 -40 H20" stroke="${C.s6}" stroke-width="2" stroke-linecap="round" opacity=".7"/>
  <rect x="-35" y="-4" width="70" height="11" rx="5" fill="${C.s4}"/><rect x="-35" y="5" width="70" height="8" rx="3" fill="${C.s6}"/>
  <rect x="-31" y="12" width="7" height="53" rx="2" fill="${C.wd}"/><rect x="24" y="12" width="7" height="53" rx="2" fill="${C.wd}"/>
  <rect x="-27" y="44" width="54" height="4" rx="2" fill="${C.wdD}"/>`,
 lamp:on=>`${on?`<circle cx="0" cy="-26" r="54" fill="url(#ex-g-glow)"/><path d="M-27 -8 L27 -8 L66 44 L-66 44 Z" fill="url(#ex-g-cone)" opacity=".8"/>`:''}
  <rect x="-1.8" y="-10" width="3.6" height="12" fill="${C.n7}"/>
  <path d="M-9 1 C-21 7 -21 31 -12 38 H12 C21 31 21 7 9 1 Z" fill="${C.n6}"/>
  <path d="M-11 9 C-15 17 -15 27 -11 33" stroke="${C.s4}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <rect x="-15" y="37" width="30" height="5" rx="2.5" fill="${C.n8}"/>
  <path d="M-17 -42 H17 L28 -8 H-28 Z" fill="${on?'url(#ex-g-shade)':C.s1}" stroke="${on?C.o2:C.s3}" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M-25.4 -16 H25.4" stroke="${on?C.o4:C.s3}" stroke-width="2" opacity=".55"/>
  ${on?`<ellipse cx="0" cy="-8" rx="24" ry="2.6" fill="#FFF6EC"/>`:''}`,
 towel:()=>`<path d="M-46 -16 C-32 -30 -8 -24 8 -28 C24 -32 38 -26 44 -12 C50 2 46 20 50 36 C40 42 30 36 22 42 C14 32 18 12 10 4 C0 10 -14 6 -22 12 C-32 16 -42 10 -48 4 C-51 -4 -50 -10 -46 -16Z" fill="#F8FAFD"/>
  <path d="M-46 -16 C-32 -30 -8 -24 8 -28 C24 -32 38 -26 44 -12" stroke="#DCE3EC" stroke-width="1.4" fill="none"/>
  <path d="M-30 -20 C-22 -12 -26 0 -18 8 M2 -25 C8 -16 4 -6 10 3 M28 -24 C34 -10 30 10 36 32" stroke="#D3DBE6" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M20 26 C26 30 36 30 46 26 M19 33 C27 37 37 37 47 33" stroke="${C.o4}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  <path d="M-47 -6 C-40 -3 -31 -5 -24 -2" stroke="${C.o4}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  <path d="M25 42 v4 M31 40 v5 M37 39 v5 M43 38 v5" stroke="#D3DBE6" stroke-width="1.6" stroke-linecap="round"/>`,
 towelF:()=>`<rect x="-26" y="-10" width="52" height="20" rx="5" fill="#F8FAFD" stroke="#D3DBE6" stroke-width="1.2"/>
  <path d="M-26 -1 H26" stroke="#D3DBE6" stroke-width="1.2"/><rect x="-26" y="3" width="52" height="3" fill="${C.o4}"/><rect x="-26" y="-7" width="52" height="2.4" fill="${C.o4}" opacity=".85"/>`,
 dog:()=>`<ellipse cx="0" cy="31" rx="66" ry="5" fill="#0B2545" opacity=".12"/>
  <path d="M54 10 C68 4 76 14 68 24 C64 28 58 26 56 22" stroke="${C.dgD}" stroke-width="8" fill="none" stroke-linecap="round"/>
  <g class="ex-breath"><ellipse cx="10" cy="8" rx="48" ry="23" fill="${C.dg}"/>
  <path d="M-20 -10 C0 -20 30 -18 50 -2" stroke="${C.dgL}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".85"/>
  <ellipse cx="16" cy="-2" rx="12" ry="7" fill="${C.dgD}" opacity=".45"/>
  <ellipse cx="36" cy="17" rx="18" ry="10" fill="${C.dgD}" opacity=".4"/></g>
  <ellipse cx="-36" cy="26" rx="16" ry="6" fill="${C.dgL}"/><ellipse cx="-22" cy="27.5" rx="12" ry="5.5" fill="${C.dg}"/>
  <ellipse cx="-42" cy="8" rx="23" ry="19" fill="${C.dg}"/>
  <ellipse cx="-62" cy="17" rx="13" ry="9.5" fill="${C.dgL}"/>
  <ellipse cx="-73" cy="13.5" rx="4.4" ry="3.5" fill="${C.n9}"/>
  <path d="M-59 4 q5 4.5 10 0" stroke="${C.n9}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M-35 -10 C-21 -12 -19 8 -27 24 C-37 22 -43 6 -35 -10Z" fill="${C.dgD}"/>
  <path d="M-21 -6 C-17 6 -17 16 -21 24" stroke="${C.o5}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-20" cy="25.5" r="3.2" fill="${C.o2}"/>
  <g class="ex-zzz" font-family="JetBrains Mono, monospace" font-weight="700" fill="${C.n7}" stroke="#fff" stroke-width="3" stroke-linejoin="round" paint-order="stroke"><text x="-62" y="-16" font-size="12">z</text><text x="-50" y="-28" font-size="15">z</text><text x="-36" y="-42" font-size="19">Z</text></g>`,
 cat:()=>`<path class="ex-tail" d="M30 4 C38 14 34 34 40 54 C42 60 38 64 34 60" stroke="${C.ct}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path class="ex-tail" d="M30 4 C38 14 34 34 40 54 C42 60 38 64 34 60" stroke="${C.ctD}" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="3 8"/>
  <ellipse cx="4" cy="0" rx="34" ry="14" fill="${C.ct}"/>
  <path d="M-6 -13 q4 6 0 11 M6 -14 q4 6 0 11 M18 -12 q4 6 0 10" stroke="${C.ctD}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="-22" cy="10" rx="10" ry="4.5" fill="${C.ctL}"/><ellipse cx="-8" cy="11" rx="9" ry="4" fill="${C.ctL}"/>
  <path d="M-43 -12 L-42 -28 L-31 -18Z" fill="${C.ct}"/><path d="M-30 -19 L-20 -29 L-17 -12Z" fill="${C.ct}"/>
  <path d="M-41 -15 L-40.5 -24 L-34 -18Z" fill="${C.o2}"/><path d="M-27 -18 L-21.5 -25 L-20 -15Z" fill="${C.o2}"/>
  <circle cx="-30" cy="-6" r="14" fill="${C.ct}"/>
  <ellipse cx="-33" cy="-1" rx="8.5" ry="6" fill="${C.ctL}"/>
  <path d="M-40 -8 q3 2.6 6 0 M-29 -8 q3 2.6 6 0" stroke="${C.n9}" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  <path d="M-35.5 -3 h4 l-2 2.2Z" fill="${C.o4}"/>
  <path d="M-43 -1 h-10 M-43 2 l-9 3 M-24 -1 h9 M-24 2 l8 3" stroke="${C.n9}" stroke-width=".8" opacity=".5"/>`,
 catC:()=>`<ellipse cx="2" cy="12" rx="30" ry="3" fill="#0B2545" opacity=".1"/>
  <ellipse cx="4" cy="0" rx="28" ry="13" fill="${C.ct}"/>
  <path d="M-4 -11 q4 6 0 10 M8 -12 q4 6 0 10 M20 -9 q3 5 0 8" stroke="${C.ctD}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M28 4 C24 16 -12 18 -24 9" stroke="${C.ct}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M28 4 C24 16 -12 18 -24 9" stroke="${C.ctD}" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="3 8"/>
  <path d="M-30 -8 L-30 -22 L-21 -13Z" fill="${C.ct}"/><path d="M-19 -14 L-10 -22 L-9 -7Z" fill="${C.ct}"/>
  <path d="M-28.5 -11 L-28.5 -18 L-23.5 -13Z" fill="${C.o2}"/>
  <circle cx="-19" cy="-2" r="12" fill="${C.ct}"/><ellipse cx="-22" cy="2" rx="7" ry="5" fill="${C.ctL}"/>
  <path d="M-27 -4 q2.6 2.2 5.2 0 M-18 -4 q2.6 2.2 5.2 0" stroke="${C.n9}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M-24 0 h3.4 l-1.7 2Z" fill="${C.o4}"/>
  <g class="ex-zzz ex-zc" font-family="JetBrains Mono, monospace" font-weight="700" fill="${C.n7}" stroke="#fff" stroke-width="2.6" stroke-linejoin="round" paint-order="stroke"><text x="-30" y="-24" font-size="10">z</text><text x="-22" y="-34" font-size="13">z</text></g>`,
 cushion:(c,p)=>`<path d="M-25 -21 Q0 -15 25 -21 Q19 0 25 21 Q0 15 -25 21 Q-19 0 -25 -21Z" fill="${c}"/>
  <path d="M-18 -15 Q0 -11 18 -15" stroke="#fff" stroke-width="2" opacity=".3" fill="none" stroke-linecap="round"/>
  ${p==='s'?`<path d="M-21.5 -6 Q0 -2 21.5 -6 M-21.5 6 Q0 10 21.5 6" stroke="${C.s4}" stroke-width="3.2" fill="none"/>`:`<circle r="3" fill="#000" opacity=".16"/><path d="M-3 -3 L-16 -16 M3 3 L16 16 M3 -3 L16 -16 M-3 3 L-16 16" stroke="#000" stroke-width="1" opacity=".08"/>`}`,
 book:c=>`<rect x="-22" y="-15" width="44" height="30" rx="2.5" fill="${c}"/><rect x="-17" y="-15" width="3" height="30" fill="#000" opacity=".16"/>
  <rect x="-8" y="-6" width="22" height="3" rx="1.5" fill="#fff" opacity=".6"/><rect x="-8" y="0" width="14" height="2.4" rx="1.2" fill="#fff" opacity=".42"/>
  <path d="M21 -13 V13" stroke="#F3EEE4" stroke-width="2.4"/>`,
 bookOpen:()=>`<path d="M-33 -15 Q-16 -21 0 -14 Q16 -21 33 -15 V17 Q16 12 0 19 Q-16 12 -33 17Z" fill="${C.n6}"/>
  <path d="M-30 -17 Q-14 -22 0 -15 V15 Q-14 10 -30 14Z" fill="#FBF8F2"/><path d="M30 -17 Q14 -22 0 -15 V15 Q14 10 30 14Z" fill="#F1EBE0"/>
  <path d="M-25 -10 H-6 M-25 -5 H-6 M-25 0 H-9 M-25 5 H-6 M6 -10 H25 M6 -5 H25 M6 0 H22 M6 5 H25" stroke="${C.g3}" stroke-width="1.5"/>
  <path d="M0 -15 V15" stroke="#D6CCBB" stroke-width="1.2"/>`,
 books2:()=>`<rect x="-21" y="-3" width="42" height="8" rx="1.5" fill="${C.n6}"/><rect x="17" y="-1.5" width="3" height="5" fill="#F3EEE4"/>
  <rect x="-17" y="-11" width="36" height="8" rx="1.5" fill="${C.o4}"/><rect x="15" y="-9.5" width="3" height="5" fill="#F3EEE4"/>
  <rect x="-14" y="-18" width="30" height="7" rx="1.5" fill="${C.s3}"/>`,
 sock:c=>`<path d="M-9 -22 H7 V2 C7 7 11 9 19 9.5 C28 10 28 22 19 22 H0 C-6 22 -9 17 -9 10 Z" fill="${c}"/>
  <rect x="-9" y="-22" width="16" height="5" fill="${C.o4}"/><path d="M16 10 C25 10 26 21 19 22 H15 C18 18 18 13 16 10Z" fill="#000" opacity=".12"/>`,
 pizza:()=>`<path d="M-44 -6 L-40 -44 H40 L44 -6Z" fill="#C9B28C"/><path d="M-36 -40 H36 L39 -10 H-39Z" fill="#D7C3A1"/>
  <circle cx="-14" cy="-26" r="5" fill="#BBA07A" opacity=".75"/><circle cx="13" cy="-20" r="3.5" fill="#BBA07A" opacity=".6"/><circle cx="24" cy="-31" r="2.4" fill="#BBA07A" opacity=".6"/>
  <rect x="-46" y="-8" width="92" height="34" rx="2" fill="#DCC9A8"/><rect x="-42" y="-5" width="84" height="27" rx="1.5" fill="#EADCC4"/>
  <path d="M-34 18 L-12 -1 L-2 18Z" fill="#F3D69A"/><path d="M-34 18 H-2" stroke="#D9A866" stroke-width="4" stroke-linecap="round"/>
  <circle cx="-17" cy="10" r="3" fill="${C.o5}" opacity=".9"/><circle cx="-10" cy="5" r="2.4" fill="${C.o5}" opacity=".9"/>
  <path d="M8 18 L22 -2 L34 16Z" fill="#F3D69A"/><path d="M8 18 L34 16" stroke="#D9A866" stroke-width="4" stroke-linecap="round"/><circle cx="22" cy="9" r="2.8" fill="${C.o5}" opacity=".9"/>
  <circle cx="0" cy="6" r="1.2" fill="#D9A866"/><circle cx="4" cy="12" r="1" fill="#D9A866"/>
  <rect x="-46" y="23" width="92" height="4" fill="#C2AA85"/>`,
 mugS:()=>`<path d="M-34 4 C-40 0 -32 -5 -20 -4 C-6 -7 14 -5 26 -1 C36 2 32 8 20 8 C6 10 -20 10 -34 4Z" fill="${C.cof}" opacity=".92"/>
  <path d="M12 7 C12 13 14 18 13 23 C12 27 8 26 8 22 C8 17 9 12 9 7Z" fill="${C.cof}" opacity=".92"/><circle cx="11" cy="31" r="2" fill="${C.cof}" opacity=".8"/>
  <g transform="translate(-10 -9)"><rect x="-14" y="-9" width="26" height="18" rx="4" fill="#F8FAFD" stroke="#CBD4E1" stroke-width="1.2"/><rect x="-5" y="-9" width="5" height="18" fill="${C.o4}"/>
  <ellipse cx="12" cy="0" rx="3.2" ry="8.4" fill="${C.cof}"/><path d="M-7 -9 C-7 -18 5 -18 5 -9" stroke="#F8FAFD" stroke-width="3.4" fill="none"/><path d="M-7 -9 C-7 -18 5 -18 5 -9" stroke="#CBD4E1" stroke-width="1" fill="none"/></g>`,
 mug:()=>`<path class="ex-steam" d="M-3 -17 C-7 -23 1 -27 -3 -33 M5 -17 C1 -23 9 -27 5 -33" stroke="${C.s3}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M9 -6 C17 -6 17 6 9 6" stroke="#F8FAFD" stroke-width="3.6" fill="none"/><path d="M9 -6 C17 -6 17 6 9 6" stroke="#CBD4E1" stroke-width="1" fill="none"/>
  <rect x="-10" y="-12" width="20" height="24" rx="3" fill="#F8FAFD" stroke="#CBD4E1" stroke-width="1.2"/><rect x="-10" y="-4" width="20" height="5" fill="${C.o4}"/>`,
 frame:()=>`<path d="M-30 -46 L0 -64 L30 -46" stroke="${C.g5}" stroke-width="1.4" fill="none"/><circle cx="0" cy="-64" r="2.8" fill="${C.n8}"/>
  <rect x="-60" y="-42" width="128" height="92" rx="3" fill="#0B2545" opacity=".1"/>
  <rect x="-64" y="-46" width="128" height="92" rx="3" fill="${C.n8}"/><rect x="-58" y="-40" width="116" height="80" fill="#fff"/>
  <rect x="-49" y="-31" width="98" height="62" fill="${C.s1}"/><circle cx="22" cy="-12" r="9" fill="${C.o4}"/>
  <path d="M-49 31 L-22 2 L-6 16 L14 -6 L49 26 V31Z" fill="${C.s4}"/><path d="M-49 31 L-30 16 L-10 31Z" fill="${C.n6}"/><path d="M4 31 L24 13 L49 31Z" fill="${C.s5}"/>`,
 plant:v=>`<path d="M0 -2 C-4 -20 -16 -30 -27 -34 C-23 -20 -12 -8 0 -2Z" fill="${C.lfD}"/>
  <path d="M0 -2 C2 -24 -2 -40 -8 -48 C-12 -32 -8 -14 0 -2Z" fill="${C.lf}"/>
  <path d="M0 -2 C6 -22 18 -34 29 -38 C25 -22 12 -8 0 -2Z" fill="${C.lfL}"/>
  <path d="M0 -2 C10 -14 22 -18 33 -16 C25 -8 12 -2 0 -2Z" fill="${C.lfD}"/>
  <path d="M0 -2 C-10 -12 -24 -14 -33 -10 C-23 -4 -10 -2 0 -2Z" fill="${C.lf}"/>
  <path d="M-1 -4 C-2 -20 -4 -32 -7 -42 M1 -4 C8 -18 16 -28 25 -34" stroke="#fff" stroke-width="1" opacity=".35" fill="none"/>
  ${v?`<path d="M13 3 C24 12 16 30 24 46" stroke="${C.lfD}" stroke-width="1.6" fill="none"/><ellipse cx="20" cy="13" rx="5" ry="3.6" fill="${C.lf}" transform="rotate(30 20 13)"/><ellipse cx="18" cy="27" rx="5" ry="3.6" fill="${C.lfD}" transform="rotate(-20 18 27)"/><ellipse cx="24" cy="40" rx="5" ry="3.6" fill="${C.lf}" transform="rotate(40 24 40)"/>`:''}
  <path d="M-16 0 H16 L12 28 H-12Z" fill="#E9E0D4"/><path d="M-1 0 H16 L12 28 H2Z" fill="#000" opacity=".05"/><rect x="-18" y="-3" width="36" height="7" rx="2" fill="#DACEBE"/>
  <path d="M-14.6 13 H14.6" stroke="${C.s4}" stroke-width="3"/>`,
 soil:()=>`<path d="M-34 6 C-30 -4 -16 -10 -4 -8 C8 -12 22 -6 30 2 C34 6 30 9 20 9 C6 11 -20 11 -34 6Z" fill="${C.soil}"/>
  <path d="M-16 -4 C-8 -8 4 -8 10 -6" stroke="#8A715E" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>
  <g fill="${C.soil}"><circle cx="-39" cy="8" r="2"/><circle cx="37" cy="4" r="2.4"/><circle cx="-25" cy="13" r="1.6"/><circle cx="13" cy="13.5" r="1.8"/><circle cx="42" cy="9" r="1.3"/></g>
  <path d="M24 -2 C28 -8 34 -8 36 -4" stroke="${C.lfD}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
 shirt:()=>`<path d="M-30 -18 L-12 -24 C-6 -18 6 -18 12 -24 L30 -18 L38 -2 L25 3 L23 22 C10 26 -10 26 -23 22 L-25 3 L-38 -2Z" fill="${C.g5}"/>
  <path d="M-12 -24 C-6 -15 6 -15 12 -24" fill="none" stroke="#56647A" stroke-width="2.6"/>
  <path d="M-14 0 C-6 6 4 2 12 10 M-18 14 C-8 12 2 18 14 14 M-25 3 L-30 -10" stroke="#56647A" stroke-width="1.6" fill="none" opacity=".75" stroke-linecap="round"/>`,
 remote:()=>`<rect x="-24" y="-7" width="48" height="14" rx="6" fill="${C.n9}"/><circle cx="-15" cy="0" r="2.6" fill="${C.o5}"/>
  <g fill="${C.s3}"><circle cx="-5" cy="-2.4" r="1.6"/><circle cx="-5" cy="2.4" r="1.6"/><circle cx="1" cy="-2.4" r="1.6"/><circle cx="1" cy="2.4" r="1.6"/><circle cx="7" cy="-2.4" r="1.6"/><circle cx="7" cy="2.4" r="1.6"/></g>
  <rect x="12" y="-3" width="8" height="6" rx="2" fill="${C.s5}"/>`,
 papers:()=>[[-10,-6,-14],[7,0,9],[-2,7,-3]].map(([x,y,r])=>`<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-17" y="-22" width="34" height="44" rx="1.5" fill="#fff" stroke="#D3DBE6" stroke-width="1"/><path d="M-11 -14 H11 M-11 -8 H11 M-11 -2 H8 M-11 4 H11 M-11 10 H5" stroke="${C.g3}" stroke-width="1.4"/></g>`).join(''),
 shoe:()=>`<path d="M-28 6 C-28 -6 -22 -14 -12 -14 C-6 -14 -4 -8 2 -6 C12 -4 24 -2 28 4 C30 8 28 12 24 12 H-24 C-27 12 -28 10 -28 6Z" fill="#F4F6FA" stroke="#C9D3E0" stroke-width="1.2"/>
  <path d="M-27 9 H27" stroke="${C.n7}" stroke-width="5" stroke-linecap="round"/>
  <path d="M-8 -6 L-2 2 M-3 -8 L3 0 M2 -7 L8 1" stroke="${C.s4}" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M-20 3 C-10 -1 2 1 12 5" stroke="${C.o4}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
 twinkle:()=>`<path class="ex-tw" d="M0 -8 L1.8 -1.8 L8 0 L1.8 1.8 L0 8 L-1.8 1.8 L-8 0 L-1.8 -1.8Z" fill="#fff" stroke="${C.o2}" stroke-width="1"/>`
};
const DRAW={chair:D.chair,lamp:()=>D.lamp(0),lampOn:()=>D.lamp(1),towel:D.towel,towelF:D.towelF,dog:D.dog,cat:D.cat,catC:D.catC,
 cushionA:()=>D.cushion(C.o4),cushionB:()=>D.cushion('#F3F5F9','s'),cushionC:()=>D.cushion(C.s3),
 bookA:()=>D.book(C.n6),bookB:()=>D.book(C.o4),bookC:()=>D.book(C.s4),bookOpen:D.bookOpen,books2:D.books2,
 sock:()=>D.sock(C.s3),sock2:()=>D.sock(C.s3),pizza:D.pizza,mugS:D.mugS,mug:D.mug,frame:D.frame,plant:()=>D.plant(0),plantV:()=>D.plant(1),
 soil:D.soil,shirt:D.shirt,remote:D.remote,papers:D.papers,shoe:D.shoe,twinkle:D.twinkle};

/* ---------- a sala (base comum aos dois estados) ---------- */
function planks(){const rows=[360,374,391,412,437,466,500,538,560];let s='';
 for(let i=1;i<rows.length-1;i++)s+=`<line x1="0" x2="980" y1="${rows[i]}" y2="${rows[i]}"/>`;
 for(let i=0;i<rows.length-1;i++){const step=150+i*14;for(let x=(i*83)%step+30;x<980;x+=step)s+=`<line x1="${x}" x2="${x-(x-490)*.04}" y1="${rows[i]}" y2="${rows[i+1]}"/>`}
 return `<g stroke="#8F7659" stroke-opacity=".2" stroke-width="1.2">${s}</g>`}
const win=()=>`<rect x="179" y="40" width="160" height="190" rx="4" fill="#0B2545" opacity=".06"/>
 <rect x="175" y="36" width="160" height="190" rx="4" fill="#fff"/><rect x="185" y="46" width="140" height="170" fill="url(#ex-g-sky)"/>
 <circle cx="296" cy="84" r="13" fill="#FFE6D2"/>
 <g fill="#fff" opacity=".9"><ellipse cx="218" cy="80" rx="18" ry="6.5"/><ellipse cx="230" cy="74" rx="11" ry="7.5"/><ellipse cx="292" cy="122" rx="15" ry="5.5"/></g>
 <g fill="#B4C6DE"><rect x="188" y="166" width="22" height="50"/><rect x="212" y="148" width="18" height="68"/><rect x="262" y="158" width="20" height="58"/><rect x="302" y="152" width="22" height="64"/></g>
 <g fill="#C7D6EA"><rect x="226" y="176" width="28" height="40"/><rect x="282" y="182" width="18" height="34"/></g>
 <g fill="#E8EEF7" opacity=".9"><rect x="216" y="156" width="3" height="4"/><rect x="223" y="156" width="3" height="4"/><rect x="216" y="166" width="3" height="4"/><rect x="306" y="162" width="3" height="4"/><rect x="314" y="162" width="3" height="4"/><rect x="306" y="172" width="3" height="4"/><rect x="266" y="168" width="3" height="4"/></g>
 <rect x="253" y="46" width="4" height="170" fill="#fff"/><rect x="185" y="129" width="140" height="4" fill="#fff"/>
 <path d="M192 214 L238 48 H250 L204 214Z" fill="#fff" opacity=".16"/>
 <rect x="168" y="224" width="174" height="9" rx="2" fill="#F8FAFD"/><rect x="170" y="233" width="170" height="3" fill="#C9D3E0"/>
 <rect x="146" y="26" width="218" height="4" rx="2" fill="${C.n7}"/><circle cx="146" cy="28" r="4.5" fill="${C.n7}"/><circle cx="364" cy="28" r="4.5" fill="${C.n7}"/>
 <path d="M150 30 H191 C189 90 193 170 188 258 C178 262 162 258 150 262 C154 180 148 100 150 30Z" fill="${C.s5}"/>
 <path d="M162 34 C160 110 164 190 160 258 M175 34 C177 110 173 190 176 258" stroke="${C.s6}" stroke-width="2" fill="none"/>
 <path d="M360 30 H319 C321 90 317 170 322 258 C332 262 348 258 360 262 C356 180 362 100 360 30Z" fill="${C.s5}"/>
 <path d="M348 34 C350 110 346 190 350 258 M335 34 C333 110 337 190 334 258" stroke="${C.s6}" stroke-width="2" fill="none"/>`;
const clock=org=>{let t='';for(let i=0;i<12;i++){const a=i*30*Math.PI/180;t+=`<line x1="${(Math.sin(a)*19).toFixed(1)}" y1="${(-Math.cos(a)*19).toFixed(1)}" x2="${(Math.sin(a)*22).toFixed(1)}" y2="${(-Math.cos(a)*22).toFixed(1)}"/>`}
 const [h,m]=org?[300,60]:[80,270];
 return `<g transform="translate(795 106)"><circle r="26" cx="2" cy="3" fill="#0B2545" opacity=".08"/><circle r="26" fill="#fff" stroke="${C.n7}" stroke-width="3"/>
 <g stroke="${C.s4}" stroke-width="1.6" stroke-linecap="round">${t}</g>
 <path d="M0 0 V-11" stroke="${C.n8}" stroke-width="3" stroke-linecap="round" transform="rotate(${h})"/><path d="M0 0 V-17" stroke="${C.n8}" stroke-width="2" stroke-linecap="round" transform="rotate(${m})"/>
 <g class="ex-sec"><path d="M0 3 V-19" stroke="${C.o5}" stroke-width="1.2" stroke-linecap="round"/></g><circle r="2.6" fill="${C.o5}"/></g>`};
function shelf(org){
 let s=`<rect x="31" y="101" width="130" height="306" fill="#0B2545" opacity=".07"/><rect x="20" y="88" width="140" height="9" rx="2" fill="${C.wdD}"/>
 <rect x="25" y="95" width="130" height="310" fill="${C.wd}"/><rect x="34" y="104" width="112" height="286" fill="#E9E0D2"/>
 <rect x="34" y="104" width="112" height="6" fill="#000" opacity=".06"/>`;
 [174,247,320].forEach(y=>s+=`<rect x="34" y="${y}" width="112" height="7" fill="${C.wd}"/><rect x="34" y="${y+7}" width="112" height="4" fill="#000" opacity=".06"/>`);
 s+=`<rect x="25" y="390" width="130" height="15" fill="${C.wdD}"/><rect x="25" y="95" width="4" height="310" fill="${C.wdL}" opacity=".7"/>`;
 if(org){
  let x=40;[[9,56,C.n6],[11,60,C.o4],[8,50,C.s4],[10,58,C.n8],[12,54,C.s2],[9,62,C.s5],[10,52,C.n7],[8,57,C.o2]].forEach(([w,h,c])=>{s+=spine(x,174,w,h,c);x+=w+1.5});
  s+=`<rect x="125" y="128" width="16" height="46" rx="2" fill="${C.wdD}"/><circle cx="133" cy="128" r="9" fill="${C.s3}"/><path d="M125 128 a8 8 0 0 1 16 0" fill="none" stroke="${C.n6}" stroke-width="1.5"/>`;
  s+=flat(40,247,50,9,C.n6)+flat(43,238,44,9,C.s4)+flat(41,229,48,8,C.o4);
  s+=`<path d="M110 247 C104 232 106 214 118 208 C130 214 132 232 126 247Z" fill="${C.n6}"/><path d="M118 208 C116 198 120 190 126 186 M118 208 C122 196 130 194 134 192" stroke="${C.lfD}" stroke-width="1.6" fill="none"/><circle cx="126" cy="186" r="3.5" fill="${C.o4}"/><circle cx="134" cy="192" r="3" fill="${C.o2}"/>`;
  x=40;[[10,56,C.s5],[9,50,C.o2],[11,58,C.n6],[8,48,C.s3]].forEach(([w,h,c])=>{s+=spine(x,320,w,h,c);x+=w+1.5});
  s+=`<rect x="84" y="278" width="8" height="42" rx="1.5" fill="${C.n8}" transform="rotate(-14 88 320)"/><rect x="100" y="284" width="42" height="36" rx="3" fill="${C.s3}"/><rect x="112" y="294" width="18" height="7" rx="2" fill="#fff" opacity=".8"/>`;
  [[40,48],[94,48]].forEach(([bx,bw])=>{s+=`<rect x="${bx}" y="350" width="${bw}" height="40" rx="4" fill="${C.wdL}"/><path d="M${bx+4} 360 H${bx+bw-4} M${bx+4} 370 H${bx+bw-4} M${bx+4} 380 H${bx+bw-4}" stroke="${C.wdD}" stroke-width="1.4" opacity=".6"/><rect x="${bx+bw/2-7}" y="356" width="14" height="4" rx="2" fill="${C.wdD}"/>`});
 }else{
  s+=`<rect x="58" y="120" width="10" height="56" rx="1.5" fill="${C.s5}" transform="rotate(28 63 174)"/>`+flat(80,174,46,9,C.n8);
  s+=`<path d="M100 247 l-10 -8 l14 -14 l10 8Z" fill="${C.s3}"/>`;
  s+=`<rect x="44" y="266" width="9" height="54" rx="1.5" fill="${C.o2}" transform="rotate(-22 48 320)"/><rect x="104" y="296" width="40" height="34" rx="3" fill="${C.s3}" transform="rotate(-12 124 320)"/>`;
  s+=`<g transform="rotate(-90 88 389)"><rect x="64" y="349" width="48" height="40" rx="4" fill="${C.wdL}"/><path d="M68 359 H108 M68 369 H108 M68 379 H108" stroke="${C.wdD}" stroke-width="1.4" opacity=".6"/></g><circle cx="120" cy="384" r="5" fill="${C.o4}"/><circle cx="132" cy="386" r="3.5" fill="${C.n6}"/>`;
 }
 return s}
const rug=()=>{let f='';for(let x=234;x<=748;x+=8)f+=`<line x1="${x}" x2="${x}" y1="550" y2="556"/>`;
 return `<path d="M292 446 H688 L752 550 H228 Z" fill="${C.s2}"/><path d="M306 454 H674 L728 542 H252 Z" fill="none" stroke="#EAF0F8" stroke-width="3"/>
 <path d="M322 462 H658 L704 534 H276 Z" fill="none" stroke="${C.s3}" stroke-width="2" stroke-dasharray="10 6"/>
 <g stroke="${C.s2}" stroke-width="2" stroke-linecap="round">${f}</g>`};
const catTree=()=>{let r='';for(let y=314;y<402;y+=7)r+=`<path d="M932 ${y} L948 ${y-3}"/>`;
 return `<ellipse cx="940" cy="413" rx="36" ry="4" fill="#0B2545" opacity=".12"/><rect x="908" y="402" width="64" height="10" rx="3" fill="${C.wdD}"/>
 <rect x="932" y="306" width="16" height="98" fill="#D9C7A6"/><g stroke="#BFA984" stroke-width="2">${r}</g>
 <rect x="904" y="300" width="72" height="9" rx="4" fill="${C.wd}"/><rect x="910" y="286" width="60" height="16" rx="8" fill="${C.s3}"/><rect x="915" y="288" width="50" height="4" rx="2" fill="#fff" opacity=".35"/>
 <path d="M971 307 V330" stroke="${C.g5}" stroke-width="1.2"/><circle cx="971" cy="334" r="4.5" fill="${C.o4}"/>`};
const dogBed=()=>`<ellipse cx="130" cy="546" rx="74" ry="6" fill="#0B2545" opacity=".12"/>
 <path d="M60 520 C60 498 82 490 130 490 C178 490 200 498 200 520 C200 538 184 546 130 546 C76 546 60 538 60 520Z" fill="${C.s5}"/>
 <ellipse cx="130" cy="513" rx="56" ry="15" fill="${C.s2}"/>
 <path d="M64 522 C68 540 100 546 130 546 C160 546 192 540 196 522 C188 534 160 539 130 539 C100 539 72 534 64 522Z" fill="${C.s6}"/>`;
const sideTable=()=>`<ellipse cx="291" cy="427" rx="30" ry="4" fill="#0B2545" opacity=".12"/>
 <rect x="266" y="354" width="5" height="72" fill="${C.wd}"/><rect x="311" y="354" width="5" height="72" fill="${C.wd}"/><rect x="266" y="398" width="50" height="5" fill="${C.wd}"/>
 <rect x="262" y="346" width="58" height="9" rx="3" fill="${C.wdD}"/>`;
const sofa=()=>`<ellipse cx="490" cy="446" rx="178" ry="8" fill="#0B2545" opacity=".16"/>
 <rect x="344" y="426" width="8" height="18" rx="2" fill="${C.wdD}"/><rect x="628" y="426" width="8" height="18" rx="2" fill="${C.wdD}"/>
 <rect x="344" y="250" width="292" height="130" rx="26" fill="${C.n6}"/>
 <rect x="356" y="262" width="133" height="104" rx="20" fill="${C.n5}"/><rect x="491" y="262" width="133" height="104" rx="20" fill="${C.n5}"/>
 <rect x="366" y="268" width="113" height="9" rx="4.5" fill="#fff" opacity=".1"/><rect x="501" y="268" width="113" height="9" rx="4.5" fill="#fff" opacity=".1"/>
 <circle cx="422" cy="314" r="2.4" fill="${C.n6}"/><circle cx="558" cy="314" r="2.4" fill="${C.n6}"/>
 <rect x="352" y="352" width="276" height="22" rx="8" fill="#3A6BAA"/><rect x="489" y="352" width="2" height="22" fill="${C.n6}"/>
 <rect x="346" y="370" width="288" height="56" rx="12" fill="${C.n6}"/><rect x="354" y="373" width="272" height="5" rx="2.5" fill="#fff" opacity=".08"/>
 <rect x="322" y="304" width="48" height="122" rx="20" fill="#1F4C86"/><rect x="610" y="304" width="48" height="122" rx="20" fill="#1F4C86"/>
 <rect x="322" y="304" width="48" height="20" rx="10" fill="${C.n5}"/><rect x="610" y="304" width="48" height="20" rx="10" fill="${C.n5}"/>`;
const rack=()=>`<ellipse cx="795" cy="414" rx="112" ry="5" fill="#0B2545" opacity=".12"/>
 <rect x="700" y="400" width="6" height="12" fill="${C.wdD}"/><rect x="884" y="400" width="6" height="12" fill="${C.wdD}"/>
 <rect x="690" y="350" width="210" height="52" rx="5" fill="${C.wd}"/><rect x="686" y="343" width="218" height="9" rx="3" fill="${C.wdD}"/>
 ${[698,764,830].map(x=>`<rect x="${x}" y="358" width="62" height="38" rx="3" fill="${C.wdL}"/><circle cx="${x+31}" cy="364" r="2.4" fill="${C.n7}"/>`).join('')}`;
const tv=org=>`<rect x="765" y="337" width="60" height="6" rx="3" fill="${C.n9}"/><rect x="788" y="322" width="14" height="16" fill="${C.n8}"/>
 <rect x="710" y="218" width="170" height="106" rx="7" fill="${C.n8}"/><rect x="716" y="224" width="158" height="94" rx="3" fill="url(#ex-g-tv${org?'on':'off'})"/>
 ${org?`<circle cx="842" cy="252" r="10" fill="#FFE3CF"/><circle cx="842" cy="252" r="16" fill="#FFE3CF" opacity=".35"/>
  <path d="M716 300 C746 280 770 284 796 296 C820 280 850 276 874 290 V318 H716Z" fill="${C.s4}"/>
  <path d="M716 310 C750 296 790 300 820 312 C840 306 860 302 874 306 V318 H716Z" fill="${C.s5}"/>
  <path d="M752 252 q4 -4 8 0 q4 -4 8 0 M774 244 q3 -3 6 0 q3 -3 6 0" stroke="${C.n6}" stroke-width="1.4" fill="none" opacity=".6"/>`
 :`<path d="M732 318 L792 224 H812 L752 318Z" fill="#fff" opacity=".06"/>`}
 <circle cx="795" cy="321" r="1.5" fill="${org?C.o4:C.s6}"/>`;
const pendant=org=>`${org?`<path d="M616 40 L664 40 L716 150 L564 150Z" fill="url(#ex-g-cone)" opacity=".35"/><ellipse cx="640" cy="44" rx="56" ry="30" fill="url(#ex-g-glow)" opacity=".8"/>`:''}
 <path d="M640 -90 V16" stroke="${C.n8}" stroke-width="1.6"/><rect x="636" y="10" width="8" height="7" rx="1.5" fill="${C.n8}"/>
 <path d="M610 41 C610 24 624 15 640 15 C656 15 670 24 670 41 Z" fill="${C.n7}"/><path d="M616 30 C620 22 628 19 636 18" stroke="#fff" stroke-width="2" fill="none" opacity=".18" stroke-linecap="round"/>
 <rect x="608" y="39" width="64" height="4" rx="2" fill="${C.o5}"/><ellipse cx="640" cy="43" rx="26" ry="3.4" fill="${org?'#FFF4E8':C.n9}"/>`;
const table=()=>`<ellipse cx="490" cy="507" rx="100" ry="5" fill="#0B2545" opacity=".14"/>
 <rect x="410" y="470" width="8" height="36" rx="2" fill="${C.wdD}"/><rect x="562" y="470" width="8" height="36" rx="2" fill="${C.wdD}"/>
 <rect x="414" y="490" width="152" height="5" fill="${C.wdD}"/>
 <rect x="398" y="458" width="184" height="13" rx="4" fill="${C.wd}"/><rect x="402" y="455" width="176" height="6" rx="3" fill="${C.wdL}"/>`;
const base=org=>`<rect y="-200" width="980" height="560" fill="#F2F5FA"/><rect width="980" height="360" fill="url(#ex-g-wall)"/>
 <rect y="278" width="980" height="70" fill="#DFE6EF"/><rect y="274" width="980" height="5" fill="#F8FAFD"/><rect y="279" width="980" height="1" fill="#CBD4E1"/>
 ${org?`<ellipse cx="291" cy="292" rx="200" ry="160" fill="url(#ex-g-glow)" opacity=".85"/>`:''}
 <rect y="346" width="980" height="14" fill="#F8FAFD"/><rect y="359" width="980" height="1.5" fill="#C3CDDA"/>
 <rect y="360" width="980" height="200" fill="url(#ex-g-floor)"/>${planks()}
 <path d="M190 362 L330 362 L410 476 L262 476Z" fill="#fff" opacity="${org?.2:.1}"/>
 ${win()}${clock(org)}${pendant(org)}${shelf(org)}${rug()}${catTree()}${dogBed()}${sideTable()}${sofa()}${rack()}${tv(org)}${table()}`;

/* ---------- posições ----------
   MESSY: a bagunça inicial (cada item é arrastável). zone: 'wall' (fica na parede) · 'pet' (bicho: gira pouco)
   ORG: a mesma sala arrumada (camada "depois" do slider) */
const MESSY=[
 {d:'frame',x:490,y:150,r:-13,zone:'wall'},
 {d:'soil',x:232,y:448,r:4},
 {d:'plant',x:198,y:432,r:-80},
 {d:'cushionC',x:72,y:452,r:18},
 {d:'bookC',x:118,y:428,r:8},
 {d:'papers',x:262,y:532,r:12},
 {d:'pizza',x:356,y:522,r:-5},
 {d:'bookOpen',x:182,y:476,r:-16},
 {d:'sock',x:124,y:510,r:-24},
 {d:'lamp',x:322,y:458,r:96},
 {d:'towel',x:620,y:322,r:6},
 {d:'dog',x:524,y:332,r:0,zone:'pet'},
 {d:'mugS',x:470,y:456,r:0},
 {d:'cushionA',x:454,y:530,r:-24},
 {d:'bookA',x:558,y:536,r:22},
 {d:'chair',x:650,y:506,r:-100},
 {d:'cushionB',x:744,y:470,r:30},
 {d:'cat',x:800,y:204,r:0,zone:'pet'},
 {d:'shirt',x:808,y:514,r:14},
 {d:'bookB',x:860,y:452,r:-64},
 {d:'sock2',x:892,y:528,r:-20},
 {d:'remote',x:914,y:468,r:62},
 {d:'shoe',x:946,y:540,r:-8}
];
const ORG=[
 {d:'plantV',x:90,y:60},{d:'frame',x:490,y:150},{d:'chair',x:222,y:360},{d:'lampOn',x:291,y:304},
 {d:'cushionA',x:386,y:334,r:-8},{d:'cushionC',x:490,y:337},{d:'cushionB',x:598,y:334,r:8},{d:'towelF',x:634,y:295},
 {d:'catC',x:938,y:272},{d:'dog',x:134,y:496},{d:'books2',x:520,y:451},{d:'mug',x:450,y:443},{d:'remote',x:558,y:452,r:-4},
 {d:'twinkle',x:574,y:478},{d:'twinkle',x:236,y:470},{d:'twinkle',x:872,y:392},{d:'twinkle',x:404,y:212},{d:'twinkle',x:690,y:176}
];
const CAT_SPOTS=[[800,204],[430,236],[256,210],[92,74],[938,272],[560,236],[735,330]];
const DOG_SPOTS=[[524,332],[134,496],[420,520],[700,516],[860,500],[270,512]];

/* ---------- monta o cenário ---------- */
const scene=$('#exScene',SEC), svgB=$('#exBefore',SEC), svgA=$('#exAfter',SEC);
$('.ex-defs',SEC).innerHTML=DEFS;
svgB.innerHTML=base(0)+`<g class="ex-items">${MESSY.map((m,i)=>`<g class="ex-it" data-i="${i}" data-k="${m.d}" style="--i:${i}">${DRAW[m.d]()}</g>`).join('')}</g><rect class="ex-dim" y="-200" width="980" height="760"/>`;
svgA.innerHTML=base(1)+ORG.map(o=>`<g transform="translate(${o.x} ${o.y}) rotate(${o.r||0})">${DRAW[o.d]()}</g>`).join('');
const layer=$('.ex-items',svgB), items=$$('.ex-it',svgB);
let st=MESSY.map(m=>({x:m.x,y:m.y,r:m.r||0}));
const put=i=>{const s=st[i];items[i].style.transform=`translate(${s.x}px,${s.y}px) rotate(${s.r}deg)`};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), rnd=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
const T=[];const later=(f,ms)=>{T.push(setTimeout(f,ms))};const clearT=()=>{while(T.length)clearTimeout(T.pop())};
items.forEach((g,i)=>put(i));

/* coordenadas: evento → unidades do SVG (o palco é escalado por CSS) */
/* o SVG usa preserveAspectRatio="xMidYMax meet": a sala fica ancorada embaixo e a parede sobe se a cena for mais alta */
let visTop=0; /* quanto da parede aparece acima de y=0 (unidades do SVG) */
function toSvg(e){const [sx,sy]=DECK.toStage(e),r=svgB.getBoundingClientRect(),s=DECK.stage.getBoundingClientRect(),k=DECK.scale();
 const ew=r.width/k,eh=r.height/k,sc=Math.min(ew/W,eh/H),ox=(r.left-s.left)/k+(ew-W*sc)/2,oy=(r.top-s.top)/k+(eh-H*sc);
 visTop=(eh-H*sc)/sc;
 return [(sx-ox)/sc,(sy-oy)/sc]}
/* meia-largura/altura do item já girado: o arraste mantém ~80% do objeto dentro da sala */
function ext(i){const g=items[i];if(!g._bb){let b=null;try{b=g.getBBox()}catch(_){}
  g._bb=b&&b.width?[Math.max(-b.x,b.x+b.width),Math.max(-b.y,b.y+b.height)]:[34,26]}
 const a=st[i].r*Math.PI/180,c=Math.abs(Math.cos(a)),sn=Math.abs(Math.sin(a)),[hx,hy]=g._bb;
 return [Math.min(c*hx+sn*hy,W/2)*.62,Math.min(sn*hx+c*hy,H/2)*.62]}

/* ---------- arrastar, girar ---------- */
let drag=null,lastTap={i:-1,t:0};
function rotate(i,dr){svgB.classList.add('ex-rot');st[i].r+=dr;put(i);tone(dr>0?720:600,.05,'triangle',.035);clearTimeout(rotate.t);rotate.t=setTimeout(()=>svgB.classList.remove('ex-rot'),260)}
svgB.addEventListener('pointerdown',e=>{const g=e.target.closest('.ex-it');if(!g||e.button>0)return;e.preventDefault();e.stopPropagation();
 const i=+g.dataset.i,[ux,uy]=toSvg(e),now=performance.now();
 if(lastTap.i===i&&now-lastTap.t<340){rotate(i,15);lastTap={i:-1,t:0};return}
 lastTap={i,t:now};svgB.classList.remove('ex-spring','ex-drop');
 drag={g,i,dx:ux-st[i].x,dy:uy-st[i].y,id:e.pointerId,moved:false};g.classList.add('drag');
 if(layer.lastElementChild!==g)layer.appendChild(g);
 try{svgB.setPointerCapture(e.pointerId)}catch(_){}tone(520,.05,'sine',.035)});
svgB.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const [ux,uy]=toSvg(e),s=st[drag.i];
 const [ex,ey]=ext(drag.i);s.x=clamp(ux-drag.dx,ex,W-ex);s.y=clamp(uy-drag.dy,ey-visTop+10,H-ey);drag.moved=true;put(drag.i)});
const endDrag=e=>{if(!drag)return;drag.g.classList.remove('drag');if(drag.moved){lastTap={i:-1,t:0};tone(300,.07,'sine',.04,180)}drag=null};
svgB.addEventListener('pointerup',endDrag);svgB.addEventListener('pointercancel',endDrag);svgB.addEventListener('lostpointercapture',endDrag);
let wAcc=0,wT=0;
svgB.addEventListener('wheel',e=>{const g=e.target.closest('.ex-it');if(!g)return;e.preventDefault();e.stopPropagation();
 const now=performance.now();wAcc+=e.deltaY;if(now-wT<70&&Math.abs(wAcc)<60)return;wT=now;rotate(+g.dataset.i,wAcc>0?15:-15);wAcc=0},{passive:false});
svgB.addEventListener('dblclick',e=>e.preventDefault());

/* ---------- bagunçar mais / original ---------- */
function springTo(fn,delayMax=180){svgB.classList.remove('ex-drop');svgB.classList.add('ex-spring');
 items.forEach((g,i)=>{g.style.setProperty('--dl',Math.round(Math.random()*delayMax)+'ms');fn(i);put(i)});
 clearTimeout(springTo.t);springTo.t=setTimeout(()=>svgB.classList.remove('ex-spring'),1400)}
function shuffle(){boing();[0,90,180,260].forEach((d,k)=>later(()=>tone(260+k*90,.09,'triangle',.04),d+120));
 springTo(i=>{const m=MESSY[i],s=st[i];
  if(m.zone==='wall'){s.x=rnd(400,600);s.y=rnd(110,190);s.r=rnd(-38,38)}
  else if(m.d==='cat'){const p=pick(CAT_SPOTS);s.x=p[0];s.y=p[1];s.r=rnd(-10,10)}
  else if(m.d==='dog'){const p=pick(DOG_SPOTS);s.x=p[0];s.y=p[1];s.r=rnd(-8,8)}
  else if(Math.random()<.22&&!['chair','lamp','pizza'].includes(m.d)){s.x=rnd(380,600);s.y=rnd(326,342);s.r=rnd(-40,40)}
  else{s.x=rnd(50,930);s.y=rnd(420,538);s.r=rnd(-180,180)}})}
function restore(anim=true){st=MESSY.map(m=>({x:m.x,y:m.y,r:m.r||0}));items.forEach(g=>layer.appendChild(g));
 if(anim){springTo(()=>{},120);tone(520,.1,'sine',.05,780)}else{svgB.classList.remove('ex-spring','ex-drop');items.forEach((g,i)=>put(i))}}
$('#exMess',SEC).onclick=shuffle;$('#exReset',SEC).onclick=()=>restore(true);
/* clique com o mouse não deixa o foco no botão: Espaço/Enter seguem avançando o deck */
$$('.ex-btn',SEC).forEach(b=>b.addEventListener('click',e=>{if(e.detail)b.blur()}));

/* ---------- antes/depois ---------- */
const btnCmp=$('#exCmp',SEC),hnd=$('#exHandle',SEC);let cmp=false,cut=50,raf=0,cdrag=null;
/* com o corte rente a uma borda, o chip daquele lado esmaece (a linha não passa por cima dele) */
const setCut=p=>{cut=clamp(p,0,100);scene.style.setProperty('--cut',cut.toFixed(2)+'%');scene.classList.toggle('cut-lo',cut<12);scene.classList.toggle('cut-hi',cut>88)};
function animCut(keys,dur){cancelAnimationFrame(raf);const t0=performance.now(),from=cut;const pts=[from,...keys],n=pts.length-1;
 const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
 const f=t=>{const k=Math.min(1,(t-t0)/dur),seg=Math.min(n-1,Math.floor(k*n)),lk=k*n-seg;setCut(pts[seg]+(pts[seg+1]-pts[seg])*ease(Math.min(1,lk)));if(k<1)raf=requestAnimationFrame(f)};raf=requestAnimationFrame(f)}
let sweepT=0;
function setCompare(on,sweep){cmp=on;scene.classList.toggle('cmp',on);btnCmp.classList.toggle('on',on);btnCmp.setAttribute('aria-pressed',on);cancelAnimationFrame(raf);clearTimeout(sweepT);
 if(on){if(sweep){setCut(98);sweepT=setTimeout(()=>{tone(240,.9,'sine',.045,900);animCut([3,50],2600)},250);T.push(sweepT)}else{setCut(50);tone(520,.12,'sine',.05,880)}}}
btnCmp.onclick=()=>setCompare(!cmp,false);
const startCut=e=>{if(!cmp||e.button>0)return;e.preventDefault();e.stopPropagation();cancelAnimationFrame(raf);cdrag=e.pointerId;try{scene.setPointerCapture(e.pointerId)}catch(_){}setCut(toSvg(e)[0]/W*100)};
hnd.addEventListener('pointerdown',startCut);svgA.addEventListener('pointerdown',startCut);
scene.addEventListener('pointermove',e=>{if(cdrag===e.pointerId)setCut(toSvg(e)[0]/W*100)});
const endCut=e=>{if(cdrag===e.pointerId)cdrag=null};scene.addEventListener('pointerup',endCut);scene.addEventListener('pointercancel',endCut);

/* ---------- CURIOSIDADE: de fora para dentro ou de dentro para fora? ----------
   CUR=0 fechado · 1 pergunta + votação · 2 resposta (ciclo). Abre pelos passos 6–7
   ou pelo chip 💡 (modo livre: → revela, → de novo fecha; ← desfaz). */
const curEl=$('#exCur',SEC),curBtn=$('#exCurBtn',SEC),cyc=$('#exCyc',SEC),tug=$('#exTug',SEC);
let CUR=0,free=false;const V={a:0,b:0};
(()=>{const c=100,RO=84,RI=56,RN=70,
 xy=(r,d)=>{const a=d*Math.PI/180;return [(c+r*Math.cos(a)).toFixed(1),(c+r*Math.sin(a)).toFixed(1)]},
 head=(r,d,cw)=>{const [x,y]=xy(r,d);return `<path d="M-3.5 -5 2 0 -3.5 5" transform="translate(${x} ${y}) rotate(${d+(cw?90:-90)})"/>`},
 node=(d,t,w,k)=>{const [x,y]=xy(RN,d);return `<g class="nd ${k}" transform="translate(${x} ${y})"><rect x="${-w/2}" y="-12" width="${w}" height="24" rx="12"/><text y="4">${t}</text></g>`};
 /* anel de fora (navy, horário: hipótese A) e anel de dentro (laranja, anti-horário: hipótese B): VER ↔ SENTIR ↔ AGIR */
 cyc.innerHTML=`<circle class="halo" cx="${c}" cy="${c}" r="${RO+8}"/>`+
  `<g class="cw"><circle cx="${c}" cy="${c}" r="${RO}"/>${[-30,90,210].map(d=>head(RO,d,1)).join('')}</g>`+
  `<g class="ccw"><circle cx="${c}" cy="${c}" r="${RI}"/>${[-30,90,210].map(d=>head(RI,d,0)).join('')}</g>`+
  node(-90,'VER',52,'v')+node(30,'SENTIR',70,'s')+node(150,'AGIR',56,'g')+
  `<text class="ct" x="${c}" y="${c-4}">é um</text><text class="cb" x="${c}" y="${c+14}">ciclo</text>`})();
/* até HMAX mãozinhas; acima disso, "+N" (cabe mesmo com contagem de 3 dígitos) */
const HMAX=6;
function paintVotes(bump){const t=V.a+V.b,p=t?V.a/t*100:50;
 ['a','b'].forEach(k=>{const n=$('#exV'+k,SEC),h=$('#exH'+k,SEC),v=V[k];n.textContent=v;n.nextElementSibling.textContent=v===1?'mão':'mãos';
  if(bump===k){n.classList.remove('bump');void n.offsetWidth;n.classList.add('bump')}
  const show=Math.min(v,HMAX),have=h.querySelectorAll('i').length;
  if(show<have||!v)h.innerHTML='';
  for(let i=h.querySelectorAll('i').length;i<show;i++)h.insertAdjacentHTML('beforeend','<i>✋</i>');
  const em=h.querySelector('em');if(v>HMAX){if(em)em.textContent='+'+(v-HMAX);else h.insertAdjacentHTML('beforeend',`<em>+${v-HMAX}</em>`)}else if(em)em.remove()});
 $('#exTa',SEC).textContent=V.a;$('#exTb',SEC).textContent=V.b;
 tug.style.setProperty('--p',p.toFixed(1)+'%');tug.classList.toggle('zero',!t)}
function vote(k){V[k]++;paintVotes(k);tone(k==='a'?520:660,.09,'triangle',.05,k==='a'?700:880)}
function zeroVotes(sound=true){V.a=V.b=0;paintVotes();if(sound)tone(420,.12,'sine',.04,260)}
function setCur(m,sound=true){const was=CUR;CUR=m;
 curEl.classList.toggle('open',m>0);curEl.classList.toggle('rev',m===2);curEl.setAttribute('aria-hidden',m?'false':'true');
 curBtn.classList.toggle('on',m>0);curBtn.setAttribute('aria-pressed',m>0);
 if(!m)free=false;
 if(!sound||m===was)return;
 if(m===1&&!was){boing();later(()=>tone(990,.12,'sine',.05,1320),260)}
 else if(m===2){ding();later(()=>tone(660,.5,'sine',.04,990),380)}
 else if(!m)tone(500,.12,'sine',.04,300)}
$$('.ex-plus',SEC).forEach(b=>b.addEventListener('click',()=>vote(b.dataset.v)));
$('#exCurZero',SEC).onclick=()=>zeroVotes();
/* fechar: se veio pelos passos, volta ao passo 5; se veio pelo chip, só fecha */
function closeCur(){if(S>=6)setS(5,-1);else setCur(0)}
function openCur(){if(S===5)setS(6,1);else if(S<5){free=true;setCur(1)}}
curBtn.onclick=()=>{CUR?closeCur():openCur()};
$('#exCurX',SEC).onclick=closeCur;
$('#exCurRev',SEC).onclick=()=>{if(S===6)setS(7,1);else if(free)setCur(2)};
/* Esc fecha o cartão só quando nada do shell está por cima (roda, painéis, tela preta, Fernando):
   escuta na captura, antes do shell, para ler o estado de antes da tecla */
addEventListener('keydown',e=>{if(e.key!=='Escape'||!CUR||!DECK.isActive('exercicio'))return;
 if(document.querySelector('#wheel.on,#infoP.on,#idxP.on,#blackout.on')||window.fernVisible?.())return;closeCur()},true);
$$('.ex-curb,.ex-plus,.ex-cur-z,.ex-cur-x',SEC).forEach(b=>b.addEventListener('click',e=>{if(e.detail)b.blur()}));
paintVotes();

/* ---------- passos: Ver → Sentir → comparar → Decidir + Agir → Repetir → Curiosidade (pergunta, resposta) ---------- */
const rows=$$('#exSteps li',SEC),panel=$('#exPanel',SEC),regs=$$('#exBrain .rg',SEC),q=$('#exIsaQ',SEC),isa=$('#exIsa',SEC);
const ON={0:[],1:[1],2:[2],3:[],4:[3,4],5:[5],6:[],7:[]},DONE={0:0,1:0,2:1,3:2,4:2,5:4,6:5,7:5};
const QS=['Pode bagunçar mais! O que mais incomoda aqui?','O que salta aos olhos primeiro?','E o que você sente olhando para isso?','Agora compare. Dá vontade de arrumar?','Decidir arruma a sala? Quem pôs a mão na massa?','E amanhã? Quem garante que a sala continua assim?','Curiosidade: começa por fora ou por dentro?','As duas! E na sua área, por onde começar?'];
let S=0;
/* linha de progresso entre os ícones (Progress Motion) */
const ol=$('#exSteps',SEC),ics=$$('#exSteps .ic',SEC),LAST={0:0,1:0,2:1,3:1,4:3,5:4,6:4,7:4};
function track(n){const k=DECK.scale()||1,o=ol.getBoundingClientRect(),c=ics.map(ic=>{const r=ic.getBoundingClientRect();return (r.top+r.height/2-o.top)/k});
 if(!o.height)return;ol.style.setProperty('--t0',c[0]+'px');ol.style.setProperty('--len',(c[c.length-1]-c[0])+'px');ol.style.setProperty('--fill',(c[LAST[n]]-c[0])+'px')}
function ask(n){if(q.textContent===QS[n])return;isa.classList.remove('pop');void isa.offsetWidth;q.textContent=QS[n];isa.classList.add('pop')}
function setS(n,dir=1){const prev=S;S=n;
 const on=ON[n],done=DONE[n];
 rows.forEach(li=>{const i=+li.dataset.s;li.classList.toggle('on',on.includes(i));li.classList.toggle('done',!on.includes(i)&&i<=done)});
 regs.forEach(g=>{const r=+g.dataset.r;g.classList.toggle('on',on.includes(r));g.classList.toggle('done',!on.includes(r)&&r<=done)});
 panel.classList.toggle('going',n>0);track(n);
 
 scene.classList.toggle('see',n===1);scene.classList.toggle('feel',n===2);scene.classList.toggle('fin',n===5);
 if(n>=3&&!cmp)setCompare(true,n===3);
 else if(n<3&&cmp)setCompare(false);
 if(n>=4)clearTimeout(sweepT);
 if(n===4&&dir>0){animCut([4],1100);later(()=>{ding()},300)}
 if(n===5&&cut>6)animCut([4],900);
 if(n===3&&dir<0&&prev===4)animCut([50],900);
 if(n===1&&dir>0)tone(440,.5,'sine',.04,880);
 if(n===2&&dir>0){tone(110,.14,'sine',.09);later(()=>tone(100,.16,'sine',.08),190)}
 if(n===5&&dir>0){ding();later(()=>tone(990,.3,'sine',.05),420)}
 setCur(n===6?1:n===7?2:0,n>=5||CUR>0);
 ask(n)}
rows.forEach(li=>li.addEventListener('click',()=>{const i=+li.dataset.s,n={1:1,2:2,3:4,4:4,5:5}[i];setS(n===S?0:n,n>=S?1:-1)}));

function drop(){svgB.classList.remove('ex-spring','ex-drop');
 items.forEach((g,i)=>{const s=st[i],m=MESSY[i];g.style.setProperty('--dl',(m.zone==='wall'?1500:120+i*42)+'ms');
  g.style.transform=m.zone==='wall'?`translate(${s.x}px,${s.y}px) rotate(0deg)`:`translate(${s.x}px,${s.y-620}px) rotate(${s.r*.3}deg)`});
 void svgB.getBoundingClientRect();
 requestAnimationFrame(()=>{svgB.classList.add('ex-drop');items.forEach((g,i)=>put(i))});
 [700,900,1150,1400].forEach((d,k)=>later(()=>tone(150-k*12,.12,'sine',.05,70),d));
 later(()=>tone(180,.35,'sawtooth',.02,120),1800);
 later(()=>svgB.classList.remove('ex-drop'),3000)}

function resetAll(){clearT();cancelAnimationFrame(raf);drag=null;cdrag=null;
 restore(false);setCompare(false);setCut(50);setCur(0,false);zeroVotes(false);S=0;setS(0,0)}
resetAll();
DECK.register('exercicio',{
 enter(){resetAll();drop()},
 leave(){resetAll()},
 step(d){
  /* cartão aberto pelo chip (fora da sequência): → revela e depois fecha; ← desfaz */
  if(free&&CUR){if(d>0){if(CUR===1)setCur(2);else setCur(0)}else{if(CUR===2)setCur(1);else setCur(0)}return true}
  if(d>0&&S<7){setS(S+1,1);return true}if(d<0&&S>0){setS(S-1,-1);return true}return false}
});
})();
