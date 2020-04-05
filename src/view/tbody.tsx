import React from "react";
import Row from "../row";
import {TR} from "./tr";
import Tabular from "../tabular";
import {BaseComponent} from "./base";

interface TBodyProps {
  tabular: Tabular
}

interface TBodyState {
  tabular?: Tabular
}

export class TBody extends BaseComponent<TBodyProps, TBodyState> {
  constructor(props) {
    super(props);

    this.state = {
      tabular: this.props.tabular
    };
  }

  render() {
    return <tbody>
      { this.state.tabular && this.state.tabular.rows.map((row: Row) => {
        return <TR key={row.id} row={row} />
      }) }
    </tbody>;
  }
}
