import { Attributes, ComponentClass, h } from 'preact';
import Row from '../row';
import Cell from '../cell';
import {BaseComponent, BaseProps} from './base';

export interface TRProps extends BaseProps {
  row: Row;
  children: ComponentClass;
}

export class TR extends BaseComponent<TRProps, {}> {
  render() {
    return (
      <tr>
        {this.props.row.cells.map((cell: Cell) => {
          return h(this.props.children, {
            cell: cell,
            key: cell.id,
          } as Attributes);
        })}
      </tr>
    );
  }
}
