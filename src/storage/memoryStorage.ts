import Row from "../row";
import Storage from "./storage";

class MemoryStorage<T> extends Storage<T> {
  private rows: Iterable<Row<T>>;

  public get(): Iterable<Row<T>> {
    return this.rows;
  }

  public set(rows: Iterable<Row<T>>): void {
    this.rows = rows;
  }

  public get length(): number {
    return Array.from(this.rows).length;
  }
}

export default MemoryStorage;
