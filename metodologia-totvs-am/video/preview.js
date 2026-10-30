// Screenshot the animation at given timestamps for QC.
// Usage: node preview.js out_dir t1 t2 t3 ...
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const [outDir, ...ts] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--force-device-scale-factor=1'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.resolve(__dirname, 'index.html'));
  await page.waitForFunction('window.__ready === true', { timeout: 30000 });
  for (const t of ts.map(Number)) {
    await page.evaluate(t => window.seek(t), t);
    await page.waitForTimeout(60);
    await page.screenshot({ path: `${outDir}/t${t.toFixed(1).replace('.', '_')}.png` });
    console.log('shot', t);
  }
  await browser.close();
})();
