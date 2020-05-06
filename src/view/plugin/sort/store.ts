import BaseStore from '../../base/store';
import { SortActionsType } from './actions';

export type SortStoreState = { index: number; direction: 1 | -1 }[];

class SortStore extends BaseStore<SortStoreState, SortActionsType> {
  getInitialState(): SortStoreState {
    return [];
  }

  handle(type, payload): void {
    if (type === 'SORT_COLUMN') {
      const existingColumn = this.state
        .filter(x => x.index === payload.columnIndex)
        .slice(0);

      // resetting the sorted columns
      this.setState([]);

      if (existingColumn.length === 0) {
        const columns = [...this.state];
        columns.push({
          index: payload.index,
          direction: payload.direction,
        });

        this.setState(columns);
      } else {
        existingColumn[0].direction = payload.direction;
        this.setState(existingColumn);
      }
    }
  }
}

export default new SortStore();
