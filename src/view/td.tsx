import React from "react";
import Cell from "../cell";

export interface TDProps {
  cell: Cell
}

export class TD extends React.Component<TDProps, {}> {
  render() {
    return <td>{ this.props.cell.getData() }</td>;
  }
}
