import { Attributes, ComponentClass, h } from 'preact';

import Row from '../row';
import Cell from '../cell';
import {BaseComponent, BaseProps} from './base';
import className from "../util/className";
import Config from "../config";

import "../theme/mermaid/tr.scss";

export interface TRProps extends BaseProps {
  row: Row;
  children: ComponentClass;
}

export class TR extends BaseComponent<TRProps, {}> {
  render() {
    return (
      <tr className={className(Config.current.classNamePrefix, "tr")}>
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
