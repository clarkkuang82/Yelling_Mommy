var REACTION_LEVELS = [
  { name: 'idle', minRatio: 0, maxRatio: 0 },
  { name: 'nervous', minRatio: 0, maxRatio: 0.25 },
  { name: 'crouching', minRatio: 0.25, maxRatio: 0.55 },
  { name: 'kneeling', minRatio: 0.55, maxRatio: 0.85 },
  { name: 'flattened', minRatio: 0.85, maxRatio: 1.0 },
];

var ANIMATION_SPEED_UP = 8;
var ANIMATION_SPEED_DOWN = 4;

function createKids(count) {
  return Array.from({ length: count }, function(_, index) {
    return {
      id: index + 1,
      state: 'standing',
      kneelingAmount: 0,
      intensity: 0,
    };
  });
}

function getReactionLevel(volumeLevel, threshold) {
  if (volumeLevel <= threshold) {
    return 'idle';
  }

  var range = 100 - threshold;
  var ratio = Math.min((volumeLevel - threshold) / range, 1.0);

  for (var i = REACTION_LEVELS.length - 1; i >= 1; i--) {
    if (ratio >= REACTION_LEVELS[i].minRatio) {
      return REACTION_LEVELS[i].name;
    }
  }

  return 'nervous';
}

function getTargetIntensity(volumeLevel, threshold) {
  if (volumeLevel <= threshold) {
    return 0;
  }

  var range = 100 - threshold;
  return Math.min((volumeLevel - threshold) / range, 1.0);
}

function updateKids(kids, volumeLevel, threshold, deltaTime) {
  var dt = deltaTime || 0.016;
  var targetIntensity = getTargetIntensity(volumeLevel, threshold);
  var reactionLevel = getReactionLevel(volumeLevel, threshold);

  return kids.map(function(kid) {
    var speed = targetIntensity > kid.intensity ? ANIMATION_SPEED_UP : ANIMATION_SPEED_DOWN;
    var diff = targetIntensity - (kid.intensity || 0);
    var newIntensity = (kid.intensity || 0) + diff * Math.min(speed * dt, 1);
    newIntensity = Math.max(0, Math.min(1, newIntensity));

    return {
      id: kid.id,
      state: reactionLevel === 'idle' ? 'idle' : reactionLevel,
      kneelingAmount: newIntensity,
      intensity: newIntensity,
    };
  });
}

if (typeof module !== 'undefined') module.exports = { createKids, updateKids, getReactionLevel };
