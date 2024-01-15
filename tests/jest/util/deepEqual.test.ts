import { deepEqual } from '../../../src/util/deepEqual';

describe('deepEqual', () => {
  it('should return true when objects are the same', () => {
    const result = deepEqual({ a: 42 }, { a: 42 });
    expect(result).toBeTrue();
  });

  it('should return false when objects are not the same', () => {
    const result = deepEqual({ b: 42 }, { a: 42 });
    expect(result).toBeFalse();
  });

  it('should return true when nested objects are the same', () => {
    const result = deepEqual({ a: 42, c: { a: 24 } }, { a: 42, c: { a: 24 } });
    expect(result).toBeTrue();
  });

  it('should return false when nested objects not are the same', () => {
    const result = deepEqual({ a: 42, c: { x: 24 } }, { a: 42, c: { a: 24 } });
    expect(result).toBeFalse();
  });

  it('should return false when objects have functions', () => {
    const result = deepEqual({ a: 42, c: jest.fn() }, { a: 42, c: jest.fn() });
    expect(result).toBeFalse();
  });

  it('should return true when objects have same functions', () => {
    const fn = jest.fn();
    const result = deepEqual({ a: 42, c: fn }, { a: 42, c: fn });
    expect(result).toBeTrue();
  });
});
