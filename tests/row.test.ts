import Row from '../src/row';
import Cell from '../src/cell';

describe('Row class', () => {
  it('should init with value', () => {
    const cell1 = new Cell(1);
    const cell2 = new Cell(2);
    const row = new Row([cell1, cell2]);

    expect(row).toHaveLength(2);
  });

  it('should accept empty constructor', () => {
    const cell1 = new Cell(1);
    const cell2 = new Cell(2);
    const row = new Row();
    row.cells.push(cell1);
    row.cells.push(cell2);

    expect(row).toHaveLength(2);
  });

  it('should have EventEmitter', () => {
    const cell1 = new Cell(1);
    const cell2 = new Cell(2);
    const row = new Row([cell1, cell2]);
    const args = [1, 2, 3, true];

    const callback = jest.fn();
    row.on("boo", callback);
    row.emit("boo", ...args);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(...args);
  });
});
