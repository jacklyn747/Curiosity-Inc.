const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://curiosityinc.online', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  
  const y = await page.evaluate(() => {
     return document.querySelector('#work').getBoundingClientRect().top + window.scrollY;
  });
  
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/gingerninja/Sites/claudessetup/tmp/step-work.png' });

  await page.evaluate((y) => window.scrollTo(0, y + 800), y);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/gingerninja/Sites/claudessetup/tmp/step-early.png' });

  await page.evaluate((y) => window.scrollTo(0, y + 1600), y);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/gingerninja/Sites/claudessetup/tmp/step-mid.png' });
  
  await browser.close();
})();
