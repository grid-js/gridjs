import { h } from 'preact';

import Row from '../../row';
import { TR } from './tr';
import Tabular from '../../tabular';
import { BaseComponent, BaseProps } from '../base';
import { TD } from './td';
import className from '../../util/className';
import Config from '../../config';
import { TBodyCell } from '../../types';

import '../../theme/mermaid/tbody.scss';

interface TBodyProps extends BaseProps {
  data: Tabular<TBodyCell>;
}

export class TBody extends BaseComponent<TBodyProps, {}> {
  render() {
    return (
      <tbody className={className(Config.current.classNamePrefix, 'tbody')}>
        {this.props.data &&
          this.props.data.rows.map((row: Row<TBodyCell>) => {
            return <TR key={row.id} row={row} children={TD} />;
          })}
      </tbody>
    );
  }
}
