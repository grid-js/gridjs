import Cell from "./cell";
import Base from "./base";


class Row extends Base implements Iterable<Cell> {
  private cells: Cell[];

  constructor(cells?: Cell[]) {
    super();

    this.setCells(cells || []);
  }

  public setCells(cells: Cell[]): void {
    this.cells = cells;
  }

  public pushCell(cell: Cell): void {
    this.cells.push(cell);
  }

  *[Symbol.iterator](): Iterator<Cell> {
    for (const cell of this.cells) {
      yield cell;
    }
  }

  get length(): number {
    return this.cells.length;
  }
}

export default Row;
