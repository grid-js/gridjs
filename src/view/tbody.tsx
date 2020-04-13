import { h } from 'preact';
import Row from '../row';
import { TR } from './tr';
import Tabular from '../tabular';
import {BaseComponent, BaseProps} from './base';
import { TD } from './td';

interface TBodyProps extends BaseProps {
  data: Tabular;
}

export class TBody extends BaseComponent<TBodyProps, {}> {
  render() {
    return (
      <tbody>
        {this.props.data &&
          this.props.data.rows.map((row: Row) => {
            return <TR key={row.id} row={row} children={TD} />;
          })}
      </tbody>
    );
  }
}
