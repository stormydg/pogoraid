const Database = require('better-sqlite3');
const db = new Database('pokemon.db');

// Beregn antal spillere baseret på gennemsnitlig TTW fra top 5 counters
// TTW = Time To Win (sekunder for 1 spiller med perfekte counters)
// Raid timer er 300 sekunder (5 minutter) for de fleste raids

function calculatePlayersNeeded(avgTTW) {
  if (!avgTTW || avgTTW <= 0) return null;

  // avgTTW er tiden for 1 person - divider med raid timer for at få antal spillere
  // Men vi skal også tage højde for at ikke alle har perfekte counters
  // Så vi ganger med 1.3 for at give et mere realistisk estimat

  const raidTimer = 300; // 5 minutter
  const realWorldMultiplier = 1.2; // Folk har ikke altid perfekte level 40 counters
  const effectiveTTW = avgTTW * realWorldMultiplier;
  const playersNeeded = effectiveTTW / raidTimer;

  // Afrund op til nærmeste hele tal eller interval
  if (playersNeeded <= 1.0) return '1 (solo)';
  if (playersNeeded <= 1.5) return '1-2';
  if (playersNeeded <= 2.0) return '2';
  if (playersNeeded <= 2.5) return '2-3';
  if (playersNeeded <= 3.0) return '3';
  if (playersNeeded <= 3.5) return '3-4';
  if (playersNeeded <= 4.0) return '4';
  if (playersNeeded <= 4.5) return '4-5';
  if (playersNeeded <= 5.0) return '5';
  if (playersNeeded <= 6.0) return '5-6';
  if (playersNeeded <= 7.0) return '6-7';
  if (playersNeeded <= 8.0) return '7-8';
  return '8+';
}

// Hent alle Pokémon med counters
const pokemonWithCounters = db.prepare(`
  SELECT p.id, p.name, p.category,
    (SELECT AVG(c.ttw) FROM counters c WHERE c.pokemon_id = p.id AND c.rank <= 5) as avg_ttw,
    (SELECT COUNT(*) FROM counters c WHERE c.pokemon_id = p.id) as counter_count
  FROM pokemon p
  WHERE EXISTS (SELECT 1 FROM counters c WHERE c.pokemon_id = p.id)
  ORDER BY p.pokedex_number
`).all();

console.log(`Genberegner player estimates for ${pokemonWithCounters.length} Pokémon...\n`);

const updateStmt = db.prepare(`
  UPDATE pokemon
  SET min_players_duo = @players, estimated_ttw = @ttw
  WHERE id = @id
`);

let updated = 0;
let skipped = 0;

pokemonWithCounters.forEach(p => {
  if (!p.avg_ttw || p.avg_ttw <= 0) {
    console.log(`  ${p.name}: Ingen TTW data (${p.counter_count} counters)`);
    skipped++;
    return;
  }

  const avgTTW = Math.round(p.avg_ttw);
  const players = calculatePlayersNeeded(avgTTW);

  updateStmt.run({
    id: p.id,
    players: players,
    ttw: avgTTW
  });

  console.log(`${p.name}: TTW ${avgTTW}s → ${players} spillere`);
  updated++;
});

console.log(`\n========== RESULTAT ==========`);
console.log(`Opdateret: ${updated}`);
console.log(`Sprunget over: ${skipped}`);

// Vis nogle eksempler på fordelingen
console.log(`\n========== FORDELING ==========`);
const distribution = db.prepare(`
  SELECT min_players_duo as players, COUNT(*) as count
  FROM pokemon
  WHERE min_players_duo IS NOT NULL
  GROUP BY min_players_duo
  ORDER BY
    CASE
      WHEN min_players_duo = '1 (solo)' THEN 1
      WHEN min_players_duo = '1-2' THEN 2
      WHEN min_players_duo = '2' THEN 3
      WHEN min_players_duo = '2-3' THEN 4
      WHEN min_players_duo = '3' THEN 5
      WHEN min_players_duo = '3-4' THEN 6
      WHEN min_players_duo = '4' THEN 7
      WHEN min_players_duo = '4-5' THEN 8
      WHEN min_players_duo = '5' THEN 9
      WHEN min_players_duo = '5-6' THEN 10
      ELSE 99
    END
`).all();

distribution.forEach(d => {
  console.log(`${d.players}: ${d.count} Pokémon`);
});

db.close();
