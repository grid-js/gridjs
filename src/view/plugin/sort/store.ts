import dispatcher from '../../util/dispatcher';
import { EventEmitter } from '../../../util/eventEmitter';

interface StoreEvents {
  updated: (state: any) => void;
}

class SortStore extends EventEmitter<StoreEvents> {
  private sortedColumns: { index: number; direction: 1 | -1 }[];

  constructor() {
    super();

    this.sortedColumns = [];
    dispatcher.register(action => this.handle(action));
  }

  private handle(action): void {
    if (action.type === 'SORT_COLUMN') {
      const existingColumn = this.sortedColumns.filter(
        x => x.index === action.columnIndex,
      );

      // resetting the sorted columns
      this.sortedColumns = [];

      if (existingColumn.length === 0) {
        this.sortedColumns.push({
          index: action.index,
          direction: action.direction,
        });
      } else {
        existingColumn[0].direction = action.direction;
      }
    }

    this.emit('updated', this.sortedColumns);
  }

  getState(): any {
    return this.sortedColumns;
  }
}

export default new SortStore();
