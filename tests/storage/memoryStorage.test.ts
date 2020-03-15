import MemoryStorage from "../../src/storage/memoryStorage";
import Row from "../../src/row";
import Cell from "../../src/cell";

describe( 'MemoryStorage class', () => {
  it('should return the correct length', async () => {
    const memoryStorage = new MemoryStorage();

    const row1 = new Row([new Cell("b1")]);
    await memoryStorage.set([row1]);

    expect(await memoryStorage.length).toBe(1);
  });

  it('should set and get rows', async () => {
    const memoryStorage = new MemoryStorage();

    const row1 = new Row([new Cell("c1")]);
    const row2 = new Row([new Cell("c2")]);

    await memoryStorage.set([row1, row2]);

    expect(await memoryStorage.get()).toStrictEqual([row1, row2]);
  });
});
