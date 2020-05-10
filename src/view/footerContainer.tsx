import { h } from 'preact';

import Config from '../config';
import { BaseComponent } from './base';
import className from '../util/className';
import { Pagination } from './plugin/pagination';

export class FooterContainer extends BaseComponent<{}, {}> {
  render() {
    return (
      <div className={className('footer')}>
        <Pagination {...Config.current.pagination} />
      </div>
    );
  }
}
