import React from "react";
import Row from "../row";
import {TR} from "./tr";

export interface TableProps<T> {
  rows: Iterable<Row<T>>
}

export class Table<T> extends React.Component<TableProps<T>, {}> {
  render() {
    return <table>
      { Array.from(this.props.rows).map((row: Row<T>) => {
        return <TR key={row.id} row={row}></TR>
      }) }
    </table>;
  }
}
