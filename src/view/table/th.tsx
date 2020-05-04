import { h } from 'preact';

import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import { THeaderCell } from '../../types';
import { Sort } from '../plugin/sort';

import '../../theme/mermaid/th.scss';

export interface THProps extends BaseProps {
  index: number;
  column: THeaderCell;
}

export class TH extends BaseComponent<THProps, {}> {
  render() {
    return (
      <th className={className('th')}>
        {this.props.column.name}
        <Sort index={this.props.index} column={this.props.column} />
      </th>
    );
  }
}
