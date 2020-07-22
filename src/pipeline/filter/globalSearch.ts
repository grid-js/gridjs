import search from '../../operator/search';
import Tabular from '../../tabular';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import { TCell } from '../../types';

interface GlobalSearchFilterProps extends PipelineProcessorProps {
  keyword: string;
  selector?: (cell: TCell, rowIndex: number, cellIndex: number) => string;
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
      return search(
        String(this.props.keyword).trim(),
        data,
        this.props.selector,
      );
    }

    return data;
  }
}

export default GlobalSearchFilter;
