// ========== MY TEAM FUNKTIONER ==========

// Global variabel til brugerens team
let myTeam = [];

// Toggle My Team panel
function toggleMyTeam() {
  const panel = document.getElementById('my-team-panel');
  if (panel.style.display === 'none') {
    panel.style.display = 'block';
    loadMyTeam();
  } else {
    panel.style.display = 'none';
  }
}

// Hent brugerens team
async function loadMyTeam() {
  const response = await fetch('/api/my-team');
  myTeam = await response.json();

  // Opdater team count badge
  document.getElementById('team-count').textContent = myTeam.length;

  // Vis team
  displayMyTeam();
}

// Vis brugerens team
function displayMyTeam() {
  const container = document.getElementById('my-team-list');

  if (myTeam.length === 0) {
    container.innerHTML = '<p class="empty-team">Intet team endnu. Tilføj dine Pokémon!</p>';
    return;
  }

  container.innerHTML = myTeam.map(mon => {
    const totalIV = ((mon.iv_attack + mon.iv_defense + mon.iv_hp) / 45 * 100).toFixed(1);
    return `
      <div class="team-pokemon-card">
        <div class="team-pokemon-info">
          <h4>${mon.nickname || mon.name}</h4>
          <p class="pokemon-species">${mon.name} ${mon.is_mega ? '(Mega)' : ''} ${mon.is_shadow ? '(Shadow)' : ''}</p>
          <p class="pokemon-ivs">IV: ${mon.iv_attack}/${mon.iv_defense}/${mon.iv_hp} (${totalIV}%)</p>
          <p class="pokemon-level">Level: ${mon.level}</p>
        </div>
        <button class="delete-btn" onclick="deletePokemon(${mon.id})">🗑️</button>
      </div>
    `;
  }).join('');
}

// Vis dialog til at tilføje Pokémon
async function showAddPokemonDialog() {
  // Populer Pokémon dropdown
  const select = document.getElementById('pokemon-select');
  if (select.options.length === 1) { // Kun default option
    const response = await fetch('/api/pokemon');
    const allPokemon = await response.json();

    allPokemon.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = `${p.name} (${p.types})`;
      select.appendChild(option);
    });
  }

  document.getElementById('add-pokemon-dialog').style.display = 'flex';
}

// Luk dialog
function closeAddPokemonDialog() {
  document.getElementById('add-pokemon-dialog').style.display = 'none';
  document.getElementById('add-pokemon-form').reset();
}

// Tilføj Pokémon til team
function setupFormHandler() {
  const form = document.getElementById('add-pokemon-form');
  if (!form) {
    console.error('Form not found!');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      pokemon_id: parseInt(document.getElementById('pokemon-select').value),
      nickname: document.getElementById('nickname-input').value,
      iv_attack: parseInt(document.getElementById('iv-attack').value),
      iv_defense: parseInt(document.getElementById('iv-defense').value),
      iv_hp: parseInt(document.getElementById('iv-hp').value),
      level: parseFloat(document.getElementById('level-input').value),
      move_fast: null,
      move_charged: null
    };

    try {
      const response = await fetch('/api/my-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        closeAddPokemonDialog();
        loadMyTeam();
      } else {
        alert('Fejl ved tilføjelse af Pokémon');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Kunne ikke tilføje Pokémon: ' + error.message);
    }
  });
}

// Slet Pokémon fra team
async function deletePokemon(id) {
  if (!confirm('Er du sikker på at du vil fjerne denne Pokémon?')) return;

  await fetch(`/api/my-team/${id}`, { method: 'DELETE' });
  loadMyTeam();
}

// Load team ved opstart
document.addEventListener('DOMContentLoaded', () => {
  loadMyTeam();
  setupFormHandler();
});
