import { TCell, TColumn } from '../../types';
import { JSX } from 'preact';
import Row from '../../row';

export interface TableEvents {
  cellClick: (
    e: JSX.TargetedMouseEvent<HTMLTableCellElement>,
    cell: TCell,
    column: TColumn,
    row: Row,
  ) => void;
  rowClick: (e: JSX.TargetedMouseEvent<HTMLTableRowElement>, row: Row) => void;
}
