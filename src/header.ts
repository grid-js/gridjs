import { OneDArray, TColumn } from './types';
import Base from './base';
import { isArrayOfType } from './util/type';

class Header extends Base {
  private readonly _columns: OneDArray<TColumn>;

  constructor(columns: OneDArray<TColumn> | OneDArray<string>) {
    super();

    // if an array of strings is provided
    if (isArrayOfType<string>(columns, 'toLowerCase')) {
      // array of strings is provided, let's cast it to Header
      this._columns = Header.fromArrayOfString(
        columns as OneDArray<string>,
      ).columns;
    } else {
      this._columns = columns as OneDArray<TColumn>;
    }
  }

  get columns(): OneDArray<TColumn> {
    return this._columns;
  }

  static fromArrayOfString(data: OneDArray<string>): Header {
    return new Header(
      data.map(name => {
        return {
          name: name,
        };
      }),
    );
  }
}

export default Header;
