import { h } from "preact";
import Row from "../row";
import {TR} from "./tr";
import Tabular from "../tabular";
import {BaseComponent} from "./base";

interface TBodyProps {
  tabular: Tabular
}

export class TBody extends BaseComponent<TBodyProps, {}> {
  render() {
    return <tbody>
      { this.props.tabular && this.props.tabular.rows.map((row: Row) => {
        return <TR key={row.id} row={row} />
      }) }
    </tbody>;
  }
}
