import search from '../../operator/search';
import { TCell } from '../../types';
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
  Tabular<TCell>,
  GlobalSearchFilterProps
> {
  get type(): ProcessorType {
    return ProcessorType.Filter;
  }

  _process(data: Tabular<TCell>): Tabular<TCell> {
    if (this.props.keyword) {
      return search(String(this.props.keyword).trim(), data);
    }

    return data;
  }
}

export default GlobalSearchFilter;
