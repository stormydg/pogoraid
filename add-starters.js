const Database = require('better-sqlite3');
const db = new Database('pokemon.db');

// Alle starter Pokemon (fuldt udviklede) fra alle generationer
const starters = [
  // Gen 1 - Kanto
  { name: 'Venusaur', pokedex: 3, types: 'Grass,Poison', attack: 198, defense: 189, hp: 190,
    weaknesses: 'Fire:1.6,Ice:1.6,Flying:1.6,Psychic:1.6', category: 'Normal', shiny: 1,
    moveset: 'Vine Whip / Frenzy Plant' },
  { name: 'Blastoise', pokedex: 9, types: 'Water', attack: 171, defense: 207, hp: 188,
    weaknesses: 'Electric:1.6,Grass:1.6', category: 'Normal', shiny: 1,
    moveset: 'Water Gun / Hydro Cannon' },

  // Gen 2 - Johto
  { name: 'Meganium', pokedex: 154, types: 'Grass', attack: 168, defense: 202, hp: 190,
    weaknesses: 'Fire:1.6,Ice:1.6,Poison:1.6,Flying:1.6,Bug:1.6', category: 'Normal', shiny: 1,
    moveset: 'Vine Whip / Frenzy Plant' },
  { name: 'Typhlosion', pokedex: 157, types: 'Fire', attack: 223, defense: 173, hp: 186,
    weaknesses: 'Water:1.6,Ground:1.6,Rock:1.6', category: 'Normal', shiny: 1,
    moveset: 'Incinerate / Blast Burn' },
  { name: 'Feraligatr', pokedex: 160, types: 'Water', attack: 205, defense: 188, hp: 198,
    weaknesses: 'Electric:1.6,Grass:1.6', category: 'Normal', shiny: 1,
    moveset: 'Waterfall / Hydro Cannon' },

  // Gen 4 - Sinnoh
  { name: 'Torterra', pokedex: 389, types: 'Grass,Ground', attack: 202, defense: 188, hp: 216,
    weaknesses: 'Ice:2.56,Fire:1.6,Flying:1.6,Bug:1.6', category: 'Normal', shiny: 1,
    moveset: 'Razor Leaf / Frenzy Plant' },
  { name: 'Infernape', pokedex: 392, types: 'Fire,Fighting', attack: 222, defense: 151, hp: 183,
    weaknesses: 'Water:1.6,Ground:1.6,Flying:1.6,Psychic:1.6', category: 'Normal', shiny: 1,
    moveset: 'Fire Spin / Blast Burn' },
  { name: 'Empoleon', pokedex: 395, types: 'Water,Steel', attack: 210, defense: 186, hp: 197,
    weaknesses: 'Electric:1.6,Fighting:1.6,Ground:1.6', category: 'Normal', shiny: 1,
    moveset: 'Waterfall / Hydro Cannon' },

  // Gen 5 - Unova
  { name: 'Serperior', pokedex: 497, types: 'Grass', attack: 161, defense: 204, hp: 181,
    weaknesses: 'Fire:1.6,Ice:1.6,Poison:1.6,Flying:1.6,Bug:1.6', category: 'Normal', shiny: 1,
    moveset: 'Vine Whip / Frenzy Plant' },
  { name: 'Emboar', pokedex: 500, types: 'Fire,Fighting', attack: 235, defense: 127, hp: 242,
    weaknesses: 'Water:1.6,Ground:1.6,Flying:1.6,Psychic:1.6', category: 'Normal', shiny: 1,
    moveset: 'Ember / Blast Burn' },
  { name: 'Samurott', pokedex: 503, types: 'Water', attack: 212, defense: 157, hp: 216,
    weaknesses: 'Electric:1.6,Grass:1.6', category: 'Normal', shiny: 1,
    moveset: 'Waterfall / Hydro Cannon' },

  // Gen 6 - Kalos
  { name: 'Chesnaught', pokedex: 652, types: 'Grass,Fighting', attack: 201, defense: 204, hp: 204,
    weaknesses: 'Flying:2.56,Fire:1.6,Ice:1.6,Poison:1.6,Psychic:1.6,Fairy:1.6', category: 'Normal', shiny: 1,
    moveset: 'Vine Whip / Frenzy Plant' },
  { name: 'Delphox', pokedex: 655, types: 'Fire,Psychic', attack: 230, defense: 189, hp: 181,
    weaknesses: 'Water:1.6,Ground:1.6,Rock:1.6,Ghost:1.6,Dark:1.6', category: 'Normal', shiny: 1,
    moveset: 'Fire Spin / Blast Burn' },
  { name: 'Greninja', pokedex: 658, types: 'Water,Dark', attack: 223, defense: 152, hp: 176,
    weaknesses: 'Electric:1.6,Grass:1.6,Fighting:1.6,Bug:1.6,Fairy:1.6', category: 'Normal', shiny: 1,
    moveset: 'Water Shuriken / Hydro Cannon' },

  // Gen 7 - Alola
  { name: 'Decidueye', pokedex: 724, types: 'Grass,Ghost', attack: 210, defense: 179, hp: 186,
    weaknesses: 'Fire:1.6,Ice:1.6,Flying:1.6,Ghost:1.6,Dark:1.6', category: 'Normal', shiny: 1,
    moveset: 'Magical Leaf / Frenzy Plant' },
  { name: 'Incineroar', pokedex: 727, types: 'Fire,Dark', attack: 214, defense: 175, hp: 216,
    weaknesses: 'Water:1.6,Fighting:1.6,Ground:1.6,Rock:1.6', category: 'Normal', shiny: 1,
    moveset: 'Fire Fang / Blast Burn' },

  // Gen 8 - Galar
  { name: 'Rillaboom', pokedex: 812, types: 'Grass', attack: 252, defense: 165, hp: 225,
    weaknesses: 'Fire:1.6,Ice:1.6,Poison:1.6,Flying:1.6,Bug:1.6', category: 'Normal', shiny: 1,
    moveset: 'Razor Leaf / Frenzy Plant' },
  { name: 'Cinderace', pokedex: 815, types: 'Fire', attack: 238, defense: 163, hp: 190,
    weaknesses: 'Water:1.6,Ground:1.6,Rock:1.6', category: 'Normal', shiny: 1,
    moveset: 'Fire Spin / Blast Burn' },
  { name: 'Inteleon', pokedex: 818, types: 'Water', attack: 240, defense: 145, hp: 172,
    weaknesses: 'Electric:1.6,Grass:1.6', category: 'Normal', shiny: 1,
    moveset: 'Water Gun / Hydro Cannon' },

  // Gen 9 - Paldea
  { name: 'Meowscarada', pokedex: 908, types: 'Grass,Dark', attack: 232, defense: 155, hp: 183,
    weaknesses: 'Bug:2.56,Fire:1.6,Ice:1.6,Fighting:1.6,Poison:1.6,Flying:1.6,Fairy:1.6', category: 'Normal', shiny: 1,
    moveset: 'Magical Leaf / Frenzy Plant' },
  { name: 'Skeledirge', pokedex: 911, types: 'Fire,Ghost', attack: 221, defense: 185, hp: 232,
    weaknesses: 'Water:1.6,Ground:1.6,Rock:1.6,Ghost:1.6,Dark:1.6', category: 'Normal', shiny: 1,
    moveset: 'Incinerate / Blast Burn' },
  { name: 'Quaquaval', pokedex: 914, types: 'Water,Fighting', attack: 238, defense: 163, hp: 198,
    weaknesses: 'Electric:1.6,Grass:1.6,Flying:1.6,Psychic:1.6,Fairy:1.6', category: 'Normal', shiny: 1,
    moveset: 'Waterfall / Hydro Cannon' },

  // Hisuian starters
  { name: 'Hisuian Typhlosion', pokedex: 157, types: 'Fire,Ghost', attack: 223, defense: 173, hp: 186,
    weaknesses: 'Water:1.6,Ground:1.6,Rock:1.6,Ghost:1.6,Dark:1.6', category: 'Normal', shiny: 1,
    moveset: 'Incinerate / Blast Burn' },
  { name: 'Hisuian Samurott', pokedex: 503, types: 'Water,Dark', attack: 218, defense: 152, hp: 207,
    weaknesses: 'Electric:1.6,Grass:1.6,Fighting:1.6,Bug:1.6,Fairy:1.6', category: 'Normal', shiny: 1,
    moveset: 'Waterfall / Hydro Cannon' },
  { name: 'Hisuian Decidueye', pokedex: 724, types: 'Grass,Fighting', attack: 213, defense: 179, hp: 204,
    weaknesses: 'Flying:2.56,Fire:1.6,Ice:1.6,Poison:1.6,Psychic:1.6,Fairy:1.6', category: 'Normal', shiny: 1,
    moveset: 'Magical Leaf / Frenzy Plant' },
];

// Brug INSERT med best_moveset
const insertPokemon = db.prepare(
  "INSERT INTO pokemon (name, pokedex_number, types, attack, defense, hp, weaknesses, category, shiny_released, best_moveset) VALUES (@name, @pokedex, @types, @attack, @defense, @hp, @weaknesses, @category, @shiny, @moveset)"
);

console.log('Tilføjer starter Pokemon...\n');

let added = 0;
starters.forEach(p => {
  // Tjek om den allerede findes
  const exists = db.prepare("SELECT id FROM pokemon WHERE name = ?").get(p.name);
  if (exists) {
    console.log("  " + p.name + " findes allerede (id: " + exists.id + ")");
  } else {
    try {
      insertPokemon.run(p);
      console.log("+ " + p.name + " (#" + p.pokedex + ") - " + p.types);
      added++;
    } catch (e) {
      console.log("ERROR " + p.name + ": " + e.message);
    }
  }
});

console.log("\nTilføjet " + added + " nye starter Pokemon");

const total = db.prepare('SELECT COUNT(*) as count FROM pokemon').get();
console.log("Total Pokemon i databasen: " + total.count);

db.close();
