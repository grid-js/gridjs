import { h } from 'preact';

import { BaseComponent, BaseProps } from './base';
import { className } from '../util/className';
import { Pagination } from './plugin/pagination';
import { Config } from '../config';
import { useRef } from 'preact/hooks';

interface FooterContainerProps extends BaseProps {
  config: Config;
}

interface FooterContainerState {
  isActive: boolean;
}

export class FooterContainer extends BaseComponent<
  FooterContainerProps,
  FooterContainerState
> {
  private footerRef = useRef(null);

  constructor() {
    super();

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
        <div ref={this.footerRef} className={className('footer')}>
          <Pagination
            pipeline={this.props.config.pipeline}
            {...this.props.config.pagination}
          />
        </div>
      );
    }

    return null;
  }
}
