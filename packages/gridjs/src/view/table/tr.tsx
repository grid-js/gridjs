import { h, JSX, Fragment, ComponentChildren } from 'preact';

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
  messageRow?: boolean;
}

export class TR extends BaseComponent<TRProps, {}> {
  private getColumn(cellIndex: number): TColumn {
    if (this.props.header) {
      const cols = Header.leafColumns(this.props.header.columns);

      if (cols) {
        return cols[cellIndex];
      }
    }

    return null;
  }

  private handleClick(e: JSX.TargetedMouseEvent<HTMLTableRowElement>): void {
    if (this.props.messageRow)
      return;
    this.config.eventEmitter.emit('rowClick', e, this.props.row);
  }

  private getChildren(): ComponentChildren {
    if (this.props.children) {
      return this.props.children;
    } else {
      return (
        <Fragment>
          {this.props.row.cells.map((cell: Cell, i) => {
            const column = this.getColumn(i);

            if (column && column.hidden) return null;

            return (
              <TD
                key={cell.id}
                cell={cell}
                row={this.props.row}
                column={column}
              />
            );
          })}
        </Fragment>
      );
    }
  }

  render() {
    return (
      <tr className={className('tr')} onClick={this.handleClick.bind(this)}>
        {this.getChildren()}
      </tr>
    );
  }
}
