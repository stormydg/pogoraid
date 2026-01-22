const puppeteer = require('puppeteer');

async function scrapeCounters() {
  const browser = await puppeteer.launch({
    headless: false,  // Kør med synlig browser
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();

  // Sæt en realistisk user agent
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Sæt viewport
  await page.setViewport({ width: 1920, height: 1080 });

  // Skjul at det er puppeteer
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  console.log('Navigerer til siden...');

  try {
    await page.goto('https://db.pokemongohub.net/pokemon/359-Mega/counters', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Vent på Cloudflare check
    console.log('Venter på Cloudflare verificering...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('\n=== SIDE TITEL ===');
    const title = await page.title();
    console.log(title);

    // Tjek om vi stadig er på Cloudflare
    const bodyText = await page.evaluate(() => document.body.innerText);

    if (bodyText.includes('Verificer') || bodyText.includes('Cloudflare')) {
      console.log('\nStadig på Cloudflare check - venter længere...');
      await new Promise(resolve => setTimeout(resolve, 15000));
    }

    console.log('\n=== COUNTER DATA ===');

    const counters = await page.evaluate(() => {
      const results = [];

      // Kig efter tabeller
      const tables = document.querySelectorAll('table');
      tables.forEach((table, i) => {
        const rows = table.querySelectorAll('tr');
        if (rows.length > 0) {
          results.push(`\n--- Table ${i + 1} (${rows.length} rows) ---`);
          rows.forEach((row, j) => {
            if (j < 15) {
              results.push(row.textContent.trim().replace(/\s+/g, ' ').substring(0, 250));
            }
          });
        }
      });

      // Hent hele body tekst
      results.push('\n--- Page text (first 3000 chars) ---');
      results.push(document.body.innerText.substring(0, 3000));

      return results;
    });

    counters.forEach(c => console.log(c));

    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    console.log('\n\nScreenshot gemt som screenshot.png');

  } catch (error) {
    console.error('Fejl:', error.message);
  }

  // Hold browseren åben i 5 sekunder så vi kan se
  await new Promise(resolve => setTimeout(resolve, 5000));

  await browser.close();
}

scrapeCounters().catch(console.error);
