import { h } from 'preact';

import Tabular from '../../tabular';
import { BaseComponent, BaseProps } from '../base';
import Header from '../../header';
import { TCell } from '../../types';
import Row from '../../row';
import Cell from '../../cell';

interface ShadowTableProps extends BaseProps {
  data: Tabular<TCell>;
  header?: Header;
}

export class ShadowTable extends BaseComponent<ShadowTableProps, {}> {
  resetStyle(): { [key: string]: string | number } {
    return { padding: 0, margin: 0, border: 'none' };
  }

  head() {
    return (
      <thead style={this.resetStyle()}>
        <tr>
          {this.props.header.columns.map((col) => {
            return <th style={this.resetStyle()}>{col.name}</th>;
          })}
        </tr>
      </thead>
    );
  }

  td(cell: Cell<TCell>) {
    return <td style={this.resetStyle()}>{cell.data}</td>;
  }

  tr(row: Row<TCell>) {
    return (
      <tr style={this.resetStyle()}>
        {row.cells.map((cell: Cell<TCell>) => {
          return this.td(cell);
        })}
      </tr>
    );
  }

  body() {
    return (
      <tbody style={this.resetStyle()}>
        {this.props.data &&
          this.props.data.rows.map((row: Row<TCell>) => {
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
