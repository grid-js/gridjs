import StorageExtractor from '../../../src/pipeline/extractor/storage';
import MemoryStorage from '../../../src/storage/memory';

describe('StorageExtractor', () => {
  it('should pull data from a Storage', async () => {
    const data = [
      [1, 2, 3],
      ['a', 'b', 'c'],
    ];
    const storage = new MemoryStorage(data);
    const processor = new StorageExtractor({ storage: storage });
    expect(await processor.process()).toStrictEqual(data);
  });
});
