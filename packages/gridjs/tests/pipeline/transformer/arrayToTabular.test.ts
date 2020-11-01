import ArrayToTabularTransformer from '../../../src/pipeline/transformer/arrayToTabular';
import Tabular from '../../../src/tabular';

describe('ArrayToTabularTransformer', () => {
  it('should convert raw data to Tabular', async () => {
    const raw = {
      data: [
        [1, 2, 3],
        ['a', 'b', 'c'],
      ],
    };

    const transformer = new ArrayToTabularTransformer();
    const data = await transformer.process(raw);

    expect(data).toBeInstanceOf(Tabular);
    expect(data).toHaveLength(2);
  });
});
