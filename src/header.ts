import { OneDArray, TCell, TColumn } from './types';
import Base from './base';
import { isArrayOfType } from './util/type';
import { UserConfig } from './config';
import Tabular from './tabular';
import { calculateWidth, getWidth, px } from './util/width';

class Header extends Base {
  private _columns: OneDArray<TColumn>;

  constructor() {
    super();

    this._columns = [];
  }

  get columns(): OneDArray<TColumn> {
    return this._columns;
  }

  set columns(columns) {
    this._columns = columns;
  }

  /**
   * Tries to automatically adjust the width of columns based on:
   *    - Header cell content
   *    - Cell content of the first row
   *    - Cell content of the last row
   * @param autoWidth
   * @param container
   * @param data
   */
  adjustWidth(
    container: Element,
    data: Tabular<TCell>,
    autoWidth = true,
  ): this {
    if (!container) {
      // we can't calculate the width because the container
      // is unknown at this stage
      return this;
    }

    // pixels
    const containerWidth = container.clientWidth;

    for (const column of this.columns) {
      if (!column.width && autoWidth) {
        const i = this.columns.indexOf(column);
        let elements = [column.name];

        // adding the first and last item of the data
        if (data.length) {
          elements = elements.concat(
            data.rows
              .slice(0, 10)
              .filter(x => x)
              .map(row => String(row.cells[i].data)),
          );
        }

        // calculates the width for header cell, first row cell content and last row cell content
        column.width = px(calculateWidth(elements));
      } else {
        column.width = px(getWidth(column.width, containerWidth));
      }
    }

    return this;
  }

  private setSort(sort = false): void {
    if (!sort) return;

    for (const column of this.columns) {
      column.sort = true;
    }
  }

  static fromUserConfig(userConfig: UserConfig): Header | null {
    // because we should be able to render a table without the header
    if (!userConfig.columns && !userConfig.from) {
      return null;
    }

    const header = new Header();

    // if an array of strings is provided
    if (isArrayOfType<string>(userConfig.columns, 'toLowerCase')) {
      // array of strings is provided, let's cast it to Header
      header.columns = Header.fromArrayOfString(
        userConfig.columns as OneDArray<string>,
      ).columns;
    } else if (userConfig.from) {
      header.columns = Header.fromHTMLTable(userConfig.from).columns;
    } else {
      header.columns = userConfig.columns as OneDArray<TColumn>;
    }

    header.setSort(userConfig.sort);

    return header;
  }

  static fromArrayOfString(data: OneDArray<string>): Header {
    const header = new Header();

    for (const name of data) {
      header.columns.push({
        name: name,
      });
    }

    return header;
  }

  static fromHTMLTable(element: HTMLElement): Header {
    const header = new Header();
    const thead = element.querySelector('thead');
    const ths = thead.querySelectorAll('th');

    for (const th of ths as any) {
      header.columns.push({
        name: th.innerText,
        width: th.width,
      });
    }

    return header;
  }
}

export default Header;
