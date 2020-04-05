import Base from '../src/base';

describe('Base class', () => {
  it('should generate unique IDs', () => {
    const b1 = new Base();
    const b2 = new Base();
    expect(b1.id).not.toBe(b2.id);
  });

  it('should accept ID', () => {
    const b1 = new Base('1');
    const b2 = new Base('1');
    expect(b1.id).toBe(b2.id);
  });
});
