import { h } from 'preact';
import Row from '../row';
import { TR } from './tr';
import {BaseComponent, BaseProps} from './base';
import Header from '../header';
import { TH } from './th';
import className from "../util/className";
import Config from "../config";

import "../theme/mermaid/thead.scss";

interface THeadProps extends BaseProps {
  header: Header;
}

export class THead extends BaseComponent<THeadProps, {}> {
  render() {
    if (this.props.header) {
      return (
        <thead className={className(Config.current.classNamePrefix, "thead")}>
          {this.props.header &&
            this.props.header.rows.map((row: Row) => {
              return <TR key={row.id} row={row} children={TH} />;
            })}
        </thead>
      );
    }
    return null;
  }
}
