const Database = require('better-sqlite3');
const db = new Database('pokemon.db');

// CP formel fra Pokemon GO
// CP = Floor(Attack * Defense^0.5 * HP^0.5 * CPMultiplier^2 / 10)
const cpMultipliers = {
  20: 0.5974,
  25: 0.667934,
  30: 0.7317,
  40: 0.7903,
  50: 0.84029999
};

function calculateCP(attack, defense, hp, level) {
  const cpm = cpMultipliers[level];
  // Antager perfekte IVs (15/15/15)
  const totalAttack = attack + 15;
  const totalDefense = defense + 15;
  const totalHP = hp + 15;

  const cp = Math.floor(
    (totalAttack * Math.sqrt(totalDefense) * Math.sqrt(totalHP) * Math.pow(cpm, 2)) / 10
  );

  return Math.max(cp, 10); // Minimum CP er 10
}

// Find alle Pokemon der mangler CP værdier
const missingCP = db.prepare(`
  SELECT p.id, p.name, p.attack, p.defense, p.hp
  FROM pokemon p
  LEFT JOIN cp_values c ON p.id = c.pokemon_id
  WHERE c.id IS NULL
`).all();

console.log(`Fandt ${missingCP.length} Pokémon der mangler CP værdier\n`);

const insertCP = db.prepare(`
  INSERT INTO cp_values (pokemon_id, level, cp)
  VALUES (@pokemon_id, @level, @cp)
`);

const levels = [20, 25, 30, 40, 50];

missingCP.forEach(pokemon => {
  console.log(`${pokemon.name} (ATK: ${pokemon.attack}, DEF: ${pokemon.defense}, HP: ${pokemon.hp})`);

  levels.forEach(level => {
    const cp = calculateCP(pokemon.attack, pokemon.defense, pokemon.hp, level);
    insertCP.run({
      pokemon_id: pokemon.id,
      level: level,
      cp: cp
    });
    process.stdout.write(`  L${level}: ${cp}`);
  });
  console.log();
});

console.log(`\n✅ Tilføjet CP værdier for ${missingCP.length} Pokémon`);

// Verificer
const totalCPValues = db.prepare('SELECT COUNT(*) as count FROM cp_values').get();
const totalPokemon = db.prepare('SELECT COUNT(*) as count FROM pokemon').get();
console.log(`\nTotal CP værdier: ${totalCPValues.count}`);
console.log(`Total Pokémon: ${totalPokemon.count}`);
console.log(`Forventet (${totalPokemon.count} * 5 levels): ${totalPokemon.count * 5}`);

db.close();
