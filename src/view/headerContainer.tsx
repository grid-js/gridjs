import { h } from 'preact';

import { BaseComponent } from './base';
import { className } from '../util/className';
import { Search } from './plugin/search/search';
import { useRef } from 'preact/hooks';
import getConfig from '../util/getConfig';

interface HeaderContainerState {
  isActive: boolean;
}

export class HeaderContainer extends BaseComponent<{}, HeaderContainerState> {
  private headerRef = useRef(null);

  constructor(props) {
    super(props);

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
    const config = getConfig(this.context);

    if (this.state.isActive) {
      return (
        <div ref={this.headerRef} className={className('head')}>
          <Search {...config.search} />
        </div>
      );
    }

    return null;
  }
}
