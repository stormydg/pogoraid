const puppeteer = require('puppeteer');

async function testTTW() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  console.log('Loading page...');
  await page.goto('https://db.pokemongohub.net/pokemon/150/counters', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await new Promise(resolve => setTimeout(resolve, 10000));

  console.log('\n=== TABLE STRUCTURE ===');
  const tableData = await page.evaluate(() => {
    const results = [];
    const table = document.querySelector('table');
    if (!table) return ['No table found'];

    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('th, td');
      const cellData = [];
      cells.forEach((cell, cellIndex) => {
        cellData.push(`[${cellIndex}] ${cell.innerText.trim().substring(0, 30)}`);
      });
      if (rowIndex < 5) {
        results.push(`Row ${rowIndex}: ${cellData.join(' | ')}`);
      }
    });

    return results;
  });

  tableData.forEach(r => console.log(r));

  await new Promise(resolve => setTimeout(resolve, 3000));
  await browser.close();
}

testTTW().catch(console.error);
