const { createKids, updateKids, getReactionLevel } = require('../../src/game/kids');

describe('createKids', () => {
  it('should create the specified number of kids', () => {
    const kids = createKids(3);
    expect(kids).toHaveLength(3);
  });

  it('should create kids with unique ids', () => {
    const kids = createKids(3);
    const ids = kids.map(kid => kid.id);
    expect(new Set(ids).size).toBe(3);
  });

  it('should create all kids in standing state with intensity 0', () => {
    const kids = createKids(3);
    kids.forEach(kid => {
      expect(kid.state).toBe('standing');
      expect(kid.kneelingAmount).toBe(0);
      expect(kid.intensity).toBe(0);
    });
  });
});

describe('getReactionLevel', () => {
  it('should return idle when volume is below threshold', () => {
    expect(getReactionLevel(10, 30)).toBe('idle');
  });

  it('should return nervous when volume barely exceeds threshold', () => {
    expect(getReactionLevel(35, 30)).toBe('nervous');
  });

  it('should return crouching at moderate volume above threshold', () => {
    expect(getReactionLevel(55, 30)).toBe('crouching');
  });

  it('should return kneeling at high volume', () => {
    expect(getReactionLevel(75, 30)).toBe('kneeling');
  });

  it('should return flattened at max volume', () => {
    expect(getReactionLevel(95, 30)).toBe('flattened');
  });
});

describe('updateKids', () => {
  it('should set kids to idle with intensity 0 below threshold', () => {
    const kids = createKids(3);
    const updated = updateKids(kids, 10, 30, 0.16);
    updated.forEach(kid => {
      expect(kid.state).toBe('idle');
    });
  });

  it('should set reaction level based on volume intensity', () => {
    const kids = createKids(3);
    const updated = updateKids(kids, 75, 30, 0.16);
    updated.forEach(kid => {
      expect(kid.state).toBe('kneeling');
    });
  });

  it('should smoothly increase intensity toward target', () => {
    const kids = createKids(2);
    const step1 = updateKids(kids, 80, 30, 0.05);
    expect(step1[0].intensity).toBeGreaterThan(0);
    expect(step1[0].intensity).toBeLessThan(1);

    const step2 = updateKids(step1, 80, 30, 0.05);
    expect(step2[0].intensity).toBeGreaterThan(step1[0].intensity);
  });

  it('should smoothly decrease intensity when volume drops', () => {
    const kids = createKids(2).map(k => ({ ...k, intensity: 1.0, kneelingAmount: 1.0 }));
    const updated = updateKids(kids, 5, 30, 0.16);
    expect(updated[0].intensity).toBeLessThan(1.0);
    expect(updated[0].intensity).toBeGreaterThan(0);
  });

  it('should compute kneelingAmount from intensity', () => {
    const kids = createKids(1);
    const updated = updateKids(kids, 90, 30, 0.16);
    expect(updated[0].kneelingAmount).toBeGreaterThan(0);
    expect(updated[0].kneelingAmount).toBeLessThanOrEqual(1);
  });

  it('should return a new array without mutating the original', () => {
    const kids = createKids(3);
    const updated = updateKids(kids, 80, 30, 0.16);
    expect(updated).not.toBe(kids);
    expect(kids[0].state).toBe('standing');
  });

  it('should calculate intensity proportional to volume above threshold', () => {
    const kids = createKids(1);
    const low = updateKids(kids, 40, 30, 1.0);
    const high = updateKids(kids, 90, 30, 1.0);
    expect(high[0].intensity).toBeGreaterThan(low[0].intensity);
  });
});
