import { OneDArray, ProtoExtends, TCell, TColumn, TwoDArray } from './types';
import Storage from './storage/storage';
import Pipeline from './pipeline/pipeline';
import Tabular from './tabular';
import { SearchConfig } from './view/plugin/search/search';
import { PaginationConfig } from './view/plugin/pagination';
import Header from './header';
import { ServerStorageOptions } from './storage/server';
import Dispatcher from './util/dispatcher';
import { GenericSortConfig } from './view/plugin/sort/sort';
import { Language, Translator } from './i18n/language';
import { createRef, RefObject } from 'preact';
import StorageUtils from './storage/storageUtils';
import PipelineUtils from './pipeline/pipelineUtils';

// Config type used internally
export interface Config {
  dispatcher?: Dispatcher<any>;
  /** container element that is used to mount the Grid.js to */
  container?: Element;
  /** gridjs-temp div which is used internally */
  tempRef?: RefObject<HTMLDivElement>;
  data?:
    | TwoDArray<TCell>
    | (() => TwoDArray<TCell>)
    | (() => Promise<TwoDArray<TCell>>);
  server?: ServerStorageOptions;
  header?: Header;
  /** to parse a HTML table and load the data */
  from: HTMLElement;
  storage: Storage<any>;
  pipeline: Pipeline<Tabular>;
  /** to automatically calculate the columns width */
  autoWidth: boolean;
  /** sets the width of the container and table */
  width: string;
  search: SearchConfig;
  pagination: PaginationConfig;
  sort: GenericSortConfig;
  translator: Translator;
  className: Partial<{
    table?: string;
    th?: string;
    td?: string;
    container?: string;
    footer?: string;
    header?: string;
  }>
}

// Config type used by the consumers
interface UserConfigExtend {
  columns?: OneDArray<TColumn | string>;
  search: SearchConfig | boolean;
  pagination: PaginationConfig | boolean;
  // implicit option to enable the sort plugin globally
  sort: GenericSortConfig | boolean;
  language: Language;
}

export type UserConfig = ProtoExtends<
  Partial<Config>,
  Partial<UserConfigExtend>
>;

export class Config {
  // this is the config file passed by the user
  // we need this for Config.update()
  private _userConfig: UserConfig;

  constructor(config?: Config) {
    const updatedConfig = {
      ...Config.defaultConfig(),
      ...config,
    };

    this._userConfig = {};

    Object.assign(this, updatedConfig);
  }

  /**
   * Assigns `updatedConfig` keys to the current config file
   *
   * @param updatedConfig
   */
  assign(updatedConfig: Partial<Config>): Config {
    for (const key of Object.keys(updatedConfig)) {
      // because we don't want to update the _userConfig cache
      if (key === '_userConfig') continue;

      this[key] = updatedConfig[key];
    }

    return this;
  }

  /**
   * Updates the config from a UserConfig
   *
   * @param userConfig
   */
  update(userConfig: Partial<UserConfig>): Config {
    if (!userConfig) return this;

    this._userConfig = {
      ...this._userConfig,
      ...userConfig,
    };

    this.assign(Config.fromUserConfig(this._userConfig));

    return this;
  }

  static defaultConfig(): Config {
    return {
      dispatcher: new Dispatcher<any>(),
      tempRef: createRef(),
      width: '100%',
      autoWidth: true,
      className: {}
    } as Config;
  }

  static fromUserConfig(userConfig: UserConfig): Config {
    const config = new Config(userConfig as Config);

    // to set the initial _userConfig object
    config._userConfig = userConfig;

    config.assign({
      storage: StorageUtils.createFromUserConfig(userConfig),
    });

    config.assign({
      pipeline: PipelineUtils.createFromConfig(config),
    });

    // Sort
    if (typeof userConfig.sort === 'boolean' && userConfig.sort) {
      config.assign({
        sort: {
          multiColumn: true,
        },
      });
    }

    // Header
    config.assign({
      header: Header.fromUserConfig(config),
    });

    // Pagination
    config.assign({
      pagination: {
        enabled:
          userConfig.pagination === true ||
          userConfig.pagination instanceof Object,
        ...(userConfig.pagination as PaginationConfig),
      },
    });

    // Search
    config.assign({
      search: {
        enabled:
          userConfig.search === true || userConfig.search instanceof Object,
        ...(userConfig.search as SearchConfig),
      },
    });

    // Translator
    config.assign({
      translator: new Translator(userConfig.language),
    });

    return config;
  }
}
