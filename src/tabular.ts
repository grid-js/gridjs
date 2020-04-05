import Base from './base';
import Row from './row';
import Cell from './cell';

class Tabular extends Base {
  private _rows: Row[];

  constructor(rows?: Row[]) {
    super();

    this.rows = rows || [];
  }

  get rows(): Row[] {
    return this._rows;
  }

  set rows(rows: Row[]) {
    this._rows = rows;
  }

  get length(): number {
    return this.rows.length;
  }

  static fromRows(rows: Row[]): Tabular {
    return new Tabular(rows.map(row => Row.fromCells(row.cells)));
  }

  static fromArray(data: any[][]): Tabular {
    return new Tabular(
      data.map(row => new Row(row.map(cell => new Cell(cell)))),
    );
  }
}

export default Tabular;
