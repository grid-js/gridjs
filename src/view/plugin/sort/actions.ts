import { BaseActions } from '../../base/actions';
import { Comparator, TCell } from '../../../types';

export interface SortActionsType {
  SORT_COLUMN: {
    index: number;
    direction: 1 | -1;
    multi?: boolean;
    compare?: Comparator<TCell>;
  };

  SORT_COLUMN_TOGGLE: {
    index: number;
    multi?: boolean;
    compare?: Comparator<TCell>;
  };
}

export class SortActions extends BaseActions<SortActionsType> {
  sortColumn(
    index: number,
    direction: 1 | -1,
    multi?: boolean,
    compare?: Comparator<TCell>,
  ): void {
    this.dispatch('SORT_COLUMN', {
      index: index,
      direction: direction,
      multi: multi,
      compare: compare,
    });
  }

  sortToggle(
    index: number,
    multi?: boolean,
    compare?: Comparator<TCell>,
  ): void {
    this.dispatch('SORT_COLUMN_TOGGLE', {
      index: index,
      multi: multi,
      compare: compare,
    });
  }
}
