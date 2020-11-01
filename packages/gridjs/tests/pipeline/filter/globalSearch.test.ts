import GlobalSearchFilter from '../../../src/pipeline/filter/globalSearch';
import Tabular from '../../../src/tabular';

describe('GlobalSearch', () => {
  let data: Tabular;

  beforeAll(() => {
    data = Tabular.fromArray([
      ['a1', 'a2', 'a3'],
      ['b1', 'b2', 'b3'],
      ['c1', 'c2', 'c3'],
    ]);
  });

  it('should process string', () => {
    expect(
      new GlobalSearchFilter().setProps({ keyword: 'a' }).process(data),
    ).toHaveLength(1);
  });

  it('should process int', () => {
    expect(
      new GlobalSearchFilter().setProps({ keyword: '1' }).process(data),
    ).toHaveLength(3);
  });

  it('should accept props constructor', () => {
    expect(new GlobalSearchFilter({ keyword: '1' }).process(data)).toHaveLength(
      3,
    );
  });

  it('should call propsUpdated', () => {
    const callback = jest.fn();
    const search = new GlobalSearchFilter();
    search.on('propsUpdated', callback);
    search.setProps({ keyword: '1' }).setProps({ keyword: '2' }).process(data);
    expect(callback).toBeCalledTimes(2);
  });

  it('should call beforeProcess and afterProcess', () => {
    const beforeProcess = jest.fn();
    const afterProcess = jest.fn();
    const search = new GlobalSearchFilter();
    search.on('beforeProcess', beforeProcess);
    search.on('afterProcess', afterProcess);
    search.setProps({ keyword: '2' }).process(data);

    expect(beforeProcess).toBeCalledTimes(1);
    expect(afterProcess).toBeCalledTimes(1);
  });
});
