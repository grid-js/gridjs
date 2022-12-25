import search from '../../operator/search';
import Tabular from '../../tabular';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import { OneDArray, TCell, TColumn } from '../../types';
import Row from '../../row';

interface GlobalSearchFilterProps extends PipelineProcessorProps {
  keyword: string;
  columns: OneDArray<TColumn>;
  ignoreHiddenColumns: boolean;
  selector?: (cell: TCell, rowIndex: number, cellIndex: number) => string;
  filter?: (keyword: string, rows: Row[]) => Row[];
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
        this.props.ignoreHiddenColumns,
        data,
        this.props.selector,
        this.props.filter,
      );
    }

    return data;
  }
}

export default GlobalSearchFilter;
