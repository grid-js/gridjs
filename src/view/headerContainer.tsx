import { h } from 'preact';

import { BaseComponent, BaseProps } from './base';
import className from '../util/className';
import { Search } from './plugin/search/search';
import { Config } from '../config';
import { useRef } from 'preact/hooks';

interface HeaderContainerProps extends BaseProps {
  config: Config;
}

interface HeaderContainerState {
  isActive: boolean;
}

export class HeaderContainer extends BaseComponent<
  HeaderContainerProps,
  HeaderContainerState
> {
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
    if (this.state.isActive) {
      return (
        <div ref={this.headerRef} className={className('head')}>
          <Search
            pipeline={this.props.config.pipeline}
            {...this.props.config.search}
          />
        </div>
      );
    }

    return null;
  }
}
