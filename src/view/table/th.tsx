import { h } from 'preact';

import Cell from '../../cell';
import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import Config from '../../config';
import { THeaderCell } from '../../types';

import '../../theme/mermaid/th.scss';

export interface TDProps extends BaseProps {
  cell: Cell<THeaderCell>;
}

export class TH extends BaseComponent<TDProps, {}> {
  render() {
    return (
      <th className={className(Config.current.classNamePrefix, 'th')}>
        {this.props.cell.data.name}
      </th>
    );
  }
}
