// Gera audio/mix.m4a a partir de timings.js: narração nos offsets das cenas,
// whoosh nas transições, cliques sincronizados à fala (CLICKS via kw), ding nos
// cartões de ato e bed ambiente em loop — tudo abaixo da voz.
// Uso: node mix2.js
const { execFileSync } = require('child_process');
const { existsSync } = require('fs');
const { SCENES, TOTAL, kw, CLICKS } = require('./timings.js');

const T = Math.round(TOTAL * 100) / 100;
const A = __dirname + '/audio/';
const narr = SCENES.filter(s => s.file)
  .map(s => ({ file: s.file + '.mp3', at: Math.round(s.n * 1000) }))
  .filter(nn => {
    const ok = existsSync(A + nn.file);
    if (!ok) console.warn('AVISO: sem narração', nn.file, '— cena fica só com trilha');
    return ok;
  });
const cuts = SCENES.slice(1).map(s => Math.round((s.a - 0.15) * 1000));
const clicks = existsSync(A + 'click.mp3')
  ? CLICKS.map(([id, ph]) => Math.round(kw(id, ph, 0.02) * 1000)).sort((a, b) => a - b) : [];
const dings = existsSync(A + 'ding.mp3')
  ? SCENES.filter(s => ['x1', 'x2', 'x3'].includes(s.id)).map(s => Math.round((s.a + 0.35) * 1000))
      .concat(SCENES.filter(s => s.id === 'c1').map(s => Math.round((s.n + s.nd + 0.2) * 1000))) : [];

const inputs = ['-stream_loop', String(Math.ceil(T / 28) - 1), '-i', 'bed.mp3'];
narr.forEach(nn => inputs.push('-i', nn.file));
const wfile = existsSync(A + 'swoosh.mp3') ? 'swoosh.mp3' : 'whoosh.mp3'; // swoosh suave v5.1
inputs.push('-i', wfile);
const wIdx = narr.length + 1;
let cIdx = -1, dIdx = -1;
if (clicks.length) { inputs.push('-i', 'click.mp3'); cIdx = wIdx + 1; }
if (dings.length) { inputs.push('-i', 'ding.mp3'); dIdx = cIdx > 0 ? cIdx + 1 : wIdx + 1; }

let fc = `[0:a]atrim=0:${T},volume=0.13,afade=t=in:st=0:d=2,afade=t=out:st=${(T - 4.5).toFixed(2)}:d=4.5[bed];\n`;
const mix = ['[bed]'];
narr.forEach((nn, i) => { fc += `[${i + 1}:a]adelay=${nn.at}|${nn.at}[n${i}];\n`; mix.push(`[n${i}]`); });
fc += `[${wIdx}:a]volume=0.16,asplit=${cuts.length}${cuts.map((_, i) => `[wa${i}]`).join('')};\n`;
cuts.forEach((c, i) => { fc += `[wa${i}]adelay=${c}|${c}[w${i}];\n`; mix.push(`[w${i}]`); });
if (clicks.length) {
  fc += `[${cIdx}:a]volume=0.34,asplit=${clicks.length}${clicks.map((_, i) => `[ca${i}]`).join('')};\n`;
  clicks.forEach((c, i) => { fc += `[ca${i}]adelay=${c}|${c}[c${i}];\n`; mix.push(`[c${i}]`); });
}
if (dings.length) {
  fc += `[${dIdx}:a]volume=0.30,asplit=${dings.length}${dings.map((_, i) => `[da${i}]`).join('')};\n`;
  dings.forEach((c, i) => { fc += `[da${i}]adelay=${c}|${c}[d${i}];\n`; mix.push(`[d${i}]`); });
}
fc += `${mix.join('')}amix=inputs=${mix.length}:normalize=0[mx];\n`;
fc += `[mx]loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.97,aresample=48000[out]`;

execFileSync('ffmpeg', ['-y', ...inputs, '-filter_complex', fc, '-map', '[out]', '-t', String(T),
  '-c:a', 'aac', '-b:a', '192k', 'mix.m4a'], { cwd: A, stdio: 'inherit' });
console.log('mix.m4a ok,', T, 's ·', narr.length, 'narrações ·', clicks.length, 'cliques ·', dings.length, 'dings');
