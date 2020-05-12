import { h } from 'preact';

import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import { TColumn } from '../../types';
import { Sort } from '../plugin/sort/sort';

export interface THProps extends BaseProps {
  index: number;
  column: TColumn;
}

export class TH extends BaseComponent<THProps, {}> {
  render() {
    return (
      <th className={className('th')}>
        {this.props.column.name}
        {this.props.column.sort && (
          <Sort index={this.props.index} column={this.props.column} />
        )}
      </th>
    );
  }
}
