const Database = require('better-sqlite3');
const db = new Database('pokemon.db');

// Flere stærke Pokemon der mangler
const newPokemon = [
  // Tyrantrum - allerede der, men lad os tjekke andre

  // Kommo-o - #784 - Dragon/Fighting
  { name: 'Kommo-o', pokedex: 784, types: 'Dragon,Fighting', attack: 222, defense: 240, hp: 181,
    weaknesses: 'Fairy:2.56,Flying:1.6,Ice:1.6,Dragon:1.6,Psychic:1.6', category: 'Normal', shiny: 1 },

  // Goodra - #706 - Dragon
  { name: 'Goodra', pokedex: 706, types: 'Dragon', attack: 220, defense: 242, hp: 207,
    weaknesses: 'Ice:1.6,Dragon:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Noivern - #715 - Flying/Dragon
  { name: 'Noivern', pokedex: 715, types: 'Flying,Dragon', attack: 205, defense: 175, hp: 198,
    weaknesses: 'Ice:2.56,Rock:1.6,Dragon:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Krookodile - #553 - Ground/Dark
  { name: 'Krookodile', pokedex: 553, types: 'Ground,Dark', attack: 229, defense: 158, hp: 216,
    weaknesses: 'Water:1.6,Grass:1.6,Ice:1.6,Fighting:1.6,Bug:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Bisharp - #625 - Dark/Steel
  { name: 'Bisharp', pokedex: 625, types: 'Dark,Steel', attack: 232, defense: 176, hp: 163,
    weaknesses: 'Fighting:2.56,Fire:1.6,Ground:1.6', category: 'Normal', shiny: 1 },

  // Houndoom - #229 - Dark/Fire
  { name: 'Houndoom', pokedex: 229, types: 'Dark,Fire', attack: 224, defense: 144, hp: 181,
    weaknesses: 'Water:1.6,Fighting:1.6,Ground:1.6,Rock:1.6', category: 'Normal', shiny: 1 },

  // Absol - #359 - Dark
  { name: 'Absol', pokedex: 359, types: 'Dark', attack: 246, defense: 120, hp: 163,
    weaknesses: 'Fighting:1.6,Bug:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Mismagius - #429 - Ghost
  { name: 'Mismagius', pokedex: 429, types: 'Ghost', attack: 211, defense: 187, hp: 155,
    weaknesses: 'Ghost:1.6,Dark:1.6', category: 'Normal', shiny: 1 },

  // Banette - #354 - Ghost
  { name: 'Banette', pokedex: 354, types: 'Ghost', attack: 218, defense: 126, hp: 162,
    weaknesses: 'Ghost:1.6,Dark:1.6', category: 'Normal', shiny: 1 },

  // Drifblim - #426 - Ghost/Flying
  { name: 'Drifblim', pokedex: 426, types: 'Ghost,Flying', attack: 180, defense: 102, hp: 312,
    weaknesses: 'Electric:1.6,Ice:1.6,Rock:1.6,Ghost:1.6,Dark:1.6', category: 'Normal', shiny: 1 },

  // Golurk - #623 - Ground/Ghost
  { name: 'Golurk', pokedex: 623, types: 'Ground,Ghost', attack: 222, defense: 154, hp: 205,
    weaknesses: 'Water:1.6,Grass:1.6,Ice:1.6,Ghost:1.6,Dark:1.6', category: 'Normal', shiny: 1 },

  // Trevenant - #709 - Ghost/Grass
  { name: 'Trevenant', pokedex: 709, types: 'Ghost,Grass', attack: 201, defense: 154, hp: 198,
    weaknesses: 'Fire:1.6,Ice:1.6,Flying:1.6,Ghost:1.6,Dark:1.6', category: 'Normal', shiny: 1 },

  // Chandelure er allerede der

  // Volcarona - #637 - Bug/Fire
  { name: 'Volcarona', pokedex: 637, types: 'Bug,Fire', attack: 264, defense: 189, hp: 198,
    weaknesses: 'Rock:2.56,Water:1.6,Flying:1.6', category: 'Normal', shiny: 1 },

  // Escavalier - #589 - Bug/Steel
  { name: 'Escavalier', pokedex: 589, types: 'Bug,Steel', attack: 223, defense: 187, hp: 172,
    weaknesses: 'Fire:2.56', category: 'Normal', shiny: 1 },

  // Galvantula - #596 - Bug/Electric
  { name: 'Galvantula', pokedex: 596, types: 'Bug,Electric', attack: 201, defense: 128, hp: 172,
    weaknesses: 'Fire:1.6,Rock:1.6', category: 'Normal', shiny: 1 },

  // Yanmega - #469 - Bug/Flying
  { name: 'Yanmega', pokedex: 469, types: 'Bug,Flying', attack: 231, defense: 156, hp: 200,
    weaknesses: 'Rock:2.56,Fire:1.6,Electric:1.6,Ice:1.6,Flying:1.6', category: 'Normal', shiny: 1 },

  // Pinsir - #127 - Bug
  { name: 'Pinsir', pokedex: 127, types: 'Bug', attack: 238, defense: 182, hp: 163,
    weaknesses: 'Fire:1.6,Flying:1.6,Rock:1.6', category: 'Normal', shiny: 1 },

  // Venomoth - #49 - Bug/Poison
  { name: 'Venomoth', pokedex: 49, types: 'Bug,Poison', attack: 179, defense: 143, hp: 172,
    weaknesses: 'Fire:1.6,Flying:1.6,Psychic:1.6,Rock:1.6', category: 'Normal', shiny: 1 },

  // Porygon-Z - #474 - Normal
  { name: 'Porygon-Z', pokedex: 474, types: 'Normal', attack: 264, defense: 150, hp: 198,
    weaknesses: 'Fighting:1.6', category: 'Normal', shiny: 1 },

  // Ursaluna - #901 - Ground/Normal
  { name: 'Ursaluna', pokedex: 901, types: 'Ground,Normal', attack: 243, defense: 181, hp: 277,
    weaknesses: 'Water:1.6,Grass:1.6,Ice:1.6,Fighting:1.6', category: 'Normal', shiny: 1 },

  // Annihilape - #979 - Fighting/Ghost
  { name: 'Annihilape', pokedex: 979, types: 'Fighting,Ghost', attack: 220, defense: 169, hp: 242,
    weaknesses: 'Flying:1.6,Psychic:1.6,Ghost:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Kingambit - #983 - Dark/Steel
  { name: 'Kingambit', pokedex: 983, types: 'Dark,Steel', attack: 250, defense: 196, hp: 225,
    weaknesses: 'Fighting:2.56,Fire:1.6,Ground:1.6', category: 'Normal', shiny: 1 },

  // Hisuian Goodra - #706 Hisuian
  { name: 'Hisuian Goodra', pokedex: 706, types: 'Steel,Dragon', attack: 209, defense: 250, hp: 190,
    weaknesses: 'Fighting:1.6,Ground:1.6', category: 'Normal', shiny: 1 },

  // Hisuian Zoroark - #571 Hisuian - Ghost/Normal
  { name: 'Hisuian Zoroark', pokedex: 571, types: 'Normal,Ghost', attack: 243, defense: 160, hp: 146,
    weaknesses: 'Dark:1.6', category: 'Normal', shiny: 1 },

  // Zoroark - #571 - Dark
  { name: 'Zoroark', pokedex: 571, types: 'Dark', attack: 250, defense: 127, hp: 155,
    weaknesses: 'Fighting:1.6,Bug:1.6,Fairy:1.6', category: 'Normal', shiny: 1 },

  // Clawitzer - #693 - Water
  { name: 'Clawitzer', pokedex: 693, types: 'Water', attack: 221, defense: 171, hp: 174,
    weaknesses: 'Electric:1.6,Grass:1.6', category: 'Normal', shiny: 1 },

  // Dragalge - #691 - Poison/Dragon
  { name: 'Dragalge', pokedex: 691, types: 'Poison,Dragon', attack: 177, defense: 207, hp: 163,
    weaknesses: 'Ground:1.6,Psychic:1.6,Ice:1.6,Dragon:1.6', category: 'Normal', shiny: 1 },

  // Drapion - #452 - Poison/Dark
  { name: 'Drapion', pokedex: 452, types: 'Poison,Dark', attack: 180, defense: 202, hp: 172,
    weaknesses: 'Ground:1.6', category: 'Normal', shiny: 1 },

  // Toxicroak - #454 - Poison/Fighting
  { name: 'Toxicroak', pokedex: 454, types: 'Poison,Fighting', attack: 211, defense: 133, hp: 195,
    weaknesses: 'Psychic:2.56,Flying:1.6,Ground:1.6', category: 'Normal', shiny: 1 },

  // Dusknoir - #477 - Ghost
  { name: 'Dusknoir', pokedex: 477, types: 'Ghost', attack: 180, defense: 254, hp: 128,
    weaknesses: 'Ghost:1.6,Dark:1.6', category: 'Normal', shiny: 1 },

  // Froslass - #478 - Ice/Ghost
  { name: 'Froslass', pokedex: 478, types: 'Ice,Ghost', attack: 171, defense: 150, hp: 172,
    weaknesses: 'Fire:1.6,Rock:1.6,Ghost:1.6,Dark:1.6,Steel:1.6', category: 'Normal', shiny: 1 },
];

const insertPokemon = db.prepare(
  "INSERT OR IGNORE INTO pokemon (name, pokedex_number, types, attack, defense, hp, weaknesses, category, shiny_released) VALUES (@name, @pokedex, @types, @attack, @defense, @hp, @weaknesses, @category, @shiny)"
);

console.log('Tilføjer nye stærke Pokemon...\n');

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
