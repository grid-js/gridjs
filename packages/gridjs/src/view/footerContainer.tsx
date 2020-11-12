import { h } from 'preact';

import { BaseComponent } from './base';
import { classJoin, className } from '../util/className';
import { useRef } from 'preact/hooks';
import { PluginPosition, PluginRenderer } from '../plugin';

interface FooterContainerState {
  isActive: boolean;
}

export class FooterContainer extends BaseComponent<{}, FooterContainerState> {
  private footerRef = useRef(null);

  constructor(props, context) {
    super(props, context);

    this.state = {
      isActive: true,
    };
  }

  componentDidMount() {
    if (this.footerRef.current.children.length === 0) {
      this.setState({
        isActive: false,
      });
    }
  }

  render() {
    if (this.state.isActive) {
      return (
        <div
          ref={this.footerRef}
          className={classJoin(
            className('footer'),
            this.config.className?.footer?.container
          )}
          style={{ ...this.config.style.footer }}
        >
          <PluginRenderer position={PluginPosition.Footer} />
        </div>
      );
    }

    return null;
  }
}
