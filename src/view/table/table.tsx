import { h } from 'preact';

import Tabular from '../../tabular';
import { TBody } from './tbody';
import { THead } from './thead';
import { BaseComponent, BaseProps } from '../base';
import Header from '../../header';
import { className } from '../../util/className';
import { Status, TCell } from '../../types';

interface TableProps extends BaseProps {
  data: Tabular<TCell>;
  status: Status;
  header?: Header;
  width?: string;
}

export class Table extends BaseComponent<TableProps, {}> {
  private getStyle(): { [key: string]: string } {
    const style = {};

    if (this.props.width) {
      style['width'] = this.props.width;
    }

    return style;
  }

  render() {
    return (
      <table className={className('table')} style={this.getStyle()}>
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
