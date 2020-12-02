import { createRef, h } from 'preact';

import { BaseComponent } from './base';
import { classJoin, className } from '../util/className';
import { PluginPosition, PluginRenderer } from '../plugin';

interface HeaderContainerState {
  isActive: boolean;
}

export class HeaderContainer extends BaseComponent<{}, HeaderContainerState> {
  private headerRef = createRef();

  constructor(props, context) {
    super(props, context);

    this.state = {
      isActive: true,
    };
  }

  componentDidMount() {
    if (this.headerRef.current.children.length === 0) {
      this.setState({
        isActive: false,
      });
    }
  }

  render() {
    if (this.state.isActive) {
      return (
        <div
          ref={this.headerRef}
          className={classJoin(className('head'), this.config.className.header)}
          style={{ ...this.config.style.header }}
        >
          <PluginRenderer position={PluginPosition.Header} />
        </div>
      );
    }

    return null;
  }
}
