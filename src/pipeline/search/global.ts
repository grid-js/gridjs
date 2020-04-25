import search from '../../operator/search';
import { TBodyCell } from '../../types';
import Tabular from '../../tabular';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';

interface GlobalSearchProps extends PipelineProcessorProps {
  keyword: string;
}

class GlobalSearch extends PipelineProcessor<
  Tabular<TBodyCell>,
  GlobalSearchProps
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

export default GlobalSearch;
