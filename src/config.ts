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
  constructor(config?: Config) {
    // FIXME: not sure if this makes sense because Config is a subset of UserConfig
    const updatedConfig = {
      ...Config.defaultConfig(),
      ...config,
    };

    Object.assign(this, updatedConfig);
  }

  update(updatedConfig: Partial<Config>): Config {
    Object.assign(this, updatedConfig || {});
    return this;
  }

  static defaultConfig(): Config {
    return {
      tempRef: createRef(),
      width: '100%',
      autoWidth: true,
    } as Config;
  }

  static fromUserConfig(userConfig: UserConfig): Config {
    const config = new Config(userConfig as Config);

    config.update({
      dispatcher: new Dispatcher<any>(),
      storage: StorageUtils.createFromUserConfig(userConfig),
    });

    config.update({
      pipeline: PipelineUtils.createFromConfig(config),
    });

    // Sort
    if (typeof userConfig.sort === 'boolean' && userConfig.sort) {
      config.update({
        sort: {
          multiColumn: true,
        },
      });
    }

    // Header
    config.update({
      header: Header.fromUserConfig(config),
    });

    // Pagination
    config.update({
      pagination: {
        enabled:
          userConfig.pagination === true ||
          userConfig.pagination instanceof Object,
        ...(userConfig.pagination as PaginationConfig),
      },
    });

    // Search
    config.update({
      search: {
        enabled:
          userConfig.search === true || userConfig.search instanceof Object,
        ...(userConfig.search as SearchConfig),
      },
    });

    // Translator
    config.update({
      translator: new Translator(userConfig.language),
    });

    return config;
  }
}
