import Base from './base';
import Row from './row';
import Cell from './cell';
import { OneDArray, TCell, TwoDArray } from './types';
import { oneDtoTwoD } from './util/array';

class Tabular extends Base {
  private _rows: Row[];
  private _length: number;

  constructor(rows?: Row[] | Row) {
    super();

    if (rows instanceof Array) {
      this.rows = rows;
    } else if (rows instanceof Row) {
      this.rows = [rows];
    } else {
      this.rows = [];
    }
  }

  get rows(): Row[] {
    return this._rows;
  }

  set rows(rows: Row[]) {
    this._rows = rows;
  }

  get length(): number {
    return this._length || this.rows.length;
  }

  // we want to sent the length when storage is ServerStorage
  set length(len: number) {
    this._length = len;
  }

  public toArray(): TCell[][] {
    return this.rows.map((row) => row.toArray());
  }

  /**
   * Creates a new Tabular from an array of Row(s)
   * This method generates a new ID for the Tabular and all nested elements
   *
   * @param rows
   * @returns Tabular
   */
  static fromRows(rows: Row[]): Tabular {
    return new Tabular(rows.map((row) => Row.fromCells(row.cells)));
  }

  /**
   * Creates a new Tabular from a 2D array
   * This method generates a new ID for the Tabular and all nested elements
   *
   * @param data
   * @returns Tabular
   */
  static fromArray<T extends TCell>(
    data: OneDArray<T> | TwoDArray<T>,
  ): Tabular {
    data = oneDtoTwoD(data);

    return new Tabular(
      data.map((row) => new Row(row.map((cell) => new Cell(cell)))),
    );
  }
}

export default Tabular;
