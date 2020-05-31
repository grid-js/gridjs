import { h } from 'preact';

import Row from '../../row';
import { TR } from './tr';
import Tabular from '../../tabular';
import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import { Status, TCell } from '../../types';
import Cell from '../../cell';
import { TD } from './td';
import Header from '../../header';

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
          <TR>
            <TD
              colSpan={this.headerLength()}
              cell={new Cell('Loading...')}
              className={`${className('message')} ${className('loading')}`}
            />
          </TR>
        )}

        {this.props.status === Status.Loaded && this.props.data.length === 0 && (
          <TR>
            <TD
              colSpan={this.headerLength()}
              cell={new Cell('No matching records found')}
              className={`${className('message')} ${className('notfound')}`}
            />
          </TR>
        )}
      </tbody>
    );
  }
}
