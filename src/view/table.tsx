import React from "react";
import Row from "../row";
import {TR} from "./tr";
import Tabular from "../tabular";
import Config from "../config";
import Storage from "../storage/storage";
import Cell from "../cell";

interface TableProps {
  config: Config
}

interface TableState {
  tabular?: Tabular
}

export class Table extends React.Component<TableProps, TableState> {
  private readonly config: Config;
  private storage: Storage;

  constructor(props) {
    super(props);

    this.state = {};
    this.config = this.props.config;
    this.storage = this.config.storage;
  }

  // TODO: this method should not be here
  private castDataToTabular(data: any[][]): Tabular {
    const tabular = new Tabular();

    const newData = data.map(row => new Row(row.map(cell => new Cell(cell))));
    tabular.setRows(newData);

    return tabular;
  }

  async componentDidMount() {
    this.setState({
      tabular: this.castDataToTabular(await this.storage.get())
    })
  }

  render() {
    return <table>
      { this.state.tabular && Array.from(this.state.tabular).map((row: Row) => {
        return <TR key={row.id} row={row}></TR>
      }) }
    </table>;
  }
}
