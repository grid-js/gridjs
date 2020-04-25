import {
  OneDArray,
  ProtoExtends,
  TBodyCell,
  THeaderCell,
  TwoDArray,
} from './types';
import Storage from './storage/storage';
import ConfigError from './error/config';
import { isArrayOfType } from './util/type';
import Header from './header';
import Pipeline from './pipeline/pipeline';
import Tabular from './tabular';
import { SearchConfig } from './view/plugin/search';
import { PaginationConfig } from './view/plugin/pagination';

// Config type used internally
interface Config {
  data?: TwoDArray<TBodyCell>;
  header?: Header;
  storage: Storage;
  pipeline: Pipeline<Tabular<TBodyCell>>;
  classNamePrefix: string;
  /** sets the width of container and table */
  width: string;
  search: SearchConfig;
  pagination: PaginationConfig;
}

// Config type used by the consumers
interface UserConfigExtend {
  header?: OneDArray<THeaderCell | string>;
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

    // casting header type
    if (isArrayOfType<string>(userConfig.header, 'toLowerCase')) {
      config.header = Header.fromArrayOfString(
        userConfig.header as OneDArray<string>,
      );
    }

    return config;
  }
}

export default Config;
