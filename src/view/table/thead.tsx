import { h } from 'preact';

import { TR } from './tr';
import { BaseComponent, BaseProps } from '../base';
import { TH } from './th';
import { className } from '../../util/className';
import Header from '../../header';
import { TColumn } from '../../types';
import { calculateRowColSpans } from '../../util/table';

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
    const { rowSpan, colSpan } = calculateRowColSpans(
      column,
      rowIndex,
      totalRows,
    );

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
    const leafColumns = Header.leafColumns(this.props.header.columns);

    return (
      <TR>
        {row.map((col) => {
          return this.renderColumn(
            col,
            rowIndex,
            leafColumns.indexOf(col),
            totalRows,
          );
        })}
      </TR>
    );
  }

  private renderRows() {
    const rows = Header.tabularFormat(this.props.header.columns);

    return rows.map((row, rowIndex) =>
      this.renderRow(row, rowIndex, rows.length),
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
