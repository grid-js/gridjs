import { h } from "preact";
import Row from "../row";
import {TR} from "./tr";
import {BaseComponent} from "./base";
import Header from "../header";
import {TH} from "./th";

interface THeadProps {
  header: Header
}

export class THead extends BaseComponent<THeadProps, {}> {
  render() {
    if (this.props.header) {
      return <thead>
      { this.props.header && this.props.header.rows.map((row: Row) => {
        return <TR key={row.id} row={row} children={TH} />
      }) }
      </thead>
    }
    return null;
  }
}
