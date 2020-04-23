import { h } from 'preact';
import { BaseComponent, BaseProps } from '../base';
import Config from '../../config';
import InMemorySearch from '../../pipeline/search/inMemory';
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
  private searchProcessor: InMemorySearch;

  constructor(props) {
    super();

    const { enabled } = props;

    this.state = {
      keyword: props.keyword,
    };

    if (enabled) {
      const searchProcessor = new InMemorySearch({
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
      <div className={className(Config.current.classNamePrefix, 'search')}>
        <input
          type="text"
          placeholder="Type a keyword..."
          onInput={this.onChange.bind(this)}
          className={className(Config.current.classNamePrefix, 'input')}
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
