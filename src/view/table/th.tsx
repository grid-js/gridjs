import { h, ComponentChild, JSX } from 'preact';

import { classJoin, className } from '../../util/className';
import { CSSDeclaration, TColumn } from '../../types';
import { GenericSortConfig, Sort } from '../plugin/sort/sort';
import { PluginRenderer } from '../../plugin';
import { Resize } from '../plugin/resize/resize';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useConfig } from '../../hooks/useConfig';
import * as SortActions from '../plugin/sort/actions';
import { useStore } from '../../hooks/useStore';

export function TH(
  props: {
    index: number;
    column: TColumn;
    style?: CSSDeclaration;
  } & Omit<JSX.HTMLAttributes<HTMLTableCellElement>, 'style'>,
) {
  const config = useConfig();
  const thRef = useRef(null);
  const [style, setStyle] = useState({});
  const { dispatch } = useStore();

  useEffect(() => {
    // sets the `top` style if the current TH is fixed
    if (config.fixedHeader && thRef.current) {
      const offsetTop = thRef.current.offsetTop;

      if (typeof offsetTop === 'number') {
        setStyle({
          top: offsetTop,
        });
      }
    }
  }, [thRef]);

  const isSortable = (): boolean => props.column.sort != undefined;
  const isResizable = (): boolean => props.column.resizable;
  const onClick = (
    e:
      | JSX.TargetedMouseEvent<HTMLTableCellElement>
      | JSX.TargetedKeyboardEvent<HTMLTableCellElement>,
  ) => {
    e.stopPropagation();

    if (isSortable()) {
      const sortConfig = config.sort as GenericSortConfig;

      dispatch(
        SortActions.SortToggle(
          props.index,
          e.shiftKey === true && sortConfig.multiColumn,
          props.column.sort.compare,
        ),
      );
    }
  };

  const keyDown = (e: JSX.TargetedKeyboardEvent<HTMLTableCellElement>) => {
    // Enter key
    if (isSortable() && e.which === 13) {
      onClick(e);
    }
  };

  const content = (): ComponentChild => {
    if (props.column.name !== undefined) {
      return props.column.name;
    }

    if (props.column.plugin !== undefined) {
      return (
        <PluginRenderer
          pluginId={props.column.plugin.id}
          props={{
            column: props.column,
          }}
        />
      );
    }

    return null;
  };

  const getCustomAttributes = () => {
    const column = props.column;

    if (!column) return {};

    if (typeof column.attributes === 'function') {
      return column.attributes(null, null, props.column);
    } else {
      return column.attributes;
    }
  };

  return (
    <th
      ref={thRef}
      data-column-id={props.column && props.column.id}
      className={classJoin(
        className('th'),
        isSortable() ? className('th', 'sort') : null,
        config.fixedHeader ? className('th', 'fixed') : null,
        config.className.th,
      )}
      onClick={onClick}
      style={{
        ...config.style.th,
        ...{
          minWidth: props.column.minWidth,
          width: props.column.width,
        },
        ...style,
        ...props.style,
      }}
      onKeyDown={keyDown}
      rowSpan={props.rowSpan > 1 ? props.rowSpan : undefined}
      colSpan={props.colSpan > 1 ? props.colSpan : undefined}
      {...getCustomAttributes()}
      {...(isSortable() ? { tabIndex: 0 } : {})}
    >
      <div className={className('th', 'content')}>{content()}</div>
      {isSortable() && <Sort index={props.index} {...props.column.sort} />}
      {isResizable() &&
        props.index < config.header.visibleColumns.length - 1 && (
          <Resize column={props.column} thRef={thRef} />
        )}
    </th>
  );
}
