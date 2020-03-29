import Tabular from '../src/tabular';
import Row from "../src/row";
import Cell from "../src/cell";

describe( 'Tabular class', () => {
  it('should init with rows', () => {
    const rows = [
      new Row([
        new Cell(1), new Cell(2), new Cell(3)
      ])
    ];

    const tabular = new Tabular(rows);

    expect(tabular.rows).toStrictEqual(rows);
  });

  it('should set and get rows', () => {
    const row1 = new Row([
      new Cell(1), new Cell(2), new Cell(3)
    ]);

    const row2 = new Row([
      new Cell(1), new Cell(2), new Cell(3)
    ]);

    const tabular = new Tabular([row1]);
    tabular.rows = [row2];

    expect(tabular.rows).toStrictEqual([row2]);
  });

  it('should push row', () => {
    const row1 = new Row([
      new Cell(1), new Cell(2), new Cell(3)
    ]);

    const row2 = new Row([
      new Cell(1), new Cell(2), new Cell(3)
    ]);

    const tabular = new Tabular([row1]);
    tabular.rows.push(row2);

    expect(tabular.rows).toStrictEqual([row1, row2]);
  });
});
