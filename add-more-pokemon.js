const Database = require('better-sqlite3');
const db = new Database('pokemon.db');

// Flere meta-relevante Pokemon at tilføje
const newPokemon = [
  // Aggron - #306 - Steel/Rock
  { name: 'Aggron', pokedex: 306, types: 'Steel,Rock', attack: 198, defense: 257, hp: 172,
    weaknesses: 'Fighting:2.56,Ground:2.56,Water:1.6', category: 'Normal', shiny: 1 },

  // Slaking - #289 - Normal (højeste non-legendary CP)
  { name: 'Slaking', pokedex: 289, types: 'Normal', attack: 290, defense: 166, hp: 284,
    weaknesses: 'Fighting:1.6', category: 'Normal', shiny: 1 },

  // Kingler - #99 - Water (høj DPS)
  { name: 'Kingler', pokedex: 99, types: 'Water', attack: 240, defense: 181, hp: 146,
    weaknesses: 'Electric:1.6,Grass:1.6', category: 'Normal', shiny: 1 },

  // Staraptor - #398 - Normal/Flying
  { name: 'Staraptor', pokedex: 398, types: 'Normal,Flying', attack: 234, defense: 140, hp: 198,
    weaknesses: 'Electric:1.6,Ice:1.6,Rock:1.6', category: 'Normal', shiny: 1 },

  // Luxray - #405 - Electric
  { name: 'Luxray', pokedex: 405, types: 'Electric', attack: 232, defense: 156, hp: 190,
    weaknesses: 'Ground:1.6', category: 'Normal', shiny: 1 },

  // Flareon - #136 - Fire
  { name: 'Flareon', pokedex: 136, types: 'Fire', attack: 246, defense: 179, hp: 163,
    weaknesses: 'Water:1.6,Ground:1.6,Rock:1.6', category: 'Normal', shiny: 1 },

  // Jolteon - #135 - Electric
  { name: 'Jolteon', pokedex: 135, types: 'Electric', attack: 232, defense: 182, hp: 163,
    weaknesses: 'Ground:1.6', category: 'Normal', shiny: 1 },

  // Vaporeon - #134 - Water
  { name: 'Vaporeon', pokedex: 134, types: 'Water', attack: 205, defense: 161, hp: 277,
    weaknesses: 'Electric:1.6,Grass:1.6', category: 'Normal', shiny: 1 },

  // Umbreon - #197 - Dark (PvP meta)
  { name: 'Umbreon', pokedex: 197, types: 'Dark', attack: 126, defense: 240, hp: 216,
    weaknesses: 'Fighting:1.6,Bug:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Sylveon - #700 - Fairy
  { name: 'Sylveon', pokedex: 700, types: 'Fairy', attack: 203, defense: 205, hp: 216,
    weaknesses: 'Poison:1.6,Steel:1.6', category: 'Normal', shiny: 1 },

  // Arcanine - #59 - Fire
  { name: 'Arcanine', pokedex: 59, types: 'Fire', attack: 227, defense: 166, hp: 207,
    weaknesses: 'Water:1.6,Ground:1.6,Rock:1.6', category: 'Normal', shiny: 1 },

  // Golem - #76 - Rock/Ground
  { name: 'Golem', pokedex: 76, types: 'Rock,Ground', attack: 211, defense: 198, hp: 190,
    weaknesses: 'Water:2.56,Grass:2.56,Ice:1.6,Fighting:1.6,Ground:1.6,Steel:1.6', category: 'Normal', shiny: 1 },

  // Hariyama - #297 - Fighting
  { name: 'Hariyama', pokedex: 297, types: 'Fighting', attack: 209, defense: 114, hp: 302,
    weaknesses: 'Flying:1.6,Psychic:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Swampert - #260 - Water/Ground
  { name: 'Swampert', pokedex: 260, types: 'Water,Ground', attack: 208, defense: 175, hp: 225,
    weaknesses: 'Grass:2.56', category: 'Normal', shiny: 1 },

  // Sceptile - #254 - Grass
  { name: 'Sceptile', pokedex: 254, types: 'Grass', attack: 223, defense: 169, hp: 172,
    weaknesses: 'Fire:1.6,Ice:1.6,Poison:1.6,Flying:1.6,Bug:1.6', category: 'Normal', shiny: 1 },

  // Infernape - #392 - Fire/Fighting
  { name: 'Infernape', pokedex: 392, types: 'Fire,Fighting', attack: 222, defense: 151, hp: 183,
    weaknesses: 'Water:1.6,Ground:1.6,Flying:1.6,Psychic:1.6', category: 'Normal', shiny: 1 },

  // Empoleon - #395 - Water/Steel
  { name: 'Empoleon', pokedex: 395, types: 'Water,Steel', attack: 210, defense: 186, hp: 197,
    weaknesses: 'Electric:1.6,Fighting:1.6,Ground:1.6', category: 'Normal', shiny: 1 },

  // Torterra - #389 - Grass/Ground
  { name: 'Torterra', pokedex: 389, types: 'Grass,Ground', attack: 202, defense: 188, hp: 216,
    weaknesses: 'Ice:2.56,Fire:1.6,Flying:1.6,Bug:1.6', category: 'Normal', shiny: 1 },

  // Flygon - #330 - Ground/Dragon
  { name: 'Flygon', pokedex: 330, types: 'Ground,Dragon', attack: 205, defense: 168, hp: 190,
    weaknesses: 'Ice:2.56,Dragon:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Milotic - #350 - Water
  { name: 'Milotic', pokedex: 350, types: 'Water', attack: 192, defense: 219, hp: 216,
    weaknesses: 'Electric:1.6,Grass:1.6', category: 'Normal', shiny: 1 },
];

const insertPokemon = db.prepare(
  "INSERT OR IGNORE INTO pokemon (name, pokedex_number, types, attack, defense, hp, weaknesses, category, shiny_released) VALUES (@name, @pokedex, @types, @attack, @defense, @hp, @weaknesses, @category, @shiny)"
);

console.log('Tilføjer nye Pokemon...\n');

let added = 0;
newPokemon.forEach(p => {
  const result = insertPokemon.run(p);
  if (result.changes > 0) {
    console.log("+ " + p.name + " (#" + p.pokedex + ") - " + p.types);
    added++;
  } else {
    console.log("  " + p.name + " findes allerede");
  }
});

console.log("\nTilføjet " + added + " nye Pokemon");

const total = db.prepare('SELECT COUNT(*) as count FROM pokemon').get();
console.log("Total Pokemon i databasen: " + total.count);

db.close();
