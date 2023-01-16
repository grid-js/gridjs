import { CSSDeclaration, OneDArray, Status, TColumn, TData } from './types';
import Storage from './storage/storage';
import Pipeline from './pipeline/pipeline';
import Tabular from './tabular';
import { Search, SearchConfig } from './view/plugin/search/search';
import { Pagination, PaginationConfig } from './view/plugin/pagination';
import Header from './header';
import { ServerStorageOptions } from './storage/server';
import { GenericSortConfig } from './view/plugin/sort/sort';
import { Language, Translator } from './i18n/language';
import { ComponentChild, createContext, createRef, RefObject } from 'preact';
import StorageUtils from './storage/storageUtils';
import PipelineUtils from './pipeline/pipelineUtils';
import { EventEmitter } from './util/eventEmitter';
import { GridEvents } from './events';
import { PluginManager, PluginPosition, Plugin } from './plugin';
import Grid from './grid';
import { Store } from './state/store';

export const ConfigContext = createContext(null);

export interface Config {
  // a reference to the current Grid.js instance
  instance: Grid;
  store: Store;
  eventEmitter: EventEmitter<GridEvents>;
  plugin: PluginManager;
  /** container element that is used to mount the Grid.js to */
  // TODO: change this to an element reference
  container?: Element;
  /** pointer to the main table element */
  tableRef?: RefObject<HTMLTableElement>;
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
  pagination: PaginationConfig | boolean;
  sort: GenericSortConfig | boolean;
  translator: Translator;
  /** fixes the table header to the top of the table */
  fixedHeader: boolean;
  /** Resizable columns? */
  resizable: boolean;
  columns: OneDArray<TColumn | string | ComponentChild>;
  search: SearchConfig | boolean;
  language: Language;
  plugins?: Plugin<any>[];
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
    tr: string;
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

export class Config {
  public constructor() {
    Object.assign(this, Config.defaultConfig());
  }
  /**
   * Assigns `updatedConfig` keys to the current config file
   *
   * @param partialConfig
   */
  assign(partialConfig: Partial<Config>): Config {
    return Object.assign(this, partialConfig);
  }

  /**
   * Updates the config from a partial Config
   *
   * @param partialConfig
   */
  update(partialConfig: Partial<Config>): Config {
    if (!partialConfig) return this;

    this.assign(
      Config.fromPartialConfig({
        ...this,
        ...partialConfig,
      }),
    );

    return this;
  }

  static defaultConfig(): Partial<Config> {
    return {
      store: new Store({
        status: Status.Init,
        header: undefined,
        data: null,
      }),
      plugin: new PluginManager(),
      tableRef: createRef(),
      width: '100%',
      height: 'auto',
      autoWidth: true,
      style: {},
      className: {},
    };
  }

  static fromPartialConfig(partialConfig: Partial<Config>): Partial<Config> {
    const config = new Config().assign(partialConfig);

    // Sort
    if (typeof partialConfig.sort === 'boolean' && partialConfig.sort) {
      config.assign({
        sort: {
          multiColumn: true,
        },
      });
    }

    // Header
    config.assign({
      header: Header.createFromConfig(config),
    });

    config.assign({
      storage: StorageUtils.createFromConfig(config),
    });

    config.assign({
      pipeline: PipelineUtils.createFromConfig(config),
    });

    // Translator
    config.assign({
      translator: new Translator(config.language),
    });

    if (config.search) {
      // Search
      config.plugin.add({
        id: 'search',
        position: PluginPosition.Header,
        component: Search,
      });
    }

    if (config.pagination) {
      // Pagination
      config.plugin.add({
        id: 'pagination',
        position: PluginPosition.Footer,
        component: Pagination,
      });
    }

    // Additional plugins
    if (config.plugins) {
      config.plugins.forEach((p) => config.plugin.add(p));
    }

    return config;
  }
}
