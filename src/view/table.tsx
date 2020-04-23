import { h } from 'preact';

import Tabular from '../tabular';
import { TBody } from './tbody';
import { THead } from './thead';
import { BaseComponent, BaseProps } from './base';
import Header from '../header';
import className from '../util/className';
import Config from '../config';
import { TBodyCell } from '../types';

import '../theme/mermaid/table.scss';

interface TableProps extends BaseProps {
  data?: Tabular<TBodyCell>;
  header?: Header;
}

export class Table extends BaseComponent<TableProps, {}> {
  render() {
    return (
      <table
        className={className(Config.current.classNamePrefix, 'table')}
        style={{ width: Config.current.width }}
      >
        <THead header={this.props.header} />
        <TBody data={this.props.data} />
      </table>
    );
  }
}
