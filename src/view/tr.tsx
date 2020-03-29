import React from "react";
import Row from "../row";
import Cell from "../cell";
import {TD} from "./td";

export interface TRProps {
  row: Row
}

export class TR extends React.Component<TRProps, {}> {
  render() {
    return <tr>
      { this.props.row.cells.map((cell: Cell) => {
        return <TD key={cell.id} cell={cell}></TD>;
      }) }
    </tr>;
  }
}
