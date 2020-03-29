import React from "react";
import Tabular from "../tabular";
import Config from "../config";
import Storage from "../storage/storage";
import {TBody} from "./tbody";

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

  async componentDidMount() {
    this.setState({
      tabular: Tabular.fromArray(await this.storage.get())
    })
  }

  render() {
    return <table>
      { this.state.tabular && <TBody tabular={this.state.tabular} /> }
    </table>;
  }
}
