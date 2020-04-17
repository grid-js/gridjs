import Cell from '../../src/cell';
import Tabular from '../../src/tabular';
import Row from '../../src/row';
import search from '../../src/operator/search';
import { TBodyCell } from '../../src/types';

describe('search', () => {
  const row1 = new Row([new Cell('hello'), new Cell('world'), new Cell('!')]);
  const row2 = new Row([new Cell('foo'), new Cell('boo'), new Cell('bar')]);
  const row3 = new Row([new Cell('hello'), new Cell('test'), new Cell('!!!')]);
  const tabular: Tabular<TBodyCell> = new Tabular([row1, row2, row3]);

  it('should work with exact match', () => {
    expect(search('hello', tabular).rows).toStrictEqual(
      new Tabular([row1, row3]).rows,
    );
  });

  it('should return results with partial keyword', () => {
    expect(search('h', tabular).rows).toStrictEqual(
      new Tabular([row1, row3]).rows,
    );
  });

  it('should return results with exact match', () => {
    expect(search('!!!', tabular).rows).toStrictEqual(new Tabular([row3]).rows);
  });
});
