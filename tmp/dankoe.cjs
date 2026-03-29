const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://curiosityinc.online', { waitUntil: 'networkidle0' });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const el = document.querySelector('.hg-container');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: '/Users/gingerninja/Sites/claudessetup/tmp/dan-koe.png' });
  await browser.close();
})();
