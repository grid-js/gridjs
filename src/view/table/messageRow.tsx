import { h } from 'preact';
import Cell from '../../cell';
import { classJoin, className } from '../../util/className';
import { TR } from './tr';
import { TD } from './td';

export function MessageRow(props: {
  message: string;
  colSpan?: number;
  className?: string;
}) {
  return (
    <TR messageRow={true}>
      <TD
        role="alert"
        colSpan={props.colSpan}
        messageCell={true}
        cell={new Cell(props.message)}
        className={classJoin(
          className('message'),
          props.className ? props.className : null,
        )}
      />
    </TR>
  );
}
