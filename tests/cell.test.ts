import Cell from '../src/cell';

describe( 'Cell class', () => {
  it('should init with value', () => {
    let cell = new Cell("boo");
    expect(cell.getData()).toBe("boo");
  });

  it('set should update the data', () => {
    let cell = new Cell("boo");
    cell.setData("foo")
    expect(cell.getData()).toBe("foo");
  });

  it('should accept int', () => {
    let cell = new Cell(1);
    expect(cell.getData()).toBe(1);
  });
});
