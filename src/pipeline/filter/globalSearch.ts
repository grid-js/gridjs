import search from '../../operator/search';
import { TBodyCell } from '../../types';
import Tabular from '../../tabular';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';

interface GlobalSearchFilterProps extends PipelineProcessorProps {
  keyword: string;
}

class GlobalSearchFilter extends PipelineProcessor<
  Tabular<TBodyCell>,
  GlobalSearchFilterProps
> {
  get type(): ProcessorType {
    return ProcessorType.Filter;
  }

  _process(data: Tabular<TBodyCell>): Tabular<TBodyCell> {
    if (this.props.keyword) {
      return search(String(this.props.keyword).trim(), data);
    }

    return data;
  }
}

export default GlobalSearchFilter;
