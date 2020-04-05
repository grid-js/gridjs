import Config from './config';
import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { Table } from './view/table';
import StorageUtils from './storage/storageUtils';
import StorageError from './error/storage';

class Grid {
  private _config: Config;

  constructor(config: Config) {
    this.config = new Config(config);
    this.bootstrap();
  }

  bootstrap(): void {
    this.setStorage();
  }

  private setStorage(): void {
    const storage = StorageUtils.createFromConfig(this.config);

    if (!storage) {
      throw new StorageError('Could not determine the storage type');
    }

    this.config.storage = storage;
  }

  set config(config: Config) {
    this._config = config;
  }

  get config(): Config {
    return this._config;
  }

  createElement(): ReactElement {
    return React.createElement(Table, {
      config: this.config,
    });
  }

  render(container: Element) {
    ReactDOM.render(this.createElement(), container);
  }
}

export default Grid;
