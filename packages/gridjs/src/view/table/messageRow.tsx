import { h } from 'preact';

import Cell from '../../cell';
import { BaseComponent, BaseProps } from '../base';
import { classJoin, className } from '../../util/className';
import { TR } from './tr';
import { TD } from './td';

export interface MessageRowProps extends BaseProps {
  message: string;
  colSpan?: number;
  className?: string;
}

export class MessageRow extends BaseComponent<MessageRowProps, {}> {
  render() {
    return (
      <TR messageRow={true}>
        <TD
          role="alert"
          colSpan={this.props.colSpan}
          messageCell={true}
          cell={new Cell(this.props.message)}
          className={classJoin(
            className('message'),
            this.props.className ? this.props.className : null,
          )}
        />
      </TR>
    );
  }
}
