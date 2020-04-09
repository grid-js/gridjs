import Config from './config';
import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import StorageUtils from './storage/storageUtils';
import StorageError from './error/storage';
import {Container} from "./view/container";

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

  /**
   * Accepts a Config object and sets it as the instance config
   *
   * @param config
   */
  set config(config: Config) {
    this._config = config;
  }

  /**
   * Returns the current config object
   */
  get config(): Config {
    return this._config;
  }

  createElement(): ReactElement {
    return React.createElement(Container, {
      config: this.config,
    });
  }

  render(container: Element) {
    ReactDOM.render(this.createElement(), container);
  }
}

export default Grid;
