

class Cell<T> {
  private data: T;

  constructor(data: T) {
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
