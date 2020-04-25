import { TBodyCell } from '../../types';
import Tabular from '../../tabular';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';

interface PaginationLimitProps extends PipelineProcessorProps {
  page: number;
  limit: number;
}

class PaginationLimit extends PipelineProcessor<
  Tabular<TBodyCell>,
  PaginationLimitProps
> {
  constructor(props) {
    super(props);

    if (isNaN(Number(props.limit)) || isNaN(Number(props.page))) {
      throw Error('Invalid parameters passed');
    }
  }

  get type(): ProcessorType {
    return ProcessorType.Limit;
  }

  process(data: Tabular<TBodyCell>): Tabular<TBodyCell> {
    const page = this.props.page;
    const start = page * this.props.limit;
    const end = (page + 1) * this.props.limit;

    return new Tabular(data.rows.slice(start, end));
  }
}

export default PaginationLimit;
