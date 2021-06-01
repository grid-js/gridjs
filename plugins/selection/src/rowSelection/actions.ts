import { BaseActions } from 'gridjs';

export interface RowSelectionActionsType {
  CHECK: {
    ROW_ID: string;
  };

  UNCHECK: {
    ROW_ID: string;
  };
}

export class RowSelectionActions extends BaseActions<RowSelectionActionsType> {
  check(rowId: string): void {
    this.dispatch('CHECK', {
      ROW_ID: rowId,
    });
  }

  uncheck(rowId: string): void {
    this.dispatch('UNCHECK', {
      ROW_ID: rowId,
    });
  }
}
