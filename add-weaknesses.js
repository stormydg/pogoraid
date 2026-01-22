const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'pokemon.db'));

// Type effectiveness chart - defensive (hvad denne type er svag imod)
// Pokémon GO bruger 1.6x for super effective, ikke 2x!
const typeWeaknesses = {
  'Normal': ['Fighting:1.6x'],
  'Fire': ['Water:1.6x', 'Ground:1.6x', 'Rock:1.6x'],
  'Water': ['Electric:1.6x', 'Grass:1.6x'],
  'Electric': ['Ground:1.6x'],
  'Grass': ['Fire:1.6x', 'Ice:1.6x', 'Poison:1.6x', 'Flying:1.6x', 'Bug:1.6x'],
  'Ice': ['Fire:1.6x', 'Fighting:1.6x', 'Rock:1.6x', 'Steel:1.6x'],
  'Fighting': ['Flying:1.6x', 'Psychic:1.6x', 'Fairy:1.6x'],
  'Poison': ['Ground:1.6x', 'Psychic:1.6x'],
  'Ground': ['Water:1.6x', 'Grass:1.6x', 'Ice:1.6x'],
  'Flying': ['Electric:1.6x', 'Ice:1.6x', 'Rock:1.6x'],
  'Psychic': ['Bug:1.6x', 'Ghost:1.6x', 'Dark:1.6x'],
  'Bug': ['Fire:1.6x', 'Flying:1.6x', 'Rock:1.6x'],
  'Rock': ['Water:1.6x', 'Grass:1.6x', 'Fighting:1.6x', 'Ground:1.6x', 'Steel:1.6x'],
  'Ghost': ['Ghost:1.6x', 'Dark:1.6x'],
  'Dragon': ['Ice:1.6x', 'Dragon:1.6x', 'Fairy:1.6x'],
  'Dark': ['Fighting:1.6x', 'Bug:1.6x', 'Fairy:1.6x'],
  'Steel': ['Fire:1.6x', 'Fighting:1.6x', 'Ground:1.6x'],
  'Fairy': ['Poison:1.6x', 'Steel:1.6x']
};

// Type resistances - defensive (hvad denne type modstår)
// Pokémon GO bruger 0.625x for resistance (1/1.6), 0.390625x for double resistance (1/2.56)
const typeResistances = {
  'Normal': [],
  'Fire': ['Fire:0.625x', 'Grass:0.625x', 'Ice:0.625x', 'Bug:0.625x', 'Steel:0.625x', 'Fairy:0.625x'],
  'Water': ['Fire:0.625x', 'Water:0.625x', 'Ice:0.625x', 'Steel:0.625x'],
  'Electric': ['Electric:0.625x', 'Flying:0.625x', 'Steel:0.625x'],
  'Grass': ['Water:0.625x', 'Electric:0.625x', 'Grass:0.625x', 'Ground:0.625x'],
  'Ice': ['Ice:0.625x'],
  'Fighting': ['Bug:0.625x', 'Rock:0.625x', 'Dark:0.625x'],
  'Poison': ['Grass:0.625x', 'Fighting:0.625x', 'Poison:0.625x', 'Bug:0.625x', 'Fairy:0.625x'],
  'Ground': ['Poison:0.625x', 'Rock:0.625x', 'Electric:0.390625x'],
  'Flying': ['Grass:0.625x', 'Fighting:0.625x', 'Bug:0.625x', 'Ground:0.390625x'],
  'Psychic': ['Fighting:0.625x', 'Psychic:0.625x'],
  'Bug': ['Grass:0.625x', 'Fighting:0.625x', 'Ground:0.625x'],
  'Rock': ['Normal:0.625x', 'Fire:0.625x', 'Poison:0.625x', 'Flying:0.625x'],
  'Ghost': ['Poison:0.625x', 'Bug:0.625x', 'Normal:0.390625x', 'Fighting:0.390625x'],
  'Dragon': ['Fire:0.625x', 'Water:0.625x', 'Electric:0.625x', 'Grass:0.625x'],
  'Dark': ['Ghost:0.625x', 'Dark:0.625x', 'Psychic:0.390625x'],
  'Steel': ['Normal:0.625x', 'Grass:0.625x', 'Ice:0.625x', 'Flying:0.625x', 'Psychic:0.625x', 'Bug:0.625x', 'Rock:0.625x', 'Dragon:0.625x', 'Steel:0.625x', 'Fairy:0.625x', 'Poison:0.390625x'],
  'Fairy': ['Fighting:0.625x', 'Bug:0.625x', 'Dark:0.625x', 'Dragon:0.390625x']
};

function calculateWeaknessesAndResistances(types) {
  const typeArray = types.split('/');
  const weaknessMap = {};
  const resistanceMap = {};

  // Start med alle multipliers på 1.0
  typeArray.forEach(type => {
    // Tilføj weaknesses
    if (typeWeaknesses[type]) {
      typeWeaknesses[type].forEach(weakness => {
        const [weakType, mult] = weakness.split(':');
        const multiplier = parseFloat(mult.replace('x', ''));
        weaknessMap[weakType] = (weaknessMap[weakType] || 1.0) * multiplier;
      });
    }

    // Tilføj resistances
    if (typeResistances[type]) {
      typeResistances[type].forEach(resistance => {
        const [resistType, mult] = resistance.split(':');
        const multiplier = parseFloat(mult.replace('x', ''));
        resistanceMap[resistType] = (resistanceMap[resistType] || 1.0) * multiplier;
      });
    }
  });

  // Konverter til string format
  const weaknesses = Object.entries(weaknessMap)
    .filter(([type, mult]) => mult > 1.0)
    .sort((a, b) => b[1] - a[1]) // Sortér efter multiplier (højeste først)
    .map(([type, mult]) => `${type}:${mult}x`)
    .join(',');

  const resistances = Object.entries(resistanceMap)
    .filter(([type, mult]) => mult < 1.0)
    .sort((a, b) => a[1] - b[1]) // Sortér efter multiplier (laveste først)
    .map(([type, mult]) => `${type}:${mult}x`)
    .join(',');

  return { weaknesses, resistances };
}

console.log('Tilføjer weaknesses og resistances til alle Pokémon...\n');

const allPokemon = db.prepare('SELECT id, name, types FROM pokemon').all();

let updated = 0;
allPokemon.forEach(pokemon => {
  const { weaknesses, resistances } = calculateWeaknessesAndResistances(pokemon.types);

  db.prepare(`
    UPDATE pokemon
    SET weaknesses = ?,
        resistances = ?
    WHERE id = ?
  `).run(weaknesses || 'None', resistances || 'None', pokemon.id);

  updated++;

  if (weaknesses.includes('4x') || weaknesses.includes('2.56x')) {
    console.log(`⚠️  ${pokemon.name.padEnd(30)} - ${weaknesses}`);
  } else if (updated % 20 === 0) {
    console.log(`✓ Opdateret ${updated}/${allPokemon.length} Pokémon...`);
  }
});

console.log(`\n✅ Opdateret ${updated} Pokémon med weaknesses og resistances`);

// Vis nogle eksempler med double weaknesses
console.log('\n📊 Eksempler på Pokémon med 4x weaknesses:');
const doubleWeak = db.prepare(`
  SELECT name, types, weaknesses
  FROM pokemon
  WHERE weaknesses LIKE '%4x%' OR weaknesses LIKE '%2.56x%'
  ORDER BY name
  LIMIT 15
`).all();

doubleWeak.forEach(p => {
  console.log(`   ${p.name.padEnd(25)} (${p.types.padEnd(20)}) - ${p.weaknesses}`);
});
