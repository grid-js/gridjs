import { h } from "preact";
import Tabular from "../tabular";
import {TBody} from "./tbody";
import {BaseComponent} from "./base";

interface TableProps {
  tabular?: Tabular
}

export class Table extends BaseComponent<TableProps, {}> {
  render() {
    return <table>
      <TBody tabular={this.props.tabular} />
    </table>;
  }
}
