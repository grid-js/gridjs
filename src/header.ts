import Tabular from './tabular';
import { OneDArray, THeaderCell } from './types';
import Row from './row';
import Cell from './cell';

class Header extends Tabular<THeaderCell> {
  constructor(props) {
    super(props);
  }
  static fromArrayOfString(data: OneDArray<string>): Header {
    return new Header(
      new Row<THeaderCell>(
        data.map(
          cell =>
            new Cell<THeaderCell>({
              name: cell,
            }),
        ),
      ),
    );
  }
}

export default Header;
