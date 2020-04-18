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
    expect(
      new InMemorySearch().setProps({ keyword: 'a' }).process(data),
    ).toHaveLength(1);
  });

  it('should process int', () => {
    expect(
      new InMemorySearch().setProps({ keyword: '1' }).process(data),
    ).toHaveLength(3);
  });

  it('should accept props constructor', () => {
    expect(new InMemorySearch({ keyword: '1' }).process(data)).toHaveLength(3);
  });

  it('should call propsUpdated', () => {
    const callback = jest.fn();
    new InMemorySearch()
      .propsUpdated(callback)
      .setProps({ keyword: '1' })
      .setProps({ keyword: '2' })
      .process(data);
    expect(callback).toBeCalledTimes(2);
  });
});
