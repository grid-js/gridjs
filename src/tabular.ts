import Base from './base';
import Row from './row';
import Cell from './cell';
import { OneDArray, TwoDArray } from './types';
import { oneDtoTwoD } from './util/cast';
import { StorageResponse } from './storage/storage';

class Tabular<T> extends Base {
  private _rows: Row<T>[];
  private _length: number;

  constructor(rows?: Row<T>[] | Row<T>) {
    super();

    if (rows instanceof Array) {
      this.rows = rows;
    } else if (rows instanceof Row) {
      this.rows = [rows];
    } else {
      this.rows = [];
    }
  }

  get rows(): Row<T>[] {
    return this._rows;
  }

  set rows(rows: Row<T>[]) {
    this._rows = rows;
  }

  get length(): number {
    return this._length || this.rows.length;
  }

  // we want to sent the length when storage is ServerStorage
  set length(len: number) {
    this._length = len;
  }

  /**
   * Creates a new Tabular from an array of Row(s)
   * This method generates a new ID for the Tabular and all nested elements
   *
   * @param rows
   * @returns Tabular
   */
  static fromRows<T>(rows: Row<T>[]): Tabular<T> {
    return new Tabular(rows.map((row) => Row.fromCells(row.cells)));
  }

  /**
   * Creates a new Tabular from a 2D array
   * This method generates a new ID for the Tabular and all nested elements
   *
   * @param data
   * @returns Tabular
   */
  static fromArray<T>(data: OneDArray<T> | TwoDArray<T>): Tabular<T> {
    data = oneDtoTwoD(data);

    return new Tabular(
      data.map((row) => new Row(row.map((cell) => new Cell(cell)))),
    );
  }

  static fromStorageResponse<T>(storageResponse: StorageResponse): Tabular<T> {
    const tabular = Tabular.fromArray(storageResponse.data);

    // for server-side storage
    tabular.length = storageResponse.total;

    return tabular;
  }
}

export default Tabular;
