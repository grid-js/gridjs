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

  it('should return a single cell', () => {
    const cell1 = new Cell(24);
    const cell2 = new Cell(42);
    const row = new Row();
    row.cells.push(cell1);
    row.cells.push(cell2);

    expect(row.cell(0).data).toBe(24);
    expect(row.cell(1).data).toBe(42);
  });

  it('should return a list of cells', () => {
    const cell1 = new Cell(24);
    const cell2 = new Cell(42);
    const row = new Row();
    row.cells.push(cell1);
    row.cells.push(cell2);

    expect(row.cells).toHaveLength(2);
    expect(row.cells.map((x) => x.data)).toContain(24);
    expect(row.cells.map((x) => x.data)).toContain(42);
  });
});
