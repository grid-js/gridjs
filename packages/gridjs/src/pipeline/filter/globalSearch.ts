import search from '../../operator/search';
import Tabular from '../../tabular';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import { OneDArray, TCell, TColumn } from '../../types';
import { ComponentChild } from "preact";

interface GlobalSearchFilterProps extends PipelineProcessorProps {
  keyword: string;
  columns: OneDArray<TColumn | string | ComponentChild>;
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
        this.props.columns,
        data,
        this.props.selector,
      );
    }

    return data;
  }
}

export default GlobalSearchFilter;
