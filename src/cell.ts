import Base from './base';

class Cell<T> extends Base {
  private _data: T;

  constructor(data: T) {
    super();

    this.data = data;
  }

  public get data(): T {
    return this._data;
  }

  public set data(data: T) {
    this._data = data;
  }
}

export default Cell;
