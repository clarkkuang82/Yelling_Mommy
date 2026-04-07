const { calculateVolume } = require('../../src/audio/volumeAnalyser');

describe('calculateVolume', () => {
  it('should return 0 for silence (all-zeros frequency data)', () => {
    const silence = new Uint8Array(256).fill(0);
    expect(calculateVolume(silence)).toBe(0);
  });

  it('should return 100 for max volume (all-255 frequency data)', () => {
    const maxVolume = new Uint8Array(256).fill(255);
    expect(calculateVolume(maxVolume)).toBe(100);
  });

  it('should return proportional value for mid-range data', () => {
    const midRange = new Uint8Array(256).fill(128);
    const result = calculateVolume(midRange);
    expect(result).toBeGreaterThan(40);
    expect(result).toBeLessThan(60);
  });

  it('should clamp output to 0-100 range', () => {
    const data = new Uint8Array(256).fill(200);
    const result = calculateVolume(data);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('should handle empty array', () => {
    const empty = new Uint8Array(0);
    expect(calculateVolume(empty)).toBe(0);
  });
});
