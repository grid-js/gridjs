import Config, { UserConfig } from './config';
import { h, render, VNode } from 'preact';
import StorageUtils from './storage/storageUtils';
import { Container } from './view/container';
import Pipeline from './pipeline/pipeline';
import StorageExtractor from './pipeline/extractor/storage';
import ArrayToTabularTransformer from './pipeline/transformer/arrayToTabular';
import log from './util/log';

class Grid {
  constructor(userConfig?: UserConfig) {
    this.bootstrap(userConfig);
  }

  bootstrap(userConfig?: UserConfig): void {
    this.setConfig(userConfig);
    this.setStorage();
    this.setPipeline();
  }

  private setConfig(userConfig?: UserConfig): void {
    // sets the current global config
    Config.fromUserConfig(userConfig).setCurrent();
  }

  private setStorage(): void {
    Config.current.storage = StorageUtils.createFromConfig(Config.current);
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
    const config = Config.current;

    return h(Container, {
      pipeline: config.pipeline,
      header: config.header,
      width: config.width,
    });
  }

  render(container: Element) {
    if (!container) {
      log.error("Container element cannot be null", true);
    }

    if (container.childNodes.length > 0) {
      log.error(
        `The container element ${container} is not empty. Make sure the container is empty and call render() again`,
      );
      return;
    }

    render(this.createElement(), container);
  }
}

export default Grid;
