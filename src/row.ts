import Cell from './cell';
import Base from './base';

class Row extends Base {
  private _cells: Cell[];

  constructor(cells?: Cell[]) {
    super();

    this.cells = cells || [];
  }

  public get cells(): Cell[] {
    return this._cells;
  }

  public set cells(cells: Cell[]) {
    this._cells = cells;
  }

  static fromCells(cells: Cell[]): Row {
    return new Row(cells.map(cell => new Cell(cell.data)));
  }

  get length(): number {
    return this.cells.length;
  }
}

export default Row;
