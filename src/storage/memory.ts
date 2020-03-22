import Row from "../row";
import Storage from "./storage";
import Config from "../config";
import Cell from "../cell";

class MemoryStorage<T> extends Storage<T> {
  private rows: Iterable<Row<T>> = [];

  public async load(config: Config): Promise<boolean> {
    this.set(this.convertData(config.get('data')));
    return true;
  }

  private convertData(data: T[][]): Iterable<Row<T>> {
    const arr = [];
    for (const row of data) {
      const thisRow = new Row<T>();
      for (const cell of row) {
        thisRow.pushCell(new Cell(cell))
      }

      arr.push(thisRow);
    }

    return arr;
  }

  public async get(): Promise<Iterable<Row<T>>> {
    return this.rows;
  }

  public async set(rows: Iterable<Row<T>>): Promise<boolean> {
    this.rows = rows;
    return true;
  }

  public get length(): Promise<number> {
    return new Promise<number>(resolve =>
      resolve(Array.from(this.rows).length)
    );
  }
}

export default MemoryStorage;
