import { h } from 'preact';
import Cell from '../cell';
import {BaseComponent, BaseProps} from './base';

export interface TDProps extends BaseProps {
  cell: Cell;
}

export class TD extends BaseComponent<TDProps, {}> {
  render() {
    return <td>{this.props.cell.data}</td>;
  }
}
