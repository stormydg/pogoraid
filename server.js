// Importer Express værktøjet
const express = require('express');

// Importer vores database
const db = require('./database.js');

// Lav en ny webserver
const app = express();

// Middleware - disse skal være før routes
app.use(express.json()); // Parser JSON i request body
app.use(express.static('public')); // Server static files

// Vælg hvilken port serveren skal lytte på
const PORT = 3000;

// API endpoint: Hent liste af alle Pokémon
app.get('/api/pokemon', (req, res) => {
  // Spørg databasen om alle Pokémon med stats og raid data
  const pokemon = db.prepare('SELECT id, name, pokedex_number, types, category, shiny_released, attack, defense, hp, raid_soloable, min_players_duo, min_players_trio, estimated_ttw FROM pokemon').all();

  // Tilføj max CP for hver Pokémon
  pokemon.forEach(p => {
    const maxCP = db.prepare('SELECT cp FROM cp_values WHERE pokemon_id = ? AND level = 50').get(p.id);
    p.max_cp = maxCP ? maxCP.cp : 0;
  });

  // Send Pokémon data som JSON
  res.json(pokemon);
});

// API endpoint: Hent detaljer om én specifik Pokémon
app.get('/api/pokemon/:id', (req, res) => {
  const id = req.params.id;

  // Hent grundinfo om Pokémon
  const pokemon = db.prepare('SELECT * FROM pokemon WHERE id = ?').get(id);

  // Hent CP værdier
  const cpValues = db.prepare('SELECT level, cp FROM cp_values WHERE pokemon_id = ?').all(id);

  // Hent top counters fra den nye counters tabel (scraped fra PokemonGOHub)
  const topCounters = db.prepare(`
    SELECT counter_name, counter_moveset, dps, ttw, rank
    FROM counters
    WHERE pokemon_id = ?
    ORDER BY rank
  `).all(id);

  // Hent også counters baseret på weaknesses (den gamle metode som fallback)
  const weaknessArray = pokemon.weaknesses.split(',');
  const countersByType = {};

  weaknessArray.forEach(weakness => {
    const [type, multiplier] = weakness.split(':');
    const attackers = db.prepare('SELECT attacker_name, attacker_moveset, notes FROM type_attackers WHERE type = ? ORDER BY rank').all(type);
    countersByType[type] = {
      multiplier: multiplier,
      attackers: attackers
    };
  });

  // Saml det hele i ét objekt
  const fullData = {
    ...pokemon,
    cp_values: cpValues,
    top_counters: topCounters,           // Nye scraped counters med DPS
    counters_by_type: countersByType     // Fallback counters baseret på type
  };

  // Send data som JSON
  res.json(fullData);
});

// Start serveren
app.listen(PORT, () => {
  console.log(`Pokémon Raid Helper kører på http://localhost:${PORT}`);
  console.log('Tryk Ctrl+C for at stoppe serveren');
});
