import BaseStore from '../../base/store';
import { SearchActionsType } from './actions';

export type SearchStoreState = { keyword: string | null };

class SearchStore extends BaseStore<SearchStoreState, SearchActionsType> {
  getInitialState(): SearchStoreState {
    return { keyword: null };
  }

  handle(type, payload): void {
    if (type === 'SEARCH_KEYWORD') {
      const { keyword } = payload;
      this.search(keyword);
    }
  }

  private search(keyword: string): void {
    this.setState({ keyword: keyword });
  }
}

export default new SearchStore();
