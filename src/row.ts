import Cell from "./cell";
import Base from "./base";


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

  get length(): number {
    return this.cells.length;
  }
}

export default Row;
