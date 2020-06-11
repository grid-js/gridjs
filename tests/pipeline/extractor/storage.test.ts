import StorageExtractor from '../../../src/pipeline/extractor/storage';
import MemoryStorage from '../../../src/storage/memory';

describe('StorageExtractor', () => {
  it('should pull data from a Storage', async () => {
    const data = {
      data: [
        [1, 2, 3],
        ['a', 'b', 'c'],
      ],
      total: 2,
    };

    const storage = new MemoryStorage(data.data);
    const processor = new StorageExtractor({ storage: storage });
    expect(await processor.process()).toStrictEqual(data);
  });

  it('should have unique ID', async () => {
    const data = [[1, 2, 3]];
    const storage = new MemoryStorage(data);
    const processor1 = new StorageExtractor({ storage: storage });
    const processor2 = new StorageExtractor({ storage: storage });
    expect(processor1.id).not.toBe(processor2.id);
  });
});
