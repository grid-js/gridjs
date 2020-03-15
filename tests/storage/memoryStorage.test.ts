import MemoryStorage from "../../src/storage/memoryStorage";
import Row from "../../src/row";
import Cell from "../../src/cell";

describe( 'MemoryStorage class', () => {
  it('should return the correct length', () => {
    let memoryStorage = new MemoryStorage();

    let row1 = new Row([new Cell("b1")]);
    memoryStorage.set([row1]);

    expect(memoryStorage).toHaveLength(1);
  });

  it('should set and get rows', () => {
    let memoryStorage = new MemoryStorage();

    let row1 = new Row([new Cell("c1")]);
    let row2 = new Row([new Cell("c2")]);
    memoryStorage.set([row1, row2]);

    expect(memoryStorage.get()).toStrictEqual([row1, row2]);
  });
});
