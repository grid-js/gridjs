import { BaseComponent, BaseProps } from './view/base';
import { ComponentProps, Fragment, h } from 'preact';
import log from './util/log';

/**
 * BaseProps for all plugins
 */
export interface PluginBaseProps<T extends PluginBaseComponent> {
  plugin: Plugin<T>;
}

/**
 * BaseComponent for all plugins
 */
export abstract class PluginBaseComponent<
  P extends PluginBaseProps<any> = any,
  S = {}
> extends BaseComponent<P, S> {}

export enum PluginPosition {
  Header,
  Footer,
  Cell,
}

export interface Plugin<T extends PluginBaseComponent> {
  id: string;
  position: PluginPosition;
  component: T;
  props?: Partial<ComponentProps<T>>;
  order?: number;
}

export class PluginManager {
  private readonly plugins: Plugin<any>[];

  constructor() {
    this.plugins = [];
  }

  get<T extends PluginBaseComponent>(id: string): Plugin<T> | null {
    const plugins = this.plugins.filter((p) => p.id === id);

    if (plugins.length > 0) {
      return plugins[0];
    }

    return null;
  }

  add<T extends PluginBaseComponent>(plugin: Plugin<T>): this {
    if (!plugin.id) {
      log.error('Plugin ID cannot be empty');
      return this;
    }

    if (this.get(plugin.id) !== null) {
      log.error(`Duplicate plugin ID: ${plugin.id}`);
      return this;
    }

    this.plugins.push(plugin);
    return this;
  }

  remove(id: string): this {
    this.plugins.splice(this.plugins.indexOf(this.get(id)), 1);
    return this;
  }

  list<T extends PluginBaseComponent>(position?: PluginPosition): Plugin<T>[] {
    let plugins: Plugin<any>[];

    if (position != null || position != undefined) {
      plugins = this.plugins.filter((p) => p.position === position);
    } else {
      plugins = this.plugins;
    }

    return plugins.sort((a, b) => a.order - b.order);
  }
}

export interface PluginRendererProps extends BaseProps {
  props?: any;
  // to render a single plugin
  pluginId?: string;
  // to render all plugins in this PluginPosition
  position?: PluginPosition;
}

export class PluginRenderer extends BaseComponent<PluginRendererProps, {}> {
  render() {
    if (this.props.pluginId) {
      const plugin = this.config.plugin.get(this.props.pluginId);

      if (!plugin) return null;

      return h(
        Fragment,
        {},
        h(plugin.component, {
          plugin: plugin,
          ...plugin.props,
          ...this.props.props,
        }),
      );
    }

    return h(
      Fragment,
      {},
      this.config.plugin
        .list(this.props.position)
        .map((p) =>
          h(p.component, { plugin: p, ...p.props, ...this.props.props }),
        ),
    );
  }
}
