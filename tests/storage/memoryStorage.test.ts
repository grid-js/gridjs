import MemoryStorage from "../../src/storage/memoryStorage";
import Row from "../../src/row";
import Cell from "../../src/cell";

describe( 'MemoryStorage class', () => {
  it('should return the correct length', () => {
    const memoryStorage = new MemoryStorage();

    const row1 = new Row([new Cell("b1")]);
    memoryStorage.set([row1]);

    expect(memoryStorage).toHaveLength(1);
  });

  it('should set and get rows', () => {
    const memoryStorage = new MemoryStorage();

    const row1 = new Row([new Cell("c1")]);
    const row2 = new Row([new Cell("c2")]);
    memoryStorage.set([row1, row2]);

    expect(memoryStorage.get()).toStrictEqual([row1, row2]);
  });
});
