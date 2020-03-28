import PipelineAbstract from "./abstract";
import Config from "../config";
import MemoryStorage from "../storage/memory";
import Row from "../row";
import {TCell} from "../types";
import Tabular from "../tabular";


class SearchPipeline extends PipelineAbstract {
  public async execute(_: Config, memoryStorage: MemoryStorage, keyword: TCell): Promise<Tabular> {
    return this.searchInRows(keyword, memoryStorage);
  }

  private async searchInRows(keyword: TCell, memoryStorage: MemoryStorage): Promise<Tabular> {
    const rows = await memoryStorage.get();
    const tabular: Tabular = new Tabular();

    // TODO: ugh! this shouldn't be here
    for (const row of rows) {
      for (const cell of row) {
        // TODO: we should not cast `keyword` to String here
        if (new RegExp(String(keyword), 'gi').test(String(cell.getData()))) {
          tabular.pushRow(row);
        }
      }
    }

    return tabular;
  }
}

export default SearchPipeline;
