// JavaScript kode til Pokémon Raid Helper
console.log('Pokémon Raid Helper er startet!');

// Hjælpe-funktion til at konvertere Pokémon navn til sprite navn
function getPokemonSpriteName(name) {
  // Konverter til lowercase
  let spriteName = name.toLowerCase();

  // Håndter specielle tilfælde
  if (spriteName.includes('primal')) {
    // "Primal Groudon" → "groudon-primal"
    spriteName = spriteName.replace('primal ', '') + '-primal';
  } else if (spriteName.includes('mega charizard y')) {
    // "Mega Charizard Y" → "charizard-mega-y"
    spriteName = 'charizard-mega-y';
  } else if (spriteName.includes('mega')) {
    // "Mega Rayquaza" → "rayquaza-mega"
    spriteName = spriteName.replace('mega ', '') + '-mega';
  } else if (spriteName.includes('crowned sword')) {
    // "Zacian Crowned Sword" → "zacian-crowned"
    spriteName = spriteName.replace(' crowned sword', '-crowned');
  } else if (spriteName.includes('crowned shield')) {
    // "Zamazenta Crowned Shield" → "zamazenta-crowned"
    spriteName = spriteName.replace(' crowned shield', '-crowned');
  } else if (spriteName.includes('dusk mane')) {
    // "Dusk Mane Necrozma" → "necrozma-dusk-mane"
    spriteName = 'necrozma-dusk-mane';
  } else if (spriteName.includes('dawn wings')) {
    // "Dawn Wings Necrozma" → "necrozma-dawn-wings"
    spriteName = 'necrozma-dawn-wings';
  } else if (spriteName.includes('black kyurem')) {
    // "Black Kyurem" → "kyurem-black"
    spriteName = 'kyurem-black';
  } else if (spriteName.includes('white kyurem')) {
    // "White Kyurem" → "kyurem-white"
    spriteName = 'kyurem-white';
  } else if (spriteName.includes('hero')) {
    // "Zacian Hero" → "zacian"
    spriteName = spriteName.replace(' hero', '');
  } else if (spriteName.includes('armored')) {
    // "Armored Mewtwo" → "mewtwo" (PokemonDB har ikke armored form)
    spriteName = spriteName.replace('armored ', '');
  } else if (spriteName.includes('shadow')) {
    // "Shadow Raikou" → "raikou" (shadow bruger normal sprite)
    spriteName = spriteName.replace('shadow ', '');
  }

  // Fjern mellemrum og erstat med bindestreg
  spriteName = spriteName.replace(/\s+/g, '-');

  return spriteName;
}

// Hjælpe-funktion til at få sprite URL baseret på Pokémon navn
function getSpriteUrl(pokemonName, isShiny = false) {
  const spriteName = getPokemonSpriteName(pokemonName);
  const shinyPath = isShiny ? 'shiny' : 'normal';

  // Armored Mewtwo bruger GO sprites
  if (pokemonName.toLowerCase().includes('armored')) {
    return `https://img.pokemondb.net/sprites/go/${shinyPath}/mewtwo-armored.png`;
  }

  // Standard HOME sprites
  return `https://img.pokemondb.net/sprites/home/${shinyPath}/${spriteName}.png`;
}

// Funktion der henter alle Pokémon fra API'et
async function loadPokemon() {
  console.log('Henter Pokémon fra serveren...');

  // Send en forespørgsel til vores API
  const response = await fetch('/api/pokemon');

  // Konverter svaret til JSON (data vi kan bruge)
  const pokemonList = await response.json();

  console.log('Fik Pokémon data:', pokemonList);

  // Vis Pokémon på siden
  displayPokemon(pokemonList);
}

// Funktion der viser Pokémon på siden
function displayPokemon(pokemonList) {
  // Find containeren hvor vi skal vise kortene
  const container = document.getElementById('pokemon-list');

  // Tøm containeren først
  container.innerHTML = '';

  // Sorter Pokémon baseret på activeSortBy
  pokemonList.sort((a, b) => {
    switch(activeSortBy) {
      case 'pokedex':
        return a.pokedex_number - b.pokedex_number;
      case 'cp':
        return b.max_cp - a.max_cp; // Højeste først
      case 'attack':
        return b.attack - a.attack; // Højeste først
      case 'defense':
        return b.defense - a.defense; // Højeste først
      case 'hp':
        return b.hp - a.hp; // Højeste først
      case 'name':
        return a.name.localeCompare(b.name); // A-Z
      default:
        return a.pokedex_number - b.pokedex_number;
    }
  });

  // Definer generationer baseret på Pokédex nummer
  const generations = [
    { max: 151, name: 'Kanto (Gen 1)' },
    { max: 251, name: 'Johto (Gen 2)' },
    { max: 386, name: 'Hoenn (Gen 3)' },
    { max: 493, name: 'Sinnoh (Gen 4)' },
    { max: 649, name: 'Unova (Gen 5)' },
    { max: 721, name: 'Kalos (Gen 6)' },
    { max: 809, name: 'Alola (Gen 7)' },
    { max: 905, name: 'Galar (Gen 8)' }
  ];

  let currentGenIndex = -1;

  // Lav et kort for hver Pokémon
  pokemonList.forEach(pokemon => {
    // Find hvilken generation denne Pokémon tilhører
    const genIndex = generations.findIndex(gen => pokemon.pokedex_number <= gen.max);

    // Hvis vi skifter til en ny generation, vis overskrift (kun når sorteret efter Pokédex)
    if (activeSortBy === 'pokedex' && genIndex !== currentGenIndex && genIndex !== -1) {
      const genHeader = document.createElement('div');
      genHeader.className = 'generation-header';
      genHeader.textContent = generations[genIndex].name;
      container.appendChild(genHeader);
      currentGenIndex = genIndex;
    }
    // Lav en div (boks) til Pokémon kortet
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    // Lav sprite URL med vores hjælpe-funktion
    const spriteUrl = getSpriteUrl(pokemon.name, false);

    // Lav difficulty badge baseret på raid data
    let difficultyBadge = '';
    if (pokemon.raid_soloable === 1) {
      difficultyBadge = '<span class="difficulty-badge solo">⭐ SOLO mulig!</span>';
    } else if (pokemon.min_players_duo === 1) {
      difficultyBadge = '<span class="difficulty-badge duo">💪 Duo mulig</span>';
    } else if (pokemon.min_players_trio === 1) {
      difficultyBadge = '<span class="difficulty-badge trio">👥 Trio mulig</span>';
    } else if (pokemon.min_players_trio === 0) {
      difficultyBadge = '<span class="difficulty-badge hard">⚠️ 4+ spillere</span>';
    }

    // Sæt indhold i kortet med billede og compare checkbox
    card.innerHTML = `
      <input type="checkbox" class="compare-checkbox" data-pokemon-id="${pokemon.id}" onclick="event.stopPropagation(); toggleCompare(${pokemon.id}, this.checked)">
      <img src="${spriteUrl}" alt="${pokemon.name}" class="pokemon-sprite" onerror="this.style.display='none'">
      <h3>${pokemon.name} <span class="pokemon-number">#${pokemon.pokedex_number}</span></h3>
      <p class="type">${pokemon.types}</p>
      ${difficultyBadge}
    `;

    // Tilføj click event - når man klikker, vis detaljer
    card.addEventListener('click', () => {
      console.log('Klik på:', pokemon.name);
      loadPokemonDetails(pokemon.id);
    });

    // Tilføj kortet til containeren
    container.appendChild(card);
  });

  console.log(`Viste ${pokemonList.length} Pokémon kort`);
}

// Funktion der henter detaljer om én Pokémon
async function loadPokemonDetails(id) {
  console.log('Henter detaljer for Pokémon ID:', id);

  // Send forespørgsel til detalje-endpoint
  const response = await fetch(`/api/pokemon/${id}`);
  const pokemon = await response.json();

  console.log('Fik detaljer:', pokemon);

  // Vis detaljerne
  displayPokemonDetails(pokemon);
}

// Funktion der viser detaljer om en Pokémon
function displayPokemonDetails(pokemon) {
  // Scroll til toppen af siden
  window.scrollTo(0, 0);

  // Skjul liste
  document.getElementById('pokemon-list').style.display = 'none';

  // Find detalje container
  const detailsContainer = document.getElementById('pokemon-details');
  detailsContainer.style.display = 'block';

  // Lav sprite URLs - både normal og shiny
  const normalSpriteUrl = getSpriteUrl(pokemon.name, false);
  const shinySpriteUrl = getSpriteUrl(pokemon.name, true);

  // Byg CP tabel
  let cpTable = '<table class="cp-table"><tr><th>Level</th><th>CP</th></tr>';
  pokemon.cp_values.forEach(cp => {
    cpTable += `<tr><td>Level ${cp.level}</td><td>${cp.cp}</td></tr>`;
  });
  cpTable += '</table>';

  // Byg raid simulator sektion
  let raidSimulatorSection = '';
  if (pokemon.estimated_ttw && pokemon.estimated_ttw > 0) {
    const ttw = pokemon.estimated_ttw;
    const minutes = Math.floor(ttw / 60);
    const seconds = ttw % 60;

    let difficultyInfo = '';
    if (pokemon.raid_soloable === 1) {
      difficultyInfo = `
        <div class="raid-difficulty solo">
          <h4>⭐ SOLO MULIG!</h4>
          <p>Denne raid kan klares alene med de rigtige counters!</p>
          <p class="tip">💡 Tip: Brug level 40-50 counters med Weather Boost for sikkerhed</p>
        </div>
      `;
    } else if (pokemon.min_players_duo === 1) {
      difficultyInfo = `
        <div class="raid-difficulty easy">
          <h4>💪 Duo Mulig!</h4>
          <p>Denne boss kan slås af 2 spillere med gode counters.</p>
          <p class="tip">💡 Tip: Brug level 40+ counters med super-effective moves</p>
        </div>
      `;
    } else if (pokemon.min_players_trio === 1) {
      difficultyInfo = `
        <div class="raid-difficulty medium">
          <h4>👥 Trio Mulig</h4>
          <p>Denne boss kræver minimum 3 spillere med stærke counters.</p>
          <p class="tip">💡 Tip: Best friend bonus og vejr boost hjælper meget!</p>
        </div>
      `;
    } else {
      difficultyInfo = `
        <div class="raid-difficulty hard">
          <h4>⚠️ Svær Raid Boss</h4>
          <p>Denne boss kræver minimum 4-5 spillere med optimale teams.</p>
          <p class="tip">💡 Tip: Koordiner med dit raid gruppe og brug Mega Evolution!</p>
        </div>
      `;
    }

    raidSimulatorSection = `
      <div class="raid-simulator-section">
        <h3>🎮 Raid Guide</h3>
        ${difficultyInfo}
        <div class="raid-stats">
          <div class="raid-stat-box">
            <span class="raid-stat-label">⏱️ Estimeret tid</span>
            <span class="raid-stat-value">${minutes}:${seconds.toString().padStart(2, '0')} min</span>
          </div>
          <div class="raid-stat-box">
            <span class="raid-stat-label">👥 Anbefalet spillere</span>
            <span class="raid-stat-value">${pokemon.raid_soloable === 1 ? '1 (Solo!)' : pokemon.min_players_duo === 1 ? '2-3' : pokemon.min_players_trio === 1 ? '3-4' : '4-6'}</span>
          </div>
        </div>
        <div class="raid-tips">
          <h4>📋 Raid Tips:</h4>
          <ul>
            <li>✓ Brug de bedste counters vist nedenfor</li>
            <li>✓ Power up dine Pokémon til mindst level 30-35</li>
            <li>✓ Tjek vejret - det giver 20% damage boost!</li>
            <li>✓ Best friend bonus giver 10% ekstra damage</li>
            ${pokemon.min_players_duo === 1 ? '<li>✓ Relobby hvis nødvendigt - du har tid!</li>' : ''}
          </ul>
        </div>
      </div>
    `;
  }

  // Byg resistances sektion
  let resistancesSection = '';
  if (pokemon.resistances && pokemon.resistances.trim() !== '') {
    const resistanceArray = pokemon.resistances.split(',');
    resistancesSection = `
      <div class="resistances-section">
        <h3>Resistances (Undgå disse typer)</h3>
        <div class="resistance-badges">
          ${resistanceArray.map(resist => {
            const [type, mult] = resist.split(':');
            const multiplier = parseFloat(mult);
            let badgeClass = 'resistance-badge';
            if (multiplier <= 0.25) {
              badgeClass += ' immune'; // Næsten immun
            } else if (multiplier <= 0.4) {
              badgeClass += ' double-resist'; // Dobbelt resistance
            }
            return `<span class="${badgeClass}">${type} (${mult} damage)</span>`;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Byg counter liste opdelt efter type
  let countersList = '<div class="counters-list">';

  // Loop gennem hver weakness type
  Object.keys(pokemon.counters_by_type).forEach(type => {
    const typeData = pokemon.counters_by_type[type];
    const multiplier = typeData.multiplier;

    // Tilføj type overskrift med multiplier
    countersList += `<h4 class="counter-type-header">${type} Attackers (${multiplier} weakness)</h4>`;

    // Tilføj de 3 bedste attackers af denne type
    typeData.attackers.forEach(counter => {
      const counterSpriteUrl = getSpriteUrl(counter.attacker_name, false);

      countersList += `
        <div class="counter-card clickable-counter" data-name="${counter.attacker_name}" onclick="loadPokemonByName('${counter.attacker_name}')">
          <img src="${counterSpriteUrl}" alt="${counter.attacker_name}" class="counter-sprite" onerror="this.style.display='none'">
          <div class="counter-info">
            <h4>${counter.attacker_name}</h4>
            <p class="moveset">${counter.attacker_moveset}</p>
            <p class="effectiveness">${counter.notes}</p>
          </div>
        </div>
      `;
    });
  });

  countersList += '</div>';

  // Sæt indhold
  detailsContainer.innerHTML = `
    <button class="back-button" onclick="showPokemonList()">← Tilbage til liste</button>

    <div class="detail-header">
      <div class="sprites-container">
        <div class="sprite-box">
          <img src="${normalSpriteUrl}" alt="${pokemon.name}" class="detail-sprite">
          <p class="sprite-label">Normal</p>
        </div>
        ${pokemon.shiny_released === 1 ? `
          <div class="sprite-box">
            <img src="${shinySpriteUrl}" alt="${pokemon.name} Shiny" class="detail-sprite">
            <p class="sprite-label shiny-label">✨ Shiny</p>
          </div>
        ` : ''}
      </div>
      <div>
        <h2>${pokemon.name}</h2>
        <p class="type-badge">${pokemon.types}</p>
      </div>
    </div>

    <div class="stats-section">
      <h3>Stats</h3>
      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-label">Attack</span>
          <span class="stat-value">${pokemon.attack}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Defense</span>
          <span class="stat-value">${pokemon.defense}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">HP</span>
          <span class="stat-value">${pokemon.hp}</span>
        </div>
      </div>
    </div>

    <div class="moveset-section">
      <h3>Bedste Moveset</h3>
      <p class="moveset-text">
        ${pokemon.best_moveset}
        ${pokemon.move_availability === 'elite' ? ' <span class="move-badge elite">Elite TM ⭐</span>' : ''}
        ${pokemon.move_availability === 'legacy' ? ' <span class="move-badge legacy">Legacy/Unobtainable ✖</span>' : ''}
      </p>
    </div>

    <div class="cp-section">
      <h3>CP Værdier</h3>
      ${cpTable}
    </div>

    ${raidSimulatorSection}

    ${resistancesSection}

    <div class="counters-section">
      <h3>Top Raid Counters</h3>
      ${countersList}
    </div>
  `;
}

// Funktion der viser listen igen
function showPokemonList() {
  document.getElementById('pokemon-details').style.display = 'none';
  document.getElementById('pokemon-list').style.display = 'grid';
}

// Funktion der finder Pokémon baseret på navn
async function loadPokemonByName(name) {
  console.log('Søger efter Pokémon:', name);

  // Hent alle Pokémon og find den rigtige
  const response = await fetch('/api/pokemon');
  const allPokemon = await response.json();

  // Find Pokémon der matcher navnet
  const pokemon = allPokemon.find(p => p.name === name);

  if (pokemon) {
    // Hvis fundet, load detaljer
    loadPokemonDetails(pokemon.id);
  } else {
    console.log('Pokémon ikke fundet i databasen:', name);
    alert(`${name} er ikke tilgængelig i databasen endnu.`);
  }
}

// Global variabel til at gemme alle Pokémon
let allPokemonData = [];
let activeCategory = 'all';
let activeSortBy = 'pokedex';

// Funktion der filtrerer Pokémon baseret på søgning og kategori
function filterPokemon(searchTerm) {
  // Konverter søgeord til lowercase for case-insensitive søgning
  const search = searchTerm.toLowerCase().trim();

  // Start med alle Pokémon
  let filtered = allPokemonData;

  // Filtrer efter kategori først
  if (activeCategory !== 'all') {
    filtered = filtered.filter(pokemon => pokemon.category === activeCategory);
  }

  // Hvis der er en søgning, filtrer yderligere
  if (search !== '') {
    filtered = filtered.filter(pokemon => {
      const nameMatch = pokemon.name.toLowerCase().includes(search);
      const typeMatch = pokemon.types.toLowerCase().includes(search);
      return nameMatch || typeMatch;
    });
  }

  // Vis de filtrerede resultater
  displayPokemon(filtered);

  // Vis antal resultater i console
  console.log(`Viser ${filtered.length} Pokémon (kategori: ${activeCategory}, søgning: "${searchTerm}")`);
}

// Opdater loadPokemon til at gemme data globalt
async function loadPokemonWithSearch() {
  console.log('Henter Pokémon fra serveren...');

  // Send en forespørgsel til vores API
  const response = await fetch('/api/pokemon');

  // Konverter svaret til JSON (data vi kan bruge)
  allPokemonData = await response.json();

  console.log('Fik Pokémon data:', allPokemonData);

  // Vis Pokémon på siden
  displayPokemon(allPokemonData);
}

// Setup søgefunktionalitet når siden loader
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const clearButton = document.getElementById('clear-search');

  // Lyt efter når brugeren skriver i søgefeltet
  searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value;

    // Vis/skjul clear knap
    if (searchTerm.length > 0) {
      clearButton.style.display = 'block';
    } else {
      clearButton.style.display = 'none';
    }

    // Filtrer Pokémon
    filterPokemon(searchTerm);
  });

  // Clear knap funktionalitet
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.style.display = 'none';
    filterPokemon('');
    searchInput.focus();
  });
}

// Setup kategori-filter funktionalitet
function setupCategoryFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Fjern 'active' class fra alle knapper
      filterButtons.forEach(btn => btn.classList.remove('active'));

      // Tilføj 'active' class til den klikkede knap
      button.classList.add('active');

      // Hent kategorien fra data-category attributten
      activeCategory = button.getAttribute('data-category');

      // Filtrer Pokémon (brug current søgning hvis den findes)
      const searchInput = document.getElementById('search-input');
      filterPokemon(searchInput.value);

      // Log valgt kategori
      console.log('Valgt kategori:', activeCategory);
    });
  });
}

// Setup sortering funktionalitet
function setupSorting() {
  const sortButtons = document.querySelectorAll('.sort-btn');

  sortButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Fjern 'active' class fra alle knapper
      sortButtons.forEach(btn => btn.classList.remove('active'));

      // Tilføj 'active' class til den klikkede knap
      button.classList.add('active');

      // Hent sorteringsmetode fra data-sort attributten
      activeSortBy = button.getAttribute('data-sort');

      // Re-filtrer Pokémon (brug current søgning og filter)
      const searchInput = document.getElementById('search-input');
      filterPokemon(searchInput.value);

      // Log valgt sortering
      console.log('Sortering:', activeSortBy);
    });
  });
}

// Dark mode functionality
function setupDarkMode() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  const themeText = document.querySelector('.theme-toggle-text');

  // Check for saved theme preference or default to 'light' mode
  const currentTheme = localStorage.getItem('theme') || 'light';

  // Apply saved theme
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
    themeText.textContent = 'Light Mode';
  }

  // Toggle theme
  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');

    if (theme === 'dark') {
      // Switch to light mode
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark Mode';
    } else {
      // Switch to dark mode
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light Mode';
    }

    console.log('Theme changed to:', localStorage.getItem('theme'));
  });
}

// ========== COMPARE MODE FUNCTIONALITY ==========

let compareList = []; // Array of Pokemon IDs to compare
const MAX_COMPARE = 6;

function toggleCompare(pokemonId, isChecked) {
  if (isChecked) {
    // Add to compare list
    if (compareList.length < MAX_COMPARE) {
      compareList.push(pokemonId);
    } else {
      // Max reached, uncheck the checkbox
      const checkbox = document.querySelector(`input[data-pokemon-id="${pokemonId}"]`);
      if (checkbox) checkbox.checked = false;
      alert(`Du kan max sammenligne ${MAX_COMPARE} Pokémon ad gangen`);
      return;
    }
  } else {
    // Remove from compare list
    compareList = compareList.filter(id => id !== pokemonId);
  }

  updateComparePanel();
}

function updateComparePanel() {
  const panel = document.getElementById('compare-panel');
  const list = document.getElementById('compare-list');
  const count = document.getElementById('compare-count');
  const showBtn = document.getElementById('show-comparison');

  // Update count
  count.textContent = compareList.length;

  // Show/hide panel
  if (compareList.length > 0) {
    panel.classList.remove('hidden');
  } else {
    panel.classList.add('hidden');
  }

  // Enable/disable compare button
  showBtn.disabled = compareList.length < 2;

  // Build list
  list.innerHTML = '';
  compareList.forEach(pokemonId => {
    const pokemon = allPokemonData.find(p => p.id === pokemonId);
    if (!pokemon) return;

    const spriteUrl = getSpriteUrl(pokemon.name, false);

    const item = document.createElement('div');
    item.className = 'compare-item';
    item.innerHTML = `
      <img src="${spriteUrl}" alt="${pokemon.name}" class="compare-item-sprite">
      <div class="compare-item-info">
        <div class="compare-item-name">${pokemon.name}</div>
        <div class="compare-item-types">${pokemon.types}</div>
      </div>
      <button class="compare-item-remove" onclick="removeFromCompare(${pokemonId})">×</button>
    `;

    list.appendChild(item);
  });
}

function removeFromCompare(pokemonId) {
  // Uncheck the checkbox
  const checkbox = document.querySelector(`input[data-pokemon-id="${pokemonId}"]`);
  if (checkbox) checkbox.checked = false;

  // Remove from list
  compareList = compareList.filter(id => id !== pokemonId);
  updateComparePanel();
}

function clearComparison() {
  // Uncheck all checkboxes
  compareList.forEach(pokemonId => {
    const checkbox = document.querySelector(`input[data-pokemon-id="${pokemonId}"]`);
    if (checkbox) checkbox.checked = false;
  });

  compareList = [];
  updateComparePanel();
}

function closeComparePanel() {
  clearComparison();
}

async function showComparison() {
  if (compareList.length < 2) {
    alert('Vælg mindst 2 Pokémon at sammenligne');
    return;
  }

  const compareView = document.getElementById('compare-view');
  const compareGrid = document.getElementById('compare-grid');

  // Fetch full data for all compare Pokemon
  const pokemonData = [];
  for (const pokemonId of compareList) {
    const response = await fetch(`/api/pokemon/${pokemonId}`);
    const data = await response.json();
    pokemonData.push(data);
  }

  // Find highest stats for highlighting
  const highestAttack = Math.max(...pokemonData.map(p => p.attack));
  const highestDefense = Math.max(...pokemonData.map(p => p.defense));
  const highestHP = Math.max(...pokemonData.map(p => p.hp));
  const highestMaxCP = Math.max(...pokemonData.map(p => {
    const maxCP = p.cp_values.find(cp => cp.level === 50);
    return maxCP ? maxCP.cp : 0;
  }));

  // Build comparison cards
  compareGrid.innerHTML = '';
  pokemonData.forEach(pokemon => {
    const spriteUrl = getSpriteUrl(pokemon.name, false);
    const maxCP = pokemon.cp_values.find(cp => cp.level === 50);

    const card = document.createElement('div');
    card.className = 'compare-card';

    card.innerHTML = `
      <div class="compare-card-header">
        <img src="${spriteUrl}" alt="${pokemon.name}" class="compare-card-sprite">
        <h3 class="compare-card-name">${pokemon.name}</h3>
        <p class="compare-card-number">#${pokemon.pokedex_number}</p>
        <div class="compare-card-type">${pokemon.types}</div>
      </div>

      <div class="compare-section-title">Base Stats</div>
      <div class="compare-stat-row">
        <span class="compare-stat-label">Attack</span>
        <span class="compare-stat-value ${pokemon.attack === highestAttack ? 'highest' : ''}">${pokemon.attack}</span>
      </div>
      <div class="compare-stat-row">
        <span class="compare-stat-label">Defense</span>
        <span class="compare-stat-value ${pokemon.defense === highestDefense ? 'highest' : ''}">${pokemon.defense}</span>
      </div>
      <div class="compare-stat-row">
        <span class="compare-stat-label">HP</span>
        <span class="compare-stat-value ${pokemon.hp === highestHP ? 'highest' : ''}">${pokemon.hp}</span>
      </div>

      <div class="compare-section-title">CP og Kategori</div>
      <div class="compare-stat-row">
        <span class="compare-stat-label">Max CP (L50)</span>
        <span class="compare-stat-value ${maxCP && maxCP.cp === highestMaxCP ? 'highest' : ''}">${maxCP ? maxCP.cp : 'N/A'}</span>
      </div>
      <div class="compare-stat-row">
        <span class="compare-stat-label">Kategori</span>
        <span class="compare-stat-value">${pokemon.category}</span>
      </div>
      <div class="compare-stat-row">
        <span class="compare-stat-label">Shiny?</span>
        <span class="compare-stat-value">${pokemon.shiny_released === 1 ? '✨ Ja' : '❌ Nej'}</span>
      </div>

      <div class="compare-section-title">Raid Difficulty</div>
      <div class="compare-stat-row">
        <span class="compare-stat-label">Solo mulig?</span>
        <span class="compare-stat-value">${pokemon.raid_soloable === 1 ? '⭐ Ja' : '❌ Nej'}</span>
      </div>
      <div class="compare-stat-row">
        <span class="compare-stat-label">Duo mulig?</span>
        <span class="compare-stat-value">${pokemon.min_players_duo === 1 ? '💪 Ja' : '❌ Nej'}</span>
      </div>
      <div class="compare-stat-row">
        <span class="compare-stat-label">Trio mulig?</span>
        <span class="compare-stat-value">${pokemon.min_players_trio === 1 ? '👥 Ja' : '❌ Nej'}</span>
      </div>

      <div class="compare-section-title">Moveset</div>
      <div class="compare-stat-row">
        <span class="compare-stat-label">${pokemon.best_moveset}</span>
      </div>
    `;

    compareGrid.appendChild(card);
  });

  // Show compare view
  compareView.classList.add('active');
}

function closeCompareView() {
  const compareView = document.getElementById('compare-view');
  compareView.classList.remove('active');
}

// Weather boost data - hvilke typer der er boosted i hvert vejr
const WEATHER_BOOSTS = {
  'sunny': ['Fire', 'Grass', 'Ground'],
  'rainy': ['Water', 'Electric', 'Bug'],
  'partlycloudy': ['Normal', 'Rock'],
  'cloudy': ['Fairy', 'Fighting', 'Poison'],
  'windy': ['Dragon', 'Flying', 'Psychic'],
  'snow': ['Ice', 'Steel'],
  'fog': ['Dark', 'Ghost']
};

// Type colors for badges
const TYPE_COLORS = {
  'Normal': '#C0C0C0',
  'Fire': '#F08030',
  'Water': '#6890F0',
  'Electric': '#F8D030',
  'Grass': '#78C850',
  'Ice': '#98D8D8',
  'Fighting': '#C03028',
  'Poison': '#A040A0',
  'Ground': '#E0C068',
  'Flying': '#A890F0',
  'Psychic': '#F85888',
  'Bug': '#A8B820',
  'Rock': '#B8A038',
  'Ghost': '#705898',
  'Dragon': '#7038F8',
  'Dark': '#2C2C2C',
  'Steel': '#B8B8D0',
  'Fairy': '#EE99AC'
};

// Setup weather selector
function setupWeather() {
  const weatherButtons = document.querySelectorAll('.weather-btn');
  const boostInfo = document.getElementById('weather-boost-info');

  weatherButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all buttons
      weatherButtons.forEach(btn => btn.classList.remove('active'));

      // Add active to clicked button
      button.classList.add('active');

      // Get selected weather
      const weather = button.getAttribute('data-weather');

      // Show/hide boost info
      if (weather === 'none') {
        boostInfo.style.display = 'none';
      } else {
        showWeatherBoostInfo(weather);
        boostInfo.style.display = 'block';
      }
    });
  });
}

// Show weather boost information
function showWeatherBoostInfo(weather) {
  const boostInfo = document.getElementById('weather-boost-info');
  const boostedTypes = WEATHER_BOOSTS[weather] || [];

  if (boostedTypes.length === 0) {
    boostInfo.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Intet valgt</p>';
    return;
  }

  let html = '<h4>💪 Boosted typer</h4>';
  html += '<div class="boosted-types">';

  boostedTypes.forEach(type => {
    const color = TYPE_COLORS[type];
    const textColor = (type === 'Normal' || type === 'Electric' || type === 'Ground') ? 'black' : 'white';
    html += `<div class="boosted-type-badge" style="background: ${color}; color: ${textColor};">${type}</div>`;
  });

  html += '</div>';
  html += '<p style="text-align: center; margin-top: 15px; color: var(--text-secondary); font-size: 14px;">Pokémon af disse typer får +5 levels i vejret (level 20 → 25 for raids)</p>';

  boostInfo.innerHTML = html;
}

// Start programmet når siden er loadet
console.log('Starter load af Pokémon...');
loadPokemonWithSearch();
setupSearch();
setupCategoryFilter();
setupSorting();
setupDarkMode();
setupWeather();
