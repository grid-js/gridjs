import { Config } from '../src/config';
import Storage from '../src/storage/storage';
import { Translator } from '../src/i18n/language';
import { Search } from '../src/view/plugin/search/search';
import { Pagination } from '../src/view/plugin/pagination';

describe('Config', () => {
  let config: Config = null;

  beforeEach(() => {
    config = Config.fromUserConfig({
      data: [[1, 2, 3]],
    });
  });

  it('should have data property', () => {
    expect(config.data).toStrictEqual([[1, 2, 3]]);
  });

  it('should return the correct values', () => {
    expect(config.storage).toBeInstanceOf(Storage);
  });

  it('should create a userConfig', () => {
    const data = [[1, 2, 3]];
    const conf = Config.fromUserConfig({
      data: data,
      width: '400px',
      height: '500px',
    });

    expect(conf.data).toStrictEqual(data);
    expect(conf.header).toBeNull();
    expect(conf.translator).toBeInstanceOf(Translator);
    expect(conf.width).toBe('400px');
    expect(conf.height).toBe('500px');
  });

  it('should create a userConfig with search', () => {
    const data = [[1, 2, 3]];
    const conf = Config.fromUserConfig({
      data: data,
      search: true,
    });

    expect(conf.plugin.get<Search>('search').props.enabled).toBeTruthy();
  });

  it('should create a userConfig with pagination', () => {
    const data = [[1, 2, 3]];
    const conf = Config.fromUserConfig({
      data: data,
      pagination: true,
    });

    expect(
      conf.plugin.get<Pagination>('pagination').props.enabled,
    ).toBeTruthy();
  });

  it('should create a userConfig with header', () => {
    const data = [[1, 2, 3]];
    const cols = ['a', 'b', 'c'];
    const conf = Config.fromUserConfig({
      data: data,
      columns: cols,
    });

    expect(conf.header.columns.map((x) => x.name)).toStrictEqual(cols);
    expect(conf.header.columns.map((x) => x.sort.enabled)).toStrictEqual([
      false,
      false,
      false,
    ]);
  });

  it('should create a userConfig with header and sort', () => {
    const data = [[1, 2, 3]];
    const cols = ['a', 'b', 'c'];
    const conf = Config.fromUserConfig({
      data: data,
      columns: cols,
      sort: true,
    });

    expect(conf.header.columns.map((x) => x.name)).toStrictEqual(cols);
    expect(conf.header.columns.map((x) => x.sort.enabled)).toStrictEqual([
      true,
      true,
      true,
    ]);
  });

  it('should create a userConfig with header and custom sort', () => {
    const data = [[1, 2, 3]];
    const cols = [
      'a',
      {
        name: 'b',
        sort: {
          enabled: false,
        },
      },
      {
        name: 'c',
        sort: null,
      },
    ];
    const conf = Config.fromUserConfig({
      data: data,
      columns: cols,
      sort: true,
    });

    expect(conf.header.columns.map((x) => x.sort.enabled)).toStrictEqual([
      true,
      false,
      false,
    ]);
  });

  it('should assign config keys', () => {
    config.assign({
      width: '1000px',
    });
    expect(config.width).toBe('1000px');
  });

  it('should update config', () => {
    config.update({
      autoWidth: false,
    });
    expect(config.width).toBe('100%');
    expect(config.autoWidth).toBeFalsy();
  });
});
