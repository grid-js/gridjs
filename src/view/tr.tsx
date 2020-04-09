import { h } from "preact";
import Row from "../row";
import Cell from "../cell";
import {TD} from "./td";
import {BaseComponent} from "./base";

export interface TRProps {
  row: Row
}

export class TR extends BaseComponent<TRProps, {}> {
  render() {
    return <tr>
      { this.props.row.cells.map((cell: Cell) => {
        return <TD key={cell.id} cell={cell}></TD>;
      }) }
    </tr>;
  }
}
