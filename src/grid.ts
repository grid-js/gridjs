import Config, { UserConfig } from './config';
import { h, render, VNode } from 'preact';
import StorageUtils from './storage/storageUtils';
import { Container } from './view/container';
import Pipeline from './pipeline/pipeline';
import StorageExtractor from './pipeline/extractor/storage';
import ArrayToTabularTransformer from './pipeline/transformer/arrayToTabular';
import { EventBus } from './eventBus';

class Grid {
  constructor(userConfig?: UserConfig) {
    this.bootstrap(userConfig);
  }

  bootstrap(userConfig?: UserConfig): void {
    this.setConfig(userConfig);
    this.setStorage();
    this.setPipeline();
    this.setEventBus();
  }

  private setConfig(userConfig?: UserConfig): void {
    // sets the current global config
    Config.fromUserConfig(userConfig).setCurrent();
  }

  private setStorage(): void {
    Config.current.storage = StorageUtils.createFromConfig(Config.current);
  }

  private setEventBus(): void {
    Config.current.events = new EventBus();
  }

  private setPipeline(): void {
    Config.current.pipeline = new Pipeline([
      new StorageExtractor({ storage: this.config.storage }),
      new ArrayToTabularTransformer(),
    ]);
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
