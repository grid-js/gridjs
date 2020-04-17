import search from '../../operator/search';
import { TBodyCell } from '../../types';
import Tabular from '../../tabular';
import { PipelineProcessor, ProcessorType } from '../processor';

class InMemorySearch implements PipelineProcessor<Tabular<TBodyCell>> {
  type: ProcessorType = ProcessorType.Search;

  process(data: Tabular<TBodyCell>, keyword: string): Tabular<TBodyCell> {
    return search(keyword, data);
  }
}

export default InMemorySearch;
