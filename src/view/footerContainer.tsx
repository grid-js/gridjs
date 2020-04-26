import { h } from 'preact';

import Config from '../config';
import { BaseComponent } from './base';
import className from '../util/className';
import { Pagination } from './plugin/pagination';

import '../theme/mermaid/footer.scss';

export class FooterContainer extends BaseComponent<{}, {}> {
  render() {
    return (
      <div className={className(Config.current.classNamePrefix, 'footer')}>
        <Pagination {...Config.current.pagination} />
      </div>
    );
  }
}
