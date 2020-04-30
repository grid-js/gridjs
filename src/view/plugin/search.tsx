import { h } from 'preact';
import { BaseComponent, BaseProps } from '../base';
import Config from '../../config';
import GlobalSearchFilter from '../../pipeline/filter/globalSearch';
import className from '../../util/className';

import '../../theme/mermaid/input.scss';

interface SearchState {
  keyword?: string;
}

export interface SearchConfig {
  keyword?: string;
  enabled?: boolean;
}

export class Search extends BaseComponent<
  BaseProps & SearchConfig,
  SearchState
> {
  private searchProcessor: GlobalSearchFilter;

  constructor(props) {
    super();

    const { enabled } = props;

    this.state = {
      keyword: props.keyword,
    };

    if (enabled) {
      const searchProcessor = new GlobalSearchFilter({
        keyword: props.keyword,
      });
      this.searchProcessor = searchProcessor;

      // adds a new processor to the pipeline
      Config.current.pipeline.register(searchProcessor);
    }
  }

  render() {
    if (!this.props.enabled) return null;

    return (
      <div className={className('search')}>
        <input
          type="text"
          placeholder="Type a keyword..."
          onInput={this.onChange.bind(this)}
          className={className('input')}
          value={this.state.keyword}
        />
      </div>
    );
  }

  private onChange(event): void {
    const keyword = event.target.value;
    this.setState({ keyword: keyword });

    // updates the processor state
    this.searchProcessor.setProps({
      keyword: keyword,
    });
  }
}
