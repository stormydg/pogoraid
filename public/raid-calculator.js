// ========== RAID DAMAGE CALCULATOR ==========

// CP Multiplier (CPM) værdier for forskellige levels
const CPM_VALUES = {
  1: 0.094, 1.5: 0.135137432, 2: 0.16639787, 2.5: 0.192650919,
  3: 0.21573247, 3.5: 0.236572661, 4: 0.25572005, 4.5: 0.273530381,
  5: 0.29024988, 5.5: 0.306057377, 6: 0.3210876, 6.5: 0.335445036,
  7: 0.34921268, 7.5: 0.362457751, 8: 0.37523559, 8.5: 0.387592406,
  9: 0.39956728, 9.5: 0.411193551, 10: 0.42250001, 10.5: 0.432926419,
  11: 0.44310755, 11.5: 0.4530599578, 12: 0.46279839, 12.5: 0.472336083,
  13: 0.48168495, 13.5: 0.4908558, 14: 0.49985844, 14.5: 0.508701765,
  15: 0.51739395, 15.5: 0.525942511, 16: 0.53435433, 16.5: 0.542635767,
  17: 0.55079269, 17.5: 0.558830576, 18: 0.56675452, 18.5: 0.574569153,
  19: 0.58227891, 19.5: 0.589887917, 20: 0.59740001, 20.5: 0.604818814,
  21: 0.61215729, 21.5: 0.619399365, 22: 0.62656713, 22.5: 0.633644533,
  23: 0.64065295, 23.5: 0.647576426, 24: 0.65443563, 24.5: 0.661214806,
  25: 0.667934, 25.5: 0.674577537, 26: 0.68116492, 26.5: 0.687680648,
  27: 0.69414365, 27.5: 0.700538673, 28: 0.70688421, 28.5: 0.713164996,
  29: 0.71939909, 29.5: 0.725571552, 30: 0.7317, 30.5: 0.734741009,
  31: 0.73776948, 31.5: 0.740785574, 32: 0.74378943, 32.5: 0.746781211,
  33: 0.74976104, 33.5: 0.752729087, 34: 0.75568551, 34.5: 0.758630378,
  35: 0.76156384, 35.5: 0.764486065, 36: 0.76739717, 36.5: 0.770297266,
  37: 0.7731865, 37.5: 0.776064962, 38: 0.77893275, 38.5: 0.781790055,
  39: 0.78463697, 39.5: 0.787473578, 40: 0.79030001, 40.5: 0.792803950,
  41: 0.79530001, 41.5: 0.797803921, 42: 0.80030001, 42.5: 0.802803892,
  43: 0.80530001, 43.5: 0.807803863, 44: 0.81030001, 44.5: 0.812803834,
  45: 0.81530001, 45.5: 0.817803806, 46: 0.82030001, 46.5: 0.822803777,
  47: 0.82530001, 47.5: 0.827803748, 48: 0.83030001, 48.5: 0.832803719,
  49: 0.83530001, 49.5: 0.837803690, 50: 0.84030001
};

// Beregn effektiv Attack stat baseret på base stats, IV og level
function calculateAttack(baseAttack, ivAttack, level) {
  const cpm = CPM_VALUES[level];
  return (baseAttack + ivAttack) * cpm;
}

// Beregn effektiv Defense stat
function calculateDefense(baseDefense, ivDefense, level) {
  const cpm = CPM_VALUES[level];
  return (baseDefense + ivDefense) * cpm;
}

// Beregn effektiv HP stat
function calculateHP(baseHP, ivHP, level) {
  const cpm = CPM_VALUES[level];
  return Math.floor((baseHP + ivHP) * cpm);
}

// Beregn CP
function calculateCP(baseAttack, baseDefense, baseHP, ivAttack, ivDefense, ivHP, level) {
  const cpm = CPM_VALUES[level];
  const attack = baseAttack + ivAttack;
  const defense = baseDefense + ivDefense;
  const hp = baseHP + ivHP;

  const cp = Math.floor((attack * Math.sqrt(defense) * Math.sqrt(hp) * cpm * cpm) / 10);
  return Math.max(10, cp);
}

// Hent type effectiveness multiplier
function getTypeEffectiveness(attackType, defenderTypes) {
  // Type effectiveness chart (simpel version)
  const typeChart = {
    'Water': { 'Fire': 2, 'Ground': 2, 'Rock': 2, 'Water': 0.5, 'Grass': 0.5, 'Dragon': 0.5 },
    'Fire': { 'Grass': 2, 'Ice': 2, 'Bug': 2, 'Steel': 2, 'Fire': 0.5, 'Water': 0.5, 'Rock': 0.5, 'Dragon': 0.5 },
    'Grass': { 'Water': 2, 'Ground': 2, 'Rock': 2, 'Fire': 0.5, 'Grass': 0.5, 'Poison': 0.5, 'Flying': 0.5, 'Bug': 0.5, 'Dragon': 0.5, 'Steel': 0.5 },
    'Electric': { 'Water': 2, 'Flying': 2, 'Electric': 0.5, 'Grass': 0.5, 'Dragon': 0.5, 'Ground': 0.5 },
    'Ice': { 'Grass': 2, 'Ground': 2, 'Flying': 2, 'Dragon': 2, 'Fire': 0.5, 'Water': 0.5, 'Ice': 0.5, 'Steel': 0.5 },
    'Fighting': { 'Normal': 2, 'Ice': 2, 'Rock': 2, 'Dark': 2, 'Steel': 2, 'Poison': 0.5, 'Flying': 0.5, 'Psychic': 0.5, 'Bug': 0.5, 'Fairy': 0.5, 'Ghost': 0.5 },
    'Poison': { 'Grass': 2, 'Fairy': 2, 'Poison': 0.5, 'Ground': 0.5, 'Rock': 0.5, 'Ghost': 0.5, 'Steel': 0.5 },
    'Ground': { 'Fire': 2, 'Electric': 2, 'Poison': 2, 'Rock': 2, 'Steel': 2, 'Grass': 0.5, 'Bug': 0.5, 'Flying': 0.5 },
    'Flying': { 'Grass': 2, 'Fighting': 2, 'Bug': 2, 'Electric': 0.5, 'Rock': 0.5, 'Steel': 0.5 },
    'Psychic': { 'Fighting': 2, 'Poison': 2, 'Psychic': 0.5, 'Steel': 0.5, 'Dark': 0.5 },
    'Bug': { 'Grass': 2, 'Psychic': 2, 'Dark': 2, 'Fire': 0.5, 'Fighting': 0.5, 'Poison': 0.5, 'Flying': 0.5, 'Ghost': 0.5, 'Steel': 0.5, 'Fairy': 0.5 },
    'Rock': { 'Fire': 2, 'Ice': 2, 'Flying': 2, 'Bug': 2, 'Fighting': 0.5, 'Ground': 0.5, 'Steel': 0.5 },
    'Ghost': { 'Psychic': 2, 'Ghost': 2, 'Dark': 0.5, 'Normal': 0.5 },
    'Dragon': { 'Dragon': 2, 'Steel': 0.5, 'Fairy': 0.5 },
    'Dark': { 'Psychic': 2, 'Ghost': 2, 'Fighting': 0.5, 'Dark': 0.5, 'Fairy': 0.5 },
    'Steel': { 'Ice': 2, 'Rock': 2, 'Fairy': 2, 'Fire': 0.5, 'Water': 0.5, 'Electric': 0.5, 'Steel': 0.5 },
    'Fairy': { 'Fighting': 2, 'Dragon': 2, 'Dark': 2, 'Fire': 0.5, 'Poison': 0.5, 'Steel': 0.5 }
  };

  let multiplier = 1.0;
  const defenderTypeArray = defenderTypes.split('/');

  defenderTypeArray.forEach(defType => {
    if (typeChart[attackType] && typeChart[attackType][defType]) {
      multiplier *= typeChart[attackType][defType];
    }
  });

  return multiplier;
}

// Simuler raid med brugerens team
async function simulateRaid(raidBossId, userTeam) {
  // Hent raid boss data
  const response = await fetch(`/api/pokemon/${raidBossId}`);
  const boss = await response.json();

  // Raid boss stats - level 20 for T5, level 25 for Mega
  const bossLevel = (boss.category === 'Mega' || boss.category === 'Primal') ? 25 : 20;
  const bossCPM = CPM_VALUES[bossLevel];
  const bossAttack = boss.attack * bossCPM;
  const bossDefense = boss.defense * bossCPM;

  // Raid boss HP baseret på kategori
  let bossHP;
  if (boss.category === 'Primal') {
    bossHP = 22500; // Primal raids (sværeste)
  } else if (boss.category === 'Mega' && (boss.category_original === 'Legendary' || boss.category_original === 'Mythical')) {
    bossHP = 22500; // Mega Legendary/Mythical
  } else if (boss.category === 'Mega') {
    bossHP = 15000; // Mega raids (normal)
  } else if (boss.category === 'Legendary' || boss.category === 'Mythical' || boss.category === 'Ultra Beast') {
    bossHP = 15000; // Tier 5 raids
  } else {
    bossHP = 9000; // Tier 3-4 raids
  }

  // Beregn samlet DPS fra brugerens team
  let totalDPS = 0;
  let teamDetails = [];

  for (const mon of userTeam) {
    // Beregn angriber stats
    const attackerAttack = calculateAttack(mon.base_attack, mon.iv_attack, mon.level);
    const attackerDefense = calculateDefense(mon.base_defense, mon.iv_defense, mon.level);

    // Shadow boost: +20% attack
    const shadowBoost = mon.is_shadow ? 1.2 : 1.0;

    // Mega boost: +30% attack (Mega Evolution er kraftigt!)
    const megaBoost = mon.is_mega ? 1.3 : 1.0;

    // Find bedste type effectiveness mod boss
    const attackerTypes = mon.types.split('/');
    let bestMultiplier = 1.0;
    attackerTypes.forEach(type => {
      const mult = getTypeEffectiveness(type, boss.types);
      if (mult > bestMultiplier) {
        bestMultiplier = mult;
      }
    });

    // Realistisk DPS beregning baseret på Pokémon GO formler
    // DPS = (Power × Attack / Defense × STAB × Effectiveness × 0.5) + 1
    // Vi antager gennemsnitlig move power på 100 for charged moves
    const movePower = 100;
    const STAB = bestMultiplier >= 1 ? 1.2 : 1.0; // Same Type Attack Bonus

    // Cycle DPS formel (mere realistisk)
    const damagePerCycle = Math.floor(
      0.5 * movePower * (attackerAttack * shadowBoost * megaBoost / bossDefense) * STAB * bestMultiplier
    ) + 1;

    // Antag ~3 sekunder per attack cycle (fast move + charged move)
    const cycleDuration = 3.0;
    const dps = damagePerCycle / cycleDuration;

    totalDPS += dps;

    teamDetails.push({
      name: mon.nickname || mon.name,
      dps: dps.toFixed(1),
      effectiveness: bestMultiplier,
      iv_percentage: ((mon.iv_attack + mon.iv_defense + mon.iv_hp) / 45 * 100).toFixed(1)
    });
  }

  // Beregn tid til at slå boss
  const timeToWin = bossHP / totalDPS;

  // Tjek om det er muligt at vinde (300 sekunder = 5 min raid timer)
  const canWin = timeToWin <= 300;

  return {
    canWin: canWin,
    timeToWin: Math.round(timeToWin),
    totalDPS: totalDPS.toFixed(1),
    bossHP: bossHP,
    bossName: boss.name,
    teamDetails: teamDetails,
    recommendation: getRecommendation(timeToWin, userTeam.length, boss)
  };
}

// Giv anbefalinger baseret på simulation
function getRecommendation(timeToWin, teamSize, boss) {
  const minutes = Math.floor(timeToWin / 60);
  const seconds = Math.round(timeToWin % 60);

  // Beregn hvor mange spillere der skal til (baseret på at hver spiller kan gøre samme DPS)
  // 300 sekunder = raid timer, så playersNeeded = timeToWin / 300
  const playersNeeded = Math.ceil(timeToWin / 300);

  if (playersNeeded === 1) {
    if (timeToWin <= 180) {
      return `✅ Solo mulig! Estimeret tid: ${minutes}:${seconds.toString().padStart(2, '0')} - du har masser af tid til overs!`;
    } else if (timeToWin <= 270) {
      return `⚠️ Solo mulig, men tight! Estimeret tid: ${minutes}:${seconds.toString().padStart(2, '0')}. Tips: Dodge Charge attacks!`;
    } else {
      return `🔥 Teknisk solo mulig på ${minutes}:${seconds.toString().padStart(2, '0')}, men meget svært! Overvej duo.`;
    }
  } else if (playersNeeded === 2) {
    return `👥 Du har brug for ${playersNeeded} spillere total (duo mulig med lignende teams).`;
  } else if (playersNeeded === 3) {
    return `👥 Du har brug for ${playersNeeded} spillere total (trio nødvendigt med lignende teams).`;
  } else {
    return `⚠️ Du har brug for ${playersNeeded}+ spillere med stærke counters.`;
  }
}
