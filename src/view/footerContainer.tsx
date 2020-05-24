import { h } from 'preact';

import { BaseComponent, BaseProps } from './base';
import className from '../util/className';
import { Pagination } from './plugin/pagination';
import { Config } from '../config';

interface FooterContainerProps extends BaseProps {
  config: Config;
}

export class FooterContainer extends BaseComponent<FooterContainerProps, {}> {
  render() {
    return (
      <div className={className('footer')}>
        <Pagination
          pipeline={this.props.config.pipeline}
          {...this.props.config.pagination}
        />
      </div>
    );
  }
}
