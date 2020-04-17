import Tabular from '../tabular';
import { TBodyCell } from '../types';

export default function(
  keyword: string,
  tabular: Tabular<TBodyCell>,
): Tabular<TBodyCell> {
  return new Tabular(
    tabular.rows.filter(row =>
      row.cells.some(cell =>
        new RegExp(String(keyword), 'gi').test(String(cell.data)),
      ),
    ),
  );
}
