import { h } from 'preact';

import Row from '../../row';
import Cell from '../../cell';
import { BaseComponent, BaseProps } from '../base';
import { className } from '../../util/className';
import { TColumn } from '../../types';
import { TD } from './td';
import Header from '../../header';

export interface TRProps extends BaseProps {
  row?: Row;
  header?: Header;
}

export class TR extends BaseComponent<TRProps, {}> {
  private getColumn(cellIndex: number): TColumn {
    if (this.props.header) {
      return this.props.header.columns[cellIndex];
    }

    return null;
  }

  render() {
    if (this.props.children) {
      return <tr className={className('tr')}>{this.props.children}</tr>;
    } else {
      return (
        <tr className={className('tr')}>
          {this.props.row.cells.map((cell: Cell, i) => {
            return (
              <TD
                key={cell.id}
                cell={cell}
                row={this.props.row}
                column={this.getColumn(i)}
              />
            );
          })}
        </tr>
      );
    }
  }
}
