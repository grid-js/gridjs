import { h, JSX } from 'preact';
import GlobalSearchFilter from '../../../pipeline/filter/globalSearch';
import { classJoin, className } from '../../../util/className';
import ServerGlobalSearchFilter from '../../../pipeline/filter/serverGlobalSearch';
import { TCell } from '../../../types';
import { useConfig } from '../../../hooks/useConfig';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { useTranslator } from '../../../i18n/language';
import * as actions from './actions';
import { useStore } from '../../../hooks/useStore';
import useSelector from '../../../hooks/useSelector';
import { debounce } from '../../../util/debounce';

export interface SearchConfig {
  keyword?: string;
  ignoreHiddenColumns?: boolean;
  debounceTimeout?: number;
  showSearchButton?: boolean;
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
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!processor) return undefined;

    config.pipeline.register<object, object>(processor);

    return () => config.pipeline.unregister<object, object>(processor);
  }, [config, processor]);

  const performSearch = (keyword: string) => {
    dispatch(actions.SearchKeyword(keyword));
  };

  // Method to handle debounced input
  const debouncedOnInput = useCallback(
    debounce(
      (event: JSX.TargetedEvent<HTMLInputElement>) => {
        if (props.debounceTimeout < 0) {
          return;
        }
        if (event.target instanceof HTMLInputElement) {
          performSearch(event.target.value);
        }
      },
      processor instanceof ServerGlobalSearchFilter ? props.debounceTimeout || 250 : 0,
    ),
    [props, processor],
  );

  // Method to handle keydown event for Enter key
  const handleKeyDown = (event: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (event.target instanceof HTMLInputElement) {
        performSearch(event.target.value);
      }
    }
  };

  // Method to handle search button click
  const handleSearchClick = () => {
    if (inputRef.current) {
      performSearch(inputRef.current.value);
    }
  };


  return (
    <div className={classJoin(className('search'), config.className?.search)}>
      <input
        type="search"
        ref={inputRef}
        placeholder={_('search.placeholder')}
        aria-label={_('search.placeholder')}
        onInput={debouncedOnInput}
        onKeyDown={handleKeyDown}
        className={classJoin(className('input'), className('search', 'input'))}
        defaultValue={state?.keyword || ''}
      />
      {props.showSearchButton && (
        <button
          className={classJoin(
            className('button'),
            className('search', 'button'),
          )}
          onClick={handleSearchClick}
        >
          {_('search.button')}
        </button>
      )}
    </div>
  );
}
