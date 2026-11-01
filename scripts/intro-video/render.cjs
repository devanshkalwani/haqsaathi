/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const [lang, fps, dur, outDir, only] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5], process.argv[6]];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => m.type()==='error' && console.log('CONSOLE', m.text()));
  await p.goto('file:///tmp/video/index.html?lang=' + lang);
  await p.evaluate(() => window.ready);
  const times = only ? only.split(',').map(Number) : [...Array(Math.round(fps*dur)).keys()].map(i => i / fps);
  for (let i = 0; i < times.length; i++) {
    await p.evaluate(t => window.renderAt(t), times[i]);
    await p.screenshot({ path: `${outDir}/f${String(i).padStart(4,'0')}.png` });
  }
  await b.close();
})();
