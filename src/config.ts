import { OneDArray, ProtoExtends, TCell, TColumn, TwoDArray } from './types';
import Storage from './storage/storage';
import ConfigError from './error/config';
import Pipeline from './pipeline/pipeline';
import Tabular from './tabular';
import { SearchConfig } from './view/plugin/search/search';
import { PaginationConfig } from './view/plugin/pagination';
import Header from './header';

// Config type used internally
interface Config {
  data?: TwoDArray<TCell>;
  header?: Header;
  /** to parse a HTML table and load the data */
  from: HTMLElement;
  storage: Storage;
  pipeline: Pipeline<Tabular<TCell>>;
  /** to automatically calculate the columns width */
  autoWidth: boolean;
  classNamePrefix: string;
  /** sets the width of the container and table */
  width: string;
  search: SearchConfig;
  pagination: PaginationConfig;
}

// Config type used by the consumers
interface UserConfigExtend {
  columns?: OneDArray<TColumn> | OneDArray<string>;
  search: SearchConfig | boolean;
  pagination: PaginationConfig | boolean;
}

export type UserConfig = ProtoExtends<Partial<Config>, UserConfigExtend>;

class Config {
  private static _current: Config;

  constructor(userConfig?: UserConfig) {
    // FIXME: not sure if this makes sense because Config is a subset of UserConfig
    const updatedConfig = {
      ...Config.defaultConfig(),
      ...userConfig,
    };

    Object.assign(this, updatedConfig);
  }

  setCurrent(): void {
    Config._current = this;
  }

  static get current(): Config {
    if (!Config._current) {
      throw new ConfigError('Current config is not set');
    }

    return Config._current;
  }

  static defaultConfig(): Config {
    return {
      classNamePrefix: 'gridjs',
      width: '100%',
      autoWidth: true,
    } as Config;
  }

  static fromUserConfig(userConfig?: UserConfig): Config {
    const config = new Config(userConfig);

    if (!userConfig) return config;

    config.header = Header.fromUserConfig(config);

    // TODO: can we refactor this?
    config.pagination = {
      enabled: userConfig.pagination === true || userConfig.pagination instanceof Object,
      ...userConfig.pagination as PaginationConfig
    };

    config.search = {
      enabled: userConfig.search === true || userConfig.search instanceof Object,
      ...userConfig.search as SearchConfig
    };

    return config;
  }
}

export default Config;
