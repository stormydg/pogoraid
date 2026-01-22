const puppeteer = require('puppeteer');
const Database = require('better-sqlite3');

const db = new Database('pokemon.db');

// Manuelle URL mappings for de problematiske Pokemon
const manualUrls = {
  'Mega Charizard Y': 'https://db.pokemongohub.net/pokemon/6-Mega-Y/counters',
  'Mega Charizard X': 'https://db.pokemongohub.net/pokemon/6-Mega-X/counters',
  'Galarian Darmanitan': 'https://db.pokemongohub.net/pokemon/555-Galarian-Standard/counters',
  'Arceus': 'https://db.pokemongohub.net/pokemon/493/counters',
  'Genesect': 'https://db.pokemongohub.net/pokemon/649/counters',
  'Zygarde 50%': 'https://db.pokemongohub.net/pokemon/718-50/counters',
  'Dusk Mane Necrozma': 'https://db.pokemongohub.net/pokemon/800-Dusk-Mane/counters',
  'Dawn Wings Necrozma': 'https://db.pokemongohub.net/pokemon/800-Dawn-Wings/counters',
  'Zacian Crowned Sword': 'https://db.pokemongohub.net/pokemon/888-Crowned-Sword/counters',
  'Zamazenta Crowned Shield': 'https://db.pokemongohub.net/pokemon/889-Crowned-Shield/counters',
  'Urshifu Single Strike': 'https://db.pokemongohub.net/pokemon/892-Single-Strike/counters',
  'Urshifu Rapid Strike': 'https://db.pokemongohub.net/pokemon/892-Rapid-Strike/counters',
  'Ice Rider Calyrex': 'https://db.pokemongohub.net/pokemon/898-Ice-Rider/counters',
  'Shadow Rider Calyrex': 'https://db.pokemongohub.net/pokemon/898-Shadow-Rider/counters'
};

function calculatePlayersNeeded(ttwSeconds, raidTimer = 300) {
  if (!ttwSeconds || ttwSeconds <= 0) return null;
  const exactPlayers = ttwSeconds / raidTimer;
  if (exactPlayers <= 1.0) return '1 (solo mulig)';
  if (exactPlayers <= 1.3) return '1-2';
  if (exactPlayers <= 2.0) return '2';
  if (exactPlayers <= 2.5) return '2-3';
  if (exactPlayers <= 3.0) return '3';
  if (exactPlayers <= 3.5) return '3-4';
  if (exactPlayers <= 4.0) return '4';
  if (exactPlayers <= 5.0) return '4-5';
  if (exactPlayers <= 6.0) return '5-6';
  return '6+';
}

async function scrapeData(browser, url, pokemonName) {
  console.log(`\nScraping ${pokemonName} -> ${url}`);

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.includes('Verificer') || bodyText.includes('Cloudflare') || bodyText.includes('Just a moment')) {
      console.log(`  Waiting for Cloudflare...`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    const data = await page.evaluate(() => {
      const counters = [];
      const table = document.querySelector('table');
      if (!table) return { counters: [], avgTTW: 0 };

      const rows = table.querySelectorAll('tr');
      rows.forEach((row, index) => {
        if (index === 0 || index > 5) return;

        const cells = row.querySelectorAll('td');
        if (cells.length >= 8) {
          const name = cells[1]?.innerText?.trim();
          const fastMove = cells[2]?.innerText?.trim().replace(' *', '');
          const chargedMove = cells[3]?.innerText?.trim().replace(' *', '');
          const dps = parseFloat(cells[4]?.innerText?.trim()) || 0;
          const ttwText = cells[7]?.innerText?.trim();

          let ttw = 0;
          if (ttwText) {
            if (ttwText.includes('m')) {
              const match = ttwText.match(/(\d+)m\s*(\d+)?s?/);
              if (match) ttw = parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
            } else {
              const match = ttwText.match(/(\d+)s/);
              if (match) ttw = parseInt(match[1]);
            }
          }

          if (name && fastMove && chargedMove) {
            counters.push({ name, moveset: `${fastMove} / ${chargedMove}`, dps, ttw });
          }
        }
      });

      const top3 = counters.slice(0, 3);
      const avgTTW = top3.length > 0 ? Math.round(top3.reduce((sum, c) => sum + c.ttw, 0) / top3.length) : 0;
      return { counters, avgTTW };
    });

    await page.close();

    if (data.counters.length > 0) {
      console.log(`  Found ${data.counters.length} counters, avg TTW: ${data.avgTTW}s`);
      return data;
    } else {
      console.log(`  No data found (page might not exist)`);
      return null;
    }
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    await page.close();
    return null;
  }
}

async function main() {
  const missingPokemon = db.prepare(`
    SELECT p.id, p.name FROM pokemon p
    WHERE NOT EXISTS (SELECT 1 FROM counters c WHERE c.pokemon_id = p.id)
  `).all();

  console.log(`Found ${missingPokemon.length} Pokemon missing counters\n`);

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const insertCounter = db.prepare(`
    INSERT INTO counters (pokemon_id, counter_name, counter_moveset, dps, ttw, rank)
    VALUES (@pokemon_id, @counter_name, @counter_moveset, @dps, @ttw, @rank)
  `);

  const updatePokemon = db.prepare(`
    UPDATE pokemon SET min_players_duo = @players, estimated_ttw = @ttw WHERE id = @id
  `);

  let found = 0;

  for (const p of missingPokemon) {
    const url = manualUrls[p.name];
    if (!url) {
      console.log(`\nNo URL mapping for ${p.name}`);
      continue;
    }

    const data = await scrapeData(browser, url, p.name);

    if (data && data.counters.length > 0) {
      data.counters.forEach((counter, index) => {
        insertCounter.run({
          pokemon_id: p.id,
          counter_name: counter.name,
          counter_moveset: counter.moveset,
          dps: counter.dps,
          ttw: counter.ttw,
          rank: index + 1
        });
      });

      if (data.avgTTW > 0) {
        const playersNeeded = calculatePlayersNeeded(data.avgTTW);
        updatePokemon.run({ id: p.id, players: playersNeeded, ttw: data.avgTTW });
        console.log(`  -> ${playersNeeded} players`);
      }
      found++;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  await browser.close();
  console.log(`\n\nDone! Found counters for ${found} additional Pokemon`);
  db.close();
}

main().catch(console.error);
