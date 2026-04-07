const { calculateScore, calculateBonus } = require('../../src/game/score');

describe('Score', () => {
  describe('calculateScore', () => {
    it('should return 0 for silence (volume level 0)', () => {
      expect(calculateScore(0)).toBe(0);
    });

    it('should return points proportional to volume level', () => {
      expect(calculateScore(50)).toBe(50);
    });

    it('should cap the score at 100 for max volume', () => {
      expect(calculateScore(150)).toBe(100);
    });

    it('should round fractional volume to nearest integer', () => {
      expect(calculateScore(33.7)).toBe(34);
    });
  });

  describe('calculateBonus', () => {
    it('should return no bonus for streak less than 3', () => {
      expect(calculateBonus(2)).toBe(0);
    });

    it('should return 10 bonus points for streak of 3', () => {
      expect(calculateBonus(3)).toBe(10);
    });

    it('should return 20 bonus points for streak of 5 or more', () => {
      expect(calculateBonus(5)).toBe(20);
    });
  });
});
