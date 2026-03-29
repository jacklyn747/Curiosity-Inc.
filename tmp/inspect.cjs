const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://curiosityinc.online', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  
  const outerHTML = await page.evaluate(() => {
    const el = document.querySelector('.hg-container');
    if (!el) return 'Not found';
    return {
      rect: el.getBoundingClientRect(),
      scrollWidth: el.querySelector('.hg-scroll-wrapper')?.scrollWidth,
      wrapperCSS: el.querySelector('.hg-scroll-wrapper')?.style.cssText,
      cardStyles: Array.from(el.querySelectorAll('.hg-card')).map(c => c.style.cssText)
    };
  });
  console.log(JSON.stringify(outerHTML, null, 2));
  await browser.close();
})();
