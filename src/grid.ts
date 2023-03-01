import { Config } from './config';
import { h, render, VNode } from 'preact';
import { Container } from './view/container';
import log from './util/log';
import { EventEmitter } from './util/eventEmitter';
import { GridEvents } from './events';
import { PluginManager } from './plugin';
import { ConfigContext } from './config';
import {xPath} from "./util/xpath";

class Grid extends EventEmitter<GridEvents> {
  public config: Config;
  public plugin: PluginManager;
  public uniqueIdentifier: string; // this is used in order to have different column widths (saved in localstorage) for different pages and configurations, this way you can have multiple tables, routes, ...

  constructor(config?: Partial<Config>) {
    super();
    this.config = new Config()
      .assign({ instance: this, eventEmitter: this })
      .update(config);
    this.plugin = this.config.plugin;
  }

  public updateConfig(config: Partial<Config>): this {
    this.config.update(config);
    return this;
  }

  createElement(): VNode {
    return h(ConfigContext.Provider, {
      value: this.config,
      children: h(Container, {}),
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

    this.destroy();

    // recreate the Grid instance
    render(this.createElement(), this.config.container);

    return this;
  }

  /**
   * Deletes the Grid.js instance
   */
  destroy(): void {
    this.config.pipeline.clearCache();
    // TODO: not sure if it's a good idea to render a null element but I couldn't find a better way
    render(null, this.config.container);
  }

  /**
   * Mounts the Grid.js instance to the container
   * and renders the instance
   *
   * @param container
   */
  render(container: Element): this {
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

    const newUniqueIdentifier = xPath(this.config.container, true) + window.location.host + window.location.pathname; // use xpath of container because that will be unique for every table on the same page

    if (this.uniqueIdentifier) {
      // transfer all column widths to new key (because identifier changed)

      const storage = {...window.localStorage};
      for (const item in storage) {
        window.localStorage.setItem(newUniqueIdentifier + item.split(this.uniqueIdentifier)[1], storage[item]);
        window.localStorage.removeItem(item);
      }
    }

    this.uniqueIdentifier = newUniqueIdentifier;

    return this;
  }
}

export default Grid;
