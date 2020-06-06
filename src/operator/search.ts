import Tabular from '../tabular';
import { TCell } from '../types';

export default function (
  keyword: string,
  tabular: Tabular<TCell>,
): Tabular<TCell> {
  return new Tabular(
    tabular.rows.filter((row) =>
      row.cells.some((cell) =>
        new RegExp(String(keyword), 'gi').test(String(cell.data)),
      ),
    ),
  );
}
