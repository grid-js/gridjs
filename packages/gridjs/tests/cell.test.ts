import Cell from '../src/cell';

describe('Cell class', () => {
  it('should init with value', () => {
    const cell = new Cell('boo');
    expect(cell.data).toBe('boo');
  });

  it('set should update the data', () => {
    const cell = new Cell('boo');
    cell.data = 'foo';
    expect(cell.data).toBe('foo');
  });

  it('should accept int', () => {
    const cell = new Cell(1);
    expect(cell.data).toBe(1);
  });

  it('should accept boolean', () => {
    const cell = new Cell(true);
    expect(cell.data).toBe(true);
  });
});
