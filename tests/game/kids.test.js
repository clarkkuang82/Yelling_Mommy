const { createKids, updateKids } = require('../../src/game/kids');

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

  it('should create all kids in standing state', () => {
    const kids = createKids(3);
    kids.forEach(kid => {
      expect(kid.state).toBe('standing');
    });
  });

  it('should create all kids with kneelingAmount of 0', () => {
    const kids = createKids(3);
    kids.forEach(kid => {
      expect(kid.kneelingAmount).toBe(0);
    });
  });
});

describe('updateKids', () => {
  it('should make all kids kneel when volume exceeds threshold', () => {
    const kids = createKids(3);
    const updated = updateKids(kids, 80, 50);
    updated.forEach(kid => {
      expect(kid.state).toBe('kneeling');
      expect(kid.kneelingAmount).toBe(1.0);
    });
  });

  it('should make all kids stand when volume is below threshold', () => {
    const kneelingKids = updateKids(createKids(3), 80, 50);
    const updated = updateKids(kneelingKids, 20, 50);
    updated.forEach(kid => {
      expect(kid.state).toBe('standing');
      expect(kid.kneelingAmount).toBe(0);
    });
  });

  it('should keep kids standing when volume equals threshold', () => {
    const kids = createKids(3);
    const updated = updateKids(kids, 50, 50);
    updated.forEach(kid => {
      expect(kid.state).toBe('standing');
    });
  });

  it('should return a new array without mutating the original', () => {
    const kids = createKids(3);
    const updated = updateKids(kids, 80, 50);
    expect(updated).not.toBe(kids);
    expect(kids[0].state).toBe('standing');
    expect(updated[0].state).toBe('kneeling');
  });
});
