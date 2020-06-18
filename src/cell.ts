import Base from './base';
import {TCell} from "./types";

class Cell extends Base {
  private _data: TCell;

  constructor(data: TCell) {
    super();

    this.data = data;
  }

  public get data(): TCell {
    return this._data;
  }

  public set data(data: TCell) {
    this._data = data;
  }
}

export default Cell;
