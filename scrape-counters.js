const puppeteer = require('puppeteer');
const Database = require('better-sqlite3');

const db = new Database('pokemon.db');

// Mapping fra vores database navne til PokemonGOHub URL format
function getUrlSlug(name, pokedexNumber, category) {
  let slug = pokedexNumber.toString();

  // Håndter special forms
  if (category === 'Mega') {
    slug += '-Mega';
    // Special cases for Mega Charizard
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

async function scrapeCounters(browser, pokemonId, name, pokedexNumber, category) {
  const slug = getUrlSlug(name, pokedexNumber, category);
  const url = `https://db.pokemongohub.net/pokemon/${slug}/counters`;

  console.log(`\n[${pokemonId}] Scraping ${name} -> ${url}`);

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

    // Vent på Cloudflare
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Tjek for Cloudflare
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.includes('Verificer') || bodyText.includes('Cloudflare') || bodyText.includes('Just a moment')) {
      console.log(`  Waiting for Cloudflare...`);
      await new Promise(resolve => setTimeout(resolve, 8000));
    }

    // Hent counter data
    const counters = await page.evaluate(() => {
      const results = [];
      const table = document.querySelector('table');
      if (!table) return results;

      const rows = table.querySelectorAll('tr');
      rows.forEach((row, index) => {
        if (index === 0) return; // Skip header
        if (index > 5) return; // Only top 5

        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
          const name = cells[1]?.innerText?.trim();
          const fastMove = cells[2]?.innerText?.trim().replace(' *', '');
          const chargedMove = cells[3]?.innerText?.trim().replace(' *', '');
          const dps = cells[4]?.innerText?.trim();

          if (name && fastMove && chargedMove) {
            results.push({
              name: name,
              moveset: `${fastMove} / ${chargedMove}`,
              dps: parseFloat(dps) || 0
            });
          }
        }
      });

      return results;
    });

    await page.close();

    if (counters.length > 0) {
      console.log(`  Found ${counters.length} counters: ${counters.map(c => c.name).join(', ')}`);
      return counters;
    } else {
      console.log(`  No counters found`);
      return null;
    }

  } catch (error) {
    console.log(`  Error: ${error.message}`);
    await page.close();
    return null;
  }
}

async function main() {
  // Opret counters tabel hvis den ikke findes
  db.exec(`
    CREATE TABLE IF NOT EXISTS counters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pokemon_id INTEGER NOT NULL,
      counter_name TEXT NOT NULL,
      counter_moveset TEXT NOT NULL,
      dps REAL DEFAULT 0,
      rank INTEGER DEFAULT 0,
      FOREIGN KEY (pokemon_id) REFERENCES pokemon(id)
    )
  `);

  // Slet eksisterende counters
  db.exec('DELETE FROM counters');

  // Hent alle Pokemon
  const pokemon = db.prepare(`
    SELECT id, name, pokedex_number, category
    FROM pokemon
    ORDER BY pokedex_number
  `).all();

  console.log(`Found ${pokemon.length} Pokemon to scrape\n`);

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const insertCounter = db.prepare(`
    INSERT INTO counters (pokemon_id, counter_name, counter_moveset, dps, rank)
    VALUES (@pokemon_id, @counter_name, @counter_moveset, @dps, @rank)
  `);

  let successCount = 0;
  let failCount = 0;

  for (const p of pokemon) {
    const counters = await scrapeCounters(browser, p.id, p.name, p.pokedex_number, p.category);

    if (counters && counters.length > 0) {
      counters.forEach((counter, index) => {
        insertCounter.run({
          pokemon_id: p.id,
          counter_name: counter.name,
          counter_moveset: counter.moveset,
          dps: counter.dps,
          rank: index + 1
        });
      });
      successCount++;
    } else {
      failCount++;
    }

    // Lille pause mellem requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await browser.close();

  console.log(`\n\n========== DONE ==========`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  // Vis nogle eksempler
  console.log('\n--- Sample counters ---');
  const samples = db.prepare(`
    SELECT p.name as pokemon_name, c.counter_name, c.counter_moveset, c.dps
    FROM counters c
    JOIN pokemon p ON c.pokemon_id = p.id
    WHERE c.rank = 1
    LIMIT 10
  `).all();

  samples.forEach(s => {
    console.log(`${s.pokemon_name}: #1 ${s.counter_name} (${s.counter_moveset}) - DPS: ${s.dps}`);
  });

  db.close();
}

main().catch(console.error);
