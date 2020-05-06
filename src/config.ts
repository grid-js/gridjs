import {
  OneDArray,
  ProtoExtends,
  TBodyCell,
  THeader,
  TwoDArray,
} from './types';
import Storage from './storage/storage';
import ConfigError from './error/config';
import Pipeline from './pipeline/pipeline';
import Tabular from './tabular';
import { SearchConfig } from './view/plugin/search';
import { PaginationConfig } from './view/plugin/pagination';
import Header from './header';

// Config type used internally
interface Config {
  data?: TwoDArray<TBodyCell>;
  header?: Header;
  storage: Storage;
  pipeline: Pipeline<Tabular<TBodyCell>>;
  classNamePrefix: string;
  /** sets the width of the container and table */
  width: string;
  search: SearchConfig;
  pagination: PaginationConfig;
}

// Config type used by the consumers
interface UserConfigExtend {
  header?: THeader | OneDArray<string>;
}

export type UserConfig = ProtoExtends<Partial<Config>, UserConfigExtend>;

class Config {
  private static _current: Config;

  constructor(config?: UserConfig) {
    const updatedConfig = {
      ...Config.defaultConfig(),
      ...config,
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
    } as Config;
  }

  static fromUserConfig(userConfig?: UserConfig): Config {
    const config = new Config(userConfig);

    if (!userConfig) return config;

    if (!(userConfig.header instanceof Header)) {
      config.header = new Header(userConfig.header);
    }

    return config;
  }
}

export default Config;
