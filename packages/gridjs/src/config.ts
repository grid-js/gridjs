import {
  CSSDeclaration,
  OneDArray,
  ProtoExtends,
  TColumn,
  TData,
} from './types';
import Storage from './storage/storage';
import Pipeline from './pipeline/pipeline';
import Tabular from './tabular';
import { Search, SearchConfig } from './view/plugin/search/search';
import { Pagination, PaginationConfig } from './view/plugin/pagination';
import Header from './header';
import { ServerStorageOptions } from './storage/server';
import Dispatcher from './util/dispatcher';
import { GenericSortConfig } from './view/plugin/sort/sort';
import { Language, Translator } from './i18n/language';
import { Component, ComponentChild, createRef, RefObject } from 'preact';
import StorageUtils from './storage/storageUtils';
import PipelineUtils from './pipeline/pipelineUtils';
import { EventEmitter } from './util/eventEmitter';
import { GridEvents } from './events';
import { PluginManager, PluginPosition } from './plugin';
import Grid from './grid';

// Config type used internally
export interface Config {
  // a reference to the current Grid.js instance
  instance: Grid;
  eventEmitter: EventEmitter<GridEvents>;
  dispatcher: Dispatcher<any>;
  plugin: PluginManager;
  /** container element that is used to mount the Grid.js to */
  // TODO: change this to an element reference
  container?: Element;
  /** pointer to the main table element */
  tableRef?: RefObject<Component>;
  /** gridjs-temp div which is used internally */
  tempRef?: RefObject<HTMLDivElement>;
  data?: TData | (() => TData) | (() => Promise<TData>);
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
  /** sets the height of the table */
  height: string;
  pagination: PaginationConfig;
  sort: GenericSortConfig;
  translator: Translator;
  style?: Partial<{
    table: CSSDeclaration;
    td: CSSDeclaration;
    th: CSSDeclaration;
    container: CSSDeclaration;
    header: CSSDeclaration;
    footer: CSSDeclaration;
  }>;
  className?: Partial<{
    table: string;
    th: string;
    thead: string;
    tbody: string;
    td: string;
    container: string;
    footer: string;
    header: string;
    search: string;
    sort: string;
    pagination: string;
    paginationSummary: string;
    paginationButton: string;
    paginationButtonNext: string;
    paginationButtonCurrent: string;
    paginationButtonPrev: string;
    loading: string;
    notfound: string;
    error: string;
  }>;
}

// Config type used by the consumers
interface UserConfigExtend {
  /** fixes the table header to the top of the table */
  fixedHeader: boolean;
  columns: OneDArray<TColumn | string | ComponentChild>;
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

  constructor(config?: Partial<Config>) {
    Object.assign(this, {
      ...Config.defaultConfig(),
      ...config,
    });

    this._userConfig = {};
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
      plugin: new PluginManager(),
      dispatcher: new Dispatcher<any>(),
      tableRef: createRef(),
      tempRef: createRef(),
      width: '100%',
      height: 'auto',
      autoWidth: true,
      style: {},
      className: {},
    } as Config;
  }

  static fromUserConfig(userConfig: UserConfig): Config {
    const config = new Config(userConfig as Config);

    // to set the initial _userConfig object
    config._userConfig = userConfig;

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

    config.assign({
      storage: StorageUtils.createFromUserConfig(userConfig),
    });

    config.assign({
      pipeline: PipelineUtils.createFromConfig(config),
    });

    // Translator
    config.assign({
      translator: new Translator(userConfig.language),
    });

    // Search
    config.plugin.add({
      id: 'search',
      position: PluginPosition.Header,
      component: Search,
      props: {
        enabled:
          userConfig.search === true || userConfig.search instanceof Object,
        ...(userConfig.search as SearchConfig),
      },
    });

    // Pagination
    config.plugin.add({
      id: 'pagination',
      position: PluginPosition.Footer,
      component: Pagination,
      props: {
        enabled:
          userConfig.pagination === true ||
          userConfig.pagination instanceof Object,
        ...(userConfig.pagination as PaginationConfig),
      },
    });

    return config;
  }
}
