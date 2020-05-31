import { h } from 'preact';

import Row from '../../row';
import { TR } from './tr';
import Tabular from '../../tabular';
import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import { Status, TCell } from '../../types';
import Header from '../../header';
import { MessageRow } from './messageRow';

interface TBodyProps extends BaseProps {
  data: Tabular<TCell>;
  status: Status;
  header?: Header;
}

export class TBody extends BaseComponent<TBodyProps, {}> {
  private headerLength(): number {
    if (this.props.header) {
      return this.props.header.columns.length;
    }
    return 0;
  }

  render() {
    return (
      <tbody className={className('tbody')}>
        {this.props.data &&
          this.props.data.rows.map((row: Row<TCell>) => {
            return <TR key={row.id} row={row} />;
          })}

        {this.props.status === Status.Loading && (
          <MessageRow
            message="Loading..."
            colSpan={this.headerLength()}
            className={className('loading')}
          />
        )}

        {this.props.status === Status.Loaded &&
          this.props.data.length === 0 && (
            <MessageRow
              message="No matching records found"
              colSpan={this.headerLength()}
              className={className('notfound')}
            />
          )}
      </tbody>
    );
  }
}
