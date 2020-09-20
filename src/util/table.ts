import { TColumn } from '../types';
import Header from '../header';

export function calculateRowColSpans(
  column: TColumn,
  rowIndex: number,
  totalRows: number,
): { rowSpan: number; colSpan: number } {
  const depth = Header.maximumDepth(column);
  const remainingRows = totalRows - rowIndex;
  const rowSpan = Math.floor(remainingRows - depth - depth / remainingRows);
  const colSpan = (column.columns && column.columns.length) || 1;

  return {
    rowSpan: rowSpan,
    colSpan: colSpan,
  };
}
