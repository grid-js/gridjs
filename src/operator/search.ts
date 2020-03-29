import Tabular from "../tabular";


export default function (keyword: string, tabular: Tabular): Tabular {
  return Tabular.fromRows(tabular.rows.filter((row) =>
    row.cells.filter(((cell) =>
      new RegExp(String(keyword), 'gi').test(String(cell.data))))));
}
