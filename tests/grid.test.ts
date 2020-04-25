import Grid from '../src/grid';
import StorageError from '../src/error/storage';
import MemoryStorage from '../src/storage/memory';

describe('Grid class', () => {
  it('should raise an exception with empty config', () => {
    expect(() => {
      new Grid({});
    }).toThrow(StorageError);
  });

  it('should init a memory storage', () => {
    const grid = new Grid({
      data: [[1, 2, 3]],
    });

    expect(grid.config.storage).toBeInstanceOf(MemoryStorage);
  });

  it('should set the config correctly', () => {
    const config = {
      data: [[1, 2, 3]]
    };

    const grid = new Grid(config);

    expect(grid.config.data).toStrictEqual(config.data);
  });
});
