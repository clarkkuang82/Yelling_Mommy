const { createKids, updateKids } = require('./kids');
const { calculateScore, calculateBonus } = require('./score');

function createInitialState(kidCount, threshold) {
  return {
    kids: createKids(kidCount),
    score: 0,
    streak: 0,
    threshold,
  };
}

function tick(state, volumeLevel) {
  const isYelling = volumeLevel > state.threshold;
  const kids = updateKids(state.kids, volumeLevel, state.threshold);
  const streak = isYelling ? state.streak + 1 : 0;
  const pointsThisTick = isYelling
    ? calculateScore(volumeLevel) + calculateBonus(streak)
    : 0;

  return {
    kids,
    score: state.score + pointsThisTick,
    streak,
    threshold: state.threshold,
  };
}

module.exports = { createInitialState, tick };
