import { h } from 'preact';
import { BaseComponent } from '../base';
import Pipeline from '../../pipeline/pipeline';
import Config from '../../config';
import { TBodyCell } from '../../types';
import Tabular from '../../tabular';
import InMemorySearch from '../../pipeline/search/inMemory';

interface SearchState {
  keyword?: string;
}

export class Search extends BaseComponent<{}, SearchState> {
  private pipeline: Pipeline<Tabular<TBodyCell>>;
  private searchProcessor: InMemorySearch;

  constructor() {
    super();

    const searchProcessor = new InMemorySearch();
    this.searchProcessor = searchProcessor;

    this.pipeline = Config.current.pipeline;
    this.pipeline.register(searchProcessor);
  }

  render() {
    return (
      <input
        type="text"
        placeholder="Type a keyword..."
        onInput={this.onChange.bind(this)}
        value={this.state.keyword}
      />
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
