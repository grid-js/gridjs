import { h } from 'preact';

import Row from '../../row';
import Cell from '../../cell';
import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import { TCell, TColumn } from '../../types';
import { TD } from './td';

export interface TRProps extends BaseProps {
  row?: Row<TCell | TColumn>;
}

export class TR extends BaseComponent<TRProps, {}> {
  render() {
    if (this.props.children) {
      return <tr className={className('tr')}>{this.props.children}</tr>;
    } else {
      return (
        <tr className={className('tr')}>
          {this.props.row.cells.map((cell: Cell<TCell>) => {
            return <TD cell={cell} key={cell.id} />;
          })}
        </tr>
      );
    }
  }
}
