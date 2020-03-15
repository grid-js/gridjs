import Row from '../src/row';
import Cell from "../src/cell";

describe( 'Row class', () => {
  it('should init with value', () => {
    const cell1 = new Cell(1);
    const cell2 = new Cell(2);
    const row = new Row([cell1, cell2]);

    expect(row).toHaveLength(2);
  });

  it('should accept iterable', () => {
    const cell1 = new Cell(1);
    const cell2 = new Cell(2);
    const row = new Row(new Set([cell1, cell2, cell2]));

    expect(row).toHaveLength(2);
  });
});
