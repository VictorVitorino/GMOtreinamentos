// Renders index.html frame by frame (deterministic seek) and pipes PNGs into ffmpeg.
// Usage: node render.js output.mp4 [fps]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

(async () => {
  const out = process.argv[2] || 'video.mp4';
  const fps = Number(process.argv[3] || 30);
  const browser = await chromium.launch({ args: ['--force-device-scale-factor=1', '--hide-scrollbars'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.resolve(__dirname, 'index.html'));
  await page.waitForFunction('window.__ready === true', { timeout: 60000 });
  const total = await page.evaluate('window.TOTAL');
  const frames = Math.round(total * fps);
  console.log(`rendering ${frames} frames @ ${fps}fps (${total}s)`);

  const ff = spawn('ffmpeg', [
    '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out,
  ], { stdio: ['pipe', 'ignore', 'inherit'] });

  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => window.seek(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94, caret: 'hide' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) {
      const el = (Date.now() - t0) / 1000;
      console.log(`frame ${i}/${frames} · ${el.toFixed(0)}s elapsed · eta ${(el / Math.max(i, 1) * (frames - i)).toFixed(0)}s`);
    }
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c)))));
  await browser.close();
  console.log('done:', out);
})().catch(e => { console.error(e); process.exit(1); });
