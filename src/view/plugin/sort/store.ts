import BaseStore from '../../base/store';
import { SortActionsType } from './actions';
import { Comparator, TCell } from '../../../types';

export type SortStoreState = {
  index: number;
  direction: 1 | -1;
  compare?: Comparator<TCell>;
}[];

export class SortStore extends BaseStore<SortStoreState, SortActionsType> {
  getInitialState(): SortStoreState {
    return [];
  }

  handle(type, payload): void {
    if (type === 'SORT_COLUMN') {
      const { index, direction, multi, compare } = payload;
      this.sortColumn(index, direction, multi, compare);
    } else if (type === 'SORT_COLUMN_TOGGLE') {
      const { index, multi, compare } = payload;
      this.sortToggle(index, multi, compare);
    }
  }

  private sortToggle(
    index: number,
    multi: boolean,
    compare: Comparator<TCell>,
  ): void {
    const columns = [...this.state];
    const column = columns.find((x) => x.index === index);

    if (!column) {
      this.sortColumn(index, 1, multi, compare);
    } else {
      this.sortColumn(index, column.direction === 1 ? -1 : 1, multi, compare);
    }
  }

  private sortColumn(
    index: number,
    direction: 1 | -1,
    multi: boolean,
    compare: Comparator<TCell>,
  ): void {
    let columns = [...this.state];
    const count = columns.length;
    const column = columns.find((x) => x.index === index);
    const exists = column !== undefined;

    let add = false;
    let reset = false;
    let remove = false;
    let update = false;

    if (!exists) {
      // the column has not been sorted
      if (count === 0) {
        // the first column to be sorted
        add = true;
      } else if (count > 0 && !multi) {
        // remove the previously sorted column
        // and sort the current column
        add = true;
        reset = true;
      } else if (count > 0 && multi) {
        // multi-sorting
        // sort this column as well
        add = true;
      }
    } else {
      // the column has been sorted before
      if (!multi) {
        // single column sorting
        if (count === 1) {
          update = true;
        } else if (count > 1) {
          // this situation happens when we have already entered
          // multi-sorting mode but then user tries to sort a single column
          reset = true;
          add = true;
        }
      } else {
        // multi sorting
        if (column.direction === -1) {
          // remove the current column from the
          // sorted columns array
          remove = true;
        } else {
          update = true;
        }
      }
    }

    if (reset) {
      // resetting the sorted columns
      columns = [];
    }

    if (add) {
      columns.push({
        index: index,
        direction: direction,
        compare: compare,
      });
    } else if (update) {
      const index = columns.indexOf(column);
      columns[index].direction = direction;
    } else if (remove) {
      const index = columns.indexOf(column);
      columns.splice(index, 1);
    }

    this.setState(columns);
  }
}
