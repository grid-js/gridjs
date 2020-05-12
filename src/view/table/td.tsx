import { h } from 'preact';

import Cell from '../../cell';
import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import { TCell } from '../../types';

export interface TDProps extends BaseProps {
  cell: Cell<TCell>;
}

export class TD extends BaseComponent<TDProps, {}> {
  render() {
    return <td className={className('td')}>{this.props.cell.data}</td>;
  }
}
