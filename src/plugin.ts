import { BaseComponent, BaseProps } from './view/base';
import { Fragment, h, VNode } from 'preact';
import log from './util/log';

export enum PluginPosition {
  Header,
  Footer,
}

export interface Plugin {
  id: string;
  position: PluginPosition;
  component: VNode<any>;
  order?: number;
}

export class PluginManager {
  private readonly plugins: Plugin[];

  constructor() {
    this.plugins = [];
  }

  get(id: string): Plugin | null {
    const plugins = this.plugins.filter((p) => p.id === id);

    if (plugins.length > 0) {
      return plugins[0];
    }

    return null;
  }

  add(plugin: Plugin): this {
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

  list(position?: PluginPosition): Plugin[] {
    let plugins: Plugin[];

    if (position != null || position != undefined) {
      plugins = this.plugins.filter((p) => p.position === position);
    } else {
      plugins = this.plugins;
    }

    return plugins.sort((a, b) => a.order - b.order);
  }
}

export interface PluginRendererProps extends BaseProps {
  position?: PluginPosition;
}

export class PluginRenderer extends BaseComponent<PluginRendererProps, {}> {
  render() {
    return h(
      Fragment,
      {},
      this.config.plugin.list(this.props.position).map((p) => p.component),
    );
  }
}
