import { Config } from '../../src/config';
import Storage from '../../src/storage/storage';
import { Translator } from '../../src/i18n/language';

describe('Config', () => {
  //let config: Partial<Config> = null;

  //beforeEach(() => {
  //  config = Config.fromPartialConfig({
  //    data: [[1, 2, 3]],
  //  });
  //});

  it('should have data property', () => {
    const config = Config.fromPartialConfig({
      data: [[1, 2, 3]],
    });
    expect(config.data).toStrictEqual([[1, 2, 3]]);
  });

  it('assign should set the default when partial config is empty', () => {
    const config = new Config();
    config.assign({})
    expect(config.width).toEqual("100%");
  });

  it('assign should set the correct default', () => {
    const config = new Config();
    config.assign({
      width: "500px"
    })
    expect(config.width).toEqual("500px");
  });

  it('should return the correct values', () => {
    const config = Config.fromPartialConfig({
      data: [],
    });
    expect(config.storage).toBeInstanceOf(Storage);
  });

  it('should create a userConfig', () => {
    const data = [[1, 2, 3]];
    const conf = Config.fromPartialConfig({
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
    const conf = Config.fromPartialConfig({
      data: data,
      search: true,
    });

    expect(conf.plugin.get('search')).toHaveLength(1);
  });

  it('should create a userConfig with pagination', () => {
    const data = [[1, 2, 3]];
    const conf = Config.fromPartialConfig({
      data: data,
      pagination: true,
    });

    expect(conf.plugin.get('pagination')).toHaveLength(1);
  });

  it('should create a userConfig with header', () => {
    const data = [[1, 2, 3]];
    const cols = ['a', 'b', 'c'];
    const conf = Config.fromPartialConfig({
      data: data,
      columns: cols,
    });

    expect(conf.header.columns.map((x) => x.name)).toStrictEqual(cols);
    expect(conf.header.columns.map((x) => x.sort)).toStrictEqual([
      undefined,
      undefined,
      undefined,
    ]);
  });

  it('should create a userConfig with header and sort', () => {
    const data = [[1, 2, 3]];
    const cols = ['a', 'b', 'c'];
    const conf = Config.fromPartialConfig({
      data: data,
      columns: cols,
      sort: true,
    });

    expect(conf.header.columns.map((x) => x.name)).toStrictEqual(cols);
    expect(conf.header.columns.map((x) => x.sort)).toStrictEqual([
      {},
      {},
      {},
    ]);
  });

  it('should create a userConfig with header and custom sort', () => {
    const data = [[1, 2, 3]];
    const cols = [
      'a',
      {
        name: 'b',
        sort: false,
      },
      {
        name: 'c',
        sort: null,
      },
    ];
    const conf = Config.fromPartialConfig({
      data: data,
      columns: cols,
      sort: true,
    });

    expect(conf.header.columns.map((x) => x.sort)).toStrictEqual([
      {},
      undefined,
      undefined,
    ]);
  });

  it('should assign config keys', () => {
    const config = Config.fromPartialConfig({
      data: [],
    }).assign({
      width: '1000px',
    });
    expect(config.width).toBe('1000px');
  });

  it('should update config', () => {
    const config = Config.fromPartialConfig({
      data: []
    }).update({
      autoWidth: false,
    });
    expect(config.width).toBe('100%');
    expect(config.autoWidth).toBeFalsy();
  });
});
