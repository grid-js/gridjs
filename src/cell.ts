import Base from './base';
import { TCell } from './types';
import { html } from './util/html';
import { ComponentChild } from 'preact';

class Cell extends Base {
  // because a Cell is a subset of TCell type
  public data: number | string | boolean | ComponentChild;

  constructor(data: TCell) {
    super();

    this.setData(data);
  }

  private cast(data: TCell): number | string | boolean | ComponentChild {
    if (data instanceof HTMLElement) {
      return html(data.outerHTML);
    }

    return data;
  }

  public setData(data: TCell): Cell {
    this.data = this.cast(data);
    return this;
  }
}

export default Cell;
