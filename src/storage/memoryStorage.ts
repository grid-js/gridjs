import Row from "../row";
import Storage from "./storage";

class MemoryStorage<T> extends Storage<T> {
  private rows: Row<T>[];

  public getRows(): Row<T>[] {
    return this.rows;
  }

  public setRows(rows: Row<T>[]) {
    this.rows = rows;
  }
}

export default MemoryStorage;
