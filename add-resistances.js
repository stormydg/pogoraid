// Script til at tilføje resistances til alle Pokémon baseret på deres types
const Database = require('better-sqlite3');
const db = new Database('pokemon.db');

// Type chart - hvilke typer er resistente mod hvilke angreb
// Format: defending type → array af typer den resisterer (0.625x damage)
const typeResistances = {
  'Normal': [],
  'Fire': ['Fire', 'Grass', 'Ice', 'Bug', 'Steel', 'Fairy'],
  'Water': ['Fire', 'Water', 'Ice', 'Steel'],
  'Electric': ['Electric', 'Flying', 'Steel'],
  'Grass': ['Water', 'Electric', 'Grass', 'Ground'],
  'Ice': ['Ice'],
  'Fighting': ['Bug', 'Rock', 'Dark'],
  'Poison': ['Grass', 'Fighting', 'Poison', 'Bug', 'Fairy'],
  'Ground': ['Poison', 'Rock'],
  'Flying': ['Grass', 'Fighting', 'Bug'],
  'Psychic': ['Fighting', 'Psychic'],
  'Bug': ['Grass', 'Fighting', 'Ground'],
  'Rock': ['Normal', 'Fire', 'Poison', 'Flying'],
  'Ghost': ['Poison', 'Bug'],
  'Dragon': ['Fire', 'Water', 'Electric', 'Grass'],
  'Dark': ['Ghost', 'Dark'],
  'Steel': ['Normal', 'Grass', 'Ice', 'Flying', 'Psychic', 'Bug', 'Rock', 'Dragon', 'Steel', 'Fairy'],
  'Fairy': ['Fighting', 'Bug', 'Dark']
};

// Immuniteter (0.39x damage) - typer der er næsten immune
const typeImmunities = {
  'Normal': ['Ghost'],
  'Fire': [],
  'Water': [],
  'Electric': [],
  'Grass': [],
  'Ice': [],
  'Fighting': [],
  'Poison': [],
  'Ground': ['Electric'],
  'Flying': ['Ground'],
  'Psychic': [],
  'Bug': [],
  'Rock': [],
  'Ghost': ['Normal', 'Fighting'],
  'Dragon': [],
  'Dark': ['Psychic'],
  'Steel': ['Poison'],
  'Fairy': ['Dragon']
};

console.log('Tilføjer resistances til alle Pokémon...\n');

// Hent alle Pokémon
const allPokemon = db.prepare('SELECT id, name, types FROM pokemon').all();

let totalUpdated = 0;

allPokemon.forEach(pokemon => {
  // Split types (f.eks. "Fairy/Steel" → ["Fairy", "Steel"])
  const pokemonTypes = pokemon.types.split('/').map(t => t.trim());

  // Objekt til at holde styr på alle resistances og deres multipliers
  const resistanceMap = {};

  // Gå gennem hver af Pokémon's typer
  pokemonTypes.forEach(pokemonType => {
    // Tjek resistances (0.625x)
    if (typeResistances[pokemonType]) {
      typeResistances[pokemonType].forEach(resistedType => {
        if (!resistanceMap[resistedType]) {
          resistanceMap[resistedType] = 0.625;
        } else {
          // Hvis begge typer resisterer samme type: 0.625 * 0.625 = 0.39x
          resistanceMap[resistedType] *= 0.625;
        }
      });
    }

    // Tjek immuniteter (0.39x)
    if (typeImmunities[pokemonType]) {
      typeImmunities[pokemonType].forEach(immuneType => {
        resistanceMap[immuneType] = 0.39;
      });
    }
  });

  // Konverter til string format: "Type1:0.625x,Type2:0.39x"
  const resistancesArray = Object.entries(resistanceMap).map(([type, mult]) => {
    // Rund til 2 decimaler
    const roundedMult = Math.round(mult * 100) / 100;
    return `${type}:${roundedMult}x`;
  });

  const resistancesString = resistancesArray.join(',');

  // Opdater database
  if (resistancesString) {
    db.prepare('UPDATE pokemon SET resistances = ? WHERE id = ?').run(resistancesString, pokemon.id);
    console.log(`✓ ${pokemon.name} (${pokemon.types}): ${resistancesString}`);
    totalUpdated++;
  } else {
    console.log(`○ ${pokemon.name} (${pokemon.types}): Ingen resistances`);
  }
});

console.log(`\n✅ Færdig! Opdaterede ${totalUpdated} Pokémon med resistances.`);

// Luk database
db.close();
