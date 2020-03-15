import Cell from "./cell";


class Row<T> implements Iterable<Cell<T>> {
  private cells: Iterable<Cell<T>>;

  constructor(cells: Iterable<Cell<T>>) {
    this.cells = cells;
  }

  *[Symbol.iterator](): Iterator<Cell<T>> {
    for (let cell of this.cells) {
      yield cell;
    }
  }

  get length(): number {
    return Array.from(this.cells).length;
  }
}

export default Row;
