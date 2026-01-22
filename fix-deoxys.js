const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'pokemon.db'));

db.prepare(`
  UPDATE pokemon
  SET raid_soloable = 1,
      min_players_duo = 1,
      min_players_trio = 1,
      estimated_ttw = 270
  WHERE name = 'Deoxys Attack'
`).run();

console.log('✅ Deoxys Attack opdateret til SOLO (270s TTW) - nemmeste legendary boss!');
