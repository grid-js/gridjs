import { h } from 'preact';
import { BaseComponent, BaseProps } from '../../base';
import GlobalSearchFilter from '../../../pipeline/filter/globalSearch';
import {classJoin, className} from '../../../util/className';
import store, { SearchStoreState } from './store';
import actions from './actions';
import Pipeline from '../../../pipeline/pipeline';
import ServerGlobalSearchFilter from "../../../pipeline/filter/serverGlobalSearch";

export interface SearchProps extends BaseProps {
  pipeline: Pipeline<any>;
}

export interface SearchConfig {
  keyword?: string;
  enabled?: boolean;
  placeholder?: string;
  server?: {
    url?: (keyword: string) => string;
    body?: (keyword: string) => BodyInit;
  };
}

export class Search extends BaseComponent<SearchProps & SearchConfig, {}> {
  private searchProcessor: GlobalSearchFilter | ServerGlobalSearchFilter;

  static defaultProps = {
    placeholder: 'Type a keyword...',
  };

  constructor(props: SearchProps & SearchConfig) {
    super();

    const { enabled, keyword } = props;

    if (enabled) {
      // initial search
      actions.search(keyword);

      store.on('updated', this.storeUpdated.bind(this));

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
    actions.search(keyword);
  }

  render() {
    if (!this.props.enabled) return null;

    return (
      <div className={className('search')}>
        <input
          type="search"
          placeholder={this.props.placeholder}
          onInput={this.onChange.bind(this)}
          className={classJoin(
            className('input'),
            className('search', 'input')
          )}
          value={store.state.keyword}
        />
      </div>
    );
  }
}
