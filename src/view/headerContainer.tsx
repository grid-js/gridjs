import { h } from 'preact';

import { BaseComponent } from './base';
import { classJoin, className } from '../util/className';
import { PluginPosition, PluginRenderer } from '../plugin';

export class HeaderContainer extends BaseComponent<Record<string, any>> {
  render() {
    return (
      <div
        className={classJoin(className('head'), this.config.className.header)}
        style={{ ...this.config.style.header }}
      >
        <PluginRenderer position={PluginPosition.Header} />
      </div>
    );
  }
}
