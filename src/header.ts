import { OneDArray, TColumn } from './types';
import Base from './base';
import { isArrayOfType } from './util/type';
import { UserConfig } from './config';

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

  adjustWidth(autoWidth?: boolean): void {
    for (const column of this.columns) {
      if (!column.width && autoWidth) {
        // FIXME: we should calculate the width based on the body cell content
        column.width = `${Math.round(100 / this.columns.length)}%`;
      }
    }
  }

  static fromUserConfig(userConfig: UserConfig): Header | null {
    // because we should be able to render a table without the header
    if (!userConfig.columns) {
      return null;
    }

    const header = new Header();

    // if an array of strings is provided
    if (isArrayOfType<string>(userConfig.columns, 'toLowerCase')) {
      // array of strings is provided, let's cast it to Header
      header.columns = Header.fromArrayOfString(
        userConfig.columns as OneDArray<string>,
      ).columns;
    } else {
      header.columns = userConfig.columns as OneDArray<TColumn>;
    }

    header.adjustWidth(userConfig.autoWidth);

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
}

export default Header;
