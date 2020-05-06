import { BaseActions } from '../../base/actions';

export interface SortActionsType {
  SORT_COLUMN: {
    index: number;
    direction: 1 | -1;
    multi?: boolean;
  };
}

class SortActions extends BaseActions<SortActionsType> {
  sortColumn(index: number, direction: 1 | -1, multi?: boolean): void {
    this.dispatch('SORT_COLUMN', {
      index: index,
      direction: direction,
      multi: multi,
    });
  }
}

export default new SortActions();
