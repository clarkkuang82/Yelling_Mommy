function calculateScore(volumeLevel) {
  const rounded = Math.round(volumeLevel);
  return Math.min(rounded, 100);
}

function calculateBonus(streak) {
  if (streak >= 5) return 20;
  if (streak >= 3) return 10;
  return 0;
}

module.exports = { calculateScore, calculateBonus };
