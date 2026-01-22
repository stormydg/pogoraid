const Database = require('better-sqlite3');
const db = new Database('pokemon.db');

// Liste af normale former til at tilføje (kun dem der ikke allerede er der)
const normalForms = [
  // Alakazam - Gen 1
  { name: 'Alakazam', pokedex: 65, types: 'Psychic', attack: 271, defense: 182, hp: 146, category: 'Normal' },

  // Beedrill - Gen 1
  { name: 'Beedrill', pokedex: 15, types: 'Bug/Poison', attack: 169, defense: 130, hp: 163, category: 'Normal' },

  // Blaziken - Gen 3
  { name: 'Blaziken', pokedex: 257, types: 'Fire/Fighting', attack: 240, defense: 141, hp: 190, category: 'Normal' },

  // Charizard - Gen 1
  { name: 'Charizard', pokedex: 6, types: 'Fire/Flying', attack: 223, defense: 173, hp: 186, category: 'Normal' },

  // Garchomp - Gen 4
  { name: 'Garchomp', pokedex: 445, types: 'Dragon/Ground', attack: 261, defense: 193, hp: 239, category: 'Normal' },

  // Gardevoir - Gen 3
  { name: 'Gardevoir', pokedex: 282, types: 'Psychic/Fairy', attack: 237, defense: 195, hp: 169, category: 'Normal' },

  // Gengar - Gen 1
  { name: 'Gengar', pokedex: 94, types: 'Ghost/Poison', attack: 261, defense: 149, hp: 155, category: 'Normal' },

  // Heracross - Gen 2
  { name: 'Heracross', pokedex: 214, types: 'Bug/Fighting', attack: 234, defense: 179, hp: 190, category: 'Normal' },

  // Lucario - Gen 4
  { name: 'Lucario', pokedex: 448, types: 'Fighting/Steel', attack: 236, defense: 144, hp: 172, category: 'Normal' },

  // Rayquaza - Gen 3 (Legendary - tjek om den findes)
  // Skip - allerede legendary

  // Sceptile - Gen 3
  { name: 'Sceptile', pokedex: 254, types: 'Grass', attack: 223, defense: 169, hp: 172, category: 'Normal' },

  // Scizor - Gen 2
  { name: 'Scizor', pokedex: 212, types: 'Bug/Steel', attack: 236, defense: 181, hp: 172, category: 'Normal' },

  // Swampert - Gen 3
  { name: 'Swampert', pokedex: 260, types: 'Water/Ground', attack: 208, defense: 175, hp: 225, category: 'Normal' },

  // Tyranitar - Gen 2
  { name: 'Tyranitar', pokedex: 248, types: 'Rock/Dark', attack: 251, defense: 207, hp: 225, category: 'Normal' }
];

console.log('Tilføjer normale former af Mega Pokémon...\n');

normalForms.forEach(pokemon => {
  // Tjek om Pokémon allerede findes
  const existing = db.prepare('SELECT id FROM pokemon WHERE name = ?').get(pokemon.name);

  if (existing) {
    console.log(`⏭️  ${pokemon.name} findes allerede (ID: ${existing.id})`);
    return;
  }

  // Indsæt Pokémon
  const result = db.prepare(`
    INSERT INTO pokemon (name, pokedex_number, types, category, shiny_released, attack, defense, hp,
                         best_moveset, weaknesses, resistances, raid_soloable, min_players_duo,
                         min_players_trio, estimated_ttw)
    VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0)
  `).run(
    pokemon.name,
    pokemon.pokedex,
    pokemon.types,
    pokemon.category,
    pokemon.attack,
    pokemon.defense,
    pokemon.hp,
    'Varies', // best_moveset
    'Varies', // weaknesses
    'Varies'  // resistances
  );

  const pokemonId = result.lastInsertRowid;
  console.log(`✅ Tilføjet ${pokemon.name} (ID: ${pokemonId})`);

  // Tilføj CP værdier for vigtige levels
  const levels = [20, 25, 30, 35, 40, 45, 50];
  levels.forEach(level => {
    const cpm = getCPM(level);
    const cp = Math.max(10, Math.floor(
      (pokemon.attack * Math.sqrt(pokemon.defense) * Math.sqrt(pokemon.hp) * cpm * cpm) / 10
    ));

    db.prepare('INSERT INTO cp_values (pokemon_id, level, cp) VALUES (?, ?, ?)').run(pokemonId, level, cp);
  });

  console.log(`   → CP værdier tilføjet for levels ${levels.join(', ')}`);
});

console.log('\n✨ Færdig!');

// CP Multiplier funktion
function getCPM(level) {
  const cpmValues = {
    20: 0.59740001, 25: 0.667934, 30: 0.7317, 35: 0.76156384,
    40: 0.79030001, 45: 0.81530001, 50: 0.84030001
  };
  return cpmValues[level] || 0.5;
}
