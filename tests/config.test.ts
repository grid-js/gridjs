import { Config } from '../src/config';
import MemoryStorage from '../src/storage/memory';
import Storage from '../src/storage/storage';
import { Translator } from '../src/i18n/language';

describe('Config', () => {
  let config: Config = null;

  beforeEach(() => {
    config = new Config();
    config.data = [[1, 2, 3]];
    config.storage = new MemoryStorage(config.data);
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
    });

    expect(conf.data).toStrictEqual(data);
    expect(conf.header).toBeNull();
    expect(conf.search).toStrictEqual({ enabled: false });
    expect(conf.pagination).toStrictEqual({ enabled: false });
    expect(conf.translator).toBeInstanceOf(Translator);
    expect(conf.width).toBe('400px');
  });

  it('should create a userConfig with search', () => {
    const data = [[1, 2, 3]];
    const conf = Config.fromUserConfig({
      data: data,
      search: true,
    });

    expect(conf.search).toStrictEqual({ enabled: true });
  });

  it('should create a userConfig with pagination', () => {
    const data = [[1, 2, 3]];
    const conf = Config.fromUserConfig({
      data: data,
      pagination: true,
    });

    expect(conf.pagination).toStrictEqual({ enabled: true });
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
});
