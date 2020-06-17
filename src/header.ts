import { OneDArray, TCell, TColumn } from './types';
import Base from './base';
import { UserConfig } from './config';
import Tabular from './tabular';
import { width, px, getWidth } from './util/width';
import { ShadowTable } from './view/table/shadow';
import { createRef, h, RefObject, render } from 'preact';

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
   *
   * @param container
   * @param tempRef
   * @param data
   * @param autoWidth
   */
  adjustWidth(
    container: Element,
    tempRef: RefObject<HTMLDivElement>,
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

    // let's create a shadow table with the first 10 rows of the data
    // and let the browser to render the table with table-layout: auto
    // no padding, margin or border to get the minimum space required
    // to render columns. One the table is rendered and widths are known,
    // we unmount the shadow table from the DOM and set the correct width
    const shadowTable = createRef();
    if (data && data.length && autoWidth) {
      // render a ShadowTable with the first 10 rows
      const el = h(ShadowTable, {
        data: Tabular.fromRows(data.rows.slice(0, 10)),
        header: this,
      });
      el.ref = shadowTable;

      // TODO: we should NOT query the container here. use Refs instead
      render(el, tempRef.current);
    }

    for (const column of this.columns) {
      if (!column.width && autoWidth) {
        // tries to find the corresponding cell
        // from the ShadowTable and set the correct width
        column.width = px(
          getWidth(shadowTable.current.base, this.columns.indexOf(column)),
        );
      } else {
        column.width = px(width(column.width, containerWidth));
      }
    }

    if (data && data.length && autoWidth) {
      // unmount the shadow table from temp
      render(null, tempRef.current);
    }

    return this;
  }

  private setSort(userConfig: UserConfig): void {
    for (const column of this.columns) {
      // implicit userConfig.sort flag
      if (column.sort === undefined && userConfig.sort) {
        column.sort = {
          enabled: true,
        };
      }

      // false, null, etc.
      if (!column.sort) {
        column.sort = {
          enabled: false,
        };
      } else if (typeof column.sort === 'object') {
        column.sort = {
          enabled: true,
          ...column.sort,
        };
      }
    }
  }

  static fromUserConfig(userConfig: UserConfig): Header | null {
    // because we should be able to render a table without the header
    if (!userConfig.columns && !userConfig.from) {
      return null;
    }

    const header = new Header();

    if (userConfig.from) {
      header.columns = Header.fromHTMLTable(userConfig.from).columns;
    } else {
      header.columns = [];

      for (const column of userConfig.columns) {
        if (typeof column === 'string') {
          header.columns.push({
            name: column,
          });
        } else if (typeof column === 'object') {
          header.columns.push(column as TColumn);
        }
      }
    }

    header.setSort(userConfig);

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
