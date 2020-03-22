import React from "react";
import Cell from "../cell";

export interface TDProps<T> {
  cell: Cell<T>
}

export class TD<T> extends React.Component<TDProps<T>, {}> {
  render() {
    return <td>{ this.props.cell.getData() }</td>;
  }
}
