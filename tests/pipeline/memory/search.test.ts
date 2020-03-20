import MemorySearchPipeline from '../../../src/pipeline/memory/search';
import MemoryStorage from "../../../src/storage/memory";
import Row from "../../../src/row";
import Cell from "../../../src/cell";

describe( 'MemorySearchPipeline class', () => {
  it('should accept a MemoryStore', () => {
    const memStore = new MemoryStorage<string>();
    const pipeline = new MemorySearchPipeline().new(null, memStore, "hi");
    expect(pipeline).toBeInstanceOf(Promise);
  });

  it('should search in rows', async () => {
    const memStore = new MemoryStorage<string>();
    await memStore.set([
      new Row<string>([new Cell("a1")]),
      new Row<string>([new Cell("a2")]),
      new Row<string>([new Cell("a3")]),
      new Row<string>([new Cell("b1")]),
      new Row<string>([new Cell("b2")]),
    ]);

    const newMemStore = await new MemorySearchPipeline().new(null, memStore, "a");
    await expect(newMemStore.length).resolves.toBe(3);
  });
});
