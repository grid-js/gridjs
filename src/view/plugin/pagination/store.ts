import BaseStore from '../../base/store';
import { PaginationActionsType } from './actions';

export type PaginationStoreState = { page: number };

export class PaginationStore extends BaseStore<
  PaginationStoreState,
  PaginationActionsType
> {
  getInitialState(): PaginationStoreState {
    return { page: 0 };
  }

  handle<K extends keyof PaginationActionsType>(
    type: K,
    payload: PaginationActionsType[K],
  ): void {
    if (type === 'GO_TO_PAGE') {
      const { page } = payload;
      this.setState({ page: page });
    }
  }
}
