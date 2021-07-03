import { BaseActions } from '../../base/actions';

export interface PaginationActionsType {
  GO_TO_PAGE: {
    page: number;
  };
}

export class PaginationActions extends BaseActions<PaginationActionsType> {
  goToPage(page: number): void {
    this.dispatch('GO_TO_PAGE', {
      page: page,
    });
  }
}
