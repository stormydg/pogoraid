// JavaScript kode til Pokémon Raid Helper
console.log('Pokémon Raid Helper er startet!');

// Helper funktion til at formatere TTW (Time To Win)
function formatTTW(seconds) {
  if (!seconds || seconds <= 0) return 'N/A';
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
}

// ============================================
// SPROG / LANGUAGE SYSTEM
// ============================================

// Nuværende sprog (default: dansk)
let currentLanguage = localStorage.getItem('pokemon-raid-language') || 'da';

// Oversættelser
const translations = {
  da: {
    subtitle: 'Find de bedste counters til raids',
    weather_title: '☀️ Nuværende vejr',
    weather_none: 'Intet valgt',
    weather_boost_text: 'Pokémon af disse typer får +5 levels i vejret (level 20 → 25 for raids)',
    boosted_types: 'Boosted typer:',
    search_placeholder: "Søg efter Pokémon navn eller type (f.eks. 'Mewtwo' eller 'Dragon')...",
    filter_title: 'Filtrer efter kategori:',
    filter_all: 'Alle (218)',
    sort_title: 'Sorter efter:',
    sort_name: 'Navn (A-Z)',
    compare_title: 'Sammenlign',
    compare_btn: 'Sammenlign',
    compare_clear: 'Ryd alle',
    comparison_title: 'Sammenligning',
    back_btn: '← Tilbage',
    // Detalje-side
    stats: 'Stats',
    base_stats: 'Base Stats',
    cp_levels: 'CP ved forskellige levels',
    best_moveset: 'Bedste Moveset',
    fast_move: 'Fast Move',
    charged_move: 'Charged Move',
    weaknesses: 'Svagheder',
    resistances: 'Resistenser',
    raid_counters: 'Raid Counters',
    top_counters_header: 'Top Counters (DPS Ranked)',
    type_counters_header: 'Counters efter Type',
    raid_difficulty: 'Raid Sværhedsgrad',
    players_needed: 'Spillere krævet',
    shiny_available: 'Shiny tilgængelig',
    shiny_yes: 'Ja',
    shiny_no: 'Nej',
    add_to_compare: 'Tilføj til sammenligning',
    remove_from_compare: 'Fjern fra sammenligning',
    close: 'Luk',
    // Type Chart
    type_chart: 'Type Chart',
    select_types: 'Vælg type(r)',
    defensive: 'Defensivt (Tager damage fra)',
    offensive: 'Offensivt (Gør damage til)',
    super_effective: 'Super effektiv mod',
    not_effective: 'Ikke effektiv mod',
    immune: 'Immun mod',
    weak_to: 'Svag mod',
    resistant_to: 'Resistent mod',
    no_selection: 'Vælg 1-2 typer ovenfor for at se effektivitet',
    clear_selection: 'Ryd valg'
  },
  en: {
    subtitle: 'Find the best counters for raids',
    weather_title: '☀️ Current weather',
    weather_none: 'None selected',
    weather_boost_text: 'Pokémon of these types get +5 levels in weather (level 20 → 25 for raids)',
    boosted_types: 'Boosted types:',
    search_placeholder: "Search for Pokémon name or type (e.g. 'Mewtwo' or 'Dragon')...",
    filter_title: 'Filter by category:',
    filter_all: 'All (218)',
    sort_title: 'Sort by:',
    sort_name: 'Name (A-Z)',
    compare_title: 'Compare',
    compare_btn: 'Compare',
    compare_clear: 'Clear all',
    comparison_title: 'Comparison',
    back_btn: '← Back',
    // Detail page
    stats: 'Stats',
    base_stats: 'Base Stats',
    cp_levels: 'CP at different levels',
    best_moveset: 'Best Moveset',
    fast_move: 'Fast Move',
    charged_move: 'Charged Move',
    weaknesses: 'Weaknesses',
    resistances: 'Resistances',
    raid_counters: 'Raid Counters',
    top_counters_header: 'Top Counters (DPS Ranked)',
    type_counters_header: 'Counters by Type',
    raid_difficulty: 'Raid Difficulty',
    players_needed: 'Players needed',
    shiny_available: 'Shiny available',
    shiny_yes: 'Yes',
    shiny_no: 'No',
    add_to_compare: 'Add to comparison',
    remove_from_compare: 'Remove from comparison',
    close: 'Close',
    // Type Chart
    type_chart: 'Type Chart',
    select_types: 'Select type(s)',
    defensive: 'Defensive (Takes damage from)',
    offensive: 'Offensive (Deals damage to)',
    super_effective: 'Super effective against',
    not_effective: 'Not very effective against',
    immune: 'Immune to',
    weak_to: 'Weak to',
    resistant_to: 'Resistant to',
    no_selection: 'Select 1-2 types above to see effectiveness',
    clear_selection: 'Clear selection'
  }
};

// Funktion til at hente oversættelse
function t(key) {
  return translations[currentLanguage][key] || translations['da'][key] || key;
}

// Funktion til at opdatere alle oversættelser på siden
function updatePageLanguage() {
  // Opdater alle elementer med data-i18n attribut
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key];
    }
  });

  // Opdater placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (translations[currentLanguage][key]) {
      element.placeholder = translations[currentLanguage][key];
    }
  });

  // Opdater HTML lang attribut
  document.documentElement.lang = currentLanguage === 'da' ? 'da' : 'en';

  // Opdater sprog-knappen
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    const flag = langToggle.querySelector('.lang-flag');
    const text = langToggle.querySelector('.lang-text');
    if (currentLanguage === 'da') {
      flag.textContent = '🇬🇧';
      text.textContent = 'English';
    } else {
      flag.textContent = '🇩🇰';
      text.textContent = 'Dansk';
    }
  }
}

// Funktion til at skifte sprog
function toggleLanguage() {
  currentLanguage = currentLanguage === 'da' ? 'en' : 'da';
  localStorage.setItem('pokemon-raid-language', currentLanguage);
  updatePageLanguage();

  // Genindlæs Pokémon for at opdatere detaljer
  if (typeof loadPokemon === 'function') {
    loadPokemon();
  }
}

// Initialiser sprog ved load
document.addEventListener('DOMContentLoaded', () => {
  updatePageLanguage();

  // Tilføj event listener til sprog-knappen
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
  }
});

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
  } else if (spriteName.includes('mega charizard x')) {
    // "Mega Charizard X" → "charizard-mega-x"
    spriteName = 'charizard-mega-x';
  } else if (spriteName.includes('zygarde 50%')) {
    // "Zygarde 50%" → "zygarde"
    spriteName = 'zygarde';
  } else if (spriteName.includes('galarian darmanitan')) {
    // "Galarian Darmanitan" → "darmanitan-galarian-standard"
    spriteName = 'darmanitan-galarian-standard';
  } else if (spriteName.includes('ice rider calyrex')) {
    // "Ice Rider Calyrex" → "calyrex-ice-rider"
    spriteName = 'calyrex-ice-rider';
  } else if (spriteName.includes('shadow rider calyrex')) {
    // "Shadow Rider Calyrex" → "calyrex-shadow-rider"
    spriteName = 'calyrex-shadow-rider';
  } else if (spriteName.startsWith('mega ')) {
    // "Mega Rayquaza" → "rayquaza-mega" (men ikke "Meganium")
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
  } else if (spriteName.includes('hisuian typhlosion')) {
    // "Hisuian Typhlosion" → "typhlosion-hisuian"
    spriteName = 'typhlosion-hisuian';
  } else if (spriteName.includes('hisuian samurott')) {
    // "Hisuian Samurott" → "samurott-hisuian"
    spriteName = 'samurott-hisuian';
  } else if (spriteName.includes('hisuian decidueye')) {
    // "Hisuian Decidueye" → "decidueye-hisuian"
    spriteName = 'decidueye-hisuian';
  } else if (spriteName.includes('hisuian')) {
    // Generel Hisuian håndtering: "Hisuian X" → "x-hisuian"
    spriteName = spriteName.replace('hisuian ', '') + '-hisuian';
  } else if (spriteName.includes('galarian')) {
    // Generel Galarian håndtering: "Galarian X" → "x-galar"
    spriteName = spriteName.replace('galarian ', '') + '-galar';
  } else if (spriteName.includes('alolan')) {
    // Generel Alolan håndtering: "Alolan X" → "x-alola"
    spriteName = spriteName.replace('alolan ', '') + '-alola';
  } else if (spriteName.includes('paldean')) {
    // Generel Paldean håndtering: "Paldean X" → "x-paldea"
    spriteName = spriteName.replace('paldean ', '') + '-paldea';
  } else if (spriteName.includes('single strike')) {
    // "Urshifu Single Strike" → "urshifu-single-strike"
    spriteName = spriteName.replace(' single strike', '-single-strike');
  } else if (spriteName.includes('rapid strike')) {
    // "Urshifu Rapid Strike" → "urshifu-rapid-strike"
    spriteName = spriteName.replace(' rapid strike', '-rapid-strike');
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

    // Tilføj type gradient baggrund
    card.style.background = getTypeGradient(pokemon.types);

    // Lav sprite URL med vores hjælpe-funktion
    const spriteUrl = getSpriteUrl(pokemon.name, false);

    // Lav difficulty badge baseret på min_players_duo (beregnet fra TTW)
    let difficultyBadge = '';
    const players = pokemon.min_players_duo;
    if (players) {
      if (players === '1 (solo)' || players === '1') {
        difficultyBadge = '<span class="difficulty-badge solo">⭐ 1 spiller (solo)</span>';
      } else if (players === '1-2') {
        difficultyBadge = '<span class="difficulty-badge duo">💪 1-2 spillere</span>';
      } else if (players === '2') {
        difficultyBadge = '<span class="difficulty-badge duo">💪 2 spillere</span>';
      } else if (players === '2-3') {
        difficultyBadge = '<span class="difficulty-badge trio">👥 2-3 spillere</span>';
      } else if (players === '3') {
        difficultyBadge = '<span class="difficulty-badge trio">👥 3 spillere</span>';
      } else if (players === '3-4') {
        difficultyBadge = '<span class="difficulty-badge hard">⚠️ 3-4 spillere</span>';
      } else if (players === '4' || players === '4-5') {
        difficultyBadge = '<span class="difficulty-badge hard">⚠️ ' + players + ' spillere</span>';
      } else {
        difficultyBadge = '<span class="difficulty-badge hard">⚠️ ' + players + ' spillere</span>';
      }
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
    const players = pokemon.min_players_duo || '';

    let difficultyInfo = '';
    let difficultyClass = 'hard';
    let difficultyTitle = '';
    let difficultyDesc = '';
    let difficultyTip = '';

    if (players === '1 (solo)' || players === '1') {
      difficultyClass = 'solo';
      difficultyTitle = '⭐ SOLO MULIG!';
      difficultyDesc = 'Denne raid kan klares alene med de rigtige counters!';
      difficultyTip = 'Brug level 35+ counters for sikkerhed';
    } else if (players === '1-2') {
      difficultyClass = 'solo';
      difficultyTitle = '⭐ Meget Let';
      difficultyDesc = 'Kan klares solo eller nemt med 2 spillere.';
      difficultyTip = 'Brug super-effective counters';
    } else if (players === '2') {
      difficultyClass = 'easy';
      difficultyTitle = '💪 Duo Mulig';
      difficultyDesc = 'Kan klares af 2 spillere med gode counters.';
      difficultyTip = 'Brug level 35+ counters med super-effective moves';
    } else if (players === '2-3') {
      difficultyClass = 'easy';
      difficultyTitle = '💪 Let';
      difficultyDesc = 'Kan klares af 2-3 spillere med solide teams.';
      difficultyTip = 'Best friend bonus hjælper!';
    } else if (players === '3') {
      difficultyClass = 'medium';
      difficultyTitle = '👥 Trio Mulig';
      difficultyDesc = 'Kræver 3 spillere med stærke counters.';
      difficultyTip = 'Best friend bonus og vejr boost hjælper meget!';
    } else if (players === '3-4') {
      difficultyClass = 'medium';
      difficultyTitle = '👥 Medium';
      difficultyDesc = 'Kræver 3-4 spillere med gode teams.';
      difficultyTip = 'Koordiner med din gruppe';
    } else if (players === '4' || players === '4-5') {
      difficultyClass = 'hard';
      difficultyTitle = '⚠️ Svær';
      difficultyDesc = `Kræver ${players} spillere med stærke teams.`;
      difficultyTip = 'Brug Mega Evolution for ekstra damage!';
    } else {
      difficultyClass = 'hard';
      difficultyTitle = '⚠️ Meget Svær';
      difficultyDesc = `Kræver ${players} spillere med optimale teams.`;
      difficultyTip = 'Koordiner med dit raid gruppe og brug Mega Evolution!';
    }

    difficultyInfo = `
      <div class="raid-difficulty ${difficultyClass}">
        <h4>${difficultyTitle}</h4>
        <p>${difficultyDesc}</p>
        <p class="tip">💡 ${difficultyTip}</p>
      </div>
    `;

    raidSimulatorSection = `
      <div class="raid-simulator-section">
        <h3>🎮 Raid Guide</h3>
        ${difficultyInfo}
        <div class="raid-stats">
          <div class="raid-stat-box">
            <span class="raid-stat-label">⏱️ TTW (Top counters)</span>
            <span class="raid-stat-value">${formatTTW(ttw)}</span>
          </div>
          <div class="raid-stat-box">
            <span class="raid-stat-label">👥 Spillere krævet</span>
            <span class="raid-stat-value">${players || 'Ukendt'}</span>
          </div>
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

  // Byg counter liste - først top counters fra PokemonGOHub, derefter type-baserede
  let countersList = '<div class="counters-list">';

  // Vis top counters fra PokemonGOHub (hvis de findes)
  if (pokemon.top_counters && pokemon.top_counters.length > 0) {
    countersList += `<h4 class="counter-type-header top-counters-header">${t('top_counters_header', currentLanguage) || 'Top Counters (DPS Ranked)'}</h4>`;

    pokemon.top_counters.forEach((counter, index) => {
      const counterSpriteUrl = getSpriteUrl(counter.counter_name, false);
      const rankBadge = index < 3 ? `<span class="rank-badge rank-${index + 1}">#${index + 1}</span>` : `<span class="rank-badge">#${index + 1}</span>`;

      countersList += `
        <div class="counter-card clickable-counter top-counter" data-name="${counter.counter_name}" onclick="loadPokemonByName('${counter.counter_name}')">
          ${rankBadge}
          <img src="${counterSpriteUrl}" alt="${counter.counter_name}" class="counter-sprite" onerror="this.style.display='none'">
          <div class="counter-info">
            <h4>${counter.counter_name}</h4>
            <p class="moveset">${counter.counter_moveset}</p>
            <p class="dps-value">DPS: ${counter.dps.toFixed(1)} | TTW: ${formatTTW(counter.ttw)}</p>
          </div>
        </div>
      `;
    });
  }

  // Vis også type-baserede counters som fallback/ekstra info
  countersList += `<h4 class="counter-type-header type-counters-header">${t('type_counters_header', currentLanguage) || 'Counters by Type'}</h4>`;

  Object.keys(pokemon.counters_by_type).forEach(type => {
    const typeData = pokemon.counters_by_type[type];
    const multiplier = typeData.multiplier;

    // Tilføj type overskrift med multiplier
    countersList += `<h5 class="counter-subtype-header">${type} (${multiplier})</h5>`;

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

// Mapping fra counter-navne (fra PokemonGOHub) til vores database-navne
function normalizeCounterName(name) {
  const nameMapping = {
    // Zacian varianter
    'Crowned Sword Zacian': 'Zacian Crowned Sword',
    'Hero Zacian': 'Zacian Hero',
    // Zamazenta varianter
    'Crowned Shield Zamazenta': 'Zamazenta Crowned Shield',
    'Hero Zamazenta': 'Zamazenta Hero',
    // Calyrex varianter
    'Shadow Rider Calyrex': 'Calyrex Shadow Rider',
    'Ice Rider Calyrex': 'Calyrex Ice Rider',
    // Necrozma varianter
    'Dusk Mane Necrozma': 'Necrozma Dusk Mane',
    'Dawn Wings Necrozma': 'Necrozma Dawn Wings',
    // Urshifu varianter
    'Single Strike Urshifu': 'Urshifu Single Strike',
    'Rapid Strike Urshifu': 'Urshifu Rapid Strike',
    // Giratina varianter
    'Origin Giratina': 'Giratina Origin',
    'Altered Giratina': 'Giratina Altered',
    // Deoxys varianter
    'Attack Deoxys': 'Deoxys Attack',
    'Defense Deoxys': 'Deoxys Defense',
    'Speed Deoxys': 'Deoxys Speed',
    'Normal Deoxys': 'Deoxys Normal',
    // Hoopa varianter
    'Unbound Hoopa': 'Hoopa Unbound',
    'Confined Hoopa': 'Hoopa Confined',
    // Forme varianter (fra PokemonGOHub format)
    'Landorus (Therian Forme)': 'Landorus Therian',
    'Landorus (Incarnate Forme)': 'Landorus Incarnate',
    'Thundurus (Therian Forme)': 'Thundurus Therian',
    'Thundurus (Incarnate Forme)': 'Thundurus Incarnate',
    'Tornadus (Therian Forme)': 'Tornadus Therian',
    'Tornadus (Incarnate Forme)': 'Tornadus Incarnate',
    'Enamorus (Therian Forme)': 'Enamorus Therian',
    'Enamorus (Incarnate Forme)': 'Enamorus Incarnate',
    'Shaymin (Sky Forme)': 'Shaymin Sky',
    'Shaymin (Land Forme)': 'Shaymin Land',
    'Keldeo (Resolute Forme)': 'Keldeo',
    'Keldeo (Ordinary Forme)': 'Keldeo',
    // Shadow Therian forms
    'Shadow Thundurus (Therian Forme)': 'Shadow Thundurus Therian',
    'Shadow Landorus (Therian Forme)': 'Shadow Landorus Therian',
    // Therian/Incarnate (uden parenteser)
    'Therian Landorus': 'Landorus Therian',
    'Incarnate Landorus': 'Landorus Incarnate',
    'Therian Tornadus': 'Tornadus Therian',
    'Incarnate Tornadus': 'Tornadus Incarnate',
    'Therian Thundurus': 'Thundurus Therian',
    'Incarnate Thundurus': 'Thundurus Incarnate',
    'Therian Enamorus': 'Enamorus Therian',
    'Incarnate Enamorus': 'Enamorus Incarnate',
    'Sky Shaymin': 'Shaymin Sky',
    'Land Shaymin': 'Shaymin Land',
  };

  return nameMapping[name] || name;
}

// Funktion der finder Pokémon baseret på navn
async function loadPokemonByName(name) {
  console.log('Søger efter Pokémon:', name);

  // Normaliser navnet først (konverter fra counter-format til vores format)
  const normalizedName = normalizeCounterName(name);
  console.log('Normaliseret navn:', normalizedName);

  // Hent alle Pokémon og find den rigtige
  const response = await fetch('/api/pokemon');
  const allPokemon = await response.json();

  // Find Pokémon der matcher navnet (prøv både originalt og normaliseret)
  let pokemon = allPokemon.find(p => p.name === normalizedName);

  // Hvis ikke fundet med normaliseret navn, prøv originalt navn
  if (!pokemon) {
    pokemon = allPokemon.find(p => p.name === name);
  }

  // Prøv også case-insensitive søgning
  if (!pokemon) {
    pokemon = allPokemon.find(p => p.name.toLowerCase() === normalizedName.toLowerCase());
  }

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
let activeCategories = []; // Array af valgte kategorier (tom = alle)
let activeSortBy = 'pokedex';
let activeRangeMin = null;
let activeRangeMax = null;

// Funktion der filtrerer Pokémon baseret på søgning og kategori
function filterPokemon(searchTerm) {
  // Konverter søgeord til lowercase for case-insensitive søgning
  const search = searchTerm.toLowerCase().trim();

  // Start med alle Pokémon
  let filtered = allPokemonData;

  // Filtrer efter kategorier (hvis nogen er valgt)
  if (activeCategories.length > 0) {
    filtered = filtered.filter(pokemon => activeCategories.includes(pokemon.category));
  }

  // Hvis der er en søgning, filtrer yderligere
  if (search !== '') {
    filtered = filtered.filter(pokemon => {
      const nameMatch = pokemon.name.toLowerCase().includes(search);
      const typeMatch = pokemon.types.toLowerCase().includes(search);
      return nameMatch || typeMatch;
    });
  }

  // Filtrer efter range (hvis sat)
  if (activeRangeMin !== null || activeRangeMax !== null) {
    filtered = filtered.filter(pokemon => {
      const value = getRangeValue(pokemon, activeSortBy);
      if (value === null) return true; // Behold hvis ingen værdi
      if (activeRangeMin !== null && value < activeRangeMin) return false;
      if (activeRangeMax !== null && value > activeRangeMax) return false;
      return true;
    });
  }

  // Vis de filtrerede resultater
  displayPokemon(filtered);

  // Vis antal resultater i console
  console.log(`Viser ${filtered.length} Pokémon (kategorier: ${activeCategories.length > 0 ? activeCategories.join(', ') : 'alle'}, søgning: "${searchTerm}")`);
}

// Hent værdi for range filter baseret på sorteringstype
function getRangeValue(pokemon, sortBy) {
  switch (sortBy) {
    case 'cp': return pokemon.max_cp || 0;
    case 'attack': return pokemon.attack || 0;
    case 'defense': return pokemon.defense || 0;
    case 'hp': return pokemon.hp || 0;
    case 'pokedex': return pokemon.pokedex_number || 0;
    default: return null;
  }
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
      const category = button.getAttribute('data-category');

      if (category === 'all') {
        // "Alle" knappen - ryd alle valg og vis alle
        activeCategories = [];
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      } else {
        // Fjern "Alle" knappens active class
        const allButton = document.querySelector('.filter-btn[data-category="all"]');
        allButton.classList.remove('active');

        // Toggle denne kategori
        if (button.classList.contains('active')) {
          // Fjern fra valgte kategorier
          button.classList.remove('active');
          activeCategories = activeCategories.filter(c => c !== category);

          // Hvis ingen kategorier er valgt, aktiver "Alle"
          if (activeCategories.length === 0) {
            allButton.classList.add('active');
          }
        } else {
          // Tilføj til valgte kategorier
          button.classList.add('active');
          activeCategories.push(category);
        }
      }

      // Filtrer Pokémon (brug current søgning hvis den findes)
      const searchInput = document.getElementById('search-input');
      filterPokemon(searchInput.value);

      // Log valgte kategorier
      console.log('Valgte kategorier:', activeCategories.length > 0 ? activeCategories : ['alle']);
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

      // Nulstil range filter når man skifter sortering
      activeRangeMin = null;
      activeRangeMax = null;

      // Opdater range filter UI
      updateRangeFilter(activeSortBy);

      // Re-filtrer Pokémon (brug current søgning og filter)
      const searchInput = document.getElementById('search-input');
      filterPokemon(searchInput.value);

      // Log valgt sortering
      console.log('Sortering:', activeSortBy);
    });
  });

  // Setup range filter
  setupRangeFilter();
}

// Presets for hver sorteringstype
const rangePresets = {
  cp: [
    { label: 'Under 2000', min: 0, max: 1999 },
    { label: '2000-3000', min: 2000, max: 3000 },
    { label: '3000-4000', min: 3000, max: 4000 },
    { label: '4000-5000', min: 4000, max: 5000 },
    { label: '5000+', min: 5000, max: 9999 },
    { label: 'Mega/Primal (6000+)', min: 6000, max: 9999 }
  ],
  attack: [
    { label: 'Under 200', min: 0, max: 199 },
    { label: '200-250', min: 200, max: 250 },
    { label: '250-300', min: 250, max: 300 },
    { label: '300+', min: 300, max: 999 }
  ],
  defense: [
    { label: 'Under 150', min: 0, max: 149 },
    { label: '150-200', min: 150, max: 200 },
    { label: '200-250', min: 200, max: 250 },
    { label: '250+', min: 250, max: 999 }
  ],
  hp: [
    { label: 'Under 150', min: 0, max: 149 },
    { label: '150-200', min: 150, max: 200 },
    { label: '200-250', min: 200, max: 250 },
    { label: '250+', min: 250, max: 999 }
  ],
  pokedex: [
    { label: 'Gen 1 (1-151)', min: 1, max: 151 },
    { label: 'Gen 2 (152-251)', min: 152, max: 251 },
    { label: 'Gen 3 (252-386)', min: 252, max: 386 },
    { label: 'Gen 4 (387-493)', min: 387, max: 493 },
    { label: 'Gen 5 (494-649)', min: 494, max: 649 },
    { label: 'Gen 6 (650-721)', min: 650, max: 721 },
    { label: 'Gen 7 (722-809)', min: 722, max: 809 },
    { label: 'Gen 8 (810-905)', min: 810, max: 905 },
    { label: 'Gen 9 (906+)', min: 906, max: 1500 }
  ]
};

// Opdater range filter baseret på valgt sortering
function updateRangeFilter(sortBy) {
  const rangeFilter = document.getElementById('range-filter');
  const presetsContainer = document.getElementById('range-presets');
  const minInput = document.getElementById('range-min');
  const maxInput = document.getElementById('range-max');

  // Skjul range filter for navn-sortering
  if (sortBy === 'name') {
    rangeFilter.style.display = 'none';
    return;
  }

  // Vis range filter
  rangeFilter.style.display = 'block';

  // Nulstil inputs
  minInput.value = '';
  maxInput.value = '';

  // Opdater labels
  const labels = {
    cp: 'CP',
    attack: 'Attack',
    defense: 'Defense',
    hp: 'HP',
    pokedex: 'Pokédex Nr.'
  };
  document.getElementById('range-label-min').textContent = `Min ${labels[sortBy]}:`;
  document.getElementById('range-label-max').textContent = `Max ${labels[sortBy]}:`;

  // Opdater presets
  const presets = rangePresets[sortBy] || [];
  presetsContainer.innerHTML = presets.map(preset => `
    <button class="range-preset-btn" data-min="${preset.min}" data-max="${preset.max}">
      ${preset.label}
    </button>
  `).join('');

  // Tilføj event listeners til presets
  presetsContainer.querySelectorAll('.range-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Fjern active fra alle presets
      presetsContainer.querySelectorAll('.range-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Sæt range værdier
      const min = parseInt(btn.getAttribute('data-min'));
      const max = parseInt(btn.getAttribute('data-max'));
      minInput.value = min;
      maxInput.value = max;

      // Anvend filter
      applyRangeFilter();
    });
  });
}

// Setup range filter event listeners
function setupRangeFilter() {
  const applyBtn = document.getElementById('apply-range');
  const clearBtn = document.getElementById('clear-range');
  const minInput = document.getElementById('range-min');
  const maxInput = document.getElementById('range-max');

  applyBtn.addEventListener('click', applyRangeFilter);
  clearBtn.addEventListener('click', clearRangeFilter);

  // Enter-tast anvender filter
  minInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') applyRangeFilter();
  });
  maxInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') applyRangeFilter();
  });
}

// Anvend range filter
function applyRangeFilter() {
  const minInput = document.getElementById('range-min');
  const maxInput = document.getElementById('range-max');

  activeRangeMin = minInput.value !== '' ? parseInt(minInput.value) : null;
  activeRangeMax = maxInput.value !== '' ? parseInt(maxInput.value) : null;

  // Re-filtrer
  const searchInput = document.getElementById('search-input');
  filterPokemon(searchInput.value);

  console.log(`Range filter: ${activeRangeMin || 'min'} - ${activeRangeMax || 'max'}`);
}

// Ryd range filter
function clearRangeFilter() {
  activeRangeMin = null;
  activeRangeMax = null;

  const minInput = document.getElementById('range-min');
  const maxInput = document.getElementById('range-max');
  minInput.value = '';
  maxInput.value = '';

  // Fjern active fra presets
  document.querySelectorAll('.range-preset-btn').forEach(btn => btn.classList.remove('active'));

  // Re-filtrer
  const searchInput = document.getElementById('search-input');
  filterPokemon(searchInput.value);

  console.log('Range filter cleared');
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

// Funktion til at lave gradient baggrund baseret på Pokémon type(r)
function getTypeGradient(types) {
  // Split types (f.eks. "Fire/Flying" → ["Fire", "Flying"])
  const typeArray = types.split('/').map(t => t.trim());

  // Hent farver for hver type
  const color1 = TYPE_COLORS[typeArray[0]] || '#888888';
  const color2 = typeArray[1] ? TYPE_COLORS[typeArray[1]] : color1;

  // Lav gradient - svag toning (20% opacity) så tekst stadig er læselig
  if (typeArray.length === 1) {
    // Single type: Svag toning fra top til bund
    return `linear-gradient(180deg, ${color1}30 0%, ${color1}10 100%)`;
  } else {
    // Dual type: Diagonal gradient mellem de to farver
    return `linear-gradient(135deg, ${color1}35 0%, ${color1}20 40%, ${color2}20 60%, ${color2}35 100%)`;
  }
}

// Setup weather dropdown
function setupWeather() {
  const weatherToggle = document.getElementById('weather-toggle');
  const weatherDropdown = document.getElementById('weather-dropdown');
  const weatherOptions = document.querySelectorAll('.weather-option');
  const currentIcon = document.getElementById('weather-current-icon');

  if (!weatherToggle || !weatherDropdown) return;

  // Toggle dropdown
  weatherToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    weatherDropdown.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!weatherDropdown.contains(e.target) && e.target !== weatherToggle) {
      weatherDropdown.classList.remove('show');
    }
  });

  // Handle weather selection
  weatherOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active from all options
      weatherOptions.forEach(opt => opt.classList.remove('active'));

      // Add active to clicked option
      option.classList.add('active');

      // Get selected weather
      const weather = option.getAttribute('data-weather');

      // Update toggle icon
      const icon = option.querySelector('.weather-icon').textContent;
      currentIcon.textContent = icon;

      // Close dropdown
      weatherDropdown.classList.remove('show');

      // Store selected weather (for use elsewhere if needed)
      window.currentWeather = weather;
    });
  });
}

// Start programmet når siden er loadet
console.log('Starter load af Pokémon...');
loadPokemonWithSearch();
setupSearch();
setupCategoryFilter();
setupSorting();
setupDarkMode();
setupWeather();
