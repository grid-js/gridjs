import Row from "../row";
import Storage from "./storage";

class MemoryStorage<T> extends Storage<T> {
  private rows: Iterable<Row<T>> = [];

  public async get(): Promise<Iterable<Row<T>>> {
    return new Promise((resolve) => {
      resolve(this.rows);
    });
  }

  public async set(rows: Iterable<Row<T>>): Promise<boolean> {
    this.rows = rows;
    return new Promise(resolve => resolve(true));
  }

  public get length(): Promise<number> {
    return new Promise<number>(resolve =>
      resolve(Array.from(this.rows).length)
    );
  }
}

export default MemoryStorage;
