import Config, { UserConfig } from './config';
import { h, render, VNode } from 'preact';
import StorageUtils from './storage/storageUtils';
import StorageError from './error/storage';
import { Container } from './view/container';

class Grid {
  constructor(userConfig?: UserConfig) {
    this.bootstrap(userConfig);
  }

  bootstrap(userConfig?: UserConfig): void {
    this.setConfig(userConfig);
    this.setStorage();
  }

  private setConfig(userConfig?: UserConfig): void {
    // sets the current global config
    Config.fromUserConfig(userConfig).setCurrent();
  }

  private setStorage(): void {
    const storage = StorageUtils.createFromConfig(Config.current);

    if (!storage) {
      throw new StorageError('Could not determine the storage type');
    }

    Config.current.storage = storage;
  }

  get config(): Config {
    return Config.current;
  }

  createElement(): VNode {
    return h(Container, {
      config: Config.current,
    });
  }

  render(container: Element) {
    render(this.createElement(), container);
  }
}

export default Grid;
