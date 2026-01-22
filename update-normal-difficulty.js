const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'pokemon.db'));

// Opdater normale former med realistiske raid difficulty ratings
// Normal Pokémon er tier 3-4 raids (9000 HP, ikke 15000)

const normalDifficulties = [
  // Meget nemme solos (lav defense)
  { name: 'Beedrill', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 120 },
  { name: 'Gengar', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 140 },

  // Soloable med gode counters (middel defense)
  { name: 'Alakazam', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 160 },
  { name: 'Blaziken', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 150 },
  { name: 'Sceptile', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 155 },
  { name: 'Charizard', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 165 },

  // Tight solos / easy duo (højere defense eller HP)
  { name: 'Heracross', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 180 },
  { name: 'Lucario', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 175 },
  { name: 'Scizor', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 185 },
  { name: 'Gardevoir', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 190 },

  // Meget svært solo / duo mulig (høj defense og HP)
  { name: 'Swampert', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 200 },
  { name: 'Tyranitar', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 210 },
  { name: 'Garchomp', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 205 }
];

console.log('Opdaterer normal Pokémon med raid difficulty...\n');

normalDifficulties.forEach(pokemon => {
  const result = db.prepare(`
    UPDATE pokemon
    SET raid_soloable = ?,
        min_players_duo = ?,
        min_players_trio = ?,
        estimated_ttw = ?
    WHERE name = ?
  `).run(
    pokemon.raid_soloable,
    pokemon.min_players_duo,
    pokemon.min_players_trio,
    pokemon.estimated_ttw,
    pokemon.name
  );

  if (result.changes > 0) {
    const soloable = pokemon.raid_soloable === 1 ? '✅ SOLO' : '👥 DUO';
    console.log(`${soloable} - ${pokemon.name} (${pokemon.estimated_ttw}s TTW)`);
  } else {
    console.log(`❌ Kunne ikke finde: ${pokemon.name}`);
  }
});

console.log('\n✨ Færdig!');
