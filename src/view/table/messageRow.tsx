import { h } from 'preact';

import Cell from '../../cell';
import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
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
      <TR>
        <TD
          colSpan={this.props.colSpan}
          cell={new Cell(this.props.message)}
          className={`${className('message')}${
            this.props.className ? ' ' + this.props.className : ''
          }`}
        />
      </TR>
    );
  }
}
