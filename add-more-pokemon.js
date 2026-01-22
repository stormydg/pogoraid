const Database = require('better-sqlite3');
const db = new Database('pokemon.db');

// Type weaknesses og resistances (Pokémon GO bruger 1.6x)
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

const typeResistances = {
  'Normal': [],
  'Fire': ['Fire:0.625x', 'Grass:0.625x', 'Ice:0.625x', 'Bug:0.625x', 'Steel:0.625x', 'Fairy:0.625x'],
  'Water': ['Fire:0.625x', 'Water:0.625x', 'Ice:0.625x', 'Steel:0.625x'],
  'Electric': ['Electric:0.625x', 'Flying:0.625x', 'Steel:0.625x'],
  'Grass': ['Water:0.625x', 'Electric:0.625x', 'Grass:0.625x', 'Ground:0.625x'],
  'Ice': ['Ice:0.625x'],
  'Fighting': ['Bug:0.625x', 'Rock:0.625x', 'Dark:0.625x'],
  'Poison': ['Grass:0.625x', 'Fighting:0.625x', 'Poison:0.625x', 'Bug:0.625x', 'Fairy:0.625x'],
  'Ground': ['Poison:0.625x', 'Rock:0.625x'],
  'Flying': ['Grass:0.625x', 'Fighting:0.625x', 'Bug:0.625x'],
  'Psychic': ['Fighting:0.625x', 'Psychic:0.625x'],
  'Bug': ['Grass:0.625x', 'Fighting:0.625x', 'Ground:0.625x'],
  'Rock': ['Normal:0.625x', 'Fire:0.625x', 'Poison:0.625x', 'Flying:0.625x'],
  'Ghost': ['Poison:0.625x', 'Bug:0.625x'],
  'Dragon': ['Fire:0.625x', 'Water:0.625x', 'Electric:0.625x', 'Grass:0.625x'],
  'Dark': ['Ghost:0.625x', 'Dark:0.625x'],
  'Steel': ['Normal:0.625x', 'Grass:0.625x', 'Ice:0.625x', 'Flying:0.625x', 'Psychic:0.625x', 'Bug:0.625x', 'Rock:0.625x', 'Dragon:0.625x', 'Steel:0.625x', 'Fairy:0.625x'],
  'Fairy': ['Fighting:0.625x', 'Bug:0.625x', 'Dark:0.625x']
};

const typeImmunities = {
  'Normal': ['Ghost:0.391x'],
  'Ground': ['Electric:0.391x'],
  'Flying': ['Ground:0.391x'],
  'Ghost': ['Normal:0.391x', 'Fighting:0.391x'],
  'Dark': ['Psychic:0.391x'],
  'Steel': ['Poison:0.391x'],
  'Fairy': ['Dragon:0.391x']
};

function calculateWeaknessesAndResistances(types) {
  const typeArray = types.split('/');
  const weaknessMap = {};
  const resistanceMap = {};

  // Start med neutral (1.0) for alle typer
  const allTypes = Object.keys(typeWeaknesses);
  allTypes.forEach(t => {
    weaknessMap[t] = 1.0;
    resistanceMap[t] = 1.0;
  });

  // Anvend immunities først
  typeArray.forEach(type => {
    if (typeImmunities[type]) {
      typeImmunities[type].forEach(immunity => {
        const [immuneType] = immunity.split(':');
        weaknessMap[immuneType] *= 0.391;
        resistanceMap[immuneType] *= 0.391;
      });
    }
  });

  // Anvend weaknesses og resistances for hver type (multiplikativt)
  typeArray.forEach(type => {
    if (typeWeaknesses[type]) {
      typeWeaknesses[type].forEach(weakness => {
        const [weakType] = weakness.split(':');
        weaknessMap[weakType] *= 1.6;
      });
    }
    if (typeResistances[type]) {
      typeResistances[type].forEach(resistance => {
        const [resistType] = resistance.split(':');
        resistanceMap[resistType] *= 0.625;
      });
    }
  });

  // Kombiner og kategoriser
  const weaknesses = [];
  const resistances = [];

  allTypes.forEach(t => {
    const combined = weaknessMap[t] * resistanceMap[t];
    if (combined > 1.0) {
      weaknesses.push(`${t}:${combined.toFixed(2).replace(/\.?0+$/, '')}x`);
    } else if (combined < 1.0) {
      resistances.push(`${t}:${combined.toFixed(3).replace(/\.?0+$/, '')}x`);
    }
  });

  return { weaknesses: weaknesses.join(','), resistances: resistances.join(',') };
}

// Nye Pokémon at tilføje (undtagen Gen 9)
const newPokemon = [
  // === FLERE MEGA EVOLUTIONS ===
  {
    name: 'Mega Gyarados',
    pokedex_number: 130,
    types: 'Water/Dark',
    attack: 292,
    defense: 247,
    hp: 216,
    best_moveset: 'Waterfall + Hydro Pump',
    category: 'Mega',
    shiny_released: 1,
    min_players: '3-4'
  },
  {
    name: 'Mega Salamence',
    pokedex_number: 373,
    types: 'Dragon/Flying',
    attack: 310,
    defense: 251,
    hp: 216,
    best_moveset: 'Dragon Tail + Outrage',
    category: 'Mega',
    shiny_released: 1,
    min_players: '3-4'
  },
  {
    name: 'Mega Latios',
    pokedex_number: 381,
    types: 'Dragon/Psychic',
    attack: 335,
    defense: 241,
    hp: 190,
    best_moveset: 'Dragon Breath + Psychic',
    category: 'Mega',
    shiny_released: 1,
    min_players: '3-4'
  },
  {
    name: 'Mega Latias',
    pokedex_number: 380,
    types: 'Dragon/Psychic',
    attack: 289,
    defense: 297,
    hp: 190,
    best_moveset: 'Dragon Breath + Outrage',
    category: 'Mega',
    shiny_released: 1,
    min_players: '4-5'
  },
  {
    name: 'Mega Metagross',
    pokedex_number: 376,
    types: 'Steel/Psychic',
    attack: 300,
    defense: 289,
    hp: 190,
    best_moveset: 'Bullet Punch + Meteor Mash',
    category: 'Mega',
    shiny_released: 1,
    min_players: '3-4'
  },
  {
    name: 'Mega Aggron',
    pokedex_number: 306,
    types: 'Steel',
    attack: 247,
    defense: 331,
    hp: 172,
    best_moveset: 'Iron Tail + Heavy Slam',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Ampharos',
    pokedex_number: 181,
    types: 'Electric/Dragon',
    attack: 294,
    defense: 203,
    hp: 207,
    best_moveset: 'Volt Switch + Zap Cannon',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Steelix',
    pokedex_number: 208,
    types: 'Steel/Ground',
    attack: 212,
    defense: 327,
    hp: 181,
    best_moveset: 'Iron Tail + Earthquake',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Lopunny',
    pokedex_number: 428,
    types: 'Normal/Fighting',
    attack: 282,
    defense: 214,
    hp: 163,
    best_moveset: 'Low Kick + Focus Blast',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Pidgeot',
    pokedex_number: 18,
    types: 'Normal/Flying',
    attack: 280,
    defense: 175,
    hp: 195,
    best_moveset: 'Gust + Brave Bird',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Aerodactyl',
    pokedex_number: 142,
    types: 'Rock/Flying',
    attack: 292,
    defense: 210,
    hp: 190,
    best_moveset: 'Rock Throw + Rock Slide',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Manectric',
    pokedex_number: 310,
    types: 'Electric',
    attack: 286,
    defense: 179,
    hp: 172,
    best_moveset: 'Thunder Fang + Wild Charge',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Houndoom',
    pokedex_number: 229,
    types: 'Dark/Fire',
    attack: 289,
    defense: 194,
    hp: 181,
    best_moveset: 'Snarl + Foul Play',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Absol',
    pokedex_number: 359,
    types: 'Dark',
    attack: 314,
    defense: 130,
    hp: 163,
    best_moveset: 'Snarl + Dark Pulse',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Banette',
    pokedex_number: 354,
    types: 'Ghost',
    attack: 312,
    defense: 160,
    hp: 162,
    best_moveset: 'Shadow Claw + Shadow Ball',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Abomasnow',
    pokedex_number: 460,
    types: 'Grass/Ice',
    attack: 240,
    defense: 191,
    hp: 207,
    best_moveset: 'Powder Snow + Weather Ball',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Glalie',
    pokedex_number: 362,
    types: 'Ice',
    attack: 252,
    defense: 168,
    hp: 190,
    best_moveset: 'Ice Shard + Avalanche',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Slowbro',
    pokedex_number: 80,
    types: 'Water/Psychic',
    attack: 224,
    defense: 259,
    hp: 216,
    best_moveset: 'Confusion + Psychic',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Kangaskhan',
    pokedex_number: 115,
    types: 'Normal',
    attack: 246,
    defense: 210,
    hp: 233,
    best_moveset: 'Low Kick + Outrage',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Venusaur',
    pokedex_number: 3,
    types: 'Grass/Poison',
    attack: 241,
    defense: 246,
    hp: 190,
    best_moveset: 'Vine Whip + Frenzy Plant',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Blastoise',
    pokedex_number: 9,
    types: 'Water',
    attack: 264,
    defense: 237,
    hp: 188,
    best_moveset: 'Water Gun + Hydro Cannon',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Mega Charizard X',
    pokedex_number: 6,
    types: 'Fire/Dragon',
    attack: 273,
    defense: 213,
    hp: 186,
    best_moveset: 'Dragon Breath + Dragon Claw',
    category: 'Mega',
    shiny_released: 1,
    min_players: '2-3'
  },

  // === NORMALE COUNTERS ===
  {
    name: 'Metagross',
    pokedex_number: 376,
    types: 'Steel/Psychic',
    attack: 257,
    defense: 228,
    hp: 190,
    best_moveset: 'Bullet Punch + Meteor Mash',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Salamence',
    pokedex_number: 373,
    types: 'Dragon/Flying',
    attack: 277,
    defense: 168,
    hp: 216,
    best_moveset: 'Dragon Tail + Outrage',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Dragonite',
    pokedex_number: 149,
    types: 'Dragon/Flying',
    attack: 263,
    defense: 198,
    hp: 209,
    best_moveset: 'Dragon Tail + Outrage',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Conkeldurr',
    pokedex_number: 534,
    types: 'Fighting',
    attack: 243,
    defense: 158,
    hp: 233,
    best_moveset: 'Counter + Dynamic Punch',
    category: 'Normal',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Rampardos',
    pokedex_number: 409,
    types: 'Rock',
    attack: 295,
    defense: 109,
    hp: 219,
    best_moveset: 'Smack Down + Rock Slide',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Electivire',
    pokedex_number: 466,
    types: 'Electric',
    attack: 249,
    defense: 163,
    hp: 181,
    best_moveset: 'Thunder Shock + Wild Charge',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Magmortar',
    pokedex_number: 467,
    types: 'Fire',
    attack: 247,
    defense: 172,
    hp: 181,
    best_moveset: 'Fire Spin + Fire Punch',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Weavile',
    pokedex_number: 461,
    types: 'Dark/Ice',
    attack: 243,
    defense: 171,
    hp: 172,
    best_moveset: 'Snarl + Avalanche',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Roserade',
    pokedex_number: 407,
    types: 'Grass/Poison',
    attack: 243,
    defense: 185,
    hp: 155,
    best_moveset: 'Razor Leaf + Grass Knot',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Gallade',
    pokedex_number: 475,
    types: 'Psychic/Fighting',
    attack: 237,
    defense: 195,
    hp: 169,
    best_moveset: 'Low Kick + Close Combat',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Togekiss',
    pokedex_number: 468,
    types: 'Fairy/Flying',
    attack: 225,
    defense: 217,
    hp: 198,
    best_moveset: 'Charm + Dazzling Gleam',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Gyarados',
    pokedex_number: 130,
    types: 'Water/Flying',
    attack: 237,
    defense: 186,
    hp: 216,
    best_moveset: 'Waterfall + Hydro Pump',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Galarian Darmanitan',
    pokedex_number: 555,
    types: 'Ice',
    attack: 263,
    defense: 114,
    hp: 233,
    best_moveset: 'Ice Fang + Avalanche',
    category: 'Normal',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Haxorus',
    pokedex_number: 612,
    types: 'Dragon',
    attack: 284,
    defense: 172,
    hp: 183,
    best_moveset: 'Dragon Tail + Dragon Claw',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Darmanitan',
    pokedex_number: 555,
    types: 'Fire',
    attack: 263,
    defense: 114,
    hp: 233,
    best_moveset: 'Fire Fang + Overheat',
    category: 'Normal',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Breloom',
    pokedex_number: 286,
    types: 'Grass/Fighting',
    attack: 241,
    defense: 144,
    hp: 155,
    best_moveset: 'Counter + Dynamic Punch',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Hariyama',
    pokedex_number: 297,
    types: 'Fighting',
    attack: 209,
    defense: 114,
    hp: 302,
    best_moveset: 'Counter + Dynamic Punch',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Magnezone',
    pokedex_number: 462,
    types: 'Electric/Steel',
    attack: 238,
    defense: 205,
    hp: 172,
    best_moveset: 'Spark + Wild Charge',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Espeon',
    pokedex_number: 196,
    types: 'Psychic',
    attack: 261,
    defense: 175,
    hp: 163,
    best_moveset: 'Confusion + Psychic',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Glaceon',
    pokedex_number: 471,
    types: 'Ice',
    attack: 238,
    defense: 205,
    hp: 163,
    best_moveset: 'Frost Breath + Avalanche',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Leafeon',
    pokedex_number: 470,
    types: 'Grass',
    attack: 216,
    defense: 219,
    hp: 163,
    best_moveset: 'Razor Leaf + Leaf Blade',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Sylveon',
    pokedex_number: 700,
    types: 'Fairy',
    attack: 203,
    defense: 205,
    hp: 216,
    best_moveset: 'Charm + Dazzling Gleam',
    category: 'Normal',
    shiny_released: 1,
    min_players: 'N/A'
  },
  {
    name: 'Tyrantrum',
    pokedex_number: 697,
    types: 'Rock/Dragon',
    attack: 227,
    defense: 191,
    hp: 193,
    best_moveset: 'Rock Throw + Outrage',
    category: 'Normal',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Aurorus',
    pokedex_number: 699,
    types: 'Rock/Ice',
    attack: 186,
    defense: 163,
    hp: 265,
    best_moveset: 'Frost Breath + Weather Ball',
    category: 'Normal',
    shiny_released: 0,
    min_players: 'N/A'
  },

  // === FLERE SHADOW POKÉMON ===
  {
    name: 'Shadow Metagross',
    pokedex_number: 376,
    types: 'Steel/Psychic',
    attack: 257,
    defense: 228,
    hp: 190,
    best_moveset: 'Bullet Punch + Meteor Mash',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Shadow Salamence',
    pokedex_number: 373,
    types: 'Dragon/Flying',
    attack: 277,
    defense: 168,
    hp: 216,
    best_moveset: 'Dragon Tail + Outrage',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Shadow Dragonite',
    pokedex_number: 149,
    types: 'Dragon/Flying',
    attack: 263,
    defense: 198,
    hp: 209,
    best_moveset: 'Dragon Tail + Outrage',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Shadow Weavile',
    pokedex_number: 461,
    types: 'Dark/Ice',
    attack: 243,
    defense: 171,
    hp: 172,
    best_moveset: 'Snarl + Avalanche',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Shadow Electivire',
    pokedex_number: 466,
    types: 'Electric',
    attack: 249,
    defense: 163,
    hp: 181,
    best_moveset: 'Thunder Shock + Wild Charge',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Shadow Magnezone',
    pokedex_number: 462,
    types: 'Electric/Steel',
    attack: 238,
    defense: 205,
    hp: 172,
    best_moveset: 'Spark + Wild Charge',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Shadow Gardevoir',
    pokedex_number: 282,
    types: 'Psychic/Fairy',
    attack: 237,
    defense: 195,
    hp: 169,
    best_moveset: 'Charm + Dazzling Gleam',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Shadow Swampert',
    pokedex_number: 260,
    types: 'Water/Ground',
    attack: 208,
    defense: 175,
    hp: 225,
    best_moveset: 'Water Gun + Hydro Cannon',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Shadow Hariyama',
    pokedex_number: 297,
    types: 'Fighting',
    attack: 209,
    defense: 114,
    hp: 302,
    best_moveset: 'Counter + Dynamic Punch',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Shadow Alakazam',
    pokedex_number: 65,
    types: 'Psychic',
    attack: 271,
    defense: 167,
    hp: 146,
    best_moveset: 'Confusion + Psychic',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Shadow Gengar',
    pokedex_number: 94,
    types: 'Ghost/Poison',
    attack: 261,
    defense: 149,
    hp: 155,
    best_moveset: 'Shadow Claw + Shadow Ball',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Shadow Gyarados',
    pokedex_number: 130,
    types: 'Water/Flying',
    attack: 237,
    defense: 186,
    hp: 216,
    best_moveset: 'Waterfall + Hydro Pump',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Shadow Latios',
    pokedex_number: 381,
    types: 'Dragon/Psychic',
    attack: 268,
    defense: 212,
    hp: 190,
    best_moveset: 'Dragon Breath + Psychic',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },
  {
    name: 'Shadow Latias',
    pokedex_number: 380,
    types: 'Dragon/Psychic',
    attack: 228,
    defense: 246,
    hp: 190,
    best_moveset: 'Dragon Breath + Outrage',
    category: 'Shadow',
    shiny_released: 0,
    min_players: 'N/A'
  },

  // === FLERE LEGENDARIES ===
  {
    name: 'Latios',
    pokedex_number: 381,
    types: 'Dragon/Psychic',
    attack: 268,
    defense: 212,
    hp: 190,
    best_moveset: 'Dragon Breath + Psychic',
    category: 'Legendary',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Latias',
    pokedex_number: 380,
    types: 'Dragon/Psychic',
    attack: 228,
    defense: 246,
    hp: 190,
    best_moveset: 'Dragon Breath + Outrage',
    category: 'Legendary',
    shiny_released: 1,
    min_players: '2-3'
  },
  {
    name: 'Regidrago',
    pokedex_number: 895,
    types: 'Dragon',
    attack: 250,
    defense: 145,
    hp: 400,
    best_moveset: 'Dragon Tail + Outrage',
    category: 'Legendary',
    shiny_released: 0,
    min_players: '3-4'
  },
  {
    name: 'Regieleki',
    pokedex_number: 894,
    types: 'Electric',
    attack: 250,
    defense: 125,
    hp: 190,
    best_moveset: 'Thunder Shock + Zap Cannon',
    category: 'Legendary',
    shiny_released: 0,
    min_players: '2-3'
  },
  {
    name: 'Spectrier',
    pokedex_number: 897,
    types: 'Ghost',
    attack: 265,
    defense: 164,
    hp: 225,
    best_moveset: 'Psycho Cut + Shadow Ball',
    category: 'Legendary',
    shiny_released: 0,
    min_players: '2-3'
  },
  {
    name: 'Glastrier',
    pokedex_number: 896,
    types: 'Ice',
    attack: 240,
    defense: 218,
    hp: 225,
    best_moveset: 'Ice Shard + Avalanche',
    category: 'Legendary',
    shiny_released: 0,
    min_players: '2-3'
  },
  {
    name: 'Calyrex',
    pokedex_number: 898,
    types: 'Psychic/Grass',
    attack: 165,
    defense: 165,
    hp: 225,
    best_moveset: 'Confusion + Psychic',
    category: 'Legendary',
    shiny_released: 0,
    min_players: '2'
  },
  {
    name: 'Ice Rider Calyrex',
    pokedex_number: 898,
    types: 'Psychic/Ice',
    attack: 266,
    defense: 250,
    hp: 225,
    best_moveset: 'Confusion + Glaciate',
    category: 'Legendary',
    shiny_released: 0,
    min_players: '4-5'
  },
  {
    name: 'Shadow Rider Calyrex',
    pokedex_number: 898,
    types: 'Psychic/Ghost',
    attack: 339,
    defense: 175,
    hp: 225,
    best_moveset: 'Confusion + Shadow Ball',
    category: 'Legendary',
    shiny_released: 0,
    min_players: '3-4'
  },
  {
    name: 'Kubfu',
    pokedex_number: 891,
    types: 'Fighting',
    attack: 190,
    defense: 144,
    hp: 155,
    best_moveset: 'Counter + Close Combat',
    category: 'Legendary',
    shiny_released: 0,
    min_players: '1-2'
  },
  {
    name: 'Urshifu Single Strike',
    pokedex_number: 892,
    types: 'Fighting/Dark',
    attack: 261,
    defense: 175,
    hp: 225,
    best_moveset: 'Counter + Close Combat',
    category: 'Legendary',
    shiny_released: 0,
    min_players: '2-3'
  },
  {
    name: 'Urshifu Rapid Strike',
    pokedex_number: 892,
    types: 'Fighting/Water',
    attack: 261,
    defense: 175,
    hp: 225,
    best_moveset: 'Counter + Dynamic Punch',
    category: 'Legendary',
    shiny_released: 0,
    min_players: '2-3'
  },
  {
    name: 'Enamorus Incarnate',
    pokedex_number: 905,
    types: 'Fairy/Flying',
    attack: 250,
    defense: 190,
    hp: 179,
    best_moveset: 'Fairy Wind + Dazzling Gleam',
    category: 'Legendary',
    shiny_released: 0,
    min_players: '2-3'
  },
  {
    name: 'Enamorus Therian',
    pokedex_number: 905,
    types: 'Fairy/Flying',
    attack: 250,
    defense: 215,
    hp: 179,
    best_moveset: 'Fairy Wind + Dazzling Gleam',
    category: 'Legendary',
    shiny_released: 0,
    min_players: '2-3'
  },

  // === MYTHICALS ===
  {
    name: 'Phione',
    pokedex_number: 489,
    types: 'Water',
    attack: 162,
    defense: 162,
    hp: 190,
    best_moveset: 'Waterfall + Surf',
    category: 'Mythical',
    shiny_released: 0,
    min_players: '1-2'
  },
  {
    name: 'Manaphy',
    pokedex_number: 490,
    types: 'Water',
    attack: 210,
    defense: 210,
    hp: 225,
    best_moveset: 'Waterfall + Surf',
    category: 'Mythical',
    shiny_released: 0,
    min_players: '2-3'
  },
  {
    name: 'Diancie',
    pokedex_number: 719,
    types: 'Rock/Fairy',
    attack: 190,
    defense: 285,
    hp: 137,
    best_moveset: 'Rock Throw + Moonblast',
    category: 'Mythical',
    shiny_released: 0,
    min_players: '2-3'
  },
  {
    name: 'Hoopa Confined',
    pokedex_number: 720,
    types: 'Psychic/Ghost',
    attack: 261,
    defense: 187,
    hp: 173,
    best_moveset: 'Confusion + Shadow Ball',
    category: 'Mythical',
    shiny_released: 0,
    min_players: '2-3'
  },
  {
    name: 'Volcanion',
    pokedex_number: 721,
    types: 'Fire/Water',
    attack: 252,
    defense: 216,
    hp: 190,
    best_moveset: 'Water Gun + Overheat',
    category: 'Mythical',
    shiny_released: 0,
    min_players: '2-3'
  },
  {
    name: 'Marshadow',
    pokedex_number: 802,
    types: 'Fighting/Ghost',
    attack: 274,
    defense: 180,
    hp: 207,
    best_moveset: 'Counter + Close Combat',
    category: 'Mythical',
    shiny_released: 0,
    min_players: '2-3'
  },
  {
    name: 'Zeraora',
    pokedex_number: 807,
    types: 'Electric',
    attack: 252,
    defense: 182,
    hp: 204,
    best_moveset: 'Spark + Wild Charge',
    category: 'Mythical',
    shiny_released: 0,
    min_players: '2-3'
  }
];

// Tjek hvilke der allerede eksisterer
const existingPokemon = db.prepare('SELECT name FROM pokemon').all().map(p => p.name);

// Forbered insert statement
const insert = db.prepare(`
  INSERT INTO pokemon (name, pokedex_number, types, weaknesses, resistances, attack, defense, hp, best_moveset, category, shiny_released, raid_tier, min_players_duo)
  VALUES (@name, @pokedex_number, @types, @weaknesses, @resistances, @attack, @defense, @hp, @best_moveset, @category, @shiny_released, 5, @min_players_duo)
`);

let added = 0;
let skipped = 0;

for (const pokemon of newPokemon) {
  if (existingPokemon.includes(pokemon.name)) {
    console.log(`Springer over: ${pokemon.name} (eksisterer allerede)`);
    skipped++;
  } else {
    const { weaknesses, resistances } = calculateWeaknessesAndResistances(pokemon.types);

    insert.run({
      name: pokemon.name,
      pokedex_number: pokemon.pokedex_number,
      types: pokemon.types,
      weaknesses: weaknesses,
      resistances: resistances,
      attack: pokemon.attack,
      defense: pokemon.defense,
      hp: pokemon.hp,
      best_moveset: pokemon.best_moveset,
      category: pokemon.category,
      shiny_released: pokemon.shiny_released,
      min_players_duo: pokemon.min_players || 'N/A'
    });
    console.log(`Tilføjet: ${pokemon.name} (${pokemon.category})`);
    added++;
  }
}

console.log(`\n✅ Færdig! Tilføjet ${added} nye Pokémon, sprang ${skipped} over.`);

// Vis total per kategori
const categories = db.prepare(`
  SELECT category, COUNT(*) as count
  FROM pokemon
  GROUP BY category
  ORDER BY count DESC
`).all();

console.log('\n📊 Pokémon per kategori:');
categories.forEach(c => console.log(`  ${c.category}: ${c.count}`));

const total = db.prepare('SELECT COUNT(*) as count FROM pokemon').get();
console.log(`\n📊 Total antal Pokémon i databasen: ${total.count}`);

db.close();
