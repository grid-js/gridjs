import { Fragment, FunctionComponent, h } from 'preact';
import { useConfig } from './hooks/useConfig';
import log from './util/log';

export enum PluginPosition {
  Header,
  Footer,
  Cell,
}

export interface Plugin<T extends FunctionComponent> {
  id: string;
  position: PluginPosition;
  component: T;
  order?: number;
}

export class PluginManager {
  private readonly plugins: Plugin<any>[];

  constructor() {
    this.plugins = [];
  }

  get<T extends FunctionComponent>(id: string): Plugin<T> | undefined {
    return this.plugins.find((p) => p.id === id);
  }

  add<T extends FunctionComponent<any>>(plugin: Plugin<T>): this {
    if (!plugin.id) {
      log.error('Plugin ID cannot be empty');
      return this;
    }

    if (this.get(plugin.id)) {
      log.error(`Duplicate plugin ID: ${plugin.id}`);
      return this;
    }

    this.plugins.push(plugin);
    return this;
  }

  remove(id: string): this {
    const plugin = this.get(id);

    if (plugin) {
      this.plugins.splice(this.plugins.indexOf(plugin), 1);
    }

    return this;
  }

  list<T extends FunctionComponent>(position?: PluginPosition): Plugin<T>[] {
    let plugins: Plugin<T>[];

    if (position != null || position != undefined) {
      plugins = this.plugins.filter((p) => p.position === position);
    } else {
      plugins = this.plugins;
    }

    return plugins.sort((a, b) => (a.order && b.order ? a.order - b.order : 1));
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
        ...props.props,
      }),
    );
  } else if (props.position !== undefined) {
    // render using a specific plugin position
    return h(
      Fragment,
      {},
      config.plugin.list(props.position).map((p) => {
        return h(p.component, { plugin: p, ...this.props.props });
      }),
    );
  }

  return null;
}
