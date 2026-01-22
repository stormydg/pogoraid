// ============================================
// SPROG / LANGUAGE SYSTEM for Type Chart
// ============================================

// Nuværende sprog (læs fra localStorage)
let currentLanguage = localStorage.getItem('pokemon-raid-language') || 'da';

// Oversættelser for Type Chart
const translations = {
  da: {
    type_chart_title: 'Pokémon Type Chart',
    type_chart_subtitle: 'Vælg 1-2 typer for at se weaknesses, resistances og effectiveness',
    back_to_list: '← Tilbage til Pokémon liste',
    select_types: 'Vælg type(r)',
    clear_selection: 'Ryd valg',
    defensive_title: '🛡️ Defensivt (Tager damage fra)',
    offensive_title: '⚔️ Offensivt (Gør damage til)',
    weak_against: '⚠️ Svag imod (tager ekstra damage)',
    resistant_against: '✅ Modstår (tager reduceret damage)',
    neutral_defense: '➖ Neutralt (normal damage)',
    super_effective_against: '💥 Super effective imod (gør ekstra damage)',
    not_effective_against: '🔻 Not very effective imod (gør reduceret damage)',
    no_effect_against: '🚫 Ingen effekt imod (0x damage)',
    neutral_offense: '➖ Neutralt imod (normal damage)'
  },
  en: {
    type_chart_title: 'Pokémon Type Chart',
    type_chart_subtitle: 'Select 1-2 types to see weaknesses, resistances and effectiveness',
    back_to_list: '← Back to Pokémon list',
    select_types: 'Select type(s)',
    clear_selection: 'Clear selection',
    defensive_title: '🛡️ Defensive (Takes damage from)',
    offensive_title: '⚔️ Offensive (Deals damage to)',
    weak_against: '⚠️ Weak to (takes extra damage)',
    resistant_against: '✅ Resists (takes reduced damage)',
    neutral_defense: '➖ Neutral (normal damage)',
    super_effective_against: '💥 Super effective against (deals extra damage)',
    not_effective_against: '🔻 Not very effective against (deals reduced damage)',
    no_effect_against: '🚫 No effect against (0x damage)',
    neutral_offense: '➖ Neutral against (normal damage)'
  }
};

// Funktion til at hente oversættelse
function t(key) {
  return translations[currentLanguage][key] || translations['da'][key] || key;
}

// Funktion til at opdatere alle oversættelser på siden
function updatePageLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key];
    }
  });

  document.documentElement.lang = currentLanguage === 'da' ? 'da' : 'en';

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
}

// Type effectiveness data - Pokémon GO mechanics (1.6x, 0.625x)
const TYPE_CHART = {
  // Defensive weaknesses (what attacks hurt this type)
  defensive: {
    'Normal': { 'Fighting': 1.6 },
    'Fire': { 'Water': 1.6, 'Ground': 1.6, 'Rock': 1.6 },
    'Water': { 'Electric': 1.6, 'Grass': 1.6 },
    'Electric': { 'Ground': 1.6 },
    'Grass': { 'Fire': 1.6, 'Ice': 1.6, 'Poison': 1.6, 'Flying': 1.6, 'Bug': 1.6 },
    'Ice': { 'Fire': 1.6, 'Fighting': 1.6, 'Rock': 1.6, 'Steel': 1.6 },
    'Fighting': { 'Flying': 1.6, 'Psychic': 1.6, 'Fairy': 1.6 },
    'Poison': { 'Ground': 1.6, 'Psychic': 1.6 },
    'Ground': { 'Water': 1.6, 'Grass': 1.6, 'Ice': 1.6 },
    'Flying': { 'Electric': 1.6, 'Ice': 1.6, 'Rock': 1.6 },
    'Psychic': { 'Bug': 1.6, 'Ghost': 1.6, 'Dark': 1.6 },
    'Bug': { 'Fire': 1.6, 'Flying': 1.6, 'Rock': 1.6 },
    'Rock': { 'Water': 1.6, 'Grass': 1.6, 'Fighting': 1.6, 'Ground': 1.6, 'Steel': 1.6 },
    'Ghost': { 'Ghost': 1.6, 'Dark': 1.6 },
    'Dragon': { 'Ice': 1.6, 'Dragon': 1.6, 'Fairy': 1.6 },
    'Dark': { 'Fighting': 1.6, 'Bug': 1.6, 'Fairy': 1.6 },
    'Steel': { 'Fire': 1.6, 'Fighting': 1.6, 'Ground': 1.6 },
    'Fairy': { 'Poison': 1.6, 'Steel': 1.6 }
  },

  // Defensive resistances (what attacks this type resists)
  resistances: {
    'Normal': {},
    'Fire': { 'Fire': 0.625, 'Grass': 0.625, 'Ice': 0.625, 'Bug': 0.625, 'Steel': 0.625, 'Fairy': 0.625 },
    'Water': { 'Fire': 0.625, 'Water': 0.625, 'Ice': 0.625, 'Steel': 0.625 },
    'Electric': { 'Electric': 0.625, 'Flying': 0.625, 'Steel': 0.625 },
    'Grass': { 'Water': 0.625, 'Electric': 0.625, 'Grass': 0.625, 'Ground': 0.625 },
    'Ice': { 'Ice': 0.625 },
    'Fighting': { 'Bug': 0.625, 'Rock': 0.625, 'Dark': 0.625 },
    'Poison': { 'Grass': 0.625, 'Fighting': 0.625, 'Poison': 0.625, 'Bug': 0.625, 'Fairy': 0.625 },
    'Ground': { 'Poison': 0.625, 'Rock': 0.625, 'Electric': 0.390625 },
    'Flying': { 'Grass': 0.625, 'Fighting': 0.625, 'Bug': 0.625, 'Ground': 0.390625 },
    'Psychic': { 'Fighting': 0.625, 'Psychic': 0.625 },
    'Bug': { 'Grass': 0.625, 'Fighting': 0.625, 'Ground': 0.625 },
    'Rock': { 'Normal': 0.625, 'Fire': 0.625, 'Poison': 0.625, 'Flying': 0.625 },
    'Ghost': { 'Poison': 0.625, 'Bug': 0.625, 'Normal': 0.390625, 'Fighting': 0.390625 },
    'Dragon': { 'Fire': 0.625, 'Water': 0.625, 'Electric': 0.625, 'Grass': 0.625 },
    'Dark': { 'Ghost': 0.625, 'Dark': 0.625, 'Psychic': 0.390625 },
    'Steel': { 'Normal': 0.625, 'Grass': 0.625, 'Ice': 0.625, 'Flying': 0.625, 'Psychic': 0.625, 'Bug': 0.625, 'Rock': 0.625, 'Dragon': 0.625, 'Steel': 0.625, 'Fairy': 0.625, 'Poison': 0.390625 },
    'Fairy': { 'Fighting': 0.625, 'Bug': 0.625, 'Dark': 0.625, 'Dragon': 0.390625 }
  },

  // Offensive effectiveness (what this type is super effective against)
  offensive: {
    'Normal': {},
    'Fire': { 'Grass': 1.6, 'Ice': 1.6, 'Bug': 1.6, 'Steel': 1.6 },
    'Water': { 'Fire': 1.6, 'Ground': 1.6, 'Rock': 1.6 },
    'Electric': { 'Water': 1.6, 'Flying': 1.6 },
    'Grass': { 'Water': 1.6, 'Ground': 1.6, 'Rock': 1.6 },
    'Ice': { 'Grass': 1.6, 'Ground': 1.6, 'Flying': 1.6, 'Dragon': 1.6 },
    'Fighting': { 'Normal': 1.6, 'Ice': 1.6, 'Rock': 1.6, 'Dark': 1.6, 'Steel': 1.6 },
    'Poison': { 'Grass': 1.6, 'Fairy': 1.6 },
    'Ground': { 'Fire': 1.6, 'Electric': 1.6, 'Poison': 1.6, 'Rock': 1.6, 'Steel': 1.6 },
    'Flying': { 'Grass': 1.6, 'Fighting': 1.6, 'Bug': 1.6 },
    'Psychic': { 'Fighting': 1.6, 'Poison': 1.6 },
    'Bug': { 'Grass': 1.6, 'Psychic': 1.6, 'Dark': 1.6 },
    'Rock': { 'Fire': 1.6, 'Ice': 1.6, 'Flying': 1.6, 'Bug': 1.6 },
    'Ghost': { 'Psychic': 1.6, 'Ghost': 1.6 },
    'Dragon': { 'Dragon': 1.6 },
    'Dark': { 'Psychic': 1.6, 'Ghost': 1.6 },
    'Steel': { 'Ice': 1.6, 'Rock': 1.6, 'Fairy': 1.6 },
    'Fairy': { 'Fighting': 1.6, 'Dragon': 1.6, 'Dark': 1.6 }
  },

  // Offensive not very effective (what this type is weak against)
  notEffective: {
    'Normal': { 'Rock': 0.625, 'Steel': 0.625 },
    'Fire': { 'Fire': 0.625, 'Water': 0.625, 'Rock': 0.625, 'Dragon': 0.625 },
    'Water': { 'Water': 0.625, 'Grass': 0.625, 'Dragon': 0.625 },
    'Electric': { 'Electric': 0.625, 'Grass': 0.625, 'Dragon': 0.625 },
    'Grass': { 'Fire': 0.625, 'Grass': 0.625, 'Poison': 0.625, 'Flying': 0.625, 'Bug': 0.625, 'Dragon': 0.625, 'Steel': 0.625 },
    'Ice': { 'Fire': 0.625, 'Water': 0.625, 'Ice': 0.625, 'Steel': 0.625 },
    'Fighting': { 'Poison': 0.625, 'Flying': 0.625, 'Psychic': 0.625, 'Bug': 0.625, 'Fairy': 0.625 },
    'Poison': { 'Poison': 0.625, 'Ground': 0.625, 'Rock': 0.625, 'Ghost': 0.625 },
    'Ground': { 'Grass': 0.625, 'Bug': 0.625 },
    'Flying': { 'Electric': 0.625, 'Rock': 0.625, 'Steel': 0.625 },
    'Psychic': { 'Psychic': 0.625, 'Steel': 0.625 },
    'Bug': { 'Fire': 0.625, 'Fighting': 0.625, 'Poison': 0.625, 'Flying': 0.625, 'Ghost': 0.625, 'Steel': 0.625, 'Fairy': 0.625 },
    'Rock': { 'Fighting': 0.625, 'Ground': 0.625, 'Steel': 0.625 },
    'Ghost': { 'Dark': 0.625 },
    'Dragon': { 'Steel': 0.625 },
    'Dark': { 'Fighting': 0.625, 'Dark': 0.625, 'Fairy': 0.625 },
    'Steel': { 'Fire': 0.625, 'Water': 0.625, 'Electric': 0.625, 'Steel': 0.625 },
    'Fairy': { 'Fire': 0.625, 'Poison': 0.625, 'Steel': 0.625 }
  },

  // Offensive immunities (what this type has no effect on)
  immune: {
    'Normal': { 'Ghost': 0 },
    'Fighting': { 'Ghost': 0 },
    'Poison': { 'Steel': 0 },
    'Ground': { 'Flying': 0 },
    'Ghost': { 'Normal': 0 },
    'Electric': { 'Ground': 0 },
    'Psychic': { 'Dark': 0 },
    'Dragon': { 'Fairy': 0 }
  }
};

const ALL_TYPES = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison',
                   'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

let selectedTypes = [];

// Setup dark mode
function setupDarkMode() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const currentTheme = localStorage.getItem('theme') || 'light';

  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
  }

  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeIcon.textContent = '🌙';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeIcon.textContent = '☀️';
    }
  });
}

// Initialize page
function init() {
  setupDarkMode();
  renderTypeSelector();
  updatePageLanguage();

  document.getElementById('clear-types').addEventListener('click', clearTypeSelection);

  // Language toggle
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
  }
}

// Render type selector buttons
function renderTypeSelector() {
  const container = document.getElementById('type-selector');
  container.innerHTML = '';

  ALL_TYPES.forEach(type => {
    const btn = document.createElement('button');
    btn.className = `type-select-btn ${type}`;
    btn.textContent = type;
    btn.addEventListener('click', () => toggleType(type));
    container.appendChild(btn);
  });
}

// Toggle type selection
function toggleType(type) {
  const index = selectedTypes.indexOf(type);

  if (index > -1) {
    // Deselect
    selectedTypes.splice(index, 1);
  } else {
    // Select (max 2)
    if (selectedTypes.length < 2) {
      selectedTypes.push(type);
    } else {
      // Replace oldest selection
      selectedTypes.shift();
      selectedTypes.push(type);
    }
  }

  updateUI();
}

// Clear all selections
function clearTypeSelection() {
  selectedTypes = [];
  updateUI();
}

// Update UI based on selections
function updateUI() {
  // Update button states
  const buttons = document.querySelectorAll('.type-select-btn');
  buttons.forEach(btn => {
    const type = btn.textContent;
    if (selectedTypes.includes(type)) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });

  // Show/hide clear button
  const clearBtn = document.getElementById('clear-types');
  if (selectedTypes.length > 0) {
    clearBtn.style.display = 'block';
  } else {
    clearBtn.style.display = 'none';
  }

  // Show/hide results
  const resultsContainer = document.getElementById('type-results');
  if (selectedTypes.length > 0) {
    resultsContainer.style.display = 'block';
    calculateAndDisplayResults();
  } else {
    resultsContainer.style.display = 'none';
  }
}

// Calculate combined type effectiveness
function calculateAndDisplayResults() {
  const defensive = calculateDefensive();
  const offensive = calculateOffensive();

  displayDefensive(defensive);
  displayOffensive(offensive);
}

// Calculate defensive effectiveness (what damages this type combination)
function calculateDefensive() {
  const multipliers = {};

  // Initialize all types to 1.0
  ALL_TYPES.forEach(type => {
    multipliers[type] = 1.0;
  });

  // Apply weaknesses and resistances for each selected type
  selectedTypes.forEach(type => {
    const weaknesses = TYPE_CHART.defensive[type] || {};
    const resistances = TYPE_CHART.resistances[type] || {};

    Object.keys(weaknesses).forEach(attackType => {
      multipliers[attackType] *= weaknesses[attackType];
    });

    Object.keys(resistances).forEach(attackType => {
      multipliers[attackType] *= resistances[attackType];
    });
  });

  // Categorize
  const result = {
    weaknesses: [],
    resistances: [],
    neutral: []
  };

  Object.entries(multipliers).forEach(([type, mult]) => {
    if (mult > 1.0) {
      result.weaknesses.push({ type, multiplier: mult });
    } else if (mult < 1.0) {
      result.resistances.push({ type, multiplier: mult });
    } else {
      result.neutral.push({ type, multiplier: mult });
    }
  });

  // Sort by multiplier
  result.weaknesses.sort((a, b) => b.multiplier - a.multiplier);
  result.resistances.sort((a, b) => a.multiplier - b.multiplier);

  return result;
}

// Calculate offensive effectiveness (what this type combination hits)
function calculateOffensive() {
  const multipliers = {};

  // Initialize all types to 1.0
  ALL_TYPES.forEach(type => {
    multipliers[type] = 1.0;
  });

  // For dual types, use the BEST offensive multiplier (not multiplicative)
  selectedTypes.forEach(type => {
    const superEffective = TYPE_CHART.offensive[type] || {};
    const notEffective = TYPE_CHART.notEffective[type] || {};
    const immune = TYPE_CHART.immune[type] || {};

    Object.keys(superEffective).forEach(defenderType => {
      multipliers[defenderType] = Math.max(multipliers[defenderType], superEffective[defenderType]);
    });

    Object.keys(notEffective).forEach(defenderType => {
      if (multipliers[defenderType] === 1.0) {
        multipliers[defenderType] = notEffective[defenderType];
      }
    });

    Object.keys(immune).forEach(defenderType => {
      multipliers[defenderType] = 0;
    });
  });

  // Categorize
  const result = {
    superEffective: [],
    notEffective: [],
    immune: [],
    neutral: []
  };

  Object.entries(multipliers).forEach(([type, mult]) => {
    if (mult === 0) {
      result.immune.push({ type, multiplier: mult });
    } else if (mult > 1.0) {
      result.superEffective.push({ type, multiplier: mult });
    } else if (mult < 1.0) {
      result.notEffective.push({ type, multiplier: mult });
    } else {
      result.neutral.push({ type, multiplier: mult });
    }
  });

  // Sort
  result.superEffective.sort((a, b) => b.multiplier - a.multiplier);
  result.notEffective.sort((a, b) => a.multiplier - b.multiplier);

  return result;
}

// Display defensive results
function displayDefensive(data) {
  displayTypeList('defensive-weaknesses', data.weaknesses, true);
  displayTypeList('defensive-resistances', data.resistances, true);
  displayTypeList('defensive-neutral', data.neutral, false);
}

// Display offensive results
function displayOffensive(data) {
  displayTypeList('offensive-super-effective', data.superEffective, true);
  displayTypeList('offensive-not-effective', data.notEffective, true);
  displayTypeList('offensive-immune', data.immune, false);
  displayTypeList('offensive-neutral', data.neutral, false);
}

// Display a list of types with multipliers
function displayTypeList(containerId, types, showMultiplier) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (types.length === 0) {
    container.innerHTML = '<div class="empty-state">Ingen</div>';
    return;
  }

  types.forEach(({ type, multiplier }) => {
    const badge = document.createElement('div');
    badge.className = `type-effectiveness-badge ${type}`;
    badge.innerHTML = `
      <span>${type}</span>
      ${showMultiplier ? `<span class="multiplier">${multiplier.toFixed(2)}x</span>` : ''}
    `;
    container.appendChild(badge);
  });
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
