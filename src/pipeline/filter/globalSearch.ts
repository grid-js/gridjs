import search from '../../operator/search';
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
  Tabular,
  GlobalSearchFilterProps
> {
  get type(): ProcessorType {
    return ProcessorType.Filter;
  }

  _process(data: Tabular): Tabular {
    if (this.props.keyword) {
      return search(String(this.props.keyword).trim(), data);
    }

    return data;
  }
}

export default GlobalSearchFilter;
