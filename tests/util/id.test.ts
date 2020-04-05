import { generateID } from '../../src/util/id';

describe('generateID function', () => {
  it('should generate unique IDs', () => {
    expect(generateID()).not.toBe(generateID());
  });
});
