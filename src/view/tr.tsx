import React from "react";
import Row from "../row";
import Cell from "../cell";
import {TD} from "./td";

export interface TRProps<T> {
  row: Row<T>
}

export class TR<T> extends React.Component<TRProps<T>, {}> {
  render() {
    return <tr>
      { Array.from(this.props.row).map((cell: Cell<T>) => {
        return <TD key={cell.id} cell={cell}></TD>;
      }) }
    </tr>;
  }
}
