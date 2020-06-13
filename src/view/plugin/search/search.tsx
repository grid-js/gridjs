import { h } from 'preact';
import { BaseComponent, BaseProps } from '../../base';
import GlobalSearchFilter from '../../../pipeline/filter/globalSearch';
import { classJoin, className } from '../../../util/className';
import { SearchStore, SearchStoreState } from './store';
import { SearchActions } from './actions';
import ServerGlobalSearchFilter from '../../../pipeline/filter/serverGlobalSearch';
import { debounce } from '../../../util/debounce';
import getConfig from '../../../util/getConfig';

export interface SearchConfig {
  keyword?: string;
  enabled?: boolean;
  placeholder?: string;
  debounceTimeout?: number;
  server?: {
    url?: (prevUrl: string, keyword: string) => string;
    body?: (prevBody: BodyInit, keyword: string) => BodyInit;
  };
}

export class Search extends BaseComponent<SearchConfig & BaseProps, {}> {
  private readonly searchProcessor:
    | GlobalSearchFilter
    | ServerGlobalSearchFilter;
  private readonly actions: SearchActions;
  private readonly store: SearchStore;

  static defaultProps = {
    placeholder: 'Type a keyword...',
    debounceTimeout: 250,
  };

  constructor(props: SearchConfig, context) {
    super();

    const config = getConfig(context);

    this.actions = new SearchActions(config.dispatcher);
    this.store = new SearchStore(config.dispatcher);
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
      config.pipeline.register(searchProcessor);
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
