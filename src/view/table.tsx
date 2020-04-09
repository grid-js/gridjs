import React from "react";
import Tabular from "../tabular";
import {TBody} from "./tbody";

interface TableProps {
  tabular?: Tabular
}

export class Table extends React.Component<TableProps, {}> {
  render() {
    return <table>
      <TBody tabular={this.props.tabular} />
    </table>;
  }
}
