import dispatcher from '../../util/dispatcher';

class SortActions {
  sortColumn(index: number, direction: 1 | -1): void {
    dispatcher.dispatch({
      type: 'SORT_COLUMN',
      index: index,
      direction: direction,
    });
  }
}

export default new SortActions();
