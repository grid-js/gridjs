import { h, JSX } from 'preact';
import GlobalSearchFilter from '../../../pipeline/filter/globalSearch';
import { classJoin, className } from '../../../util/className';
import ServerGlobalSearchFilter from '../../../pipeline/filter/serverGlobalSearch';
import { TCell } from '../../../types';
import { useConfig } from '../../../hooks/useConfig';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { useTranslator } from '../../../i18n/language';
import * as actions from './actions';
import { useStore } from '../../../hooks/useStore';
import useSelector from '../../../hooks/useSelector';
import { debounce } from '../../../util/debounce';

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

export function Search() {
  const [processor, setProcessor] = useState<
    GlobalSearchFilter | ServerGlobalSearchFilter
  >(undefined);
  const config = useConfig();
  const props = config.search as SearchConfig;
  const _ = useTranslator();
  const { dispatch } = useStore();
  const state = useSelector((state) => state.search);

  const [searchInput, setSearchInput] = useState(props.keyword || '');

  useEffect(() => {
    if (!processor) return;

    processor.setProps({
      keyword: state?.keyword,
    });
  }, [state, processor]);

  useEffect(() => {
    if (props.server) {
      setProcessor(
        new ServerGlobalSearchFilter({
          keyword: props.keyword,
          url: props.server.url,
          body: props.server.body,
        }),
      );
    } else {
      setProcessor(
        new GlobalSearchFilter({
          keyword: props.keyword,
          columns: config.header && config.header.columns,
          ignoreHiddenColumns:
            props.ignoreHiddenColumns ||
            props.ignoreHiddenColumns === undefined,
          selector: props.selector,
        }),
      );
    }

    // initial search
    if (props.keyword) dispatch(actions.SearchKeyword(props.keyword));
  }, [props]);

  useEffect(() => {
    config.pipeline.register(processor);

    return () => config.pipeline.unregister(processor);
  }, [config, processor]);

  const handleSearchInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    if (event.target instanceof HTMLInputElement) {
      setSearchInput(event.target.value);
      debouncedOnInput(event);
    }
  }

  const debouncedOnInput = useCallback(
    debounce(
      (event: JSX.TargetedEvent<HTMLInputElement>) => {
        if (event.target instanceof HTMLInputElement) {
          dispatch(actions.SearchKeyword(event.target.value));
        }
      },
      processor instanceof ServerGlobalSearchFilter
        ? props.debounceTimeout || 250
        : 0,
    ),
    [props, processor],
  );

  return (
    <div className={className(classJoin('search', config.className?.search))}>
      <input
        type="search"
        placeholder={_('search.placeholder')}
        aria-label={_('search.placeholder')}
        onInput={handleSearchInput}
        className={classJoin(className('input'), className('search', 'input'))}
        value={searchInput || ''}
      />
    </div>
  );
}
