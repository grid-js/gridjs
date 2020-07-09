import { h } from 'preact';

import Tabular from '../../tabular';
import { TBody } from './tbody';
import { THead } from './thead';
import { BaseComponent, BaseProps } from '../base';
import Header from '../../header';
import { classJoin, className } from '../../util/className';
import { Status } from '../../types';

interface TableProps extends BaseProps {
  data: Tabular;
  status: Status;
  header?: Header;
  width: string;
  height: string;
}

export class Table extends BaseComponent<TableProps, {}> {
  render() {
    return (
      <table
        role="grid"
        className={classJoin(className('table'), this.config.className.table)}
        style={{
          ...this.config.style.table,
          ...{
            width: this.props.width,
            height: this.props.height,
          },
        }}
      >
        <THead header={this.props.header} />
        <TBody
          data={this.props.data}
          status={this.props.status}
          header={this.props.header}
        />
      </table>
    );
  }
}
