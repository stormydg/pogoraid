const puppeteer = require('puppeteer');
const Database = require('better-sqlite3');

const db = new Database('pokemon.db');

// Mapping fra vores database navne til PokemonGOHub URL format
function getUrlSlug(name, pokedexNumber, category) {
  let slug = pokedexNumber.toString();

  if (category === 'Mega') {
    slug += '-Mega';
    if (name === 'Mega Charizard X') {
      slug = pokedexNumber + '-Mega-X';
    } else if (name === 'Mega Charizard Y') {
      slug = pokedexNumber + '-Mega-Y';
    }
  } else if (category === 'Primal') {
    slug += '-Primal';
  } else if (category === 'Shadow') {
    slug += '-Shadow';
  } else if (name.includes('Origin')) {
    slug += '-Origin';
  } else if (name.includes('Altered')) {
    slug += '-Altered';
  } else if (name.includes('Therian')) {
    slug += '-Therian';
  } else if (name.includes('Incarnate')) {
    slug += '-Incarnate';
  } else if (name.includes('Attack') && name.includes('Deoxys')) {
    slug += '-Attack';
  } else if (name.includes('Defense') && name.includes('Deoxys')) {
    slug += '-Defense';
  } else if (name.includes('Speed') && name.includes('Deoxys')) {
    slug += '-Speed';
  } else if (name.includes('Aria')) {
    slug += '-Aria';
  } else if (name.includes('Pirouette')) {
    slug += '-Pirouette';
  } else if (name.includes('Confined')) {
    slug += '-Confined';
  } else if (name.includes('Unbound')) {
    slug += '-Unbound';
  } else if (name.includes('50%')) {
    slug += '-50';
  } else if (name.includes('10%')) {
    slug += '-10';
  } else if (name.includes('Complete')) {
    slug += '-Complete';
  } else if (name.includes('Dawn Wings')) {
    slug += '-Dawn-Wings';
  } else if (name.includes('Dusk Mane')) {
    slug += '-Dusk-Mane';
  } else if (name.includes('Hero') && !name.includes('Crowned')) {
    slug += '-Hero';
  } else if (name.includes('Crowned Sword')) {
    slug += '-Crowned-Sword';
  } else if (name.includes('Crowned Shield')) {
    slug += '-Crowned-Shield';
  } else if (name.includes('Single Strike')) {
    slug += '-Single-Strike';
  } else if (name.includes('Rapid Strike')) {
    slug += '-Rapid-Strike';
  } else if (name.includes('Ice Rider')) {
    slug += '-Ice-Rider';
  } else if (name.includes('Shadow Rider')) {
    slug += '-Shadow-Rider';
  } else if (name.includes('White Kyurem')) {
    slug = pokedexNumber + '-White';
  } else if (name.includes('Black Kyurem')) {
    slug = pokedexNumber + '-Black';
  } else if (name.includes('Land') && name.includes('Shaymin')) {
    slug += '-Land';
  } else if (name.includes('Sky') && name.includes('Shaymin')) {
    slug += '-Sky';
  } else if (name.includes('Resolute')) {
    slug += '-Resolute';
  } else if (name.includes('Galarian')) {
    slug += '-Galarian';
  } else if (name.includes('Alolan')) {
    slug += '-Alolan';
  } else if (name.includes('Hisuian')) {
    slug += '-Hisuian';
  } else if (name.includes('Armored')) {
    slug += '-Armored';
  }

  return slug;
}

// Beregn antal spillere baseret på TTW
function calculatePlayersNeeded(ttwSeconds, raidTimer = 300) {
  if (!ttwSeconds || ttwSeconds <= 0) return null;

  const exactPlayers = ttwSeconds / raidTimer;

  if (exactPlayers <= 1.0) {
    return '1 (solo mulig)';
  } else if (exactPlayers <= 1.3) {
    return '1-2';
  } else if (exactPlayers <= 2.0) {
    return '2';
  } else if (exactPlayers <= 2.5) {
    return '2-3';
  } else if (exactPlayers <= 3.0) {
    return '3';
  } else if (exactPlayers <= 3.5) {
    return '3-4';
  } else if (exactPlayers <= 4.0) {
    return '4';
  } else if (exactPlayers <= 5.0) {
    return '4-5';
  } else if (exactPlayers <= 6.0) {
    return '5-6';
  } else {
    return '6+';
  }
}

async function scrapeData(browser, pokemonId, name, pokedexNumber, category) {
  const slug = getUrlSlug(name, pokedexNumber, category);
  const url = `https://db.pokemongohub.net/pokemon/${slug}/counters`;

  console.log(`\n[${pokemonId}] ${name} -> ${url}`);

  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.includes('Verificer') || bodyText.includes('Cloudflare') || bodyText.includes('Just a moment')) {
      console.log(`  Cloudflare...`);
      await new Promise(resolve => setTimeout(resolve, 8000));
    }

    // Hent counter data med TTW
    const data = await page.evaluate(() => {
      const counters = [];
      const table = document.querySelector('table');
      if (!table) return { counters: [], avgTTW: 0 };

      const rows = table.querySelectorAll('tr');
      rows.forEach((row, index) => {
        if (index === 0) return; // Skip header
        if (index > 5) return; // Top 5

        const cells = row.querySelectorAll('td');
        if (cells.length >= 8) {
          const name = cells[1]?.innerText?.trim();
          const fastMove = cells[2]?.innerText?.trim().replace(' *', '');
          const chargedMove = cells[3]?.innerText?.trim().replace(' *', '');
          const dps = parseFloat(cells[4]?.innerText?.trim()) || 0;
          const ttwText = cells[7]?.innerText?.trim(); // TTW is column 7

          // Parse TTW
          let ttw = 0;
          if (ttwText) {
            if (ttwText.includes('m')) {
              const match = ttwText.match(/(\d+)m\s*(\d+)?s?/);
              if (match) {
                ttw = parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
              }
            } else {
              const match = ttwText.match(/(\d+)s/);
              if (match) {
                ttw = parseInt(match[1]);
              }
            }
          }

          if (name && fastMove && chargedMove) {
            counters.push({
              name,
              moveset: `${fastMove} / ${chargedMove}`,
              dps,
              ttw
            });
          }
        }
      });

      // Gennemsnitlig TTW af top 3
      const top3 = counters.slice(0, 3);
      const avgTTW = top3.length > 0
        ? Math.round(top3.reduce((sum, c) => sum + c.ttw, 0) / top3.length)
        : 0;

      return { counters, avgTTW };
    });

    await page.close();

    if (data.counters.length > 0) {
      const ttwInfo = data.counters.slice(0, 3).map(c => `${c.ttw}s`).join(', ');
      console.log(`  ${data.counters.length} counters, TTW: ${ttwInfo}, avg: ${data.avgTTW}s`);
      return data;
    } else {
      console.log(`  No data found`);
      return null;
    }

  } catch (error) {
    console.log(`  Error: ${error.message}`);
    await page.close();
    return null;
  }
}

async function main() {
  // Drop og genskab counters tabel
  db.exec('DROP TABLE IF EXISTS counters');
  db.exec(`
    CREATE TABLE counters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pokemon_id INTEGER NOT NULL,
      counter_name TEXT NOT NULL,
      counter_moveset TEXT NOT NULL,
      dps REAL DEFAULT 0,
      ttw INTEGER DEFAULT 0,
      rank INTEGER DEFAULT 0,
      FOREIGN KEY (pokemon_id) REFERENCES pokemon(id)
    )
  `);

  const pokemon = db.prepare(`
    SELECT id, name, pokedex_number, category
    FROM pokemon
    ORDER BY pokedex_number
  `).all();

  console.log(`Scraping ${pokemon.length} Pokemon...\n`);

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const insertCounter = db.prepare(`
    INSERT INTO counters (pokemon_id, counter_name, counter_moveset, dps, ttw, rank)
    VALUES (@pokemon_id, @counter_name, @counter_moveset, @dps, @ttw, @rank)
  `);

  const updatePokemon = db.prepare(`
    UPDATE pokemon
    SET min_players_duo = @players, estimated_ttw = @ttw
    WHERE id = @id
  `);

  let successCount = 0;
  let failCount = 0;

  for (const p of pokemon) {
    const data = await scrapeData(browser, p.id, p.name, p.pokedex_number, p.category);

    if (data && data.counters.length > 0) {
      // Gem counters
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

      // Beregn og gem spillerantal
      if (data.avgTTW > 0) {
        const playersNeeded = calculatePlayersNeeded(data.avgTTW);
        updatePokemon.run({
          id: p.id,
          players: playersNeeded,
          ttw: data.avgTTW
        });
        console.log(`  -> ${playersNeeded} players (TTW: ${data.avgTTW}s)`);
      }

      successCount++;
    } else {
      failCount++;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await browser.close();

  console.log(`\n\n========== DONE ==========`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  // Vis resultater
  console.log('\n--- Easiest raids (lowest TTW) ---');
  const easiest = db.prepare(`
    SELECT name, estimated_ttw, min_players_duo
    FROM pokemon
    WHERE estimated_ttw > 0
    ORDER BY estimated_ttw
    LIMIT 10
  `).all();
  easiest.forEach(s => console.log(`${s.name}: ${s.estimated_ttw}s -> ${s.min_players_duo}`));

  console.log('\n--- Hardest raids (highest TTW) ---');
  const hardest = db.prepare(`
    SELECT name, estimated_ttw, min_players_duo
    FROM pokemon
    WHERE estimated_ttw > 0
    ORDER BY estimated_ttw DESC
    LIMIT 10
  `).all();
  hardest.forEach(s => console.log(`${s.name}: ${s.estimated_ttw}s -> ${s.min_players_duo}`));

  db.close();
}

main().catch(console.error);
