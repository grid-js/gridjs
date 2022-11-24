import { Component, ComponentProps, Fragment, h } from 'preact';
import { useConfig } from './hooks/useConfig';
import log from './util/log';

/**
 * BaseProps for all plugins
 */
export interface PluginBaseProps<T extends PluginBaseComponentCtor> {
  plugin: Plugin<T>;
}

/**
 * BaseComponent for all plugins
 */
export abstract class PluginBaseComponent<
  P extends PluginBaseProps<any> = any,
  S = unknown,
> extends BaseComponent<P, S> {}

export interface PluginBaseComponentCtor<
  P extends PluginBaseProps<any> = any,
  S = unknown,
> {
  new (props: P, context?: any): Component<P, S>;
}

export enum PluginPosition {
  Header,
  Footer,
  Cell,
}

export interface Plugin<T extends PluginBaseComponentCtor> {
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

  get<T extends PluginBaseComponentCtor>(id: string): Plugin<T> | null {
    const plugins = this.plugins.filter((p) => p.id === id);

    if (plugins.length > 0) {
      return plugins[0];
    }

    return null;
  }

  add<T extends PluginBaseComponentCtor>(plugin: Plugin<T>): this {
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

  list<T extends PluginBaseComponentCtor>(
    position?: PluginPosition,
  ): Plugin<T>[] {
    let plugins: Plugin<T>[];

    if (position != null || position != undefined) {
      plugins = this.plugins.filter((p) => p.position === position);
    } else {
      plugins = this.plugins;
    }

    return plugins.sort((a, b) => a.order - b.order);
  }
}

export function PluginRenderer(props: {
  props?: any;
  // to render a single plugin
  pluginId?: string;
  // to render all plugins in this PluginPosition
  position?: PluginPosition;
}) {
  const config = useConfig();

  if (props.pluginId) {
    // render a single plugin
    const plugin = config.plugin.get(props.pluginId);

    if (!plugin) return null;

    return h(
      Fragment,
      {},
      h(plugin.component, {
        plugin: plugin,
        ...plugin.props,
        ...props.props,
      }),
    );
  } else if (props.position !== undefined) {
    // render using a specific plugin position
    return h(
      Fragment,
      {},
      config.plugin
        .list(props.position)
        .map((p) => h(p.component, { plugin: p, ...p.props, ...props.props })),
    );
  }

  return null;
}
