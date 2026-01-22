// Script til at rette CP værdier baseret på korrekte level 50 værdier
const Database = require('better-sqlite3');
const db = new Database('pokemon.db');

// CP Multiplier værdier fra Pokémon GO
const CPM = {
  20: 0.5974,
  25: 0.667934,
  30: 0.7317,
  40: 0.7903,
  50: 0.84029999
};

console.log('Starter rettelse af CP værdier...\n');

// Hent alle Pokémon med deres level 50 CP
const allPokemon = db.prepare('SELECT id, name FROM pokemon').all();

let totalFixed = 0;

// For hver Pokémon
allPokemon.forEach(pokemon => {
  // Hent level 50 CP (som er korrekt)
  const level50Data = db.prepare('SELECT cp FROM cp_values WHERE pokemon_id = ? AND level = 50').get(pokemon.id);

  if (!level50Data) {
    console.log(`⚠️  ${pokemon.name}: Ingen level 50 CP fundet - springer over`);
    return;
  }

  const level50CP = level50Data.cp;

  // Beregn korrekte CP værdier for de andre levels
  // CP forholdet er: CP_level_X = CP_level_50 × (CPM_X / CPM_50)²
  const calculateCP = (level) => {
    const ratio = CPM[level] / CPM[50];
    return Math.floor(level50CP * ratio * ratio);
  };

  const correctCPs = {
    20: calculateCP(20),
    25: calculateCP(25),
    30: calculateCP(30),
    40: calculateCP(40)
  };

  // Opdater database
  const updateStmt = db.prepare('UPDATE cp_values SET cp = ? WHERE pokemon_id = ? AND level = ?');

  let pokemonFixed = 0;

  [20, 25, 30, 40].forEach(level => {
    const oldCP = db.prepare('SELECT cp FROM cp_values WHERE pokemon_id = ? AND level = ?').get(pokemon.id, level);

    if (oldCP && oldCP.cp !== correctCPs[level]) {
      updateStmt.run(correctCPs[level], pokemon.id, level);
      console.log(`✓ ${pokemon.name} Level ${level}: ${oldCP.cp} → ${correctCPs[level]}`);
      pokemonFixed++;
      totalFixed++;
    }
  });

  if (pokemonFixed === 0) {
    console.log(`✓ ${pokemon.name}: Alle levels var allerede korrekte`);
  }
});

console.log(`\n✅ Færdig! Rettede ${totalFixed} CP værdier i alt.`);

// Luk database
db.close();
