import GlobalSearch from '../../../src/pipeline/search/global';
import Tabular from '../../../src/tabular';

describe('GlobalSearch', () => {
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
      new GlobalSearch().setProps({ keyword: 'a' }).process(data),
    ).toHaveLength(1);
  });

  it('should process int', () => {
    expect(
      new GlobalSearch().setProps({ keyword: '1' }).process(data),
    ).toHaveLength(3);
  });

  it('should accept props constructor', () => {
    expect(new GlobalSearch({ keyword: '1' }).process(data)).toHaveLength(3);
  });

  it('should call propsUpdated', () => {
    const callback = jest.fn();
    new GlobalSearch()
      .propsUpdated(callback)
      .setProps({ keyword: '1' })
      .setProps({ keyword: '2' })
      .process(data);
    expect(callback).toBeCalledTimes(2);
  });

  it('should call beforeProcess and afterProcess', () => {
    const beforeProcess = jest.fn();
    const afterProcess = jest.fn();
    new GlobalSearch()
      .beforeProcess(beforeProcess)
      .afterProcess(afterProcess)
      .setProps({ keyword: '2' })
      .process(data);

    expect(beforeProcess).toBeCalledTimes(1);
    expect(afterProcess).toBeCalledTimes(1);
  });
});
