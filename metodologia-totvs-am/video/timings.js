/* Single source of truth for scene timing.
   NARR durations (s) from ffprobe on the chosen takes.
   (*) s3/s4/s5 are ESTIMATES until the ElevenLabs credits are recharged
   and the 3 pending segments are generated — update before final render. */
const NARR = {
  s1: 15.88,  // boas-vindas            audio/n01.mp3
  s2: 21.63,  // por que método         audio/n02.mp3
  s3: 27.5,   // metodologia A&M · TMO  audio/n03.mp3 (*)
  s4: 33.0,   // framework A&M × TOTVS  audio/n04.mp3 (*)
  s5: 21.8,   // o que é um MIT         audio/n05.mp3 (*)
  s6: 20.11,  // frentes (Fluig/Integr./GAPs) audio/n06.mp3
  s7: 30.43,  // fases                  audio/n07.mp3
  s8: 24.84,  // status semanal         audio/n08.mp3
  s9: 21.47,  // riscos                 audio/n09.mp3
  s10: 19.72, // seu papel              audio/n10.mp3
};
const PAD = {
  s1: [1.6, 1.3], s2: [0.9, 1.5], s3: [0.9, 1.5], s4: [0.9, 1.6], s5: [0.9, 1.5],
  s6: [0.9, 1.5], s7: [0.9, 1.5], s8: [0.9, 1.7], s9: [0.9, 1.6], s10: [0.9, 4.6],
};
const ORDER = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10'];
const SCENES = [];
let t = 0;
for (const id of ORDER) {
  const [lead, tail] = PAD[id];
  const a = t, n = t + lead, b = t + lead + NARR[id] + tail;
  SCENES.push({ id, a, n, b, nd: NARR[id] });
  t = b;
}
const TOTAL = t;
if (typeof module !== 'undefined') module.exports = { NARR, PAD, ORDER, SCENES, TOTAL };
if (typeof window !== 'undefined') { window.NARR = NARR; window.SCENES = SCENES; window.TOTAL = Math.round(TOTAL * 100) / 100; }
