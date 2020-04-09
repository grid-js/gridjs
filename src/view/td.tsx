import { h } from "preact";
import Cell from "../cell";
import {BaseComponent} from "./base";

export interface TDProps {
  cell: Cell
}

export class TD extends BaseComponent<TDProps, {}> {
  render() {
    return <td>{ this.props.cell.data }</td>;
  }
}
