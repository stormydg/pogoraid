const puppeteer = require('puppeteer');
const Database = require('better-sqlite3');

const db = new Database('pokemon.db');

// Mapping fra vores database navne til PokemonGOHub URL format
function getUrlSlug(name, pokedexNumber, category) {
  let slug = pokedexNumber.toString();

  // Håndter special forms
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
// Raid timer: 5* raids = 300 sekunder, Mega raids = 300 sekunder
function calculatePlayersNeeded(ttwSeconds, raidTimer = 300) {
  if (!ttwSeconds || ttwSeconds <= 0) return null;

  // Antal spillere = TTW / raid timer, rundet op
  // Vi tilføjer lidt buffer fordi ikke alle har perfekte counters
  const exactPlayers = ttwSeconds / raidTimer;

  // Returner et estimat med buffer
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

async function scrapeTTW(browser, pokemonId, name, pokedexNumber, category) {
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

    // Hent TTW data fra de 3 bedste counters
    const data = await page.evaluate(() => {
      const results = [];
      const table = document.querySelector('table');
      if (!table) return { counters: [], avgTTW: 0 };

      const rows = table.querySelectorAll('tr');
      rows.forEach((row, index) => {
        if (index === 0) return; // Skip header
        if (index > 3) return; // Only top 3

        const cells = row.querySelectorAll('td');
        if (cells.length >= 7) {
          const name = cells[1]?.innerText?.trim();
          const ttwText = cells[6]?.innerText?.trim(); // TTW kolonne

          // Parse TTW (format: "179s" eller "3m 45s")
          let ttwSeconds = 0;
          if (ttwText) {
            if (ttwText.includes('m')) {
              const match = ttwText.match(/(\d+)m\s*(\d+)?s?/);
              if (match) {
                ttwSeconds = parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
              }
            } else {
              const match = ttwText.match(/(\d+)s/);
              if (match) {
                ttwSeconds = parseInt(match[1]);
              }
            }
          }

          if (name && ttwSeconds > 0) {
            results.push({
              name: name,
              ttw: ttwSeconds
            });
          }
        }
      });

      // Beregn gennemsnit af top 3
      const avgTTW = results.length > 0
        ? Math.round(results.reduce((sum, c) => sum + c.ttw, 0) / results.length)
        : 0;

      return { counters: results, avgTTW: avgTTW };
    });

    await page.close();

    if (data.counters.length > 0) {
      console.log(`  Top 3 TTW: ${data.counters.map(c => `${c.name}=${c.ttw}s`).join(', ')}`);
      console.log(`  Average TTW: ${data.avgTTW}s`);
      return data;
    } else {
      console.log(`  No TTW data found`);
      return null;
    }

  } catch (error) {
    console.log(`  Error: ${error.message}`);
    await page.close();
    return null;
  }
}

async function main() {
  // Hent alle Pokemon
  const pokemon = db.prepare(`
    SELECT id, name, pokedex_number, category
    FROM pokemon
    ORDER BY pokedex_number
  `).all();

  console.log(`Found ${pokemon.length} Pokemon to scrape for TTW\n`);

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const updatePlayer = db.prepare(`
    UPDATE pokemon
    SET min_players_duo = @players, estimated_ttw = @ttw
    WHERE id = @id
  `);

  let successCount = 0;
  let failCount = 0;

  for (const p of pokemon) {
    const data = await scrapeTTW(browser, p.id, p.name, p.pokedex_number, p.category);

    if (data && data.avgTTW > 0) {
      const playersNeeded = calculatePlayersNeeded(data.avgTTW);
      console.log(`  -> Players needed: ${playersNeeded}`);

      updatePlayer.run({
        id: p.id,
        players: playersNeeded,
        ttw: data.avgTTW
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
  console.log('\n--- Sample results ---');
  const samples = db.prepare(`
    SELECT name, estimated_ttw, min_players_duo
    FROM pokemon
    WHERE estimated_ttw > 0
    ORDER BY estimated_ttw
    LIMIT 15
  `).all();

  samples.forEach(s => {
    console.log(`${s.name}: TTW=${s.estimated_ttw}s -> ${s.min_players_duo} players`);
  });

  db.close();
}

main().catch(console.error);
