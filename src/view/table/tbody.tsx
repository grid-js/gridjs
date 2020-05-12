import { h } from 'preact';

import Row from '../../row';
import { TR } from './tr';
import Tabular from '../../tabular';
import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import { TCell } from '../../types';

interface TBodyProps extends BaseProps {
  data: Tabular<TCell>;
}

export class TBody extends BaseComponent<TBodyProps, {}> {
  render() {
    return (
      <tbody className={className('tbody')}>
        {this.props.data &&
          this.props.data.rows.map((row: Row<TCell>) => {
            return <TR key={row.id} row={row} />;
          })}
      </tbody>
    );
  }
}
