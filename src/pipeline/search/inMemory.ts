import search from '../../operator/search';
import { TBodyCell } from '../../types';
import Tabular from '../../tabular';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';

interface InMemorySearchProps extends PipelineProcessorProps {
  keyword: string;
}

class InMemorySearch extends PipelineProcessor<
  Tabular<TBodyCell>,
  InMemorySearchProps
> {
  get type(): ProcessorType {
    return ProcessorType.Search;
  }

  process(data: Tabular<TBodyCell>): Tabular<TBodyCell> {
    return search(this.props.keyword, data);
  }
}

export default InMemorySearch;
