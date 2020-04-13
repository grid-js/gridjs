import { h } from 'preact';
import Cell from '../cell';
import {BaseComponent, BaseProps} from './base';

export interface TDProps extends BaseProps {
  cell: Cell;
}

export class TH extends BaseComponent<TDProps, {}> {
  render() {
    return <th>{this.props.cell.data}</th>;
  }
}
