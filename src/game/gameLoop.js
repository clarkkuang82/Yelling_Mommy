if (typeof require !== 'undefined') {
  var { createKids, updateKids } = require('./kids');
  var { calculateScore, calculateBonus } = require('./score');
}

function createInitialState(kidCount, threshold) {
  return {
    kids: createKids(kidCount),
    score: 0,
    streak: 0,
    threshold: threshold,
    volumeLevel: 0,
  };
}

function tick(state, volumeLevel, deltaTime) {
  var dt = deltaTime || 0.016;
  var isYelling = volumeLevel > state.threshold;
  var kids = updateKids(state.kids, volumeLevel, state.threshold, dt);
  var streak = isYelling ? state.streak + 1 : 0;
  var pointsThisTick = isYelling
    ? calculateScore(volumeLevel) + calculateBonus(streak)
    : 0;

  return {
    kids: kids,
    score: state.score + pointsThisTick,
    streak: streak,
    threshold: state.threshold,
    volumeLevel: volumeLevel,
  };
}

if (typeof module !== 'undefined') module.exports = { createInitialState, tick };
