import { BaseComponent, BaseProps } from './view/base';
import { Attributes, ComponentProps, ComponentType, Fragment, h } from 'preact';
import log from './util/log';

export enum PluginPosition {
  Header,
  Footer,
  Cell,
}

export interface Plugin<T> {
  id: string;
  position: PluginPosition;
  component: ComponentType<T>;
  props?: Partial<Attributes & T>;
  order?: number;
}

export class PluginManager {
  private readonly plugins: Plugin<any>[];

  constructor() {
    this.plugins = [];
  }

  get<T>(id: string): Plugin<T> | null {
    const plugins = this.plugins.filter((p) => p.id === id);

    if (plugins.length > 0) {
      return plugins[0];
    }

    return null;
  }

  add<T>(plugin: Plugin<T>): this {
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

  list(position?: PluginPosition): Plugin<any>[] {
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
  // TODO: change this to a typed ComponentProps
  props?: ComponentProps<any>;
  position?: PluginPosition;
}

export class PluginRenderer extends BaseComponent<PluginRendererProps, {}> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
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
