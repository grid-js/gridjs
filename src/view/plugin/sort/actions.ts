import { Comparator, TCell } from '../../../types';

export const SortColumn =
  (
    index: number,
    direction: 1 | -1,
    multi?: boolean,
    compare?: Comparator<TCell>,
  ) =>
  (state) => {
    let columns = state.sort ? [...state.sort.columns] : [];
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

    return {
      ...state,
      sort: {
        columns: columns,
      },
    };
  };

export const SortToggle =
  (index: number, multi: boolean, compare?: Comparator<TCell>) => (state) => {
    const columns = state.sort ? [...state.sort.columns] : [];
    const column = columns.find((x) => x.index === index);

    if (!column) {
      return {
        ...state,
        ...SortColumn(index, 1, multi, compare)(state),
      };
    } else {
      return {
        ...state,
        ...SortColumn(
          index,
          column.direction === 1 ? -1 : 1,
          multi,
          compare,
        )(state),
      };
    }
  };
