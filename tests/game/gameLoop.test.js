const { createInitialState, tick } = require('../../src/game/gameLoop');

describe('createInitialState', () => {
  it('should create state with the specified number of standing kids', () => {
    const state = createInitialState(3, 50);
    expect(state.kids).toHaveLength(3);
    state.kids.forEach(kid => {
      expect(kid.state).toBe('standing');
    });
  });

  it('should start with score 0 and streak 0', () => {
    const state = createInitialState(3, 50);
    expect(state.score).toBe(0);
    expect(state.streak).toBe(0);
  });

  it('should store the threshold', () => {
    const state = createInitialState(3, 50);
    expect(state.threshold).toBe(50);
  });
});

describe('tick', () => {
  it('should make kids kneel and increase score when volume exceeds threshold', () => {
    const state = createInitialState(3, 50);
    const next = tick(state, 80);
    next.kids.forEach(kid => {
      expect(kid.state).toBe('kneeling');
    });
    expect(next.score).toBeGreaterThan(0);
  });

  it('should make kids stand and reset streak on silence', () => {
    const state = createInitialState(3, 50);
    const loud = tick(state, 80);
    const silent = tick(loud, 10);
    silent.kids.forEach(kid => {
      expect(kid.state).toBe('standing');
    });
    expect(silent.streak).toBe(0);
  });

  it('should increment streak on consecutive loud ticks', () => {
    const state = createInitialState(3, 50);
    const tick1 = tick(state, 80);
    const tick2 = tick(tick1, 80);
    const tick3 = tick(tick2, 80);
    expect(tick3.streak).toBe(3);
  });

  it('should add bonus points when streak reaches 3', () => {
    const state = createInitialState(3, 50);
    const tick1 = tick(state, 80);
    const tick2 = tick(tick1, 80);
    const scoreBefore = tick2.score;
    const tick3 = tick(tick2, 80);
    const scoreGain = tick3.score - scoreBefore;
    expect(scoreGain).toBeGreaterThan(tick1.score);
  });

  it('should return a new state object without mutating the original', () => {
    const state = createInitialState(3, 50);
    const next = tick(state, 80);
    expect(next).not.toBe(state);
    expect(state.score).toBe(0);
    expect(state.streak).toBe(0);
  });

  it('should preserve the threshold across ticks', () => {
    const state = createInitialState(3, 50);
    const next = tick(state, 80);
    expect(next.threshold).toBe(50);
  });
});
