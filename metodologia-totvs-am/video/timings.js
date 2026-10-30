/* Fonte única de tempo — v4 (3 atos).
   [id, duração da narração (s), arquivo de áudio | null, lead, tail]
   (*) nA2/nA3/n04/n05: atualizar com ffprobe após baixar os takes. */
const DEF = [
  ['i0', 15.88, 'n01', 1.2, 1.2],  // cold open · boas-vindas
  ['x1', 0,     null,  0,   2.4],  // cartão ATO 1
  ['a1', 21.63, 'n02', 0.9, 1.3],  // por que método (tipografia cinética)
  ['a2', 29.23, 'nA2', 0.9, 1.4],  // PMO + GMO = TMO
  ['a3', 43.89, 'nA3', 0.9, 1.4],  // as 6 fases
  ['a4', 24.84, 'n08', 0.9, 1.5],  // status semanal
  ['a5', 21.47, 'n09', 0.9, 1.4],  // riscos
  ['x2', 0,     null,  0,   2.4],  // cartão ATO 2
  ['b1', 33.57, 'n04', 0.9, 1.5],  // framework venn + como entregamos
  ['b2', 22.60, 'n05', 0.9, 1.4],  // MIT
  ['b3', 20.11, 'n06', 0.9, 1.4],  // frentes do dia a dia
  ['x3', 0,     null,  0,   2.4],  // cartão ATO 3
  ['c1', 19.72, 'n10', 0.9, 4.6],  // seu papel + encerramento
];
const SCENES = [];
let t = 0;
for (const [id, nd, file, lead, tail] of DEF) {
  const a = t, n = t + lead, b = t + lead + nd + tail;
  SCENES.push({ id, a, n, b, nd, file });
  t = b;
}
const TOTAL = t;
if (typeof module !== 'undefined') module.exports = { SCENES, TOTAL };
if (typeof window !== 'undefined') { window.SCENES = SCENES; window.TOTAL = Math.round(TOTAL * 100) / 100; }
