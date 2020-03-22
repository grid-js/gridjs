import Cell from "./cell";
import Base from "./base";


class Row<T> extends Base implements Iterable<Cell<T>> {
  private cells: Cell<T>[];

  constructor(cells?: Cell<T>[]) {
    super();

    this.setCells(cells || []);
  }

  public setCells(cells: Cell<T>[]): void {
    this.cells = cells;
  }

  public pushCell(cell: Cell<T>): void {
    this.cells.push(cell);
  }

  *[Symbol.iterator](): Iterator<Cell<T>> {
    for (const cell of this.cells) {
      yield cell;
    }
  }

  get length(): number {
    return this.cells.length;
  }
}

export default Row;
