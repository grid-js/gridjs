import {BaseComponent, BaseProps} from "./view/base";
import {ComponentChild, Fragment, h} from "preact";

export enum PluginPosition {
  Header,
  Footer
}

export interface Plugin {
  enabled: boolean;
  position: PluginPosition;
  component: ComponentChild;
}

export class PluginManager {
  private readonly plugins: Plugin[];

  constructor() {
    this.plugins = [];
  }

  add(plugin: Plugin): this {
    if (plugin.enabled === undefined) {
      plugin.enabled = true;
    }

    this.plugins.push(plugin);
    return this;
  }

  list(position?: PluginPosition): Plugin[] {
    if (position) {
      return this.plugins.filter(p => p.position === position);
    }

    return this.plugins;
  }
}

export interface PluginRendererProps extends BaseProps {
  position?: PluginPosition
}

export class PluginRenderer extends BaseComponent<PluginRendererProps, {}> {
  render() {
    return h(Fragment, {}, this.config.pluginManager.list(this.props.position).filter(p => p.enabled).map(p => p.component));
  }
}
