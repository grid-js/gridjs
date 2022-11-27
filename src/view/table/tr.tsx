import { h, JSX, Fragment, ComponentChildren } from 'preact';

import Row from '../../row';
import Cell from '../../cell';
import { classJoin, className } from '../../util/className';
import { TColumn } from '../../types';
import { TD } from './td';
import Header from '../../header';
import { useConfig } from '../../hooks/useConfig';

export function TR(props: {
  row?: Row;
  header?: Header;
  messageRow?: boolean;
  children?: ComponentChildren;
}) {
  const config = useConfig();

  const getColumn = (cellIndex: number): TColumn => {
    if (props.header) {
      const cols = Header.leafColumns(props.header.columns);

      if (cols) {
        return cols[cellIndex];
      }
    }

    return null;
  };

  const handleClick = (
    e: JSX.TargetedMouseEvent<HTMLTableRowElement>,
  ): void => {
    if (props.messageRow) return;
    config.eventEmitter.emit('rowClick', e, props.row);
  };

  const getChildren = (): ComponentChildren => {
    if (props.children) {
      return props.children;
    } else {
      return (
        <Fragment>
          {props.row.cells.map((cell: Cell, i) => {
            const column = getColumn(i);

            if (column && column.hidden) return null;

            return (
              <TD key={cell.id} cell={cell} row={props.row} column={column} />
            );
          })}
        </Fragment>
      );
    }
  };

  return (
    <tr
      className={classJoin(className('tr'), config.className.tr)}
      onClick={handleClick}
    >
      {getChildren()}
    </tr>
  );
}
