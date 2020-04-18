import InMemorySearch from '../../../src/pipeline/search/inMemory';
import Tabular from '../../../src/tabular';

describe('InMemorySearch', () => {
  let data: Tabular<any>;

  beforeAll(() => {
    data = Tabular.fromArray([
      ['a1', 'a2', 'a3'],
      ['b1', 'b2', 'b3'],
      ['c1', 'c2', 'c3'],
    ]);
  });

  it('should process string', () => {
    expect(new InMemorySearch().process(data, 'a')).toHaveLength(1);
  });

  it('should process int', () => {
    expect(new InMemorySearch().process(data, '1')).toHaveLength(3);
  });
});
