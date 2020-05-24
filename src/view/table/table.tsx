import { h } from 'preact';

import Tabular from '../../tabular';
import { TBody } from './tbody';
import { THead } from './thead';
import { BaseComponent, BaseProps } from '../base';
import Header from '../../header';
import className from '../../util/className';
import { TCell } from '../../types';
import Pipeline from '../../pipeline/pipeline';

interface TableProps extends BaseProps {
  pipeline: Pipeline<any>;
  data: Tabular<TCell>;
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
        <THead pipeline={this.props.pipeline} header={this.props.header} />
        <TBody data={this.props.data} />
      </table>
    );
  }
}
