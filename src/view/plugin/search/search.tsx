import { h } from 'preact';
import { BaseComponent, BaseProps } from '../../base';
import GlobalSearchFilter from '../../../pipeline/filter/globalSearch';
import { classJoin, className } from '../../../util/className';
import { SearchStore, SearchStoreState } from './store';
import { SearchActions } from './actions';
import Pipeline from '../../../pipeline/pipeline';
import ServerGlobalSearchFilter from '../../../pipeline/filter/serverGlobalSearch';
import Dispatcher from '../../../util/dispatcher';
import { debounce } from '../../../util/debounce';

export interface SearchProps extends BaseProps {
  dispatcher: Dispatcher<any>;
  pipeline: Pipeline<any>;
}

export interface SearchConfig {
  keyword?: string;
  enabled?: boolean;
  placeholder?: string;
  debounceTimeout?: number;
  server?: {
    url?: (keyword: string) => string;
    body?: (keyword: string) => BodyInit;
  };
}

export class Search extends BaseComponent<SearchProps & SearchConfig, {}> {
  private readonly searchProcessor:
    | GlobalSearchFilter
    | ServerGlobalSearchFilter;
  private readonly actions: SearchActions;
  private readonly store: SearchStore;

  static defaultProps = {
    placeholder: 'Type a keyword...',
    debounceTimeout: 250,
  };

  constructor(props: SearchProps & SearchConfig) {
    super();

    this.actions = new SearchActions(props.dispatcher);
    this.store = new SearchStore(props.dispatcher);
    const { enabled, keyword } = props;

    if (enabled) {
      // initial search
      this.actions.search(keyword);

      this.store.on('updated', this.storeUpdated.bind(this));

      let searchProcessor;
      if (props.server) {
        searchProcessor = new ServerGlobalSearchFilter({
          keyword: props.keyword,
          url: props.server.url,
          body: props.server.body,
        });
      } else {
        searchProcessor = new GlobalSearchFilter({
          keyword: props.keyword,
        });
      }

      this.searchProcessor = searchProcessor;

      // adds a new processor to the pipeline
      props.pipeline.register(searchProcessor);
    }
  }

  private storeUpdated(state: SearchStoreState): void {
    // updates the processor state
    this.searchProcessor.setProps({
      keyword: state.keyword,
    });
  }

  private onChange(event): void {
    const keyword = event.target.value;
    this.actions.search(keyword);
  }

  render() {
    if (!this.props.enabled) return null;

    let onInput = this.onChange.bind(this);

    // add debounce to input only if it's a server-side search
    if (this.searchProcessor instanceof ServerGlobalSearchFilter) {
      onInput = debounce(onInput, this.props.debounceTimeout);
    }

    return (
      <div className={className('search')}>
        <input
          type="search"
          placeholder={this.props.placeholder}
          onInput={onInput}
          className={classJoin(
            className('input'),
            className('search', 'input'),
          )}
          value={this.store.state.keyword}
        />
      </div>
    );
  }
}
