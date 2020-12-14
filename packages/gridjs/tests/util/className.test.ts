import { classJoin, className } from '../../src/util/className';

describe('className', () => {
  describe('classJoin', () => {
    it('should join empty classes', () => {
      expect(classJoin(null, 'boo')).toBe('boo');
    });

    it('should join one class', () => {
      expect(classJoin('boo')).toBe('boo');
    });

    it('should join two or more class', () => {
      expect(classJoin('boo', 'foo', 'bar')).toBe('boo foo bar');
    });

    it('should return null when inputs are null and undefined', () => {
      expect(classJoin(null, undefined, null)).toBe(null);
    });

    it('should return null when inputs are null', () => {
      expect(classJoin(null, null)).toBe(null);
    });
  });

  describe('className', () => {
    it('should accept two or more args', () => {
      expect(className('boo', 'foo', 'bar')).toBe('gridjs-boo-foo-bar');
    });

    it('should generate classNames', () => {
      expect(className('boo')).toBe('gridjs-boo');
    });
  });
});
