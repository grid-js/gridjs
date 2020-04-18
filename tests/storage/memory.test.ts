import MemoryStorage from '../../src/storage/memory';

describe('MemoryStorage class', () => {
  let data;

  beforeEach(() => {
    data = [
      [1, 2, 3],
      [4, 5, 6],
    ];
  });

  it('should load from the config', async () => {
    const memoryStorage = new MemoryStorage(data);
    expect(await memoryStorage.length).toBe(2);
  });

  it('should return the correct length', async () => {
    const memoryStorage = new MemoryStorage(data);

    await memoryStorage.set([[1, 2, 3]]);

    expect(await memoryStorage.length).toBe(1);
  });

  it('should set and get rows', async () => {
    const memoryStorage = new MemoryStorage(data);

    await memoryStorage.set([['a', 'b', 'c']]);

    expect(await memoryStorage.get()).toStrictEqual([['a', 'b', 'c']]);
  });
});
