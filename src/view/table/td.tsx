import { h } from 'preact';

import Cell from '../../cell';
import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import { TCell } from '../../types';

export interface TDProps extends BaseProps {
  cell: Cell<TCell>;
  colSpan?: number;
  className?: string;
}

export class TD extends BaseComponent<TDProps, {}> {
  render() {
    return (
      <td
        colSpan={this.props.colSpan}
        className={`${className('td')}${
          this.props.className ? ' ' + this.props.className : ''
        }`}
      >
        {this.props.cell.data}
      </td>
    );
  }
}
