import { oneDtoTwoD } from '../../src/util/array';

describe('cast module', () => {
  describe('oneDtwoTwoD', () => {
    it('should cast 1d arrays to 2d', () => {
      expect(oneDtoTwoD([1, 2, 3])).toStrictEqual([[1, 2, 3]]);
    });

    it('should not change a 2d array', () => {
      expect(oneDtoTwoD([[1, 2, 3]])).toStrictEqual([[1, 2, 3]]);
    });

    it('should work with empty arrays', () => {
      expect(oneDtoTwoD([])).toStrictEqual([]);
    });
  });
});
