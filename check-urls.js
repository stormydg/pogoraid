const puppeteer = require('puppeteer');

const pokemonToCheck = [
  { name: 'Mega Charizard Y', urls: [
    'https://db.pokemongohub.net/pokemon/6-Mega-Y/counters',
    'https://db.pokemongohub.net/pokemon/6-mega-y/counters',
    'https://db.pokemongohub.net/pokemon/charizard-mega-y/counters'
  ]},
  { name: 'Galarian Darmanitan', urls: [
    'https://db.pokemongohub.net/pokemon/555-Galarian/counters',
    'https://db.pokemongohub.net/pokemon/555-Galarian-Standard/counters',
    'https://db.pokemongohub.net/pokemon/darmanitan-galarian/counters'
  ]}
];

async function checkUrl(browser, url) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 5000));

    const title = await page.title();
    const hasTable = await page.evaluate(() => !!document.querySelector('table'));

    console.log(`${url}`);
    console.log(`  Title: ${title}`);
    console.log(`  Has table: ${hasTable}`);

    await page.close();
    return hasTable;
  } catch (e) {
    console.log(`${url} - ERROR: ${e.message}`);
    await page.close();
    return false;
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });

  for (const pokemon of pokemonToCheck) {
    console.log(`\n=== ${pokemon.name} ===`);
    for (const url of pokemon.urls) {
      await checkUrl(browser, url);
    }
  }

  await browser.close();
}

main();
