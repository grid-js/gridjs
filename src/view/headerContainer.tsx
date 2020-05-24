import { h } from 'preact';

import { BaseComponent, BaseProps } from './base';
import className from '../util/className';
import { Search } from './plugin/search/search';
import { Config } from '../config';

interface HeaderContainerProps extends BaseProps {
  config: Config;
}

export class HeaderContainer extends BaseComponent<HeaderContainerProps, {}> {
  render() {
    return (
      <div className={className('head')}>
        <Search
          pipeline={this.props.config.pipeline}
          {...this.props.config.search}
        />
      </div>
    );
  }
}
