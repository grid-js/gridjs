import { Config, UserConfig } from './config';
import { h, render, VNode } from 'preact';
import { Container } from './view/container';
import log from './util/log';

class Grid {
  public config: Config;
  private _userConfig: UserConfig;

  constructor(userConfig?: UserConfig) {
    this._userConfig = userConfig;
  }

  bootstrap(): void {
    this.setConfig(this._userConfig);
  }

  public updateConfig(userConfig: UserConfig): this {
    this._userConfig = {
      ...this._userConfig,
      ...userConfig,
    };

    return this;
  }

  private setConfig(userConfig: UserConfig): this {
    if (!this.config) {
      this.config = new Config();
    }

    this.config.update(Config.fromUserConfig(userConfig));
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
    if (!this.config || !this.config.container) {
      log.error(
        'Container is empty. Make sure you call render() before forceRender()',
        true,
      );
    }

    // re-creates essential components
    this.bootstrap();

    // clear the pipeline cache
    // FIXME: not sure if this is necessary because we are calling bootstrap() before this line
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
