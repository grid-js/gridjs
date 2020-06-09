import { OneDArray, ProtoExtends, TCell, TColumn, TwoDArray } from './types';
import Storage from './storage/storage';
import Pipeline from './pipeline/pipeline';
import Tabular from './tabular';
import { SearchConfig } from './view/plugin/search/search';
import { PaginationConfig } from './view/plugin/pagination';
import Header from './header';
import { ServerStorageOptions } from './storage/server';
import Dispatcher from './util/dispatcher';

// Config type used internally
export interface Config {
  dispatcher?: Dispatcher<any>;
  /** container element that is used to mount the Grid.js to */
  container?: Element;
  data?: TwoDArray<TCell> | Function;
  server?: ServerStorageOptions;
  header?: Header;
  /** to parse a HTML table and load the data */
  from: HTMLElement;
  storage: Storage;
  pipeline: Pipeline<Tabular<TCell>>;
  /** to automatically calculate the columns width */
  autoWidth: boolean;
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
  // implicit option to enable the sort plugin globally
  sort: boolean;
}

export type UserConfig = ProtoExtends<
  Partial<Config>,
  Partial<UserConfigExtend>
>;

export class Config {
  constructor(userConfig?: UserConfig) {
    // FIXME: not sure if this makes sense because Config is a subset of UserConfig
    const updatedConfig = {
      ...Config.defaultConfig(),
      ...userConfig,
    };

    Object.assign(this, updatedConfig);
  }

  static defaultConfig(): Config {
    return {
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
      enabled:
        userConfig.pagination === true ||
        userConfig.pagination instanceof Object,
      ...(userConfig.pagination as PaginationConfig),
    };

    config.search = {
      enabled:
        userConfig.search === true || userConfig.search instanceof Object,
      ...(userConfig.search as SearchConfig),
    };

    return config;
  }
}
