import { h } from 'preact';

import Row from '../../row';
import { TR } from './tr';
import Tabular from '../../tabular';
import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import {Status, TCell} from '../../types';
import Cell from "../../cell";
import {TD} from "./td";

interface TBodyProps extends BaseProps {
  data: Tabular<TCell>;
  status: Status;
}

export class TBody extends BaseComponent<TBodyProps, {}> {
  render() {
    return (
      <tbody className={className('tbody')}>
        {this.props.data &&
          this.props.data.rows.map((row: Row<TCell>) => {
            return <TR key={row.id} row={row} />;
          })}

        {this.props.status === Status.Loading &&
          <TR>
            <TD colSpan={} cell={new Cell("Loading...")} />
          </TR>
        }

        {this.props.status === Status.Loaded && this.props.data.length === 0 &&
          <TR row={new Row([new Cell("No matching records found")])} />
        }
      </tbody>
    );
  }
}
