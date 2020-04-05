import MemoryStorage from '../../src/storage/memory';
import Config from '../../src/config';

describe('MemoryStorage class', () => {
  let config: Config = null;

  beforeEach(() => {
    config = new Config();
    config.data = [
      [1, 2, 3],
      [4, 5, 6],
    ];
  });

  it('should load from the config', async () => {
    const memoryStorage = new MemoryStorage(config);
    expect(await memoryStorage.length).toBe(2);
  });

  it('should return the correct length', async () => {
    const memoryStorage = new MemoryStorage(config);

    await memoryStorage.set([[1, 2, 3]]);

    expect(await memoryStorage.length).toBe(1);
  });

  it('should set and get rows', async () => {
    const memoryStorage = new MemoryStorage(config);

    await memoryStorage.set([['a', 'b', 'c']]);

    expect(await memoryStorage.get()).toStrictEqual([['a', 'b', 'c']]);
  });
});
