import { Config, UserConfig } from './config';
import { h, render, VNode } from 'preact';
import StorageUtils from './storage/storageUtils';
import { Container } from './view/container';
import log from './util/log';
import PipelineUtils from './pipeline/pipelineUtils';
import Dispatcher from './util/dispatcher';

class Grid {
  private _config: Config;
  private _userConfig: UserConfig;

  constructor(userConfig?: UserConfig) {
    this._userConfig = userConfig;
  }

  bootstrap(): void {
    this.setConfig(this._userConfig);
    this.setDispatcher(this._userConfig);
    this.setStorage(this._userConfig);
    this.setPipeline(this.config);
  }

  get config(): Config {
    return this._config;
  }

  set config(config: Config) {
    this._config = config;
  }

  private setDispatcher(userConfig?: UserConfig): this {
    this.config.dispatcher = userConfig.dispatcher || new Dispatcher<any>();
    return this;
  }

  public updateConfig(userConfig: UserConfig): this {
    this._userConfig = {
      ...this._userConfig,
      ...userConfig,
    };

    return this;
  }

  private setConfig(userConfig: UserConfig): this {
    // sets the current global config
    this.config = {
      ...(this.config || {}),
      ...Config.fromUserConfig(userConfig),
    };
    return this;
  }

  private setStorage(userConfig: UserConfig): this {
    this.config.storage = StorageUtils.createFromUserConfig(userConfig);
    return this;
  }

  private setPipeline(config: Config): this {
    this.config.pipeline = PipelineUtils.createFromConfig(config);
    return this;
  }

  createElement(): VNode {
    return h(Container, {
      config: this.config,
      pipeline: this.config.pipeline,
      header: this.config.header,
      width: this.config.width,
    });
  }

  /**
   * Uses the existing container and tries to clear the cache
   * and re-render the existing Grid.js instance again. This is
   * useful when a new config is set/updated.
   *
   */
  forceRender(): this {
    if (!this.config.container) {
      log.error('Container is empty', true);
    }

    // re-creates essential components
    this.bootstrap();

    // clear the pipeline cache
    this.config.pipeline.clearCache();

    // TODO: not sure if it's a good idea to render a null element but I couldn't find a better way
    render(null, this.config.container);
    render(this.createElement(), this.config.container);

    return this;
  }

  /**
   * Mounts the Grid.js instance to the container
   * and renders the instance
   *
   * @param container
   */
  render(container: Element): this {
    this.bootstrap();

    if (!container) {
      log.error('Container element cannot be null', true);
    }

    if (container.childNodes.length > 0) {
      log.error(
        `The container element ${container} is not empty. Make sure the container is empty and call render() again`,
      );
      return this;
    }

    this.config.container = container;
    render(this.createElement(), container);

    return this;
  }
}

export default Grid;
