import { ComponentChild, h } from 'preact';

import Cell from '../../cell';
import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import { TCell, TColumn } from '../../types';

export interface TDProps extends BaseProps {
  cell: Cell<TCell>;
  column?: TColumn;
  colSpan?: number;
  className?: string;
}

export class TD extends BaseComponent<TDProps, {}> {
  private content(): ComponentChild {
    if (
      this.props.column &&
      typeof this.props.column.formatter === 'function'
    ) {
      return this.props.column.formatter(this.props.cell, this.props.column);
    }

    return this.props.cell.data;
  }

  render() {
    return (
      <td
        colSpan={this.props.colSpan}
        className={`${className('td')}${
          this.props.className ? ' ' + this.props.className : ''
        }`}
      >
        {this.content()}
      </td>
    );
  }
}
