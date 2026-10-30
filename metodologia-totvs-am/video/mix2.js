// Gera audio/mix.m4a a partir de timings.js: narração n01..n10 nos offsets
// das cenas, whoosh em cada transição e bed ambiente em loop.
// Uso: node mix2.js
const { execFileSync } = require('child_process');
const { SCENES, TOTAL } = require('./timings.js');

const T = Math.round(TOTAL * 100) / 100;
const narr = SCENES.map((s, i) => ({ file: `n${String(i + 1).padStart(2, '0')}.mp3`, at: Math.round(s.n * 1000) }));
const cuts = SCENES.slice(1).map(s => Math.round((s.a - 0.15) * 1000));

const inputs = ['-stream_loop', String(Math.ceil(T / 28) - 1), '-i', 'bed.mp3'];
narr.forEach(nn => inputs.push('-i', nn.file));
inputs.push('-i', 'whoosh.mp3');
const wIdx = narr.length + 1;

let fc = `[0:a]atrim=0:${T},volume=0.15,afade=t=in:st=0:d=2,afade=t=out:st=${(T - 4.5).toFixed(2)}:d=4.5[bed];\n`;
const mix = ['[bed]'];
narr.forEach((nn, i) => { fc += `[${i + 1}:a]adelay=${nn.at}|${nn.at}[n${i}];\n`; mix.push(`[n${i}]`); });
fc += `[${wIdx}:a]volume=0.30,asplit=${cuts.length}${cuts.map((_, i) => `[wa${i}]`).join('')};\n`;
cuts.forEach((c, i) => { fc += `[wa${i}]adelay=${c}|${c}[w${i}];\n`; mix.push(`[w${i}]`); });
fc += `${mix.join('')}amix=inputs=${mix.length}:normalize=0[mx];\n`;
fc += `[mx]loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.97,aresample=48000[out]`;

execFileSync('ffmpeg', ['-y', ...inputs, '-filter_complex', fc, '-map', '[out]', '-t', String(T),
  '-c:a', 'aac', '-b:a', '192k', 'mix.m4a'], { cwd: __dirname + '/audio', stdio: 'inherit' });
console.log('mix.m4a ok,', T, 's');
