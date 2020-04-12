import Tabular from './tabular';
import { OneDArray } from './types';
import Row from './row';
import Cell from './cell';

class Header extends Tabular {
  static fromArray(data: OneDArray): Header {
    return new Tabular(new Row(data.map(cell => new Cell(cell))));
  }
}

export default Header;
