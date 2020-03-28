import Base from "./base";
import Row from "./row";


class Tabular extends Base implements Iterable<Row> {
  private rows: Row[];

  constructor(rows?: Row[]) {
    super();

    this.setRows(rows || []);
  }

  public setRows(rows: Row[]): void {
    this.rows = rows;
  }

  public pushRow(row: Row): void {
    this.rows.push(row);
  }

  *[Symbol.iterator](): Iterator<Row> {
    for (const row of this.rows) {
      yield row;
    }
  }

  get length(): number {
    return this.rows.length;
  }
}

export default Tabular;
