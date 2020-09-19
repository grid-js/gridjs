import { h, Fragment } from 'preact';

import { TR } from './tr';
import { BaseComponent, BaseProps } from '../base';
import { TH } from './th';
import { className } from '../../util/className';
import Header from '../../header';
import { TColumn } from '../../types';

interface THeadProps extends BaseProps {
  header: Header;
}

export class THead extends BaseComponent<THeadProps, {}> {
  private renderColumn(
    column: TColumn,
    rowIndex: number,
    columnIndex: number,
    totalRows: number,
  ) {
    const depth = Header.maximumDepth(column);
    const remainingRows = totalRows - rowIndex;
    const rowSpan = Math.floor(remainingRows - depth - depth / remainingRows);
    const colSpan = (column.columns && column.columns.length) || 1;

    return (
      <TH
        column={column}
        index={columnIndex}
        colSpan={colSpan > 1 ? colSpan : undefined}
        rowSpan={rowSpan > 1 ? rowSpan : undefined}
      />
    );
  }

  private renderRow(row: TColumn[], rowIndex: number, totalRows: number) {
    return (
      <TR>
        {row.map((col, columnIndex) => {
          return this.renderColumn(col, rowIndex, columnIndex, totalRows);
        })}
      </TR>
    );
  }

  private renderRows() {
    const rows = Header.tabularFormat(this.props.header.columns);

    return (
      <Fragment>
        {rows.map((row, rowIndex) =>
          this.renderRow(row, rowIndex, rows.length),
        )}
      </Fragment>
    );
  }

  render() {
    if (this.props.header) {
      return (
        <thead key={this.props.header.id} className={className('thead')}>
          {this.renderRows()}
        </thead>
      );
    }

    return null;
  }
}
