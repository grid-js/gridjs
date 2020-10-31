import Tabular from '../src/tabular';
import Row from '../src/row';
import Cell from '../src/cell';

describe('Tabular class', () => {
  it('should init with rows', () => {
    const rows = [new Row([new Cell(1), new Cell(2), new Cell(3)])];

    const tabular = new Tabular(rows);

    expect(tabular.rows).toStrictEqual(rows);
  });

  it('should set and get rows', () => {
    const row1 = new Row([new Cell(1), new Cell(2), new Cell(3)]);

    const row2 = new Row([new Cell(1), new Cell(2), new Cell(3)]);

    const tabular = new Tabular([row1]);
    tabular.rows = [row2];

    expect(tabular.rows).toStrictEqual([row2]);
  });

  it('should push row', () => {
    const row1 = new Row([new Cell(1), new Cell(2), new Cell(3)]);

    const row2 = new Row([new Cell(1), new Cell(2), new Cell(3)]);

    const tabular = new Tabular([row1]);
    tabular.rows.push(row2);

    expect(tabular.rows).toStrictEqual([row1, row2]);
  });

  it('should convert more than one row to array', () => {
    const row1 = new Row([new Cell(1), new Cell(2), new Cell(3)]);
    const row2 = new Row([new Cell(4), new Cell(5), new Cell(6)]);
    const row3 = new Row([new Cell(6), new Cell(7), new Cell(8)]);

    const tabular = new Tabular([row1, row2, row3]);

    expect(tabular.toArray()).toStrictEqual([
      [1, 2, 3],
      [4, 5, 6],
      [6, 7, 8],
    ]);
  });

  it('should convert one row or empty to array', () => {
    const row1 = new Row([new Cell(1), new Cell(2), new Cell(3)]);
    const tabular = new Tabular([row1]);
    expect(tabular.toArray()).toStrictEqual([[1, 2, 3]]);

    expect(new Tabular([new Row([])]).toArray()).toStrictEqual([[]]);
  });
});
