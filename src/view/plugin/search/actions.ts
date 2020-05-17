import { BaseActions } from '../../base/actions';

export interface SearchActionsType {
  SEARCH_KEYWORD: {
    keyword: string;
  };
}

class SearchActions extends BaseActions<SearchActionsType> {
  search(keyword: string): void {
    this.dispatch('SEARCH_KEYWORD', {
      keyword: keyword,
    });
  }
}

export default new SearchActions();
