import { Comparator, TCell } from '../../types';
import Tabular from '../../tabular';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import Row from '../../row';
import log from '../../util/log';

interface NativeSortProps extends PipelineProcessorProps {
  columns: {
    index: number;
    // 1 ascending, -1 descending
    direction?: 1 | -1;
    compare?: Comparator<TCell>;
  }[];
}

class NativeSort extends PipelineProcessor<Tabular, NativeSortProps> {
  protected validateProps(): void {
    for (const condition of this.props.columns) {
      if (condition.direction === undefined) {
        condition.direction = 1;
      }

      if (condition.direction !== 1 && condition.direction !== -1) {
        log.error(`Invalid sort direction ${condition.direction}`);
      }
    }
  }

  get type(): ProcessorType {
    return ProcessorType.Sort;
  }

  private compare(cellA: TCell, cellB: TCell): number {
    if (cellA > cellB) {
      return 1;
    } else if (cellA < cellB) {
      return -1;
    }

    return 0;
  }

  private compareWrapper(a: Row, b: Row): number {
    let cmp = 0;

    for (const column of this.props.columns) {
      if (cmp === 0) {
        const cellA = a.cells[column.index].data;
        const cellB = b.cells[column.index].data;

        if (typeof column.compare === 'function') {
          cmp |= column.compare(cellA, cellB) * column.direction;
        } else {
          cmp |= this.compare(cellA, cellB) * column.direction;
        }
      } else {
        break;
      }
    }

    return cmp;
  }

  protected _process(data: Tabular): Tabular {
    const sortedRows = [...data.rows];
    sortedRows.sort(this.compareWrapper.bind(this));

    const sorted = new Tabular(sortedRows);
    // we have to set the tabular length manually
    // because of the server-side storage
    sorted.length = data.length;

    return sorted;
  }
}

export default NativeSort;
