import { TBodyCell } from '../../types';
import Tabular from '../../tabular';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import Row from '../../row';

interface NativeSortProps extends PipelineProcessorProps {
  columnIndex: number;
  // 1 ascending, -1 descending
  order: 1 | -1;
}

class NativeSort extends PipelineProcessor<
  Tabular<TBodyCell>,
  NativeSortProps
> {
  constructor(props?: Partial<NativeSortProps>) {
    super(props);

    if (this.props.order === undefined) {
      this.props.order = 1;
    }
  }

  protected validateProps(data: Tabular<TBodyCell>): void {
    if (isNaN(Number(this.props.columnIndex))) {
      throw Error('Invalid column index');
    }

    if (this.props.columnIndex > data.rows.length - 1) {
      throw Error(`Column index ${this.props.columnIndex} does not exist`);
    }

    if (this.props.order !== 1 && this.props.order !== -1) {
      throw Error(`Invalid order ${this.props.order}`);
    }
  }

  get type(): ProcessorType {
    return ProcessorType.Sort;
  }

  private compare(a: Row<any>, b: Row<any>): number {
    const cellA = a.cells[this.props.columnIndex];
    const cellB = b.cells[this.props.columnIndex];

    if (cellA.data > cellB.data) {
      return 1 * this.props.order;
    } else if (cellA.data < cellB.data) {
      return -1 * this.props.order;
    }

    return 0;
  }

  protected _process(data: Tabular<TBodyCell>): Tabular<TBodyCell> {
    const sorted = [...data.rows];
    sorted.sort(this.compare.bind(this));
    return new Tabular(sorted);
  }
}

export default NativeSort;
