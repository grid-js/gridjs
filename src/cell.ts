import Base from "./base";
import {TCell} from "./types";


class Cell extends Base {
  private data: TCell;

  constructor(data: TCell) {
    super();

    this.setData(data);
  }

  public getData(): TCell {
    return this.data;
  }

  public setData(data: TCell): void {
    this.data = data;
  }
}

export default Cell;
