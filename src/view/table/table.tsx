import { h } from 'preact';

import Tabular from '../../tabular';
import { TBody } from './tbody';
import { THead } from './thead';
import { BaseComponent, BaseProps } from '../base';
import Header from '../../header';
import className from '../../util/className';
import { TCell } from '../../types';

interface TableProps extends BaseProps {
  data?: Tabular<TCell>;
  header?: Header;
  width?: string;
}

export class Table extends BaseComponent<TableProps, {}> {
  render() {
    return (
      <table
        className={className('table')}
        style={{ width: this.props.width }}
      >
        <THead header={this.props.header} />
        <TBody data={this.props.data} />
      </table>
    );
  }
}
