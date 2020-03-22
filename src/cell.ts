import Base from "./base";


class Cell<T> extends Base {
  private data: T;

  constructor(data: T) {
    super();

    this.setData(data);
  }

  public getData(): T {
    return this.data;
  }

  public setData(data: T): void {
    this.data = data;
  }
}

export default Cell;
