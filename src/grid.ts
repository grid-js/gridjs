import { Config, UserConfig } from './config';
import { h, render, VNode } from 'preact';
import StorageUtils from './storage/storageUtils';
import { Container } from './view/container';
import log from './util/log';
import PipelineUtils from "./pipeline/pipelineUtils";

class Grid {
  private _config: Config;

  constructor(userConfig?: UserConfig) {
    this.bootstrap(userConfig);
  }

  bootstrap(userConfig?: UserConfig): void {
    this.setConfig(userConfig);
    this.setStorage(userConfig);
    this.setPipeline(this.config);
  }

  get config(): Config {
    return this._config;
  }

  set config(config: Config) {
    this._config = config;
  }

  private setConfig(userConfig?: UserConfig): void {
    // sets the current global config
    this.config = Config.fromUserConfig(userConfig);
  }

  private setStorage(userConfig: UserConfig): void {
    this.config.storage = StorageUtils.createFromUserConfig(userConfig);
  }

  private setPipeline(config: Config): void {
    this.config.pipeline = PipelineUtils.createFromConfig(config);
  }

  createElement(): VNode {
    return h(Container, {
      config: this.config,
      pipeline: this.config.pipeline,
      header: this.config.header,
      width: this.config.width,
    });
  }

  render(container: Element): void {
    if (!container) {
      log.error('Container element cannot be null', true);
    }

    if (container.childNodes.length > 0) {
      log.error(
        `The container element ${container} is not empty. Make sure the container is empty and call render() again`,
      );
      return;
    }

    this.config.container = container;

    render(this.createElement(), container);
  }
}

export default Grid;
