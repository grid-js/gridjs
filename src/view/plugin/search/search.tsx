import GlobalSearchFilter from '../../../pipeline/filter/globalSearch';
import { classJoin, className } from '../../../util/className';
import { SearchStore, SearchStoreState } from './store';
import { SearchActions } from './actions';
import ServerGlobalSearchFilter from '../../../pipeline/filter/serverGlobalSearch';
import { debounce } from '../../../util/debounce';
import { TCell } from '../../../types';
import { useConfig } from '../../../hooks/useConfig';
import { useEffect } from 'preact/hooks';
import { useTranslator } from '../../../i18n/language';

export interface SearchConfig {
  keyword?: string;
  ignoreHiddenColumns?: boolean;
  debounceTimeout?: number;
  selector?: (cell: TCell, rowIndex: number, cellIndex: number) => string;
  server?: {
    url?: (prevUrl: string, keyword: string) => string;
    body?: (prevBody: BodyInit, keyword: string) => BodyInit;
  };
}

export function Search(props: SearchConfig) {
  let searchProcessor: GlobalSearchFilter | ServerGlobalSearchFilter;
  const config = useConfig();
  const actions = new SearchActions(config.dispatcher);
  const store = new SearchStore(config.dispatcher);
  const _ = useTranslator();

  if (props.server) {
    searchProcessor = new ServerGlobalSearchFilter({
      keyword: props.keyword,
      url: props.server.url,
      body: props.server.body,
    });
  } else {
    searchProcessor = new GlobalSearchFilter({
      keyword: props.keyword,
      columns: config.header && config.header.columns,
      ignoreHiddenColumns:
        props.ignoreHiddenColumns || props.ignoreHiddenColumns === undefined,
      selector: props.selector,
    });
  }

  useEffect(() => {
    const { keyword } = props;

    // initial search
    if (keyword) actions.search(keyword);

    store.on('updated', storeUpdated);

    // adds a new processor to the pipeline
    config.pipeline.register(searchProcessor);

    return () => {
      config.pipeline.unregister(searchProcessor);
      store.off('updated', storeUpdated);
    };
  }, []);

  const storeUpdated = (state: SearchStoreState) => {
    // updates the processor state
    searchProcessor.setProps({
      keyword: state.keyword,
    });
  };

  const onChange = (event) => {
    const keyword = event.target.value;
    actions.search(keyword);
  };

  let onInput = onChange;
  // add debounce to input only if it's a server-side search
  if (searchProcessor instanceof ServerGlobalSearchFilter) {
    onInput = debounce(onInput, props.debounceTimeout || 250);
  }

  return (
    <div className={className(classJoin('search', config.className?.search))}>
      <input
        type="search"
        placeholder={_('search.placeholder')}
        aria-label={_('search.placeholder')}
        onInput={onInput}
        className={classJoin(className('input'), className('search', 'input'))}
        value={store.state.keyword || ""}
      />
    </div>
  );
}
