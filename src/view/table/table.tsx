import { h } from 'preact';
import { TBody } from './tbody';
import { THead } from './thead';
import { classJoin, className } from '../../util/className';
import { useConfig } from '../../hooks/useConfig';
import { useEffect, useRef } from 'preact/hooks';
import * as actions from '../actions';
import { useStore } from '../../hooks/useStore';

export function Table() {
  const config = useConfig();
  const tableRef = useRef(null);
  const { dispatch } = useStore();

  useEffect(() => {
    if (tableRef) dispatch(actions.SetTableRef(tableRef));
  }, [tableRef]);

  return (
    <table
      ref={tableRef}
      role="grid"
      className={classJoin(className('table'), config.className.table)}
      style={{
        ...config.style.table,
        ...{
          height: config.height,
        },
      }}
    >
      <THead />
      <TBody />
    </table>
  );
}
