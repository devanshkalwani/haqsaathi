/* eslint-disable @typescript-eslint/no-require-imports */
/* Screenshots of the real site (dev server on :3456, light mode, phone size) used on the phone screen in the intro video. Run: node capture-site.cjs (writes site/<lang>-<page>.png) */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const lang of ['en', 'hi']) {
    const ctx = await b.newContext({ viewport: { width: 360, height: 734 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await ctx.addInitScript(([lang]) => {
      localStorage.setItem('hs-theme', 'light');
      localStorage.setItem('hs_lang', JSON.stringify(lang));
      localStorage.setItem('hs_profile', JSON.stringify({ age: 45, gender: 'male', area: 'rural', state: 'Uttar Pradesh', occupation: 'farmer', income: 'upto_1l', category: 'obc', flags: ['has_bank_account', 'owns_farmland', 'has_bpl_card'] }));
      localStorage.setItem('hs_saved_schemes', JSON.stringify([]));
    }, [lang]);
    const p = await ctx.newPage();
    const hide = () => p.addStyleTag({ content: 'nextjs-portal{display:none!important} *{animation-play-state:paused!important} .animate-fade-up{animation:none!important;opacity:1!important}' });
    // quiz: go to the occupation question
    await p.goto('http://localhost:3456/check', { waitUntil: 'networkidle' });
    await hide(); await p.waitForTimeout(600);
    for (let i = 0; i < 4; i++) { await p.locator('main button:has(svg.lucide-arrow-right)').last().click(); await p.waitForTimeout(350); }
    await p.waitForTimeout(800);
    await p.screenshot({ path: `site/${lang}-check.png` });
    await p.goto('http://localhost:3456/results', { waitUntil: 'networkidle' });
    await hide(); await p.waitForTimeout(900);
    await p.screenshot({ path: `site/${lang}-results.png` });
    await p.goto('http://localhost:3456/schemes/pm-kisan', { waitUntil: 'networkidle' });
    await hide(); await p.waitForTimeout(900);
    await p.evaluate(() => { document.querySelectorAll('nav.fixed').forEach(n => n.style.display = 'none'); document.querySelector('header').style.position = 'static'; });
    await p.screenshot({ path: `site/${lang}-detail.png`, clip: { x: 0, y: 0, width: 360, height: 1900 }, fullPage: true });
    await ctx.close();
  }
  await b.close();
})();
