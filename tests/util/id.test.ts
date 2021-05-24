import { generateUUID } from '../../src/util/id';

describe('generateUUID function', () => {
  it('should generate unique UUIDs', () => {
    expect(generateUUID()).not.toBe(generateUUID());
    expect(generateUUID()).not.toBe(generateUUID());
    expect(generateUUID()).not.toBe(generateUUID());
    expect(generateUUID()).not.toBe(generateUUID());
  });
});
