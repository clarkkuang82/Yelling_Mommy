function createKids(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    state: 'standing',
    kneelingAmount: 0,
  }));
}

function updateKids(kids, volumeLevel, threshold) {
  const isYelling = volumeLevel > threshold;

  return kids.map(kid => ({
    ...kid,
    state: isYelling ? 'kneeling' : 'standing',
    kneelingAmount: isYelling ? 1.0 : 0,
  }));
}

module.exports = { createKids, updateKids };
