import { h, ComponentChild, JSX } from 'preact';

import Cell from '../../cell';
import { classJoin, className } from '../../util/className';
import { CSSDeclaration, TColumn } from '../../types';
import Row from '../../row';
import { JSXInternal } from 'preact/src/jsx';
import { PluginRenderer } from '../../plugin';
import { useConfig } from '../../hooks/useConfig';

export function TD(
  props: {
    cell: Cell;
    row?: Row;
    column?: TColumn;
    style?: CSSDeclaration;
    messageCell?: boolean;
  } & Omit<JSX.HTMLAttributes<HTMLTableCellElement>, 'style'>,
) {
  const config = useConfig();

  const content = (): ComponentChild => {
    if (props.column && typeof props.column.formatter === 'function') {
      return props.column.formatter(props.cell.data, props.row, props.column);
    }

    if (props.column && props.column.plugin) {
      return (
        <PluginRenderer
          pluginId={props.column.id}
          props={{
            column: props.column,
            cell: props.cell,
            row: props.row,
          }}
        />
      );
    }

    return props.cell.data;
  };

  const handleClick = (
    e: JSX.TargetedMouseEvent<HTMLTableCellElement>,
  ): void => {
    if (props.messageCell) return;

    config.eventEmitter.emit(
      'cellClick',
      e,
      props.cell,
      props.column,
      props.row,
    );
  };

  const getCustomAttributes = (
    column: TColumn | null,
  ): JSXInternal.HTMLAttributes<HTMLTableCellElement> => {
    if (!column) return {};

    if (typeof column.attributes === 'function') {
      return column.attributes(props.cell.data, props.row, props.column);
    } else {
      return column.attributes;
    }
  };

  return (
    <td
      role={props.role}
      colSpan={props.colSpan}
      data-column-id={props.column && props.column.id}
      className={classJoin(
        className('td'),
        props.className,
        config.className.td,
      )}
      style={{
        ...props.style,
        ...config.style.td,
      }}
      onClick={handleClick}
      {...getCustomAttributes(props.column)}
    >
      {content()}
    </td>
  );
}
