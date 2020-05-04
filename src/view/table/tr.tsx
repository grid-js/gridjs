import { h } from 'preact';

import Row from '../../row';
import Cell from '../../cell';
import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import { TBodyCell, THeaderCell } from '../../types';

import '../../theme/mermaid/tr.scss';
import { TD } from './td';

export interface TRProps extends BaseProps {
  row?: Row<TBodyCell | THeaderCell>;
}

export class TR extends BaseComponent<TRProps, {}> {
  render() {
    if (this.props.children) {
      return <tr className={className('tr')}>{this.props.children}</tr>;
    } else {
      return (
        <tr className={className('tr')}>
          {this.props.row.cells.map((cell: Cell<TBodyCell>) => {
            return <TD cell={cell} key={cell.id} />;
          })}
        </tr>
      );
    }
  }
}
