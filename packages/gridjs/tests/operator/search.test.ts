import Cell from '../../src/cell';
import Tabular from '../../src/tabular';
import Row from '../../src/row';
import search from '../../src/operator/search';

describe('search', () => {
  const row1 = new Row([new Cell('hello'), new Cell('world'), new Cell('!')]);
  const row2 = new Row([new Cell('foo'), new Cell('boo'), new Cell('bar')]);
  const row3 = new Row([new Cell('hello'), new Cell('test'), new Cell('!!!')]);
  const row4 = new Row([new Cell(null), new Cell('xkcd'), new Cell('???')]);
  const row5 = new Row([
    new Cell('foo'),
    new Cell('ping pong ping'),
    new Cell('bar'),
  ]);
  const tabular: Tabular = new Tabular([row1, row2, row3, row4, row5]);

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

  it('should return results for a keyword with a space in', () => {
    expect(search('ping pong', tabular).rows).toStrictEqual(
      new Tabular([row5]).rows,
    );
  });

  it('should return results for words with the letter s in', () => {
    expect(search('test', tabular).rows).toStrictEqual(
      new Tabular([row3]).rows,
    );
  });

  it('should use the selector with hardcoded string', () => {
    expect(search('test', tabular, () => 'custom keyword').rows).toStrictEqual(
      new Tabular([]).rows,
    );
  });

  it('should use the selector with dynamic string', () => {
    expect(
      search(
        '00',
        tabular,
        (_, rowIndex, cellIndex) => `${rowIndex}${cellIndex}`,
      ).rows,
    ).toStrictEqual(new Tabular([row1]).rows);
  });
});
