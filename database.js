const Database = require('better-sqlite3');

// Opret eller åbn databasen
const db = new Database('pokemon.db');

console.log('Opretter database tabeller...');

// Lav tabel til Pokémon grundinfo
db.exec(`
  CREATE TABLE IF NOT EXISTS pokemon (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    pokedex_number INTEGER NOT NULL,
    types TEXT NOT NULL,
    weaknesses TEXT NOT NULL,
    attack INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    hp INTEGER NOT NULL,
    best_moveset TEXT NOT NULL,
    move_availability TEXT,
    category TEXT NOT NULL DEFAULT 'Normal',
    shiny_released INTEGER NOT NULL DEFAULT 0
  )
`);

// Lav tabel til CP værdier på forskellige levels
db.exec(`
  CREATE TABLE IF NOT EXISTS cp_values (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pokemon_id INTEGER NOT NULL,
    level INTEGER NOT NULL,
    cp INTEGER NOT NULL,
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id)
  )
`);

// Lav tabel til top attackers per type
db.exec(`
  CREATE TABLE IF NOT EXISTS type_attackers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    rank INTEGER NOT NULL,
    attacker_name TEXT NOT NULL,
    attacker_moveset TEXT NOT NULL,
    notes TEXT
  )
`);

console.log('Tabeller oprettet!');

// Tjek om vi allerede har data
const count = db.prepare('SELECT COUNT(*) as count FROM pokemon').get();

if (count.count === 0) {
  console.log('Indsætter start Pokémon...');

  // Indsæt 25 Pokémon med weaknesses, move availability, category og shiny_released
  const insertPokemon = db.prepare(`
    INSERT INTO pokemon (id, name, pokedex_number, types, weaknesses, attack, defense, hp, best_moveset, move_availability, category, shiny_released)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 1. Primal Groudon - Fire/Ground type (4x svag mod Water!, 2x mod Ground)
  insertPokemon.run(1, 'Primal Groudon', 383, 'Fire/Ground', 'Water:2.56x,Ground:1.6x', 353, 268, 218, 'Mud Shot + Precipice Blades', 'legacy', 'Primal', 1);

  // 2. Primal Kyogre - Water type (svag mod Grass, Electric)
  insertPokemon.run(2, 'Primal Kyogre', 382, 'Water', 'Grass:1.6x,Electric:1.6x', 353, 268, 205, 'Waterfall + Origin Pulse', 'legacy', 'Primal', 1);

  // 3. Mega Rayquaza - Dragon/Flying (svag mod Ice [4x], Rock, Dragon, Fairy)
  insertPokemon.run(3, 'Mega Rayquaza', 384, 'Dragon/Flying', 'Ice:2.56x,Rock:1.6x,Dragon:1.6x,Fairy:1.6x', 377, 210, 233, 'Dragon Tail + Dragon Ascent', 'legacy', 'Mega', 1);

  // 4. Dialga - Steel/Dragon (svag mod Fighting, Ground)
  insertPokemon.run(4, 'Dialga', 483, 'Steel/Dragon', 'Fighting:1.6x,Ground:1.6x', 275, 211, 205, 'Metal Claw + Draco Meteor', 'normal', 'Legendary', 1);

  // 5. Mewtwo - Psychic (svag mod Bug, Ghost, Dark)
  insertPokemon.run(5, 'Mewtwo', 150, 'Psychic', 'Bug:1.6x,Ghost:1.6x,Dark:1.6x', 300, 182, 214, 'Psycho Cut + Psystrike', 'elite', 'Legendary', 1);

  // 6. Zacian Hero - Fairy (svag mod Poison, Steel)
  insertPokemon.run(6, 'Zacian Hero', 888, 'Fairy', 'Poison:1.6x,Steel:1.6x', 254, 236, 192, 'Metal Claw + Close Combat', 'normal', 'Legendary', 1);

  // 7. Zacian Crowned Sword - Fairy/Steel (svag mod Fire, Ground)
  insertPokemon.run(7, 'Zacian Crowned Sword', 888, 'Fairy/Steel', 'Fire:1.6x,Ground:1.6x', 254, 236, 192, 'Metal Claw + Behemoth Blade', 'normal', 'Legendary', 1);

  // 8. Zamazenta Hero - Fighting (svag mod Flying, Psychic, Fairy)
  insertPokemon.run(8, 'Zamazenta Hero', 889, 'Fighting', 'Flying:1.6x,Psychic:1.6x,Fairy:1.6x', 254, 236, 192, 'Metal Claw + Close Combat', 'normal', 'Legendary', 1);

  // 9. Zamazenta Crowned Shield - Fighting/Steel (svag mod Fire, Fighting, Ground)
  insertPokemon.run(9, 'Zamazenta Crowned Shield', 889, 'Fighting/Steel', 'Fire:1.6x,Fighting:1.6x,Ground:1.6x', 231, 282, 192, 'Metal Claw + Behemoth Bash', 'normal', 'Legendary', 1);

  // 10. Dusk Mane Necrozma - Psychic/Steel (svag mod Fire, Ground, Ghost, Dark)
  insertPokemon.run(10, 'Dusk Mane Necrozma', 800, 'Psychic/Steel', 'Fire:1.6x,Ground:1.6x,Ghost:1.6x,Dark:1.6x', 277, 220, 200, 'Metal Claw + Sunsteel Strike', 'legacy', 'Legendary', 1);

  // 11. Dawn Wings Necrozma - Psychic/Ghost (svag mod Ghost, Dark)
  insertPokemon.run(11, 'Dawn Wings Necrozma', 800, 'Psychic/Ghost', 'Ghost:1.6x,Dark:1.6x', 277, 220, 200, 'Shadow Claw + Moongeist Beam', 'normal', 'Legendary', 1);

  // 12. Black Kyurem - Dragon/Ice (svag mod Fighting [2x], Rock [4x], Steel [2x], Dragon [2x], Fairy [2x])
  insertPokemon.run(12, 'Black Kyurem', 646, 'Dragon/Ice', 'Fighting:1.6x,Rock:2.56x,Steel:1.6x,Dragon:1.6x,Fairy:1.6x', 310, 183, 245, 'Dragon Tail + Fusion Bolt', 'legacy', 'Legendary', 1);

  // 13. White Kyurem - Dragon/Ice (svag mod Fighting [2x], Rock [4x], Steel [2x], Dragon [2x], Fairy [2x])
  insertPokemon.run(13, 'White Kyurem', 646, 'Dragon/Ice', 'Fighting:1.6x,Rock:2.56x,Steel:1.6x,Dragon:1.6x,Fairy:1.6x', 310, 183, 245, 'Ice Fang + Fusion Flare', 'legacy', 'Legendary', 1);

  // 14. Rayquaza - Dragon/Flying (svag mod Ice [4x], Rock, Dragon, Fairy)
  insertPokemon.run(14, 'Rayquaza', 384, 'Dragon/Flying', 'Ice:2.56x,Rock:1.6x,Dragon:1.6x,Fairy:1.6x', 284, 170, 213, 'Dragon Tail + Breaking Swipe', 'normal', 'Legendary', 1);

  // 15. Kyogre - Water (svag mod Grass, Electric)
  insertPokemon.run(15, 'Kyogre', 382, 'Water', 'Grass:1.6x,Electric:1.6x', 270, 228, 205, 'Waterfall + Origin Pulse', 'normal', 'Legendary', 1);

  // 16. Groudon - Ground (svag mod Water, Grass, Ice)
  insertPokemon.run(16, 'Groudon', 383, 'Ground', 'Water:1.6x,Grass:1.6x,Ice:1.6x', 270, 228, 205, 'Mud Shot + Precipice Blades', 'legacy', 'Legendary', 1);

  // 17. Articuno - Ice/Flying (svag mod Rock [4x], Fire, Electric, Steel)
  insertPokemon.run(17, 'Articuno', 144, 'Ice/Flying', 'Rock:2.56x,Fire:1.6x,Electric:1.6x,Steel:1.6x', 192, 236, 207, 'Frost Breath + Triple Axel', 'normal', 'Legendary', 1);

  // 18. Zapdos - Electric/Flying (svag mod Ice, Rock [2x])
  insertPokemon.run(18, 'Zapdos', 145, 'Electric/Flying', 'Ice:1.6x,Rock:1.6x', 253, 185, 207, 'Thunder Shock + Drill Peck', 'normal', 'Legendary', 1);

  // 19. Moltres - Fire/Flying (svag mod Rock [4x], Water, Electric)
  insertPokemon.run(19, 'Moltres', 146, 'Fire/Flying', 'Rock:2.56x,Water:1.6x,Electric:1.6x', 251, 184, 207, 'Fire Spin + Sky Attack', 'elite', 'Legendary', 1);

  // 20. Raikou - Electric (svag mod Ground)
  insertPokemon.run(20, 'Raikou', 243, 'Electric', 'Ground:1.6x', 241, 195, 207, 'Thunder Shock + Wild Charge', 'normal', 'Legendary', 1);

  // 21. Entei - Fire (svag mod Water, Ground, Rock)
  insertPokemon.run(21, 'Entei', 244, 'Fire', 'Water:1.6x,Ground:1.6x,Rock:1.6x', 235, 171, 251, 'Fire Fang + Overheat', 'normal', 'Legendary', 1);

  // 22. Suicune - Water (svag mod Grass, Electric)
  insertPokemon.run(22, 'Suicune', 245, 'Water', 'Grass:1.6x,Electric:1.6x', 180, 235, 225, 'Snarl + Hydro Pump', 'normal', 'Legendary', 1);

  // 23. Mega Sceptile - Grass/Dragon (svag mod Ice [4x], Poison, Flying, Bug, Dragon, Fairy)
  insertPokemon.run(23, 'Mega Sceptile', 254, 'Grass/Dragon', 'Ice:2.56x,Poison:1.6x,Flying:1.6x,Bug:1.6x,Dragon:1.6x,Fairy:1.6x', 320, 186, 172, 'Bullet Seed + Frenzy Plant', 'elite', 'Mega', 1);

  // 24. Mega Blaziken - Fire/Fighting (svag mod Water, Ground [2x], Flying, Psychic)
  insertPokemon.run(24, 'Mega Blaziken', 257, 'Fire/Fighting', 'Water:1.6x,Ground:1.6x,Flying:1.6x,Psychic:1.6x', 329, 168, 176, 'Counter + Aura Sphere', 'normal', 'Mega', 1);

  // 25. Mega Swampert - Water/Ground (svag mod Grass [4x])
  insertPokemon.run(25, 'Mega Swampert', 260, 'Water/Ground', 'Grass:2.56x', 283, 218, 225, 'Water Gun + Hydro Cannon', 'elite', 'Mega', 1);

  // 26. Mega Charizard Y - Fire/Flying (svag mod Rock [4x], Water, Electric)
  insertPokemon.run(26, 'Mega Charizard Y', 6, 'Fire/Flying', 'Rock:2.56x,Water:1.6x,Electric:1.6x', 354, 266, 186, 'Fire Spin + Blast Burn', 'elite', 'Mega', 1);

  // 27. Mega Garchomp - Dragon/Ground (svag mod Ice [4x], Dragon, Fairy)
  insertPokemon.run(27, 'Mega Garchomp', 445, 'Dragon/Ground', 'Ice:2.56x,Dragon:1.6x,Fairy:1.6x', 339, 222, 239, 'Dragon Tail + Breaking Swipe', 'normal', 'Mega', 1);

  // 28. Mega Gardevoir - Psychic/Fairy (svag mod Ghost, Poison, Steel)
  insertPokemon.run(28, 'Mega Gardevoir', 282, 'Psychic/Fairy', 'Ghost:1.6x,Poison:1.6x,Steel:1.6x', 326, 229, 169, 'Charm + Dazzling Gleam', 'normal', 'Mega', 1);

  // 29. Xurkitree - Electric (svag mod Ground)
  insertPokemon.run(29, 'Xurkitree', 796, 'Electric', 'Ground:1.6x', 330, 144, 195, 'Thunder Shock + Discharge', 'normal', 'Ultra Beast', 0);

  // 30. Kartana - Grass/Steel (svag mod Fire [4x], Fighting)
  insertPokemon.run(30, 'Kartana', 798, 'Grass/Steel', 'Fire:2.56x,Fighting:1.6x', 323, 182, 139, 'Razor Leaf + Leaf Blade', 'normal', 'Ultra Beast', 0);

  // 31. Eternatus - Poison/Dragon (svag mod Ground, Psychic, Ice, Dragon)
  insertPokemon.run(31, 'Eternatus', 890, 'Poison/Dragon', 'Ground:1.6x,Psychic:1.6x,Ice:1.6x,Dragon:1.6x', 310, 275, 277, 'Dragon Tail + Dynamax Cannon', 'normal', 'Legendary', 1);

  // 32. Tyranitar - Rock/Dark (svag mod Fighting [4x], Ground, Bug, Steel, Water, Grass, Fairy)
  insertPokemon.run(32, 'Tyranitar', 248, 'Rock/Dark', 'Fighting:2.56x,Ground:1.6x,Bug:1.6x,Steel:1.6x,Water:1.6x,Grass:1.6x,Fairy:1.6x', 251, 207, 225, 'Smack Down + Stone Edge', 'elite', 'Normal', 1);

  // 33. Mega Tyranitar - Rock/Dark (svag mod Fighting [4x], Ground, Bug, Steel, Water, Grass, Fairy)
  insertPokemon.run(33, 'Mega Tyranitar', 248, 'Rock/Dark', 'Fighting:2.56x,Ground:1.6x,Bug:1.6x,Steel:1.6x,Water:1.6x,Grass:1.6x,Fairy:1.6x', 309, 276, 225, 'Bite + Brutal Swing', 'normal', 'Mega', 1);

  // 34. Lucario - Fighting/Steel (svag mod Fire, Fighting, Ground)
  insertPokemon.run(34, 'Lucario', 448, 'Fighting/Steel', 'Fire:1.6x,Fighting:1.6x,Ground:1.6x', 236, 144, 172, 'Force Palm + Aura Sphere', 'elite', 'Normal', 1);

  // 35. Mega Lucario - Fighting/Steel (svag mod Fire, Fighting, Ground)
  insertPokemon.run(35, 'Mega Lucario', 448, 'Fighting/Steel', 'Fire:1.6x,Fighting:1.6x,Ground:1.6x', 310, 175, 172, 'Force Palm + Aura Sphere', 'elite', 'Mega', 1);

  // 36. Rhyperior - Ground/Rock (svag mod Water [4x], Grass [4x], Fighting, Ground, Steel, Ice)
  insertPokemon.run(36, 'Rhyperior', 464, 'Ground/Rock', 'Water:2.56x,Grass:2.56x,Fighting:1.6x,Ground:1.6x,Steel:1.6x,Ice:1.6x', 241, 190, 251, 'Smack Down + Rock Wrecker', 'elite', 'Normal', 1);

  // 37. Terrakion - Rock/Fighting (svag mod Fighting, Ground, Psychic, Water, Grass, Fairy, Steel)
  insertPokemon.run(37, 'Terrakion', 639, 'Rock/Fighting', 'Fighting:1.6x,Ground:1.6x,Psychic:1.6x,Water:1.6x,Grass:1.6x,Fairy:1.6x,Steel:1.6x', 260, 192, 209, 'Double Kick + Sacred Sword', 'elite', 'Normal', 1);

  // 38. Mamoswine - Ice/Ground (svag mod Fighting, Fire, Grass, Steel, Water)
  insertPokemon.run(38, 'Mamoswine', 473, 'Ice/Ground', 'Fighting:1.6x,Fire:1.6x,Grass:1.6x,Steel:1.6x,Water:1.6x', 247, 146, 242, 'Powder Snow + Avalanche', 'normal', 'Normal', 1);

  // 39. Zekrom - Dragon/Electric (svag mod Dragon, Fairy, Ground, Ice)
  insertPokemon.run(39, 'Zekrom', 644, 'Dragon/Electric', 'Dragon:1.6x,Fairy:1.6x,Ground:1.6x,Ice:1.6x', 275, 211, 205, 'Dragon Breath + Fusion Bolt', 'elite', 'Legendary', 1);

  // 40. Zarude - Dark/Grass (svag mod Bug, Fairy, Fighting, Fire, Flying, Ice, Poison)
  insertPokemon.run(40, 'Zarude', 893, 'Dark/Grass', 'Bug:1.6x,Fairy:1.6x,Fighting:1.6x,Fire:1.6x,Flying:1.6x,Ice:1.6x,Poison:1.6x', 245, 191, 190, 'Vine Whip + Power Whip', 'normal', 'Mythical', 0);

  // 41. Hoopa Unbound - Psychic/Dark (svag mod Bug, Fairy)
  insertPokemon.run(41, 'Hoopa Unbound', 720, 'Psychic/Dark', 'Bug:1.6x,Fairy:1.6x', 311, 191, 173, 'Astonish + Dark Pulse', 'normal', 'Mythical', 0);

  // 42. Pheromosa - Bug/Fighting (svag mod Flying [4x], Fire, Fairy, Psychic)
  insertPokemon.run(42, 'Pheromosa', 795, 'Bug/Fighting', 'Flying:2.56x,Fire:1.6x,Fairy:1.6x,Psychic:1.6x', 316, 85, 174, 'Bug Bite + Bug Buzz', 'normal', 'Ultra Beast', 0);

  // 43. Nihilego - Rock/Poison (svag mod Water, Ground [2x], Psychic, Steel)
  insertPokemon.run(43, 'Nihilego', 793, 'Rock/Poison', 'Water:1.6x,Ground:1.6x,Psychic:1.6x,Steel:1.6x', 249, 210, 240, 'Poison Jab + Sludge Bomb', 'normal', 'Ultra Beast', 0);

  // 44. Primarina - Water/Fairy (svag mod Electric, Grass, Poison)
  insertPokemon.run(44, 'Primarina', 730, 'Water/Fairy', 'Electric:1.6x,Grass:1.6x,Poison:1.6x', 232, 195, 190, 'Charm + Moonblast', 'normal', 'Normal', 1);

  // 45. Mega Gengar - Ghost/Poison (svag mod Dark, Ghost, Ground, Psychic)
  insertPokemon.run(45, 'Mega Gengar', 94, 'Ghost/Poison', 'Dark:1.6x,Ghost:1.6x,Ground:1.6x,Psychic:1.6x', 349, 199, 155, 'Shadow Claw + Shadow Ball', 'normal', 'Mega', 1);

  // 46. Mega Alakazam - Psychic (svag mod Bug, Dark, Ghost)
  insertPokemon.run(46, 'Mega Alakazam', 65, 'Psychic', 'Bug:1.6x,Dark:1.6x,Ghost:1.6x', 367, 207, 146, 'Psycho Cut + Psychic', 'normal', 'Mega', 1);

  // 47. Mega Beedrill - Bug/Poison (svag mod Fire, Flying, Psychic, Rock)
  insertPokemon.run(47, 'Mega Beedrill', 15, 'Bug/Poison', 'Fire:1.6x,Flying:1.6x,Psychic:1.6x,Rock:1.6x', 303, 148, 163, 'Poison Jab + Sludge Bomb', 'normal', 'Mega', 1);

  // 48. Mega Heracross - Bug/Fighting (svag mod Flying 4x, Fire, Psychic, Fairy)
  insertPokemon.run(48, 'Mega Heracross', 214, 'Bug/Fighting', 'Flying:2.56x,Fire:1.6x,Psychic:1.6x,Fairy:1.6x', 334, 223, 190, 'Struggle Bug + Megahorn', 'normal', 'Mega', 1);

  // 49. Mega Scizor - Bug/Steel (svag mod Fire 2x)
  insertPokemon.run(49, 'Mega Scizor', 212, 'Bug/Steel', 'Fire:1.6x', 279, 250, 172, 'Fury Cutter + X-Scissor', 'normal', 'Mega', 1);

  // 50. Scizor - Bug/Steel (svag mod Fire 4x)
  insertPokemon.run(50, 'Scizor', 212, 'Bug/Steel', 'Fire:2.56x', 236, 181, 172, 'Fury Cutter + X-Scissor', 'normal', 'Normal', 1);

  // 51. Machamp - Fighting (svag mod Fairy, Flying, Psychic)
  insertPokemon.run(51, 'Machamp', 68, 'Fighting', 'Fairy:1.6x,Flying:1.6x,Psychic:1.6x', 234, 159, 207, 'Counter + Dynamic Punch', 'normal', 'Normal', 1);

  // 52. Excadrill - Ground/Steel (svag mod Fighting, Fire, Ground, Water)
  insertPokemon.run(52, 'Excadrill', 530, 'Ground/Steel', 'Fighting:1.6x,Fire:1.6x,Ground:1.6x,Water:1.6x', 255, 129, 242, 'Mud-Slap + Scorching Sands', 'normal', 'Normal', 1);

  // 53. Hydreigon - Dark/Dragon (svag mod Fairy 4x, Bug, Dragon, Fighting, Ice)
  insertPokemon.run(53, 'Hydreigon', 635, 'Dark/Dragon', 'Fairy:2.56x,Bug:1.6x,Dragon:1.6x,Fighting:1.6x,Ice:1.6x', 256, 188, 211, 'Bite + Brutal Swing', 'elite', 'Normal', 1);

  // 54. Chandelure - Ghost/Fire (svag mod Dark, Ghost, Ground, Rock, Water)
  insertPokemon.run(54, 'Chandelure', 609, 'Ghost/Fire', 'Dark:1.6x,Ghost:1.6x,Ground:1.6x,Rock:1.6x,Water:1.6x', 271, 182, 155, 'Hex + Shadow Ball', 'normal', 'Normal', 1);

  // 55. Honchkrow - Dark/Flying (svag mod Electric, Fairy, Ice, Rock)
  insertPokemon.run(55, 'Honchkrow', 430, 'Dark/Flying', 'Electric:1.6x,Fairy:1.6x,Ice:1.6x,Rock:1.6x', 243, 103, 200, 'Snarl + Sky Attack', 'normal', 'Normal', 1);

  // 56. Victreebel - Grass/Poison (svag mod Fire, Flying, Ice, Psychic)
  insertPokemon.run(56, 'Victreebel', 71, 'Grass/Poison', 'Fire:1.6x,Flying:1.6x,Ice:1.6x,Psychic:1.6x', 207, 135, 190, 'Razor Leaf + Leaf Blade', 'normal', 'Normal', 1);

  // ===== SHADOW POKÉMON (ID 57-71) =====
  // Shadow versioner har samme stats som normale, men får Shadow prefix i navnet

  // 57. Shadow Mewtwo (baseret på ID 5)
  insertPokemon.run(57, 'Shadow Mewtwo', 150, 'Psychic', 'Bug:1.6x,Ghost:1.6x,Dark:1.6x', 300, 182, 214, 'Psycho Cut + Psystrike', 'elite', 'Shadow', 1);

  // 58. Shadow Kyogre (baseret på ID 15)
  insertPokemon.run(58, 'Shadow Kyogre', 382, 'Water', 'Grass:1.6x,Electric:1.6x', 270, 228, 205, 'Waterfall + Origin Pulse', 'normal', 'Shadow', 1);

  // 59. Shadow Groudon (baseret på ID 16)
  insertPokemon.run(59, 'Shadow Groudon', 383, 'Ground', 'Water:1.6x,Grass:1.6x,Ice:1.6x', 270, 228, 205, 'Mud Shot + Precipice Blades', 'legacy', 'Shadow', 1);

  // 60. Shadow Raikou (baseret på ID 20)
  insertPokemon.run(60, 'Shadow Raikou', 243, 'Electric', 'Ground:1.6x', 241, 195, 207, 'Thunder Shock + Wild Charge', 'normal', 'Shadow', 1);

  // 61. Shadow Entei (baseret på ID 21)
  insertPokemon.run(61, 'Shadow Entei', 244, 'Fire', 'Water:1.6x,Ground:1.6x,Rock:1.6x', 235, 171, 251, 'Fire Fang + Overheat', 'normal', 'Shadow', 1);

  // 62. Shadow Moltres (baseret på ID 19)
  insertPokemon.run(62, 'Shadow Moltres', 146, 'Fire/Flying', 'Rock:2.56x,Water:1.6x,Electric:1.6x', 251, 184, 207, 'Fire Spin + Sky Attack', 'elite', 'Shadow', 1);

  // 63. Shadow Mamoswine (baseret på ID 38)
  insertPokemon.run(63, 'Shadow Mamoswine', 473, 'Ice/Ground', 'Fighting:1.6x,Fire:1.6x,Grass:1.6x,Steel:1.6x,Water:1.6x', 247, 146, 242, 'Powder Snow + Avalanche', 'normal', 'Shadow', 1);

  // 64. Shadow Scizor (baseret på ID 50)
  insertPokemon.run(64, 'Shadow Scizor', 212, 'Bug/Steel', 'Fire:2.56x', 236, 181, 172, 'Fury Cutter + X-Scissor', 'normal', 'Shadow', 1);

  // 65. Shadow Tyranitar (baseret på ID 32)
  insertPokemon.run(65, 'Shadow Tyranitar', 248, 'Rock/Dark', 'Fighting:2.56x,Ground:1.6x,Bug:1.6x,Steel:1.6x,Water:1.6x,Grass:1.6x,Fairy:1.6x', 251, 207, 225, 'Smack Down + Stone Edge', 'elite', 'Shadow', 1);

  // 66. Shadow Machamp (baseret på ID 51)
  insertPokemon.run(66, 'Shadow Machamp', 68, 'Fighting', 'Fairy:1.6x,Flying:1.6x,Psychic:1.6x', 234, 159, 207, 'Counter + Dynamic Punch', 'normal', 'Shadow', 1);

  // 67. Shadow Excadrill (baseret på ID 52)
  insertPokemon.run(67, 'Shadow Excadrill', 530, 'Ground/Steel', 'Fighting:1.6x,Fire:1.6x,Ground:1.6x,Water:1.6x', 255, 129, 242, 'Mud-Slap + Scorching Sands', 'normal', 'Shadow', 1);

  // 68. Shadow Hydreigon (baseret på ID 53)
  insertPokemon.run(68, 'Shadow Hydreigon', 635, 'Dark/Dragon', 'Fairy:2.56x,Bug:1.6x,Dragon:1.6x,Fighting:1.6x,Ice:1.6x', 256, 188, 211, 'Bite + Brutal Swing', 'elite', 'Shadow', 1);

  // 69. Shadow Chandelure (baseret på ID 54)
  insertPokemon.run(69, 'Shadow Chandelure', 609, 'Ghost/Fire', 'Dark:1.6x,Ghost:1.6x,Ground:1.6x,Rock:1.6x,Water:1.6x', 271, 182, 155, 'Hex + Shadow Ball', 'normal', 'Shadow', 1);

  // 70. Shadow Honchkrow (baseret på ID 55)
  insertPokemon.run(70, 'Shadow Honchkrow', 430, 'Dark/Flying', 'Electric:1.6x,Fairy:1.6x,Ice:1.6x,Rock:1.6x', 243, 103, 200, 'Snarl + Sky Attack', 'normal', 'Shadow', 1);

  // 71. Shadow Victreebel (baseret på ID 56)
  insertPokemon.run(71, 'Shadow Victreebel', 71, 'Grass/Poison', 'Fire:1.6x,Flying:1.6x,Ice:1.6x,Psychic:1.6x', 207, 135, 190, 'Razor Leaf + Leaf Blade', 'normal', 'Shadow', 1);

  // ===== META LEGENDARY POKÉMON (ID 72-89) =====

  // 72. Lugia - Psychic/Flying (svag mod Electric, Ice, Rock, Ghost, Dark)
  insertPokemon.run(72, 'Lugia', 249, 'Psychic/Flying', 'Electric:1.6x,Ice:1.6x,Rock:1.6x,Ghost:1.6x,Dark:1.6x', 193, 310, 235, 'Extrasensory + Aeroblast', 'elite', 'Legendary', 1);

  // 73. Ho-Oh - Fire/Flying (svag mod Rock 4x, Electric, Water)
  insertPokemon.run(73, 'Ho-Oh', 250, 'Fire/Flying', 'Rock:2.56x,Electric:1.6x,Water:1.6x', 239, 244, 214, 'Incinerate + Sacred Fire', 'elite', 'Legendary', 1);

  // 74. Latias - Dragon/Psychic (svag mod Bug, Ghost, Ice, Dragon, Dark, Fairy)
  insertPokemon.run(74, 'Latias', 380, 'Dragon/Psychic', 'Bug:1.6x,Ghost:1.6x,Ice:1.6x,Dragon:1.6x,Dark:1.6x,Fairy:1.6x', 228, 246, 190, 'Dragon Breath + Aura Sphere', 'normal', 'Legendary', 1);

  // 75. Latios - Dragon/Psychic (svag mod Bug, Ghost, Ice, Dragon, Dark, Fairy)
  insertPokemon.run(75, 'Latios', 381, 'Dragon/Psychic', 'Bug:1.6x,Ghost:1.6x,Ice:1.6x,Dragon:1.6x,Dark:1.6x,Fairy:1.6x', 268, 212, 190, 'Dragon Breath + Aura Sphere', 'normal', 'Legendary', 1);

  // 76. Deoxys Attack - Psychic (svag mod Bug, Ghost, Dark)
  insertPokemon.run(76, 'Deoxys Attack', 386, 'Psychic', 'Bug:1.6x,Ghost:1.6x,Dark:1.6x', 414, 46, 75, 'Zen Headbutt + Dark Pulse', 'normal', 'Legendary', 1);

  // 77. Palkia - Water/Dragon (svag mod Dragon, Fairy)
  insertPokemon.run(77, 'Palkia', 484, 'Water/Dragon', 'Dragon:1.6x,Fairy:1.6x', 280, 215, 189, 'Dragon Tail + Spacial Rend', 'normal', 'Legendary', 1);

  // 78. Palkia Origin - Water/Dragon (svag mod Dragon, Fairy)
  insertPokemon.run(78, 'Palkia Origin', 484, 'Water/Dragon', 'Dragon:1.6x,Fairy:1.6x', 286, 215, 189, 'Dragon Tail + Spacial Rend', 'normal', 'Legendary', 1);

  // 79. Giratina Origin - Ghost/Dragon (svag mod Ghost, Ice, Dragon, Dark, Fairy)
  insertPokemon.run(79, 'Giratina Origin', 487, 'Ghost/Dragon', 'Ghost:1.6x,Ice:1.6x,Dragon:1.6x,Dark:1.6x,Fairy:1.6x', 225, 187, 284, 'Dragon Tail + Shadow Force', 'elite', 'Legendary', 1);

  // 80. Darkrai - Dark (svag mod Bug, Fairy, Fighting)
  insertPokemon.run(80, 'Darkrai', 491, 'Dark', 'Bug:1.6x,Fairy:1.6x,Fighting:1.6x', 285, 198, 172, 'Snarl + Shadow Ball', 'normal', 'Legendary', 1);

  // 81. Heatran - Fire/Steel (svag mod Ground 4x, Fighting, Water)
  insertPokemon.run(81, 'Heatran', 485, 'Fire/Steel', 'Ground:2.56x,Fighting:1.6x,Water:1.6x', 251, 213, 209, 'Fire Spin + Magma Storm', 'elite', 'Legendary', 1);

  // 82. Reshiram - Dragon/Fire (svag mod Ground, Rock, Dragon)
  insertPokemon.run(82, 'Reshiram', 643, 'Dragon/Fire', 'Ground:1.6x,Rock:1.6x,Dragon:1.6x', 275, 211, 205, 'Fire Fang + Fusion Flare', 'elite', 'Legendary', 1);

  // 83. Landorus Therian - Ground/Flying (svag mod Ice 4x, Water)
  insertPokemon.run(83, 'Landorus Therian', 645, 'Ground/Flying', 'Ice:2.56x,Water:1.6x', 289, 179, 205, 'Mud Shot + Sandsear Storm', 'normal', 'Legendary', 1);

  // 84. Genesect - Bug/Steel (svag mod Fire 4x)
  insertPokemon.run(84, 'Genesect', 649, 'Bug/Steel', 'Fire:2.56x', 252, 199, 174, 'Fury Cutter + Techno Blast', 'normal', 'Legendary', 1);

  // 85. Cobalion - Steel/Fighting (svag mod Fighting, Ground, Fire)
  insertPokemon.run(85, 'Cobalion', 638, 'Steel/Fighting', 'Fighting:1.6x,Ground:1.6x,Fire:1.6x', 192, 229, 209, 'Metal Claw + Sacred Sword', 'normal', 'Legendary', 1);

  // 86. Virizion - Grass/Fighting (svag mod Flying 4x, Fire, Psychic, Ice, Poison, Fairy)
  insertPokemon.run(86, 'Virizion', 640, 'Grass/Fighting', 'Flying:2.56x,Fire:1.6x,Psychic:1.6x,Ice:1.6x,Poison:1.6x,Fairy:1.6x', 192, 229, 209, 'Double Kick + Sacred Sword', 'normal', 'Legendary', 1);

  // 87. Xerneas - Fairy (svag mod Poison, Steel)
  insertPokemon.run(87, 'Xerneas', 716, 'Fairy', 'Poison:1.6x,Steel:1.6x', 250, 185, 246, 'Geomancy + Giga Impact', 'normal', 'Legendary', 1);

  // 88. Yveltal - Dark/Flying (svag mod Electric, Ice, Rock, Fairy)
  insertPokemon.run(88, 'Yveltal', 717, 'Dark/Flying', 'Electric:1.6x,Ice:1.6x,Rock:1.6x,Fairy:1.6x', 250, 185, 246, 'Snarl + Oblivion Wing', 'elite', 'Legendary', 1);

  // 89. Solgaleo - Psychic/Steel (svag mod Ground, Ghost, Fire, Dark)
  insertPokemon.run(89, 'Solgaleo', 791, 'Psychic/Steel', 'Ground:1.6x,Ghost:1.6x,Fire:1.6x,Dark:1.6x', 255, 191, 264, 'Zen Headbutt + Solar Beam', 'normal', 'Legendary', 1);

  // 90. Lunala - Psychic/Ghost (svag mod Ghost 4x, Dark 4x)
  insertPokemon.run(90, 'Lunala', 792, 'Psychic/Ghost', 'Ghost:2.56x,Dark:2.56x', 255, 191, 264, 'Confusion + Shadow Ball', 'normal', 'Legendary', 1);

  // ===== GENERATION 1-2 LEGENDARIES (ID 91-95) =====

  // 91. Mew - Psychic (svag mod Bug, Ghost, Dark)
  insertPokemon.run(91, 'Mew', 151, 'Psychic', 'Bug:1.6x,Ghost:1.6x,Dark:1.6x', 210, 210, 225, 'Shadow Claw + Wild Charge', 'normal', 'Mythical', 1);

  // 92. Celebi - Psychic/Grass (svag mod Bug 4x, Fire, Ice, Poison, Flying, Ghost, Dark)
  insertPokemon.run(92, 'Celebi', 251, 'Psychic/Grass', 'Bug:2.56x,Fire:1.6x,Ice:1.6x,Poison:1.6x,Flying:1.6x,Ghost:1.6x,Dark:1.6x', 210, 210, 225, 'Magical Leaf + Dazzling Gleam', 'normal', 'Mythical', 1);

  // ===== GENERATION 3 LEGENDARIES - REGIS (ID 93-96) =====

  // 93. Regirock - Rock (svag mod Fighting, Ground, Steel, Water, Grass)
  insertPokemon.run(93, 'Regirock', 377, 'Rock', 'Fighting:1.6x,Ground:1.6x,Steel:1.6x,Water:1.6x,Grass:1.6x', 179, 309, 190, 'Lock-On + Stone Edge', 'normal', 'Legendary', 1);

  // 94. Regice - Ice (svag mod Fighting, Rock, Steel, Fire)
  insertPokemon.run(94, 'Regice', 378, 'Ice', 'Fighting:1.6x,Rock:1.6x,Steel:1.6x,Fire:1.6x', 179, 309, 190, 'Lock-On + Blizzard', 'normal', 'Legendary', 1);

  // 95. Registeel - Steel (svag mod Fighting, Ground, Fire)
  insertPokemon.run(95, 'Registeel', 379, 'Steel', 'Fighting:1.6x,Ground:1.6x,Fire:1.6x', 143, 285, 190, 'Lock-On + Focus Blast', 'normal', 'Legendary', 1);

  // 96. Jirachi - Steel/Psychic (svag mod Fire, Ground, Ghost, Dark)
  insertPokemon.run(96, 'Jirachi', 385, 'Steel/Psychic', 'Fire:1.6x,Ground:1.6x,Ghost:1.6x,Dark:1.6x', 210, 210, 225, 'Charge Beam + Doom Desire', 'elite', 'Mythical', 1);

  // ===== GENERATION 4 LEGENDARIES (ID 97-106) =====

  // 97. Uxie - Psychic (svag mod Bug, Ghost, Dark)
  insertPokemon.run(97, 'Uxie', 480, 'Psychic', 'Bug:1.6x,Ghost:1.6x,Dark:1.6x', 156, 270, 181, 'Confusion + Future Sight', 'normal', 'Legendary', 1);

  // 98. Mesprit - Psychic (svag mod Bug, Ghost, Dark)
  insertPokemon.run(98, 'Mesprit', 481, 'Psychic', 'Bug:1.6x,Ghost:1.6x,Dark:1.6x', 212, 212, 190, 'Confusion + Future Sight', 'normal', 'Legendary', 1);

  // 99. Azelf - Psychic (svag mod Bug, Ghost, Dark)
  insertPokemon.run(99, 'Azelf', 482, 'Psychic', 'Bug:1.6x,Ghost:1.6x,Dark:1.6x', 270, 151, 181, 'Confusion + Future Sight', 'normal', 'Legendary', 1);

  // 100. Dialga Origin - Steel/Dragon (svag mod Fighting, Ground)
  insertPokemon.run(100, 'Dialga Origin', 483, 'Steel/Dragon', 'Fighting:1.6x,Ground:1.6x', 281, 211, 205, 'Metal Claw + Roar of Time', 'normal', 'Legendary', 1);

  // 101. Giratina Altered - Ghost/Dragon (svag mod Ghost, Ice, Dragon, Dark, Fairy)
  insertPokemon.run(101, 'Giratina Altered', 487, 'Ghost/Dragon', 'Ghost:1.6x,Ice:1.6x,Dragon:1.6x,Dark:1.6x,Fairy:1.6x', 187, 225, 284, 'Shadow Claw + Shadow Force', 'elite', 'Legendary', 1);

  // 102. Cresselia - Psychic (svag mod Bug, Ghost, Dark)
  insertPokemon.run(102, 'Cresselia', 488, 'Psychic', 'Bug:1.6x,Ghost:1.6x,Dark:1.6x', 152, 258, 260, 'Psycho Cut + Moonblast', 'elite', 'Legendary', 1);

  // 103. Regigigas - Normal (svag mod Fighting)
  insertPokemon.run(103, 'Regigigas', 486, 'Fighting:1.6x', 287, 210, 221, 'Hidden Power + Giga Impact', 'normal', 'normal', 'Legendary', 1);

  // 104. Shaymin Land - Grass (svag mod Bug, Fire, Flying, Ice, Poison)
  insertPokemon.run(104, 'Shaymin Land', 492, 'Grass', 'Bug:1.6x,Fire:1.6x,Flying:1.6x,Ice:1.6x,Poison:1.6x', 210, 210, 225, 'Hidden Power + Grass Knot', 'normal', 'Mythical', 1);

  // 105. Shaymin Sky - Grass/Flying (svag mod Ice 4x, Fire, Flying, Poison, Rock)
  insertPokemon.run(105, 'Shaymin Sky', 492, 'Grass/Flying', 'Ice:2.56x,Fire:1.6x,Flying:1.6x,Poison:1.6x,Rock:1.6x', 261, 166, 225, 'Hidden Power + Grass Knot', 'normal', 'Mythical', 1);

  // 106. Arceus - Normal (svag mod Fighting)
  insertPokemon.run(106, 'Arceus', 493, 'Normal', 'Fighting:1.6x', 238, 238, 237, 'Shadow Claw + Hyper Beam', 'normal', 'Mythical', 1);

  // ===== GENERATION 5 LEGENDARIES (ID 107-115) =====

  // 107. Victini - Psychic/Fire (svag mod Ground, Rock, Ghost, Water, Dark)
  insertPokemon.run(107, 'Victini', 494, 'Psychic/Fire', 'Ground:1.6x,Rock:1.6x,Ghost:1.6x,Water:1.6x,Dark:1.6x', 261, 193, 225, 'Confusion + V-create', 'elite', 'Mythical', 0);

  // 108. Tornadus Incarnate - Flying (svag mod Electric, Ice, Rock)
  insertPokemon.run(108, 'Tornadus Incarnate', 641, 'Flying', 'Electric:1.6x,Ice:1.6x,Rock:1.6x', 266, 164, 188, 'Air Slash + Hurricane', 'normal', 'Legendary', 1);

  // 109. Tornadus Therian - Flying (svag mod Electric, Ice, Rock)
  insertPokemon.run(109, 'Tornadus Therian', 641, 'Flying', 'Electric:1.6x,Ice:1.6x,Rock:1.6x', 238, 189, 188, 'Gust + Hurricane', 'normal', 'Legendary', 1);

  // 110. Thundurus Incarnate - Electric/Flying (svag mod Ice, Rock)
  insertPokemon.run(110, 'Thundurus Incarnate', 642, 'Electric/Flying', 'Ice:1.6x,Rock:1.6x', 266, 164, 188, 'Thunder Shock + Thunder', 'normal', 'Legendary', 1);

  // 111. Thundurus Therian - Electric/Flying (svag mod Ice, Rock)
  insertPokemon.run(111, 'Thundurus Therian', 642, 'Electric/Flying', 'Ice:1.6x,Rock:1.6x', 295, 161, 188, 'Volt Switch + Thunderbolt', 'normal', 'Legendary', 1);

  // 112. Landorus Incarnate - Ground/Flying (svag mod Ice 4x, Water)
  insertPokemon.run(112, 'Landorus Incarnate', 645, 'Ground/Flying', 'Ice:2.56x,Water:1.6x', 261, 182, 205, 'Mud Shot + Earth Power', 'normal', 'Legendary', 1);

  // 113. Keldeo - Water/Fighting (svag mod Electric, Grass, Flying, Psychic, Fairy)
  insertPokemon.run(113, 'Keldeo', 647, 'Water/Fighting', 'Electric:1.6x,Grass:1.6x,Flying:1.6x,Psychic:1.6x,Fairy:1.6x', 260, 192, 209, 'Low Kick + Sacred Sword', 'normal', 'Mythical', 0);

  // 114. Meloetta Aria - Normal/Psychic (svag mod Bug, Dark)
  insertPokemon.run(114, 'Meloetta Aria', 648, 'Normal/Psychic', 'Bug:1.6x,Dark:1.6x', 250, 225, 225, 'Confusion + Psystrike', 'normal', 'Mythical', 0);

  // 115. Kyurem - Dragon/Ice (svag mod Fighting, Rock, Steel, Dragon, Fairy)
  insertPokemon.run(115, 'Kyurem', 646, 'Dragon/Ice', 'Fighting:1.6x,Rock:1.6x,Steel:1.6x,Dragon:1.6x,Fairy:1.6x', 246, 170, 245, 'Dragon Breath + Draco Meteor', 'normal', 'Legendary', 1);

  // ===== GENERATION 6-7 LEGENDARIES (ID 116-127) =====

  // 116. Zygarde 50% - Dragon/Ground (svag mod Ice 4x, Dragon, Fairy)
  insertPokemon.run(116, 'Zygarde 50%', 718, 'Dragon/Ground', 'Ice:2.56x,Dragon:1.6x,Fairy:1.6x', 203, 232, 239, 'Dragon Tail + Outrage', 'normal', 'Legendary', 1);

  // 117. Tapu Koko - Electric/Fairy (svag mod Ground, Poison)
  insertPokemon.run(117, 'Tapu Koko', 785, 'Electric/Fairy', 'Ground:1.6x,Poison:1.6x', 250, 181, 172, 'Volt Switch + Dazzling Gleam', 'normal', 'Legendary', 1);

  // 118. Tapu Lele - Psychic/Fairy (svag mod Ghost, Poison, Steel)
  insertPokemon.run(118, 'Tapu Lele', 786, 'Psychic/Fairy', 'Ghost:1.6x,Poison:1.6x,Steel:1.6x', 259, 208, 172, 'Confusion + Future Sight', 'normal', 'Legendary', 1);

  // 119. Tapu Bulu - Grass/Fairy (svag mod Fire, Ice, Flying, Poison, Steel)
  insertPokemon.run(119, 'Tapu Bulu', 787, 'Grass/Fairy', 'Fire:1.6x,Ice:1.6x,Flying:1.6x,Poison:1.6x,Steel:1.6x', 249, 215, 172, 'Bullet Seed + Dazzling Gleam', 'normal', 'Legendary', 1);

  // 120. Tapu Fini - Water/Fairy (svag mod Electric, Grass, Poison)
  insertPokemon.run(120, 'Tapu Fini', 788, 'Water/Fairy', 'Electric:1.6x,Grass:1.6x,Poison:1.6x', 189, 254, 172, 'Water Gun + Surf', 'normal', 'Legendary', 1);

  // 121. Nihilego - Rock/Poison (allerede tilføjet som ID 43, men her er Ultra Beast version)

  // 122. Buzzwole - Bug/Fighting (svag mod Flying 4x, Fire, Psychic, Fairy)
  insertPokemon.run(122, 'Buzzwole', 794, 'Bug/Fighting', 'Flying:2.56x,Fire:1.6x,Psychic:1.6x,Fairy:1.6x', 236, 196, 219, 'Counter + Superpower', 'normal', 'Ultra Beast', 0);

  // 123. Xurkitree - allerede tilføjet som ID 29

  // 124. Celesteela - Steel/Flying (svag mod Electric, Fire)
  insertPokemon.run(124, 'Celesteela', 797, 'Steel/Flying', 'Electric:1.6x,Fire:1.6x', 207, 199, 219, 'Air Slash + Iron Head', 'normal', 'Ultra Beast', 0);

  // 125. Guzzlord - Dark/Dragon (svag mod Bug, Fairy 4x, Fighting, Ice, Dragon)
  insertPokemon.run(125, 'Guzzlord', 799, 'Dark/Dragon', 'Fairy:2.56x,Bug:1.6x,Fighting:1.6x,Ice:1.6x,Dragon:1.6x', 188, 99, 440, 'Dragon Tail + Brutal Swing', 'normal', 'Ultra Beast', 0);

  // 126. Meltan - Steel (svag mod Fighting, Ground, Fire)
  insertPokemon.run(126, 'Meltan', 808, 'Steel', 'Fighting:1.6x,Ground:1.6x,Fire:1.6x', 118, 99, 130, 'Thunder Shock + Flash Cannon', 'normal', 'Mythical', 1);

  // 127. Melmetal - Steel (svag mod Fighting, Ground, Fire)
  insertPokemon.run(127, 'Melmetal', 809, 'Steel', 'Fighting:1.6x,Ground:1.6x,Fire:1.6x', 226, 190, 264, 'Thunder Shock + Double Iron Bash', 'elite', 'Mythical', 1);

  // 128. Armored Mewtwo - Psychic (svag mod Bug, Ghost, Dark)
  insertPokemon.run(128, 'Armored Mewtwo', 150, 'Psychic', 'Bug:1.6x,Ghost:1.6x,Dark:1.6x', 182, 278, 214, 'Confusion + Psystrike', 'elite', 'Legendary', 0);

  // 129. Frogadier - Water (svag mod Grass, Electric)
  insertPokemon.run(129, 'Frogadier', 657, 'Water', 'Grass:1.6x,Electric:1.6x', 168, 113, 144, 'Bubble + Surf', 'normal', 'Normal', 1);

  // 130. Shuckle - Bug/Rock (svag mod Rock, Steel, Water)
  insertPokemon.run(130, 'Shuckle', 213, 'Bug/Rock', 'Rock:1.6x,Steel:1.6x,Water:1.6x', 17, 396, 85, 'Rock Throw + Stone Edge', 'normal', 'Normal', 1);

  // 131. Blissey - Normal (svag mod Fighting)
  insertPokemon.run(131, 'Blissey', 242, 'Normal', 'Fighting:1.6x', 129, 169, 496, 'Pound + Hyper Beam', 'normal', 'Normal', 1);

  // Indsæt CP værdier for hver Pokémon
  const insertCP = db.prepare(`
    INSERT INTO cp_values (pokemon_id, level, cp)
    VALUES (?, ?, ?)
  `);

  // Primal Groudon CP værdier
  insertCP.run(1, 20, 3372);
  insertCP.run(1, 25, 4215);
  insertCP.run(1, 30, 5059);
  insertCP.run(1, 40, 5902);
  insertCP.run(1, 50, 6672);

  // Primal Kyogre CP værdier
  insertCP.run(2, 20, 3372);
  insertCP.run(2, 25, 4215);
  insertCP.run(2, 30, 5059);
  insertCP.run(2, 40, 5902);
  insertCP.run(2, 50, 6672);

  // Mega Rayquaza CP værdier
  insertCP.run(3, 20, 3264);
  insertCP.run(3, 25, 4080);
  insertCP.run(3, 30, 4897);
  insertCP.run(3, 40, 5713);
  insertCP.run(3, 50, 6458);

  // Dialga CP værdier
  insertCP.run(4, 20, 2307);
  insertCP.run(4, 25, 2884);
  insertCP.run(4, 30, 3462);
  insertCP.run(4, 40, 4038);
  insertCP.run(4, 50, 4565);

  // Mewtwo CP værdier
  insertCP.run(5, 20, 2387);
  insertCP.run(5, 25, 2984);
  insertCP.run(5, 30, 3343);
  insertCP.run(5, 40, 4178);
  insertCP.run(5, 50, 4724);

  // Zacian Hero CP værdier
  insertCP.run(6, 20, 1810);
  insertCP.run(6, 25, 2263);
  insertCP.run(6, 30, 2716);
  insertCP.run(6, 40, 3170);
  insertCP.run(6, 50, 4329);

  // Zacian Crowned Sword CP værdier
  insertCP.run(7, 20, 2845);
  insertCP.run(7, 25, 3556);
  insertCP.run(7, 30, 4268);
  insertCP.run(7, 40, 4979);
  insertCP.run(7, 50, 5629);

  // Zamazenta Hero CP værdier
  insertCP.run(8, 20, 1810);
  insertCP.run(8, 25, 2263);
  insertCP.run(8, 30, 2716);
  insertCP.run(8, 40, 3170);
  insertCP.run(8, 50, 4329);

  // Zamazenta Crowned Shield CP værdier
  insertCP.run(9, 20, 2384);
  insertCP.run(9, 25, 2980);
  insertCP.run(9, 30, 3576);
  insertCP.run(9, 40, 4172);
  insertCP.run(9, 50, 4717);

  // Dusk Mane Necrozma CP værdier
  insertCP.run(10, 20, 2342);
  insertCP.run(10, 25, 2928);
  insertCP.run(10, 30, 3514);
  insertCP.run(10, 40, 4099);
  insertCP.run(10, 50, 4634);

  // Dawn Wings Necrozma CP værdier
  insertCP.run(11, 20, 2342);
  insertCP.run(11, 25, 2928);
  insertCP.run(11, 30, 3514);
  insertCP.run(11, 40, 4099);
  insertCP.run(11, 50, 4634);

  // Black Kyurem CP værdier
  insertCP.run(12, 20, 2631);
  insertCP.run(12, 25, 3289);
  insertCP.run(12, 30, 3947);
  insertCP.run(12, 40, 4605);
  insertCP.run(12, 50, 5206);

  // White Kyurem CP værdier
  insertCP.run(13, 20, 2631);
  insertCP.run(13, 25, 3289);
  insertCP.run(13, 30, 3947);
  insertCP.run(13, 40, 4605);
  insertCP.run(13, 50, 5206);

  // Rayquaza CP værdier
  insertCP.run(14, 20, 2191);
  insertCP.run(14, 25, 2739);
  insertCP.run(14, 30, 3287);
  insertCP.run(14, 40, 3835);
  insertCP.run(14, 50, 4336);

  // Kyogre CP værdier
  insertCP.run(15, 20, 2351);
  insertCP.run(15, 25, 2939);
  insertCP.run(15, 30, 3527);
  insertCP.run(15, 40, 4115);
  insertCP.run(15, 50, 4652);

  // Groudon CP værdier
  insertCP.run(16, 20, 2351);
  insertCP.run(16, 25, 2939);
  insertCP.run(16, 30, 3527);
  insertCP.run(16, 40, 4115);
  insertCP.run(16, 50, 4652);

  // Articuno CP værdier
  insertCP.run(17, 20, 1665);
  insertCP.run(17, 25, 2081);
  insertCP.run(17, 30, 2498);
  insertCP.run(17, 40, 2914);
  insertCP.run(17, 50, 3450);

  // Zapdos CP værdier
  insertCP.run(18, 20, 1902);
  insertCP.run(18, 25, 2378);
  insertCP.run(18, 30, 2854);
  insertCP.run(18, 40, 3329);
  insertCP.run(18, 50, 3987);

  // Moltres CP værdier
  insertCP.run(19, 20, 1896);
  insertCP.run(19, 25, 2370);
  insertCP.run(19, 30, 2845);
  insertCP.run(19, 40, 3319);
  insertCP.run(19, 50, 3973);

  // Raikou CP værdier
  insertCP.run(20, 20, 1913);
  insertCP.run(20, 25, 2391);
  insertCP.run(20, 30, 2869);
  insertCP.run(20, 40, 3349);
  insertCP.run(20, 50, 3902);

  // Entei CP værdier
  insertCP.run(21, 20, 1930);
  insertCP.run(21, 25, 2413);
  insertCP.run(21, 30, 2896);
  insertCP.run(21, 40, 3377);
  insertCP.run(21, 50, 3926);

  // Suicune CP værdier
  insertCP.run(22, 20, 1627);
  insertCP.run(22, 25, 2034);
  insertCP.run(22, 30, 2441);
  insertCP.run(22, 40, 2847);
  insertCP.run(22, 50, 3372);

  // Mega Sceptile CP værdier
  insertCP.run(23, 20, 2224);
  insertCP.run(23, 25, 2780);
  insertCP.run(23, 30, 3336);
  insertCP.run(23, 40, 3892);
  insertCP.run(23, 50, 4585);

  // Mega Blaziken CP værdier
  insertCP.run(24, 20, 2282);
  insertCP.run(24, 25, 2853);
  insertCP.run(24, 30, 3424);
  insertCP.run(24, 40, 3994);
  insertCP.run(24, 50, 4704);

  // Mega Swampert CP værdier
  insertCP.run(25, 20, 2420);
  insertCP.run(25, 25, 3025);
  insertCP.run(25, 30, 3630);
  insertCP.run(25, 40, 4236);
  insertCP.run(25, 50, 4975);

  // Mega Charizard Y CP værdier
  insertCP.run(26, 20, 2449);
  insertCP.run(26, 25, 3061);
  insertCP.run(26, 30, 3674);
  insertCP.run(26, 40, 4286);
  insertCP.run(26, 50, 5037);

  // Mega Garchomp CP værdier
  insertCP.run(27, 20, 2993);
  insertCP.run(27, 25, 3742);
  insertCP.run(27, 30, 4490);
  insertCP.run(27, 40, 5239);
  insertCP.run(27, 50, 6132);

  // Mega Gardevoir CP værdier
  insertCP.run(28, 20, 2480);
  insertCP.run(28, 25, 3100);
  insertCP.run(28, 30, 3720);
  insertCP.run(28, 40, 4341);
  insertCP.run(28, 50, 5101);

  // Xurkitree CP værdier
  insertCP.run(29, 20, 2155);
  insertCP.run(29, 25, 2695);
  insertCP.run(29, 30, 3234);
  insertCP.run(29, 40, 3773);
  insertCP.run(29, 50, 4451);

  // Kartana CP værdier
  insertCP.run(30, 20, 2010);
  insertCP.run(30, 25, 2512);
  insertCP.run(30, 30, 3015);
  insertCP.run(30, 40, 3518);
  insertCP.run(30, 50, 4156);

  // Eternatus CP værdier
  insertCP.run(31, 20, 2435);
  insertCP.run(31, 25, 3044);
  insertCP.run(31, 30, 3653);
  insertCP.run(31, 40, 4261);
  insertCP.run(31, 50, 5007);

  // Tyranitar CP værdier
  insertCP.run(32, 20, 2049);
  insertCP.run(32, 25, 2561);
  insertCP.run(32, 30, 3074);
  insertCP.run(32, 40, 3586);
  insertCP.run(32, 50, 4335);

  // Mega Tyranitar CP værdier
  insertCP.run(33, 20, 3074);
  insertCP.run(33, 25, 3842);
  insertCP.run(33, 30, 4611);
  insertCP.run(33, 40, 5379);
  insertCP.run(33, 50, 6045);

  // Lucario CP værdier
  insertCP.run(34, 20, 1544);
  insertCP.run(34, 25, 1930);
  insertCP.run(34, 30, 2317);
  insertCP.run(34, 40, 2703);
  insertCP.run(34, 50, 3056);

  // Mega Lucario CP værdier
  insertCP.run(35, 20, 2280);
  insertCP.run(35, 25, 2850);
  insertCP.run(35, 30, 3420);
  insertCP.run(35, 40, 3990);
  insertCP.run(35, 50, 4325);

  // Rhyperior CP værdier
  insertCP.run(36, 20, 2243);
  insertCP.run(36, 25, 2804);
  insertCP.run(36, 30, 3365);
  insertCP.run(36, 40, 3926);
  insertCP.run(36, 50, 4221);

  // Terrakion CP værdier
  insertCP.run(37, 20, 2026);
  insertCP.run(37, 25, 2533);
  insertCP.run(37, 30, 3040);
  insertCP.run(37, 40, 3547);
  insertCP.run(37, 50, 4181);

  // Mamoswine CP værdier
  insertCP.run(38, 20, 2032);
  insertCP.run(38, 25, 2540);
  insertCP.run(38, 30, 3049);
  insertCP.run(38, 40, 3557);
  insertCP.run(38, 50, 3763);

  // Zekrom CP værdier
  insertCP.run(39, 20, 2307);
  insertCP.run(39, 25, 2884);
  insertCP.run(39, 30, 3461);
  insertCP.run(39, 40, 4038);
  insertCP.run(39, 50, 4565);

  // Zarude CP værdier
  insertCP.run(40, 20, 2100);
  insertCP.run(40, 25, 2625);
  insertCP.run(40, 30, 3150);
  insertCP.run(40, 40, 3675);
  insertCP.run(40, 50, 4334);

  // Hoopa Unbound CP værdier
  insertCP.run(41, 20, 2380);
  insertCP.run(41, 25, 2975);
  insertCP.run(41, 30, 3570);
  insertCP.run(41, 40, 4165);
  insertCP.run(41, 50, 4530);

  // Pheromosa CP værdier
  insertCP.run(42, 20, 1818);
  insertCP.run(42, 25, 2273);
  insertCP.run(42, 30, 2727);
  insertCP.run(42, 40, 3182);
  insertCP.run(42, 50, 3213);

  // Nihilego CP værdier
  insertCP.run(43, 20, 2290);
  insertCP.run(43, 25, 2863);
  insertCP.run(43, 30, 3435);
  insertCP.run(43, 40, 4008);
  insertCP.run(43, 50, 4465);

  // Primarina CP værdier
  insertCP.run(44, 20, 1760);
  insertCP.run(44, 25, 2200);
  insertCP.run(44, 30, 2640);
  insertCP.run(44, 40, 3080);
  insertCP.run(44, 50, 3618);

  // Mega Gengar CP værdier
  insertCP.run(45, 20, 2619);
  insertCP.run(45, 25, 3274);
  insertCP.run(45, 30, 3929);
  insertCP.run(45, 40, 4584);
  insertCP.run(45, 50, 4902);

  // Mega Alakazam CP værdier
  insertCP.run(46, 20, 2894);
  insertCP.run(46, 25, 3618);
  insertCP.run(46, 30, 4341);
  insertCP.run(46, 40, 5065);
  insertCP.run(46, 50, 5099);

  // Mega Beedrill CP værdier
  insertCP.run(47, 20, 2145);
  insertCP.run(47, 25, 2681);
  insertCP.run(47, 30, 3218);
  insertCP.run(47, 40, 3754);
  insertCP.run(47, 50, 3824);

  // Mega Heracross CP værdier
  insertCP.run(48, 20, 3053);
  insertCP.run(48, 25, 3816);
  insertCP.run(48, 30, 4579);
  insertCP.run(48, 40, 5342);
  insertCP.run(48, 50, 5443);

  // Mega Scizor CP værdier
  insertCP.run(49, 20, 2593);
  insertCP.run(49, 25, 3241);
  insertCP.run(49, 30, 3889);
  insertCP.run(49, 40, 4537);
  insertCP.run(49, 50, 4621);

  // Scizor CP værdier (max CP 3393)
  insertCP.run(50, 20, 1903);
  insertCP.run(50, 25, 2379);
  insertCP.run(50, 30, 2855);
  insertCP.run(50, 40, 3331);
  insertCP.run(50, 50, 3393);

  // Machamp CP værdier (max CP 3455)
  insertCP.run(51, 20, 1938);
  insertCP.run(51, 25, 2423);
  insertCP.run(51, 30, 2908);
  insertCP.run(51, 40, 3392);
  insertCP.run(51, 50, 3455);

  // Excadrill CP værdier (max CP 3667)
  insertCP.run(52, 20, 2057);
  insertCP.run(52, 25, 2571);
  insertCP.run(52, 30, 3085);
  insertCP.run(52, 40, 3600);
  insertCP.run(52, 50, 3667);

  // Hydreigon CP værdier (max CP 4098)
  insertCP.run(53, 20, 2298);
  insertCP.run(53, 25, 2873);
  insertCP.run(53, 30, 3448);
  insertCP.run(53, 40, 4023);
  insertCP.run(53, 50, 4098);

  // Chandelure CP værdier (max CP 3695)
  insertCP.run(54, 20, 2073);
  insertCP.run(54, 25, 2591);
  insertCP.run(54, 30, 3109);
  insertCP.run(54, 40, 3627);
  insertCP.run(54, 50, 3695);

  // Honchkrow CP værdier (max CP 3065)
  insertCP.run(55, 20, 1720);
  insertCP.run(55, 25, 2150);
  insertCP.run(55, 30, 2580);
  insertCP.run(55, 40, 3010);
  insertCP.run(55, 50, 3065);

  // Victreebel CP værdier (max CP 2748)
  insertCP.run(56, 20, 1542);
  insertCP.run(56, 25, 1927);
  insertCP.run(56, 30, 2313);
  insertCP.run(56, 40, 2699);
  insertCP.run(56, 50, 2748);

  // Shadow Mewtwo CP værdier (samme som ID 5)
  insertCP.run(57, 20, 2387);
  insertCP.run(57, 25, 2984);
  insertCP.run(57, 30, 3343);
  insertCP.run(57, 40, 4178);
  insertCP.run(57, 50, 4724);

  // Shadow Kyogre CP værdier (samme som ID 15)
  insertCP.run(58, 20, 2351);
  insertCP.run(58, 25, 2939);
  insertCP.run(58, 30, 3527);
  insertCP.run(58, 40, 4115);
  insertCP.run(58, 50, 4652);

  // Shadow Groudon CP værdier (samme som ID 16)
  insertCP.run(59, 20, 2351);
  insertCP.run(59, 25, 2939);
  insertCP.run(59, 30, 3527);
  insertCP.run(59, 40, 4115);
  insertCP.run(59, 50, 4652);

  // Shadow Raikou CP værdier (samme som ID 20)
  insertCP.run(60, 20, 1913);
  insertCP.run(60, 25, 2391);
  insertCP.run(60, 30, 2869);
  insertCP.run(60, 40, 3349);
  insertCP.run(60, 50, 3902);

  // Shadow Entei CP værdier (samme som ID 21)
  insertCP.run(61, 20, 1930);
  insertCP.run(61, 25, 2413);
  insertCP.run(61, 30, 2896);
  insertCP.run(61, 40, 3377);
  insertCP.run(61, 50, 3926);

  // Shadow Moltres CP værdier (samme som ID 19)
  insertCP.run(62, 20, 1896);
  insertCP.run(62, 25, 2370);
  insertCP.run(62, 30, 2845);
  insertCP.run(62, 40, 3319);
  insertCP.run(62, 50, 3973);

  // Shadow Mamoswine CP værdier (samme som ID 38)
  insertCP.run(63, 20, 2032);
  insertCP.run(63, 25, 2540);
  insertCP.run(63, 30, 3049);
  insertCP.run(63, 40, 3557);
  insertCP.run(63, 50, 3763);

  // Shadow Scizor CP værdier (samme som ID 50)
  insertCP.run(64, 20, 1903);
  insertCP.run(64, 25, 2379);
  insertCP.run(64, 30, 2855);
  insertCP.run(64, 40, 3331);
  insertCP.run(64, 50, 3393);

  // Shadow Tyranitar CP værdier (samme som ID 32)
  insertCP.run(65, 20, 2049);
  insertCP.run(65, 25, 2561);
  insertCP.run(65, 30, 3074);
  insertCP.run(65, 40, 3586);
  insertCP.run(65, 50, 4335);

  // Shadow Machamp CP værdier (samme som ID 51)
  insertCP.run(66, 20, 1938);
  insertCP.run(66, 25, 2423);
  insertCP.run(66, 30, 2908);
  insertCP.run(66, 40, 3392);
  insertCP.run(66, 50, 3455);

  // Shadow Excadrill CP værdier (samme som ID 52)
  insertCP.run(67, 20, 2057);
  insertCP.run(67, 25, 2571);
  insertCP.run(67, 30, 3085);
  insertCP.run(67, 40, 3600);
  insertCP.run(67, 50, 3667);

  // Shadow Hydreigon CP værdier (samme som ID 53)
  insertCP.run(68, 20, 2298);
  insertCP.run(68, 25, 2873);
  insertCP.run(68, 30, 3448);
  insertCP.run(68, 40, 4023);
  insertCP.run(68, 50, 4098);

  // Shadow Chandelure CP værdier (samme som ID 54)
  insertCP.run(69, 20, 2073);
  insertCP.run(69, 25, 2591);
  insertCP.run(69, 30, 3109);
  insertCP.run(69, 40, 3627);
  insertCP.run(69, 50, 3695);

  // Shadow Honchkrow CP værdier (samme som ID 55)
  insertCP.run(70, 20, 1720);
  insertCP.run(70, 25, 2150);
  insertCP.run(70, 30, 2580);
  insertCP.run(70, 40, 3010);
  insertCP.run(70, 50, 3065);

  // Shadow Victreebel CP værdier (samme som ID 56)
  insertCP.run(71, 20, 1542);
  insertCP.run(71, 25, 1927);
  insertCP.run(71, 30, 2313);
  insertCP.run(71, 40, 2699);
  insertCP.run(71, 50, 2748);

  // Lugia CP værdier (max CP 4186)
  insertCP.run(72, 20, 2349);
  insertCP.run(72, 25, 2936);
  insertCP.run(72, 30, 3523);
  insertCP.run(72, 40, 4110);
  insertCP.run(72, 50, 4186);

  // Ho-Oh CP værdier (max CP 4367)
  insertCP.run(73, 20, 2449);
  insertCP.run(73, 25, 3062);
  insertCP.run(73, 30, 3674);
  insertCP.run(73, 40, 4286);
  insertCP.run(73, 50, 4367);

  // Latias CP værdier (max CP 3968)
  insertCP.run(74, 20, 2226);
  insertCP.run(74, 25, 2782);
  insertCP.run(74, 30, 3339);
  insertCP.run(74, 40, 3895);
  insertCP.run(74, 50, 3968);

  // Latios CP værdier (max CP 4310)
  insertCP.run(75, 20, 2418);
  insertCP.run(75, 25, 3023);
  insertCP.run(75, 30, 3627);
  insertCP.run(75, 40, 4232);
  insertCP.run(75, 50, 4310);

  // Deoxys Attack CP værdier (max CP 2916)
  insertCP.run(76, 20, 1636);
  insertCP.run(76, 25, 2045);
  insertCP.run(76, 30, 2454);
  insertCP.run(76, 40, 2863);
  insertCP.run(76, 50, 2916);

  // Palkia CP værdier (max CP 4512)
  insertCP.run(77, 20, 2531);
  insertCP.run(77, 25, 3164);
  insertCP.run(77, 30, 3797);
  insertCP.run(77, 40, 4430);
  insertCP.run(77, 50, 4512);

  // Palkia Origin CP værdier (max CP 4683)
  insertCP.run(78, 20, 2627);
  insertCP.run(78, 25, 3284);
  insertCP.run(78, 30, 3941);
  insertCP.run(78, 40, 4597);
  insertCP.run(78, 50, 4683);

  // Giratina Origin CP værdier (max CP 4164)
  insertCP.run(79, 20, 2336);
  insertCP.run(79, 25, 2920);
  insertCP.run(79, 30, 3504);
  insertCP.run(79, 40, 4088);
  insertCP.run(79, 50, 4164);

  // Darkrai CP værdier (max CP 4227)
  insertCP.run(80, 20, 2371);
  insertCP.run(80, 25, 2964);
  insertCP.run(80, 30, 3557);
  insertCP.run(80, 40, 4150);
  insertCP.run(80, 50, 4227);

  // Heatran CP værdier (max CP 4244)
  insertCP.run(81, 20, 2381);
  insertCP.run(81, 25, 2976);
  insertCP.run(81, 30, 3571);
  insertCP.run(81, 40, 4166);
  insertCP.run(81, 50, 4244);

  // Reshiram CP værdier (max CP 4565)
  insertCP.run(82, 20, 2561);
  insertCP.run(82, 25, 3201);
  insertCP.run(82, 30, 3841);
  insertCP.run(82, 40, 4481);
  insertCP.run(82, 50, 4565);

  // Landorus Therian CP værdier (max CP 4434)
  insertCP.run(83, 20, 2487);
  insertCP.run(83, 25, 3109);
  insertCP.run(83, 30, 3731);
  insertCP.run(83, 40, 4353);
  insertCP.run(83, 50, 4434);

  // Genesect CP værdier (max CP 3791)
  insertCP.run(84, 20, 2127);
  insertCP.run(84, 25, 2659);
  insertCP.run(84, 30, 3191);
  insertCP.run(84, 40, 3723);
  insertCP.run(84, 50, 3791);

  // Cobalion CP værdier (max CP 3417)
  insertCP.run(85, 20, 1916);
  insertCP.run(85, 25, 2395);
  insertCP.run(85, 30, 2874);
  insertCP.run(85, 40, 3353);
  insertCP.run(85, 50, 3417);

  // Virizion CP værdier (max CP 3417)
  insertCP.run(86, 20, 1916);
  insertCP.run(86, 25, 2395);
  insertCP.run(86, 30, 2874);
  insertCP.run(86, 40, 3353);
  insertCP.run(86, 50, 3417);

  // Xerneas CP værdier (max CP 4275)
  insertCP.run(87, 20, 2398);
  insertCP.run(87, 25, 2998);
  insertCP.run(87, 30, 3597);
  insertCP.run(87, 40, 4196);
  insertCP.run(87, 50, 4275);

  // Yveltal CP værdier (max CP 4275)
  insertCP.run(88, 20, 2398);
  insertCP.run(88, 25, 2998);
  insertCP.run(88, 30, 3597);
  insertCP.run(88, 40, 4196);
  insertCP.run(88, 50, 4275);

  // Solgaleo CP værdier (max CP 4570)
  insertCP.run(89, 20, 2564);
  insertCP.run(89, 25, 3205);
  insertCP.run(89, 30, 3846);
  insertCP.run(89, 40, 4487);
  insertCP.run(89, 50, 4570);

  // Lunala CP værdier (max CP 4570)
  insertCP.run(90, 20, 2564);
  insertCP.run(90, 25, 3205);
  insertCP.run(90, 30, 3846);
  insertCP.run(90, 40, 4487);
  insertCP.run(90, 50, 4570);

  // Mew CP værdier (max CP 3265)
  insertCP.run(91, 20, 1832);
  insertCP.run(91, 25, 2290);
  insertCP.run(91, 30, 2748);
  insertCP.run(91, 40, 3206);
  insertCP.run(91, 50, 3265);

  // Celebi CP værdier (max CP 3265)
  insertCP.run(92, 20, 1832);
  insertCP.run(92, 25, 2290);
  insertCP.run(92, 30, 2748);
  insertCP.run(92, 40, 3206);
  insertCP.run(92, 50, 3265);

  // Regirock CP værdier (max CP 3122)
  insertCP.run(93, 20, 1752);
  insertCP.run(93, 25, 2190);
  insertCP.run(93, 30, 2628);
  insertCP.run(93, 40, 3066);
  insertCP.run(93, 50, 3122);

  // Regice CP værdier (max CP 3122)
  insertCP.run(94, 20, 1752);
  insertCP.run(94, 25, 2190);
  insertCP.run(94, 30, 2628);
  insertCP.run(94, 40, 3066);
  insertCP.run(94, 50, 3122);

  // Registeel CP værdier (max CP 2766)
  insertCP.run(95, 20, 1551);
  insertCP.run(95, 25, 1939);
  insertCP.run(95, 30, 2327);
  insertCP.run(95, 40, 2716);
  insertCP.run(95, 50, 2766);

  // Jirachi CP værdier (max CP 3265)
  insertCP.run(96, 20, 1832);
  insertCP.run(96, 25, 2290);
  insertCP.run(96, 30, 2748);
  insertCP.run(96, 40, 3206);
  insertCP.run(96, 50, 3265);

  // Uxie CP værdier (max CP 2524)
  insertCP.run(97, 20, 1415);
  insertCP.run(97, 25, 1769);
  insertCP.run(97, 30, 2123);
  insertCP.run(97, 40, 2478);
  insertCP.run(97, 50, 2524);

  // Mesprit CP værdier (max CP 3265)
  insertCP.run(98, 20, 1831);
  insertCP.run(98, 25, 2289);
  insertCP.run(98, 30, 2747);
  insertCP.run(98, 40, 3205);
  insertCP.run(98, 50, 3265);

  // Azelf CP værdier (max CP 3210)
  insertCP.run(99, 20, 1801);
  insertCP.run(99, 25, 2251);
  insertCP.run(99, 30, 2702);
  insertCP.run(99, 40, 3152);
  insertCP.run(99, 50, 3210);

  // Dialga Origin CP værdier (max CP 4694)
  insertCP.run(100, 20, 2633);
  insertCP.run(100, 25, 3292);
  insertCP.run(100, 30, 3950);
  insertCP.run(100, 40, 4608);
  insertCP.run(100, 50, 4694);

  // Giratina Altered CP værdier (max CP 3379)
  insertCP.run(101, 20, 1895);
  insertCP.run(101, 25, 2369);
  insertCP.run(101, 30, 2843);
  insertCP.run(101, 40, 3317);
  insertCP.run(101, 50, 3379);

  // Cresselia CP værdier (max CP 2857)
  insertCP.run(102, 20, 1603);
  insertCP.run(102, 25, 2004);
  insertCP.run(102, 30, 2405);
  insertCP.run(102, 40, 2806);
  insertCP.run(102, 50, 2857);

  // Regigigas CP værdier (max CP 4346)
  insertCP.run(103, 20, 2438);
  insertCP.run(103, 25, 3048);
  insertCP.run(103, 30, 3658);
  insertCP.run(103, 40, 4268);
  insertCP.run(103, 50, 4346);

  // Shaymin Land CP værdier (max CP 3265)
  insertCP.run(104, 20, 1832);
  insertCP.run(104, 25, 2290);
  insertCP.run(104, 30, 2748);
  insertCP.run(104, 40, 3206);
  insertCP.run(104, 50, 3265);

  // Shaymin Sky CP værdier (max CP 3729)
  insertCP.run(105, 20, 2091);
  insertCP.run(105, 25, 2614);
  insertCP.run(105, 30, 3137);
  insertCP.run(105, 40, 3660);
  insertCP.run(105, 50, 3729);

  // Arceus CP værdier (max CP 3989)
  insertCP.run(106, 20, 2237);
  insertCP.run(106, 25, 2796);
  insertCP.run(106, 30, 3356);
  insertCP.run(106, 40, 3915);
  insertCP.run(106, 50, 3989);

  // Victini CP værdier (max CP 3921)
  insertCP.run(107, 20, 2200);
  insertCP.run(107, 25, 2750);
  insertCP.run(107, 30, 3300);
  insertCP.run(107, 40, 3850);
  insertCP.run(107, 50, 3921);

  // Tornadus Incarnate CP værdier (max CP 3345)
  insertCP.run(108, 20, 1876);
  insertCP.run(108, 25, 2345);
  insertCP.run(108, 30, 2815);
  insertCP.run(108, 40, 3284);
  insertCP.run(108, 50, 3345);

  // Tornadus Therian CP værdier (max CP 3332)
  insertCP.run(109, 20, 1868);
  insertCP.run(109, 25, 2335);
  insertCP.run(109, 30, 2802);
  insertCP.run(109, 40, 3269);
  insertCP.run(109, 50, 3332);

  // Thundurus Incarnate CP værdier (max CP 3345)
  insertCP.run(110, 20, 1876);
  insertCP.run(110, 25, 2345);
  insertCP.run(110, 30, 2815);
  insertCP.run(110, 40, 3284);
  insertCP.run(110, 50, 3345);

  // Thundurus Therian CP værdier (max CP 4002)
  insertCP.run(111, 20, 2245);
  insertCP.run(111, 25, 2806);
  insertCP.run(111, 30, 3367);
  insertCP.run(111, 40, 3929);
  insertCP.run(111, 50, 4002);

  // Landorus Incarnate CP værdier (max CP 3922)
  insertCP.run(112, 20, 2200);
  insertCP.run(112, 25, 2750);
  insertCP.run(112, 30, 3300);
  insertCP.run(112, 40, 3850);
  insertCP.run(112, 50, 3922);

  // Keldeo CP værdier (max CP 4178)
  insertCP.run(113, 20, 2344);
  insertCP.run(113, 25, 2930);
  insertCP.run(113, 30, 3516);
  insertCP.run(113, 40, 4102);
  insertCP.run(113, 50, 4178);

  // Meloetta Aria CP værdier (max CP 3972)
  insertCP.run(114, 20, 2228);
  insertCP.run(114, 25, 2785);
  insertCP.run(114, 30, 3342);
  insertCP.run(114, 40, 3899);
  insertCP.run(114, 50, 3972);

  // Kyurem CP værdier (max CP 3575)
  insertCP.run(115, 20, 2005);
  insertCP.run(115, 25, 2507);
  insertCP.run(115, 30, 3008);
  insertCP.run(115, 40, 3510);
  insertCP.run(115, 50, 3575);

  // Zygarde 50% CP værdier (max CP 3754)
  insertCP.run(116, 20, 2105);
  insertCP.run(116, 25, 2632);
  insertCP.run(116, 30, 3158);
  insertCP.run(116, 40, 3685);
  insertCP.run(116, 50, 3754);

  // Tapu Koko CP værdier (max CP 3582)
  insertCP.run(117, 20, 2009);
  insertCP.run(117, 25, 2511);
  insertCP.run(117, 30, 3014);
  insertCP.run(117, 40, 3516);
  insertCP.run(117, 50, 3582);

  // Tapu Lele CP værdier (max CP 3922)
  insertCP.run(118, 20, 2200);
  insertCP.run(118, 25, 2750);
  insertCP.run(118, 30, 3300);
  insertCP.run(118, 40, 3850);
  insertCP.run(118, 50, 3922);

  // Tapu Bulu CP værdier (max CP 3737)
  insertCP.run(119, 20, 2096);
  insertCP.run(119, 25, 2620);
  insertCP.run(119, 30, 3144);
  insertCP.run(119, 40, 3668);
  insertCP.run(119, 50, 3737);

  // Tapu Fini CP værdier (max CP 3185)
  insertCP.run(120, 20, 1786);
  insertCP.run(120, 25, 2233);
  insertCP.run(120, 30, 2679);
  insertCP.run(120, 40, 3126);
  insertCP.run(120, 50, 3185);

  // Buzzwole CP værdier (max CP 3859)
  insertCP.run(122, 20, 2165);
  insertCP.run(122, 25, 2706);
  insertCP.run(122, 30, 3248);
  insertCP.run(122, 40, 3789);
  insertCP.run(122, 50, 3859);

  // Celesteela CP værdier (max CP 3507)
  insertCP.run(124, 20, 1967);
  insertCP.run(124, 25, 2459);
  insertCP.run(124, 30, 2950);
  insertCP.run(124, 40, 3442);
  insertCP.run(124, 50, 3507);

  // Guzzlord CP værdier (max CP 2633)
  insertCP.run(125, 20, 1477);
  insertCP.run(125, 25, 1846);
  insertCP.run(125, 30, 2216);
  insertCP.run(125, 40, 2585);
  insertCP.run(125, 50, 2633);

  // Meltan CP værdier (max CP 1207)
  insertCP.run(126, 20, 677);
  insertCP.run(126, 25, 847);
  insertCP.run(126, 30, 1016);
  insertCP.run(126, 40, 1185);
  insertCP.run(126, 50, 1207);

  // Melmetal CP værdier (max CP 4069)
  insertCP.run(127, 20, 2283);
  insertCP.run(127, 25, 2854);
  insertCP.run(127, 30, 3424);
  insertCP.run(127, 40, 3995);
  insertCP.run(127, 50, 4069);

  // Armored Mewtwo CP værdier (max CP 3603)
  insertCP.run(128, 20, 1740);
  insertCP.run(128, 25, 2175);
  insertCP.run(128, 30, 2610);
  insertCP.run(128, 40, 3045);
  insertCP.run(128, 50, 3603);

  // Frogadier CP værdier (max CP 1850)
  insertCP.run(129, 20, 877);
  insertCP.run(129, 25, 1097);
  insertCP.run(129, 30, 1316);
  insertCP.run(129, 40, 1636);
  insertCP.run(129, 50, 1850);

  // Shuckle CP værdier (max CP 458 - laveste!)
  insertCP.run(130, 20, 189);
  insertCP.run(130, 25, 236);
  insertCP.run(130, 30, 284);
  insertCP.run(130, 40, 381);
  insertCP.run(130, 50, 458);

  // Blissey CP værdier (max CP 3117)
  insertCP.run(131, 20, 1492);
  insertCP.run(131, 25, 1866);
  insertCP.run(131, 30, 2239);
  insertCP.run(131, 40, 2757);
  insertCP.run(131, 50, 3117);

  // Indsæt top attackers per type (top 3 af hver relevant type)
  const insertAttacker = db.prepare(`
    INSERT INTO type_attackers (type, rank, attacker_name, attacker_moveset, notes)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Water attackers (top 3)
  insertAttacker.run('Water', 1, 'Primal Kyogre', 'Waterfall + Origin Pulse', 'Stærkeste Water attacker');
  insertAttacker.run('Water', 2, 'Shadow Kyogre', 'Waterfall + Origin Pulse', 'Højere DPS, lavere bulk');
  insertAttacker.run('Water', 3, 'Mega Swampert', 'Water Gun + Hydro Cannon', 'Mega boost til hold');

  // Grass attackers (top 3)
  insertAttacker.run('Grass', 1, 'Kartana', 'Razor Leaf + Leaf Blade', 'Højeste DPS');
  insertAttacker.run('Grass', 2, 'Mega Sceptile', 'Bullet Seed + Frenzy Plant', 'Stærkeste Mega');
  insertAttacker.run('Grass', 3, 'Zarude', 'Vine Whip + Power Whip', 'God bulky option');

  // Ice attackers (top 3)
  insertAttacker.run('Ice', 1, 'White Kyurem', 'Ice Fang + Fusion Flare', 'Stærkeste overordnet');
  insertAttacker.run('Ice', 2, 'Black Kyurem', 'Dragon Tail + Freeze Shock', 'Høj TDO med legacy move');
  insertAttacker.run('Ice', 3, 'Shadow Mamoswine', 'Powder Snow + Avalanche', 'Budget option med høj DPS');

  // Electric attackers (top 3)
  insertAttacker.run('Electric', 1, 'Xurkitree', 'Thunder Shock + Discharge', 'Højeste DPS (17.85), 330 Attack!');
  insertAttacker.run('Electric', 2, 'Shadow Raikou', 'Thunder Shock + Wild Charge', 'Tæt på Xurkitree, 17.64 DPS');
  insertAttacker.run('Electric', 3, 'Zekrom', 'Charge Beam + Fusion Bolt', 'Bedste TDO, meget bulky');

  // Fire attackers (top 3)
  insertAttacker.run('Fire', 1, 'Mega Charizard Y', 'Fire Spin + Blast Burn', 'Stærkeste Mega');
  insertAttacker.run('Fire', 2, 'Shadow Moltres', 'Fire Spin + Overheat', 'Høj DPS');
  insertAttacker.run('Fire', 3, 'Shadow Entei', 'Fire Fang + Overheat', 'God balance');

  // Ground attackers (top 3)
  insertAttacker.run('Ground', 1, 'Primal Groudon', 'Mud Shot + Precipice Blades', 'Stærkeste Ground attacker');
  insertAttacker.run('Ground', 2, 'Shadow Groudon', 'Mud Shot + Precipice Blades', 'Højere DPS, lavere bulk');
  insertAttacker.run('Ground', 3, 'Shadow Excadrill', 'Mud-Slap + Drill Run', 'Budget option');

  // Ghost attackers (top 3)
  insertAttacker.run('Ghost', 1, 'Dawn Wings Necrozma', 'Shadow Claw + Moongeist Beam', 'Stærkeste Ghost attacker');
  insertAttacker.run('Ghost', 2, 'Shadow Chandelure', 'Hex + Shadow Ball', 'Høj DPS');
  insertAttacker.run('Ghost', 3, 'Mega Gengar', 'Shadow Claw + Shadow Ball', 'Mega boost, men glass cannon');

  // Dark attackers (top 3)
  insertAttacker.run('Dark', 1, 'Mega Tyranitar', 'Bite + Brutal Swing', 'Stærkeste Mega');
  insertAttacker.run('Dark', 2, 'Shadow Hydreigon', 'Bite + Brutal Swing', 'Høj DPS');
  insertAttacker.run('Dark', 3, 'Hoopa Unbound', 'Astonish + Dark Pulse', 'God alternative');

  // Fighting attackers (top 3)
  insertAttacker.run('Fighting', 1, 'Mega Lucario', 'Counter + Aura Sphere', 'Stærkeste Mega');
  insertAttacker.run('Fighting', 2, 'Shadow Machamp', 'Counter + Dynamic Punch', 'Høj DPS budget');
  insertAttacker.run('Fighting', 3, 'Terrakion', 'Double Kick + Sacred Sword', 'God bulk');

  // Steel attackers (top 3)
  insertAttacker.run('Steel', 1, 'Zacian Crowned Sword', 'Metal Claw + Behemoth Blade', 'Stærkeste Steel attacker');
  insertAttacker.run('Steel', 2, 'Zamazenta Crowned Shield', 'Metal Claw + Behemoth Bash', 'Bedste bulk');
  insertAttacker.run('Steel', 3, 'Dusk Mane Necrozma', 'Metal Claw + Sunsteel Strike', 'God balance');

  // Rock attackers (top 3)
  insertAttacker.run('Rock', 1, 'Shadow Tyranitar', 'Smack Down + Stone Edge', 'Højeste DPS');
  insertAttacker.run('Rock', 2, 'Rhyperior', 'Smack Down + Rock Wrecker', 'God bulk');
  insertAttacker.run('Rock', 3, 'Terrakion', 'Smack Down + Rock Slide', 'Hurtig charge move');

  // Flying attackers (top 3)
  insertAttacker.run('Flying', 1, 'Mega Rayquaza', 'Air Slash + Dragon Ascent', 'Stærkeste overordnet');
  insertAttacker.run('Flying', 2, 'Shadow Moltres', 'Wing Attack + Sky Attack', 'Høj DPS');
  insertAttacker.run('Flying', 3, 'Shadow Honchkrow', 'Peck + Sky Attack', 'Budget option');

  // Psychic attackers (top 3)
  insertAttacker.run('Psychic', 1, 'Shadow Mewtwo', 'Psycho Cut + Psystrike', 'Højeste DPS');
  insertAttacker.run('Psychic', 2, 'Mewtwo', 'Psycho Cut + Psystrike', 'God bulk');
  insertAttacker.run('Psychic', 3, 'Mega Alakazam', 'Psycho Cut + Psychic', 'Mega boost');

  // Bug attackers (top 4)
  insertAttacker.run('Bug', 1, 'Shadow Scizor', 'Fury Cutter + X-Scissor', 'Højeste DPS');
  insertAttacker.run('Bug', 2, 'Mega Heracross', 'Struggle Bug + Megahorn', 'Stærkeste Mega Bug attacker');
  insertAttacker.run('Bug', 3, 'Mega Scizor', 'Fury Cutter + X-Scissor', 'God defensiv + Mega boost');
  insertAttacker.run('Bug', 4, 'Mega Beedrill', 'Bug Bite + X-Scissor', 'God alternativ Mega');

  // Dragon attackers (top 3)
  insertAttacker.run('Dragon', 1, 'Eternatus', 'Dragon Tail + Dynamax Cannon', '#1 Dragon attacker, højere DPS + TDO end Mega Ray');
  insertAttacker.run('Dragon', 2, 'Mega Rayquaza', 'Dragon Tail + Breaking Swipe', 'Giver Mega boost til hold, stadig top tier');
  insertAttacker.run('Dragon', 3, 'Mega Garchomp', 'Dragon Tail + Breaking Swipe', 'Høj TDO, mega boost');

  // Fairy attackers (top 3)
  insertAttacker.run('Fairy', 1, 'Mega Gardevoir', 'Charm + Dazzling Gleam', 'Stærkeste Fairy (5101 CP, 326 Attack!)');
  insertAttacker.run('Fairy', 2, 'Zacian Crowned Sword', 'Snarl + Play Rough', 'Bedste non-mega Fairy');
  insertAttacker.run('Fairy', 3, 'Primarina', 'Charm + Moonblast', 'Høj Attack (232), god bulk');

  // Poison attackers (top 3) - Brugt sjældent, men for completeness
  insertAttacker.run('Poison', 1, 'Shadow Victreebel', 'Acid + Sludge Bomb', 'Højeste DPS');
  insertAttacker.run('Poison', 2, 'Nihilego', 'Poison Jab + Sludge Bomb', 'God bulk');
  insertAttacker.run('Poison', 3, 'Mega Beedrill', 'Poison Jab + Sludge Bomb', 'Mega boost');

  console.log('Start data indsat!');
} else {
  console.log('Database har allerede data - springer indsættelse over.');
}

console.log('Database er klar!');

// Eksporter databasen så andre filer kan bruge den
module.exports = db;
