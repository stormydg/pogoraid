const puppeteer = require('puppeteer');
const Database = require('better-sqlite3');

const db = new Database('pokemon.db');

// Prøv forskellige URL formater for hver Pokemon
const pokemonUrls = {
  'Mega Charizard X': [
    'https://db.pokemongohub.net/pokemon/6-Mega-X/counters',
    'https://db.pokemongohub.net/pokemon/charizard-mega-x/counters'
  ],
  'Galarian Darmanitan': [
    'https://db.pokemongohub.net/pokemon/555-Galarian-Standard/counters',
    'https://db.pokemongohub.net/pokemon/darmanitan-galarian/counters',
    'https://db.pokemongohub.net/pokemon/darmanitan-galarian-standard/counters'
  ],
  'Arceus': [
    'https://db.pokemongohub.net/pokemon/493/counters',
    'https://db.pokemongohub.net/pokemon/arceus/counters',
    'https://db.pokemongohub.net/pokemon/arceus-normal/counters'
  ],
  'Genesect': [
    'https://db.pokemongohub.net/pokemon/649/counters',
    'https://db.pokemongohub.net/pokemon/genesect/counters'
  ],
  'Zygarde 50%': [
    'https://db.pokemongohub.net/pokemon/718-50/counters',
    'https://db.pokemongohub.net/pokemon/718-50-Percent/counters',
    'https://db.pokemongohub.net/pokemon/zygarde-50/counters'
  ],
  'Dusk Mane Necrozma': [
    'https://db.pokemongohub.net/pokemon/800-Dusk-Mane/counters',
    'https://db.pokemongohub.net/pokemon/necrozma-dusk-mane/counters'
  ],
  'Dawn Wings Necrozma': [
    'https://db.pokemongohub.net/pokemon/800-Dawn-Wings/counters',
    'https://db.pokemongohub.net/pokemon/necrozma-dawn-wings/counters'
  ],
  'Zacian Crowned Sword': [
    'https://db.pokemongohub.net/pokemon/888-Crowned-Sword/counters',
    'https://db.pokemongohub.net/pokemon/zacian-crowned-sword/counters',
    'https://db.pokemongohub.net/pokemon/888-Crowned/counters'
  ],
  'Zamazenta Crowned Shield': [
    'https://db.pokemongohub.net/pokemon/889-Crowned-Shield/counters',
    'https://db.pokemongohub.net/pokemon/zamazenta-crowned-shield/counters',
    'https://db.pokemongohub.net/pokemon/889-Crowned/counters'
  ],
  'Urshifu Single Strike': [
    'https://db.pokemongohub.net/pokemon/892-Single-Strike/counters',
    'https://db.pokemongohub.net/pokemon/urshifu-single-strike/counters',
    'https://db.pokemongohub.net/pokemon/892/counters'
  ],
  'Urshifu Rapid Strike': [
    'https://db.pokemongohub.net/pokemon/892-Rapid-Strike/counters',
    'https://db.pokemongohub.net/pokemon/urshifu-rapid-strike/counters'
  ],
  'Ice Rider Calyrex': [
    'https://db.pokemongohub.net/pokemon/898-Ice-Rider/counters',
    'https://db.pokemongohub.net/pokemon/calyrex-ice-rider/counters'
  ],
  'Shadow Rider Calyrex': [
    'https://db.pokemongohub.net/pokemon/898-Shadow-Rider/counters',
    'https://db.pokemongohub.net/pokemon/calyrex-shadow-rider/counters'
  ]
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

async function scrapeUrl(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 3000));

    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.includes('Verificer') || bodyText.includes('Cloudflare')) {
      console.log('  Waiting for Cloudflare...');
      await new Promise(r => setTimeout(r, 8000));
    }

    const data = await page.evaluate(() => {
      const counters = [];
      const table = document.querySelector('table');
      if (!table) return null;

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

      if (counters.length === 0) return null;

      const top3 = counters.slice(0, 3);
      const avgTTW = Math.round(top3.reduce((sum, c) => sum + c.ttw, 0) / top3.length);
      return { counters, avgTTW };
    });

    return data;
  } catch (e) {
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

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });

  const insertCounter = db.prepare(`
    INSERT INTO counters (pokemon_id, counter_name, counter_moveset, dps, ttw, rank)
    VALUES (@pokemon_id, @counter_name, @counter_moveset, @dps, @ttw, @rank)
  `);

  const updatePokemon = db.prepare(`
    UPDATE pokemon SET min_players_duo = @players, estimated_ttw = @ttw WHERE id = @id
  `);

  let found = 0;
  const notFound = [];

  for (const p of missingPokemon) {
    const urls = pokemonUrls[p.name];
    if (!urls) {
      console.log(`No URL mapping for ${p.name}`);
      notFound.push(p.name);
      continue;
    }

    console.log(`\n=== ${p.name} ===`);
    let data = null;

    for (const url of urls) {
      console.log(`  Trying: ${url}`);
      data = await scrapeUrl(page, url);
      if (data && data.counters.length > 0) {
        console.log(`  SUCCESS! Found ${data.counters.length} counters`);
        break;
      }
    }

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
        console.log(`  -> ${playersNeeded} players (TTW: ${data.avgTTW}s)`);
      }
      found++;
    } else {
      console.log(`  FAILED - no data found`);
      notFound.push(p.name);
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  await browser.close();
  console.log(`\n\n========== DONE ==========`);
  console.log(`Found counters for ${found} Pokemon`);
  if (notFound.length > 0) {
    console.log(`\nStill missing (${notFound.length}):`);
    notFound.forEach(n => console.log(`  - ${n}`));
  }
  db.close();
}

main().catch(console.error);
