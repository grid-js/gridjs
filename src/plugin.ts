import { BaseComponent, BaseProps } from './view/base';
import {Fragment, h, VNode} from 'preact';

export enum PluginPosition {
  Header,
  Footer,
}

export interface Plugin {
  position: PluginPosition;
  component: VNode<any>;
}

export class PluginManager {
  private readonly plugins: Plugin[];

  constructor() {
    this.plugins = [];
  }

  add(plugin: Plugin): this {
    this.plugins.push(plugin);
    return this;
  }

  remove(plugin: Plugin): this {
    this.plugins.splice(this.plugins.indexOf(plugin), 1);
    return this;
  }

  list(position?: PluginPosition): Plugin[] {
    if (position) {
      return this.plugins.filter((p) => p.position === position);
    }

    return this.plugins;
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
