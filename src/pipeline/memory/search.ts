import PipelineAbstract from "../abstract";
import Config from "../../config";
import MemoryStorage from "../../storage/memory";
import Row from "../../row";


class MemorySearchPipeline<T> extends PipelineAbstract<T> {
  public async new(_: Config, memoryStorage: MemoryStorage<T>, keyword: T): Promise<MemoryStorage<T>> {
    return this.searchInRows(keyword, memoryStorage)
      .then(this.setAndReturn);
  }

  private async searchInRows(keyword: T, memoryStorage: MemoryStorage<T>): Promise<Iterable<Row<T>>> {
    const rows: Iterable<Row<T>> = await memoryStorage.get();
    const filterResult: Row<T>[] = [];

    // TODO: ugh! this shouldn't be here
    for (const row of rows) {
      for (const cell of row) {
        // TODO: we should not cast `keyword` to String here
        if (new RegExp(String(keyword), 'gi').test(String(cell.getData()))) {
          filterResult.push(row);
        }
      }
    }

    return filterResult;
  }

  private async setAndReturn(rows: Iterable<Row<T>>): Promise<MemoryStorage<T>> {
    const newStorage = new MemoryStorage<T>();
    await newStorage.set(rows);

    return newStorage;
  }
}

export default MemorySearchPipeline;
