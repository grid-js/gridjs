import { h } from 'preact';

import Row from '../../row';
import { TR } from './tr';
import Tabular from '../../tabular';
import { BaseComponent, BaseProps } from '../base';
import { classJoin, className } from '../../util/className';
import { Status } from '../../types';
import Header from '../../header';
import { MessageRow } from './messageRow';

interface TBodyProps extends BaseProps {
  data: Tabular;
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
      <tbody
        className={classJoin(className('tbody'), this.config.className.tbody)}
      >
        {this.props.data &&
          this.props.data.rows.map((row: Row) => {
            return <TR key={row.id} row={row} header={this.props.header} />;
          })}

        {this.props.status === Status.Loading &&
          (!this.props.data || this.props.data.length === 0) && (
            <MessageRow
              message={this._('loading')}
              colSpan={this.headerLength()}
              className={classJoin(
                className('loading'),
                this.config.className.loading,
              )}
            />
          )}

        {this.props.status === Status.Rendered &&
          this.props.data &&
          this.props.data.length === 0 && (
            <MessageRow
              message={this._('noRecordsFound')}
              colSpan={this.headerLength()}
              className={classJoin(
                className('notfound'),
                this.config.className.notfound,
              )}
            />
          )}

        {this.props.status === Status.Error && (
          <MessageRow
            message={this._('error')}
            colSpan={this.headerLength()}
            className={classJoin(
              className('error'),
              this.config.className.error,
            )}
          />
        )}
      </tbody>
    );
  }
}
