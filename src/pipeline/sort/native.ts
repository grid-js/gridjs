import { TBodyCell } from '../../types';
import Tabular from '../../tabular';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import Row from '../../row';

interface NativeSortProps extends PipelineProcessorProps {
  columns: {
    index: number;
    // 1 ascending, -1 descending
    direction?: 1 | -1;
  }[];
}

class NativeSort extends PipelineProcessor<
  Tabular<TBodyCell>,
  NativeSortProps
> {
  protected validateProps(): void {
    for (const condition of this.props.columns) {
      if (condition.direction === undefined) {
        condition.direction = 1;
      }

      if (condition.direction !== 1 && condition.direction !== -1) {
        throw Error(`Invalid sort direction ${condition.direction}`);
      }
    }
  }

  get type(): ProcessorType {
    return ProcessorType.Sort;
  }

  private compare(
    a: Row<any>,
    b: Row<any>,
    index: number,
    order: 1 | -1,
  ): number {
    const cellA = a.cells[index];
    const cellB = b.cells[index];

    if (cellA.data > cellB.data) {
      return 1 * order;
    } else if (cellA.data < cellB.data) {
      return -1 * order;
    }

    return 0;
  }

  private compareWrapper(a: Row<any>, b: Row<any>): number {
    let cmp = 0;
    for (const condition of this.props.columns) {
      if (cmp === 0) {
        cmp |= this.compare(a, b, condition.index, condition.direction);
      } else {
        break;
      }
    }

    return cmp;
  }

  protected _process(data: Tabular<TBodyCell>): Tabular<TBodyCell> {
    const sorted = [...data.rows];
    sorted.sort(this.compareWrapper.bind(this));
    return new Tabular(sorted);
  }
}

export default NativeSort;
