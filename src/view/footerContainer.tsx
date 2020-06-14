import { h } from 'preact';

import { BaseComponent } from './base';
import { className } from '../util/className';
import { Pagination } from './plugin/pagination';
import { useRef } from 'preact/hooks';
import getConfig from '../util/getConfig';

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
    const config = getConfig(this.context);

    if (this.state.isActive) {
      return (
        <div ref={this.footerRef} className={className('footer')}>
          <Pagination {...config.pagination} />
        </div>
      );
    }

    return null;
  }
}
