import Row from '../src/row';
import Cell from "../src/cell";

describe( 'Row class', () => {
  it('should init with value', () => {
    let cell1 = new Cell(1);
    let cell2 = new Cell(2);
    let row = new Row([cell1, cell2]);

    expect(row).toHaveLength(2);
  });

  it('should accept iterable', () => {
    let cell1 = new Cell(1);
    let cell2 = new Cell(2);
    let row = new Row(new Set([cell1, cell2, cell2]));

    expect(row).toHaveLength(2);
  });
});
