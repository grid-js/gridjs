import { h } from "preact";
import Cell from "../cell";
import {BaseComponent} from "./base";

export interface TDProps {
  cell: Cell
}

export class TH extends BaseComponent<TDProps, {}> {
  render() {
    return <th>{ this.props.cell.data }</th>;
  }
}
