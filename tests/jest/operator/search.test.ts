import Cell from '../../../src/cell';
import Tabular from '../../../src/tabular';
import Row from '../../../src/row';
import search from '../../../src/operator/search';

describe('search', () => {
  const column1 = { id: 'col1', name: 'col1' };
  const column2 = { id: 'col2', name: 'col2' };
  const column3 = { id: 'col3', name: 'col3' };
  const column4 = { id: 'col4', name: 'col4', hidden: true };
  const columns = [column1, column2, column3, column4];
  const row1 = new Row([
    new Cell('hello'),
    new Cell('world'),
    new Cell('!'),
    new Cell('hidden content'),
  ]);
  const row2 = new Row([
    new Cell('foo'),
    new Cell('boo'),
    new Cell('bar'),
    new Cell('hidden content'),
  ]);
  const row3 = new Row([
    new Cell('hello'),
    new Cell('test'),
    new Cell('!!!'),
    new Cell('hidden content'),
  ]);
  const row4 = new Row([
    new Cell(null),
    new Cell('xkcd'),
    new Cell('???'),
    new Cell('hidden content'),
  ]);
  const row5 = new Row([
    new Cell('foo'),
    new Cell('ping pong ping'),
    new Cell('bar'),
  ]);
  const tabular: Tabular = new Tabular([row1, row2, row3, row4, row5]);

  it('should work with exact match', () => {
    expect(search('hello', columns, true, tabular).rows).toStrictEqual(
      new Tabular([row1, row3]).rows,
    );
  });

  it('should return results with partial keyword', () => {
    expect(search('h', columns, true, tabular).rows).toStrictEqual(
      new Tabular([row1, row3]).rows,
    );
  });

  it('should return results with exact match', () => {
    expect(search('!!!', columns, true, tabular).rows).toStrictEqual(
      new Tabular([row3]).rows,
    );
  });

  it('should return results for a keyword with a space in', () => {
    expect(search('ping pong', columns, true, tabular).rows).toStrictEqual(
      new Tabular([row5]).rows,
    );
  });

  it('should return results for words with the letter s in', () => {
    expect(search('test', columns, true, tabular).rows).toStrictEqual(
      new Tabular([row3]).rows,
    );
  });

  it('should use the selector with hardcoded string', () => {
    expect(
      search('test', columns, true, tabular, () => 'custom keyword').rows,
    ).toStrictEqual(new Tabular([]).rows);
  });

  it('should use the selector with dynamic string', () => {
    expect(
      search(
        '00',
        columns,
        true,
        tabular,
        (_, rowIndex, cellIndex) => `${rowIndex}${cellIndex}`,
      ).rows,
    ).toStrictEqual(new Tabular([row1]).rows);
  });

  it('should ignore content of hidden columns', () => {
    expect(search('hidden', columns, true, tabular).rows).toStrictEqual(
      new Tabular([]).rows,
    );
  });

  it('should not ignore content of hidden columns if ignoreHiddenColumns option is set to false', () => {
    expect(search('hidden', columns, false, tabular).rows).toStrictEqual(
      new Tabular([row1, row2, row3, row4]).rows,
    );
  });
});
