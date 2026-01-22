const Database = require('better-sqlite3');
const db = new Database('pokemon.db');

// Nye meta-relevante Pokemon at tilføje
const newPokemon = [
  // Rampardos - #409 - Rock
  { name: 'Rampardos', pokedex: 409, types: 'Rock', attack: 295, defense: 109, hp: 219,
    weaknesses: 'Water:1.6,Grass:1.6,Fighting:1.6,Ground:1.6,Steel:1.6', category: 'Normal', shiny: 1 },

  // Darmanitan - #555 - Fire
  { name: 'Darmanitan', pokedex: 555, types: 'Fire', attack: 263, defense: 114, hp: 233,
    weaknesses: 'Water:1.6,Ground:1.6,Rock:1.6', category: 'Normal', shiny: 1 },

  // Salamence - #373 - Dragon/Flying
  { name: 'Salamence', pokedex: 373, types: 'Dragon,Flying', attack: 277, defense: 168, hp: 216,
    weaknesses: 'Ice:2.56,Rock:1.6,Dragon:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Dragonite - #149 - Dragon/Flying
  { name: 'Dragonite', pokedex: 149, types: 'Dragon,Flying', attack: 263, defense: 198, hp: 209,
    weaknesses: 'Ice:2.56,Rock:1.6,Dragon:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Garchomp - #445 - Dragon/Ground
  { name: 'Garchomp', pokedex: 445, types: 'Dragon,Ground', attack: 261, defense: 193, hp: 239,
    weaknesses: 'Ice:2.56,Dragon:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Electivire - #466 - Electric
  { name: 'Electivire', pokedex: 466, types: 'Electric', attack: 249, defense: 163, hp: 181,
    weaknesses: 'Ground:1.6', category: 'Normal', shiny: 1 },

  // Magnezone - #462 - Electric/Steel
  { name: 'Magnezone', pokedex: 462, types: 'Electric,Steel', attack: 238, defense: 205, hp: 172,
    weaknesses: 'Ground:2.56,Fire:1.6,Fighting:1.6', category: 'Normal', shiny: 1 },

  // Roserade - #407 - Grass/Poison
  { name: 'Roserade', pokedex: 407, types: 'Grass,Poison', attack: 243, defense: 185, hp: 155,
    weaknesses: 'Fire:1.6,Ice:1.6,Flying:1.6,Psychic:1.6', category: 'Normal', shiny: 1 },

  // Weavile - #461 - Dark/Ice
  { name: 'Weavile', pokedex: 461, types: 'Dark,Ice', attack: 243, defense: 171, hp: 172,
    weaknesses: 'Fighting:2.56,Fire:1.6,Bug:1.6,Rock:1.6,Steel:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Gengar - #94 - Ghost/Poison
  { name: 'Gengar', pokedex: 94, types: 'Ghost,Poison', attack: 261, defense: 149, hp: 155,
    weaknesses: 'Ground:1.6,Ghost:1.6,Psychic:1.6,Dark:1.6', category: 'Normal', shiny: 1 },

  // Espeon - #196 - Psychic
  { name: 'Espeon', pokedex: 196, types: 'Psychic', attack: 261, defense: 175, hp: 163,
    weaknesses: 'Bug:1.6,Ghost:1.6,Dark:1.6', category: 'Normal', shiny: 1 },

  // Conkeldurr - #534 - Fighting
  { name: 'Conkeldurr', pokedex: 534, types: 'Fighting', attack: 243, defense: 158, hp: 233,
    weaknesses: 'Flying:1.6,Psychic:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Breloom - #286 - Grass/Fighting
  { name: 'Breloom', pokedex: 286, types: 'Grass,Fighting', attack: 241, defense: 144, hp: 155,
    weaknesses: 'Flying:2.56,Fire:1.6,Ice:1.6,Poison:1.6,Psychic:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Aggron - #306 - Steel/Rock
  { name: 'Aggron', pokedex: 306, types: 'Steel,Rock', attack: 198, defense: 257, hp: 172,
    weaknesses: 'Fighting:2.56,Ground:2.56,Water:1.6', category: 'Normal', shiny: 1 },

  // Slaking - #289 - Normal
  { name: 'Slaking', pokedex: 289, types: 'Normal', attack: 290, defense: 166, hp: 284,
    weaknesses: 'Fighting:1.6', category: 'Normal', shiny: 1 },

  // Togekiss - #468 - Fairy/Flying
  { name: 'Togekiss', pokedex: 468, types: 'Fairy,Flying', attack: 225, defense: 217, hp: 198,
    weaknesses: 'Electric:1.6,Ice:1.6,Poison:1.6,Rock:1.6,Steel:1.6', category: 'Normal', shiny: 1 },
];

const insertPokemon = db.prepare(`
  INSERT OR IGNORE INTO pokemon (name, pokedex_number, types, attack, defense, hp, weaknesses, category, shiny_released)
  VALUES (@name, @pokedex, @types, @attack, @defense, @hp, @weaknesses, @category, @shiny)
`);

console.log('Tilføjer nye Pokemon...\n');

let added = 0;
newPokemon.forEach(p => {
  const result = insertPokemon.run(p);
  if (result.changes > 0) {
    console.log(`+ ${p.name} (${p.types})`);
    added++;
  } else {
    console.log(`  ${p.name} findes allerede`);
  }
});

console.log(`\nTilføjet ${added} nye Pokemon`);

// Vis total
const total = db.prepare('SELECT COUNT(*) as count FROM pokemon').get();
console.log(`Total Pokemon i databasen: ${total.count}`);

db.close();
