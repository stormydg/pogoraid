const Database = require('better-sqlite3');
const db = new Database('pokemon.db');

// Realistiske spiller-estimater baseret på research fra Pokebattler, Pokemon GO Hub, etc.
// Format: 'Pokemon navn': 'minimum spillere'
//
// Faktorer der afgør sværhedsgrad:
// - Lav Defense = lettere (Deoxys Attack kan solos!)
// - Høj Defense = sværere (Lugia, Deoxys Defense)
// - Double weakness = lettere
// - Primal/Mega forms af counters hjælper meget

const playerEstimates = {
  // === SOLOABLE (1 spiller med max counters) ===
  'Deoxys Attack': '1 (solo mulig)',
  'Regieleki': '1-2 (solo mulig med Primal Groudon)',

  // === NEMT DUO (2 spillere) ===
  'Articuno': '2',
  'Zapdos': '2',
  'Moltres': '2',
  'Raikou': '2',
  'Entei': '2',
  'Suicune': '2-3',
  'Regirock': '2-3',
  'Regice': '2-3',
  'Registeel': '2-3',
  'Latios': '2',
  'Latias': '2-3',
  'Kyogre': '2-3',
  'Groudon': '2-3',
  'Rayquaza': '2',
  'Deoxys': '2-3',
  'Deoxys Speed': '2',
  'Dialga': '2-3',
  'Palkia': '2-3',
  'Heatran': '2',
  'Regigigas': '3-4',
  'Giratina Altered': '2-3',
  'Giratina Origin': '2-3',
  'Cresselia': '2-3',
  'Darkrai': '2',
  'Cobalion': '2-3',
  'Terrakion': '2',
  'Virizion': '2',
  'Tornadus Incarnate': '2',
  'Tornadus Therian': '2',
  'Thundurus Incarnate': '2',
  'Thundurus Therian': '2',
  'Reshiram': '2-3',
  'Zekrom': '2-3',
  'Landorus Incarnate': '2',
  'Landorus Therian': '2',
  'Kyurem': '2-3',
  'Black Kyurem': '2-3',
  'White Kyurem': '2-3',
  'Xerneas': '2-3',
  'Yveltal': '2-3',
  'Zygarde 50%': '2-3',
  'Tapu Koko': '2',
  'Tapu Lele': '2',
  'Tapu Bulu': '2',
  'Tapu Fini': '2-3',
  'Solgaleo': '2-3',
  'Lunala': '2-3',
  'Necrozma': '2-3',
  'Dawn Wings Necrozma': '3-4',
  'Dusk Mane Necrozma': '3-4',
  'Zacian Hero': '2-3',
  'Zacian Crowned Sword': '2-3',
  'Zamazenta Hero': '3-4',
  'Zamazenta Crowned Shield': '3-4',
  'Eternatus': '2-3',
  'Kubfu': '1-2',
  'Urshifu Single Strike': '2-3',
  'Urshifu Rapid Strike': '2-3',
  'Calyrex': '2',
  'Ice Rider Calyrex': '3-4',
  'Shadow Rider Calyrex': '2-3',
  'Glastrier': '2-3',
  'Spectrier': '2',
  'Regidrago': '2-3',
  'Enamorus Incarnate': '2-3',
  'Enamorus Therian': '2-3',

  // === MYTHICALS ===
  'Mew': '2-3',
  'Celebi': '2',
  'Jirachi': '2-3',
  'Deoxys Defense': '4-5',
  'Phione': '1-2',
  'Manaphy': '2',
  'Shaymin Land': '2',
  'Shaymin Sky': '2',
  'Arceus': '3-4',
  'Victini': '2',
  'Keldeo': '2-3',
  'Meloetta Aria': '2-3',
  'Genesect': '2',
  'Diancie': '2-3',
  'Hoopa Confined': '2',
  'Hoopa Unbound': '2-3',
  'Volcanion': '2-3',
  'Magearna': '2-3',
  'Marshadow': '2-3',
  'Zeraora': '2',
  'Meltan': '1',
  'Melmetal': '2-3',
  'Zarude': '2',

  // === ULTRA BEASTS ===
  'Nihilego': '2',
  'Buzzwole': '2-3',
  'Pheromosa': '2',
  'Xurkitree': '2',
  'Celesteela': '3-4',
  'Kartana': '2',
  'Guzzlord': '2-3',

  // === MEGA RAIDS ===
  'Mega Venusaur': '2',
  'Mega Charizard Y': '2',
  'Mega Charizard X': '2',
  'Mega Blastoise': '2',
  'Mega Beedrill': '1-2',
  'Mega Pidgeot': '2',
  'Mega Alakazam': '2',
  'Mega Slowbro': '2',
  'Mega Gengar': '2',
  'Mega Kangaskhan': '2',
  'Mega Aerodactyl': '2',
  'Mega Ampharos': '2',
  'Mega Steelix': '2-3',
  'Mega Scizor': '2',
  'Mega Heracross': '2',
  'Mega Houndoom': '2',
  'Mega Tyranitar': '2-3',
  'Mega Sceptile': '2',
  'Mega Blaziken': '2',
  'Mega Swampert': '2',
  'Mega Gardevoir': '2',
  'Mega Aggron': '2-3',
  'Mega Manectric': '2',
  'Mega Banette': '2',
  'Mega Absol': '2',
  'Mega Glalie': '2',
  'Mega Salamence': '2-3',
  'Mega Metagross': '2-3',
  'Mega Latios': '2-3',
  'Mega Latias': '3-4',
  'Mega Rayquaza': '3-4',
  'Mega Lopunny': '2',
  'Mega Garchomp': '2-3',
  'Mega Lucario': '2',
  'Mega Abomasnow': '2',
  'Mega Gyarados': '2-3',

  // === PRIMALS ===
  'Primal Groudon': '3-4',
  'Primal Kyogre': '3-4',

  // === ARMORED ===
  'Armored Mewtwo': '3-4',
  'Mewtwo': '2-3',

  // === ORIGIN FORMS ===
  'Dialga Origin': '2-3',
  'Palkia Origin': '2-3'
};

// Opdater alle Pokémon med de nye estimater
const update = db.prepare(`
  UPDATE pokemon
  SET min_players_duo = @estimate
  WHERE name = @name
`);

let updated = 0;
let notFound = 0;

for (const [name, estimate] of Object.entries(playerEstimates)) {
  const result = update.run({ name, estimate });
  if (result.changes > 0) {
    console.log(`✅ ${name}: ${estimate}`);
    updated++;
  } else {
    console.log(`❌ ${name} ikke fundet i databasen`);
    notFound++;
  }
}

console.log(`\n📊 Opdateret ${updated} Pokémon, ${notFound} ikke fundet`);

// Vis nogle eksempler
console.log('\n📋 Eksempler på opdaterede værdier:');
const examples = db.prepare(`
  SELECT name, min_players_duo, attack, defense
  FROM pokemon
  WHERE name IN ('Deoxys Attack', 'Regieleki', 'Lugia', 'Mewtwo', 'Primal Groudon')
`).all();
examples.forEach(p => console.log(`  ${p.name}: ${p.min_players_duo} (ATK: ${p.attack}, DEF: ${p.defense})`));

db.close();
