import { h } from 'preact';
import GlobalSearchFilter from '../../../pipeline/filter/globalSearch';
import { classJoin, className } from '../../../util/className';
import { SearchStore, SearchStoreState } from './store';
import { SearchActions } from './actions';
import ServerGlobalSearchFilter from '../../../pipeline/filter/serverGlobalSearch';
import { debounce } from '../../../util/debounce';
import { TCell } from '../../../types';
import { PluginBaseComponent, PluginBaseProps } from '../../../plugin';

export interface SearchConfig {
  keyword?: string;
  enabled?: boolean;
  debounceTimeout?: number;
  selector?: (cell: TCell, rowIndex: number, cellIndex: number) => string;
  server?: {
    url?: (prevUrl: string, keyword: string) => string;
    body?: (prevBody: BodyInit, keyword: string) => BodyInit;
  };
}

export class Search extends PluginBaseComponent<
  SearchConfig & PluginBaseProps<Search>
> {
  private readonly searchProcessor:
    | GlobalSearchFilter
    | ServerGlobalSearchFilter;
  private readonly actions: SearchActions;
  private readonly store: SearchStore;
  private readonly storeUpdatedFn: (...args) => void;

  static defaultProps = {
    debounceTimeout: 250,
  };

  constructor(props, context) {
    super(props, context);

    this.actions = new SearchActions(this.config.dispatcher);
    this.store = new SearchStore(this.config.dispatcher);
    const { enabled, keyword } = props;

    if (enabled) {
      // initial search
      if (keyword) this.actions.search(keyword);

      this.storeUpdatedFn = this.storeUpdated.bind(this);
      this.store.on('updated', this.storeUpdatedFn);

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
          selector: props.selector,
        });
      }

      this.searchProcessor = searchProcessor;

      // adds a new processor to the pipeline
      this.config.pipeline.register(searchProcessor);
    }
  }

  componentWillUnmount(): void {
    this.config.pipeline.unregister(this.searchProcessor);
    this.store.off('updated', this.storeUpdatedFn);
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
      <div
        className={className(classJoin('search', this.config.className.search))}
      >
        <input
          type="search"
          placeholder={this._('search.placeholder')}
          aria-label={this._('search.placeholder')}
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
