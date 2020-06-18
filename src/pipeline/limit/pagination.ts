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

class PaginationLimit extends PipelineProcessor<Tabular, PaginationLimitProps> {
  protected validateProps(): void {
    if (isNaN(Number(this.props.limit)) || isNaN(Number(this.props.page))) {
      throw Error('Invalid parameters passed');
    }
  }

  get type(): ProcessorType {
    return ProcessorType.Limit;
  }

  protected _process(data: Tabular): Tabular {
    const page = this.props.page;
    const start = page * this.props.limit;
    const end = (page + 1) * this.props.limit;

    return new Tabular(data.rows.slice(start, end));
  }
}

export default PaginationLimit;
