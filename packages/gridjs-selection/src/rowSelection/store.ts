import { BaseStore } from 'gridjs';
import { RowSelectionActionsType } from './actions';
import { ID } from 'gridjs';

export type RowSelectionStoreState = {
  rowIds: ID[];
};

export class RowSelectionStore extends BaseStore<
  RowSelectionStoreState,
  RowSelectionActionsType
> {
  getInitialState(): RowSelectionStoreState {
    return { rowIds: [] };
  }

  handle(type, payload): void {
    if (type === 'CHECK') {
      const { ROW_ID } = payload;
      this.check(ROW_ID);
    }

    if (type === 'UNCHECK') {
      const { ROW_ID } = payload;
      this.uncheck(ROW_ID);
    }
  }

  private check(rowId: ID): void {
    // rowId already exists
    if (this.state.rowIds.indexOf(rowId) > -1) return;

    this.setState({
      rowIds: [rowId, ...this.state.rowIds],
    });
  }

  private uncheck(rowId: ID): void {
    const index = this.state.rowIds.indexOf(rowId);

    // rowId doesn't exist
    if (index === -1) return;

    const cloned = [...this.state.rowIds];
    cloned.splice(index, 1);

    this.setState({
      rowIds: cloned,
    });
  }
}
