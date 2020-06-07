import { h } from 'preact';
import { BaseComponent, BaseProps } from '../../base';
import GlobalSearchFilter from '../../../pipeline/filter/globalSearch';
import { className } from '../../../util/className';
import store, { SearchStoreState } from './store';
import actions from './actions';
import Pipeline from '../../../pipeline/pipeline';

export interface SearchProps extends BaseProps {
  pipeline: Pipeline<any>;
}

export interface SearchConfig {
  keyword?: string;
  enabled?: boolean;
  placeholder?: string;
}

export class Search extends BaseComponent<SearchProps & SearchConfig, {}> {
  private searchProcessor: GlobalSearchFilter;

  static defaultProps = {
    placeholder: 'Type a keyword...',
  };

  constructor(props) {
    super();

    const { enabled, keyword } = props;

    if (enabled) {
      // initial search
      actions.search(keyword);

      store.on('updated', this.storeUpdated.bind(this));

      const searchProcessor = new GlobalSearchFilter({
        keyword: props.keyword,
      });
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
          className={`${className('input')} ${className('search', 'input')}`}
          value={store.state.keyword}
        />
      </div>
    );
  }
}
