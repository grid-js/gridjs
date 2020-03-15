import Cell from '../src/cell';

describe( 'Cell class', () => {
  it('should init with value', () => {
    const cell = new Cell("boo");
    expect(cell.getData()).toBe("boo");
  });

  it('set should update the data', () => {
    const cell = new Cell("boo");
    cell.setData("foo");
    expect(cell.getData()).toBe("foo");
  });

  it('should accept int', () => {
    const cell = new Cell(1);
    expect(cell.getData()).toBe(1);
  });
});
