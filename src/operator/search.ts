import Tabular from "../tabular";


export default function (keyword: string, tabular: Tabular): Tabular {
  return new Tabular(tabular.rows.filter((row) =>
    row.cells.some(((cell) =>
      new RegExp(String(keyword), 'gi').test(String(cell.data))))));
}
