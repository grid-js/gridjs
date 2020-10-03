import { h } from 'preact';

import Tabular from '../../tabular';
import { BaseComponent, BaseProps } from '../base';
import Header from '../../header';
import Row from '../../row';
import Cell from '../../cell';
import { calculateRowColSpans } from '../../util/table';

interface ShadowTableProps extends BaseProps {
  data: Tabular;
  header?: Header;
}

export class ShadowTable extends BaseComponent<ShadowTableProps, {}> {
  resetStyle(): { [key: string]: string | number } {
    return { padding: 0, margin: 0, border: 'none', outline: 'none' };
  }

  head() {
    const rows = Header.tabularFormat(this.props.header.columns);
    const totalRows = rows.length;

    return (
      <thead style={this.resetStyle()}>
        {rows.map((row, rowIndex) => {
          return (
            <tr>
              {row.map((col) => {
                if (col.hidden) return null;

                const { rowSpan, colSpan } = calculateRowColSpans(
                  col,
                  rowIndex,
                  totalRows,
                );

                return (
                  <th
                    data-column-id={col && col.id}
                    style={{
                      ...this.resetStyle(),
                      whiteSpace: 'nowrap',
                      // pagination buttons
                      paddingRight: col.sort && col.sort.enabled ? '18px' : '0',
                    }}
                    colSpan={colSpan > 1 ? colSpan : undefined}
                    rowSpan={rowSpan > 1 ? rowSpan : undefined}
                  >
                    {col.name}
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
    );
  }

  td(cell: Cell) {
    return <td style={this.resetStyle()}>{cell.data}</td>;
  }

  tr(row: Row) {
    return (
      <tr style={this.resetStyle()}>
        {row.cells.map((cell: Cell, i) => {
          if (this.props.header) {
            const column = this.props.header.columns[i];

            if (column && column.hidden) return null;
          }

          return this.td(cell);
        })}
      </tr>
    );
  }

  body() {
    return (
      <tbody style={this.resetStyle()}>
        {this.props.data &&
          this.props.data.rows.map((row: Row) => {
            return this.tr(row);
          })}
      </tbody>
    );
  }

  render() {
    return (
      <table
        style={{
          position: 'absolute',
          zIndex: '-2147483640',
          visibility: 'hidden',
          tableLayout: 'auto',
          width: 'auto',
          ...this.resetStyle(),
        }}
      >
        {this.head()}
        {this.body()}
      </table>
    );
  }
}
