import { BaseActions } from '../../base/actions';
import { ID } from '../../../util/id';

export interface CheckboxActionsType {
  CHECK: {
    ROW_ID: ID;
  };

  UNCHECK: {
    ROW_ID: ID;
  };
}

export class CheckboxActions extends BaseActions<CheckboxActionsType> {
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
