import { ComponentChild, h } from 'preact';

import { TR } from './tr';
import { BaseComponent, BaseProps } from '../base';
import { TH } from './th';
import { classJoin, className } from '../../util/className';
import Header from '../../header';
import { TColumn } from '../../types';
import { calculateRowColSpans } from '../../util/table';

interface THeadProps extends BaseProps {
  header: Header;
}

export class THead extends BaseComponent<THeadProps> {
  private renderColumn(
    column: TColumn,
    rowIndex: number,
    columnIndex: number,
    totalRows: number,
  ): ComponentChild {
    const { rowSpan, colSpan } = calculateRowColSpans(
      column,
      rowIndex,
      totalRows,
    );

    return (
      <TH
        column={column}
        index={columnIndex}
        colSpan={colSpan}
        rowSpan={rowSpan}
      />
    );
  }

  private renderRow(
    row: TColumn[],
    rowIndex: number,
    totalRows: number,
  ): ComponentChild {
    // because the only sortable columns are leaf columns (not parents)
    const leafColumns = Header.leafColumns(this.props.header.columns);

    return (
      <TR>
        {row.map((col) => {
          if (col.hidden) return null;

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

  private renderRows(): ComponentChild {
    const rows = Header.tabularFormat(this.props.header.columns);

    return rows.map((row, rowIndex) =>
      this.renderRow(row, rowIndex, rows.length),
    );
  }

  render() {
    if (this.props.header) {
      return (
        <thead
          key={this.props.header.id}
          className={classJoin(className('thead'), this.config.className.thead)}
        >
          {this.renderRows()}
        </thead>
      );
    }

    return null;
  }
}
