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
    if (this.props.keyword) {
      return search(String(this.props.keyword).trim(), data);
    }

    return data;
  }
}

export default InMemorySearch;
