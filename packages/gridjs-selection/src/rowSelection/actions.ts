import { BaseActions } from 'gridjs';
import { ID } from 'gridjs';

export interface RowSelectionActionsType {
  CHECK: {
    ROW_ID: ID;
  };

  UNCHECK: {
    ROW_ID: ID;
  };
}

export class RowSelectionActions extends BaseActions<RowSelectionActionsType> {
  check(rowId: ID): void {
    this.dispatch('CHECK', {
      ROW_ID: rowId,
    });
  }

  uncheck(rowId: ID): void {
    this.dispatch('UNCHECK', {
      ROW_ID: rowId,
    });
  }
}
