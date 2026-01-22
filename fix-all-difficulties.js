const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'pokemon.db'));

console.log('Retter ALLE urealistiske raid difficulty ratings...\n');

// === TIER 3-4 NORMAL RAIDS (9000 HP) - SOLO MULIGE ===
const easyNormalSolos = [
  // Meget lav defense - super easy solos
  { name: 'Pheromosa', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 80 },
  { name: 'Kartana', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 90 },
  { name: 'Honchkrow', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 110 },
  { name: 'Shadow Honchkrow', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 90 },
  { name: 'Victreebel', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 130 },
  { name: 'Shadow Victreebel', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 110 },
  { name: 'Xurkitree', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 140 },
  { name: 'Excadrill', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 150 },
  { name: 'Shadow Excadrill', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 125 },
  { name: 'Mamoswine', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 155 },
  { name: 'Shadow Mamoswine', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 130 },
  { name: 'Machamp', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 165 },
  { name: 'Shadow Machamp', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 140 },
  { name: 'Chandelure', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 160 },
  { name: 'Shadow Chandelure', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 135 },
  { name: 'Hydreigon', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 180 },
  { name: 'Shadow Hydreigon', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 150 },
  { name: 'Rhyperior', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 185 },
  { name: 'Primarina', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 190 },
];

// === TIER 3-4 IMPOSSIBLE/ANNOYING SOLOS - DUO MULIGE ===
const normalDuos = [
  { name: 'Guzzlord', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 250 }, // Massiv HP
  { name: 'Meltan', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 240 }, // Lav attack
  { name: 'Frogadier', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 200 },
  { name: 'Blissey', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 280 }, // Timeout tank!
  { name: 'Shuckle', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 290 }, // 396 defense!
];

// === TIER 5 LEGENDARY RAIDS (15000 HP) ===

// Solo legendary (kun Attack Deoxys!)
const legendariesSolo = [
  { name: 'Attack Deoxys', raid_soloable: 1, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 270 },
];

// Duo mulige legendaries (lav defense eller double weakness)
const legendariesDuo = [
  { name: 'Shadow Entei', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 180 },
  { name: 'Shadow Moltres', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 185 },
  { name: 'Shadow Raikou', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 190 },
  { name: 'Shadow Scizor', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 195 },
  { name: 'Genesect', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 200 },
  { name: 'Kyurem', raid_soloable: 0, min_players_duo: 1, min_players_trio: 1, estimated_ttw: 210 },
];

// Trio mulige legendaries (decent stats men ikke crazy)
const legendariesTrio = [
  { name: 'Hoopa Unbound', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 240 },
  { name: 'Regigigas', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 245 },
  { name: 'Dusk Mane Necrozma', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 250 },
  { name: 'Dawn Wings Necrozma', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 250 },
  { name: 'Zacian Hero', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 255 },
  { name: 'Zacian Crowned Sword', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 255 },
  { name: 'Zamazenta Hero', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 260 },
  { name: 'Zygarde 50%', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 260 },
  { name: 'Shadow Tyranitar', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 235 },
  { name: 'Shadow Kyogre', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 265 },
  { name: 'Shadow Groudon', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 265 },
];

// 4+ spillere (meget høj defense eller Primal/Ultra tanky)
const legendariesHard = [
  { name: 'Eternatus', raid_soloable: 0, min_players_duo: 0, min_players_trio: 0, estimated_ttw: 300 },
  { name: 'Armored Mewtwo', raid_soloable: 0, min_players_duo: 0, min_players_trio: 0, estimated_ttw: 300 },
  { name: 'Zamazenta Crowned Shield', raid_soloable: 0, min_players_duo: 0, min_players_trio: 0, estimated_ttw: 300 },
  { name: 'Arceus', raid_soloable: 0, min_players_duo: 0, min_players_trio: 0, estimated_ttw: 300 },
  { name: 'Primal Groudon', raid_soloable: 0, min_players_duo: 0, min_players_trio: 0, estimated_ttw: 300 },
  { name: 'Primal Kyogre', raid_soloable: 0, min_players_duo: 0, min_players_trio: 0, estimated_ttw: 300 },
];

// === MYTHICAL RAIDS (15000 HP) ===
const mythicalsTrio = [
  { name: 'Shaymin Sky', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 230 },
  { name: 'Keldeo', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 240 },
  { name: 'Victini', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 245 },
  { name: 'Zarude', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 240 },
  { name: 'Melmetal', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 250 },
  { name: 'Mew', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 255 },
  { name: 'Celebi', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 255 },
  { name: 'Jirachi', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 255 },
  { name: 'Shaymin Land', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 255 },
  { name: 'Meloetta Aria', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 260 },
];

// === MEGA RAIDS (15000-22500 HP) ===
const megasTrio = [
  { name: 'Mega Rayquaza', raid_soloable: 0, min_players_duo: 0, min_players_trio: 1, estimated_ttw: 270 },
];

// Kombiner alle arrays
const allUpdates = [
  ...easyNormalSolos,
  ...normalDuos,
  ...legendariesSolo,
  ...legendariesDuo,
  ...legendariesTrio,
  ...legendariesHard,
  ...mythicalsTrio,
  ...megasTrio
];

console.log(`Opdaterer ${allUpdates.length} Pokémon...\n`);

let soloCount = 0;
let duoCount = 0;
let trioCount = 0;
let hardCount = 0;

allUpdates.forEach(pokemon => {
  const result = db.prepare(`
    UPDATE pokemon
    SET raid_soloable = ?,
        min_players_duo = ?,
        min_players_trio = ?,
        estimated_ttw = ?
    WHERE name = ?
  `).run(
    pokemon.raid_soloable,
    pokemon.min_players_duo,
    pokemon.min_players_trio,
    pokemon.estimated_ttw,
    pokemon.name
  );

  if (result.changes > 0) {
    let badge = '';
    if (pokemon.raid_soloable === 1) {
      badge = '⭐ SOLO';
      soloCount++;
    } else if (pokemon.min_players_duo === 1) {
      badge = '💪 DUO ';
      duoCount++;
    } else if (pokemon.min_players_trio === 1) {
      badge = '👥 TRIO';
      trioCount++;
    } else {
      badge = '⚠️ 4+  ';
      hardCount++;
    }
    console.log(`${badge} - ${pokemon.name.padEnd(25)} (${pokemon.estimated_ttw}s TTW)`);
  } else {
    console.log(`❌ Ikke fundet: ${pokemon.name}`);
  }
});

console.log(`\n📊 Opdateret fordeling:`);
console.log(`   ⭐ Solo mulige: ${soloCount}`);
console.log(`   💪 Duo mulige: ${duoCount}`);
console.log(`   👥 Trio mulige: ${trioCount}`);
console.log(`   ⚠️ 4+ spillere: ${hardCount}`);
console.log(`\n✨ Færdig!`);
