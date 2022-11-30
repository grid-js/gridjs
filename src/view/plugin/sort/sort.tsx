import { h, JSX } from 'preact';

import { classJoin, className } from '../../../util/className';
import { ProcessorType } from '../../../pipeline/processor';
import NativeSort from '../../../pipeline/sort/native';
import { SortStore, SortStoreState } from './store';
import { Comparator, TCell, TColumnSort } from '../../../types';
import { SortActions } from './actions';
import ServerSort from '../../../pipeline/sort/server';
import { useEffect, useState } from 'preact/hooks';
import { useConfig } from '../../../hooks/useConfig';
import { useTranslator } from '../../../i18n/language';

// column specific config
export interface SortConfig {
  enabled?: boolean;
  compare?: Comparator<TCell>;
}

// generic sort config:
//
// Config {
//    sort: GenericSortConfig
// }
//
export interface GenericSortConfig {
  multiColumn?: boolean;
  server?: {
    url?: (prevUrl: string, columns: TColumnSort[]) => string;
    body?: (prevBody: BodyInit, columns: TColumnSort[]) => BodyInit;
  };
}

export function Sort(
  props: {
    // column index
    index: number;
  } & SortConfig,
) {
  const config = useConfig();
  const _ = useTranslator();
  const [direction, setDirection] = useState(0);
  const actions = new SortActions(config.dispatcher);
  const store = new SortStore(config.dispatcher);
  let sortProcessor: NativeSort | ServerSort;
  let updateStateFn: (...args) => void;
  let updateSortProcessorFn: (sortedColumns: SortStoreState) => void;

  useEffect(() => {
    if (props.enabled) {
      sortProcessor = getOrCreateSortProcessor();
      updateStateFn = updateState;
      store.on('updated', updateStateFn);
    }

    return () => {
      config.pipeline.unregister(sortProcessor);

      store.off('updated', updateStateFn);

      if (updateSortProcessorFn) {
        store.off('updated', updateSortProcessorFn);
      }
    };
  }, []);

  /**
   * Sets the internal state of component
   */
  const updateState = () => {
    const currentColumn = store.state.find((x) => x.index === props.index);

    if (!currentColumn) {
      setDirection(0);
    } else {
      setDirection(currentColumn.direction);
    }
  };

  const updateSortProcessor = (sortedColumns: SortStoreState) => {
    // updates the Sorting processor
    sortProcessor.setProps({
      columns: sortedColumns,
    });
  };

  const getOrCreateSortProcessor = (): NativeSort => {
    let processorType = ProcessorType.Sort;

    if (config.sort && typeof config.sort.server === 'object') {
      processorType = ProcessorType.ServerSort;
    }

    const processors = config.pipeline.getStepsByType(processorType);

    // my assumption is that we only have ONE sorting processor in the
    // entire pipeline and that's why I'm displaying a warning here
    let processor;

    // A sort process is already registered
    if (processors.length > 0) {
      processor = processors[0];
    } else {
      // let's create a new sort processor

      // this event listener is here because
      // we want to subscribe to the sort store only once
      updateSortProcessorFn = updateSortProcessor.bind(this);
      store.on('updated', updateSortProcessorFn);

      if (processorType === ProcessorType.ServerSort) {
        processor = new ServerSort({
          columns: store.state,
          ...config.sort.server,
        });
      } else {
        processor = new NativeSort({
          columns: store.state,
        });
      }

      config.pipeline.register(processor);
    }

    return processor;
  };

  const changeDirection = (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // to sort two or more columns at the same time
    actions.sortToggle(
      props.index,
      e.shiftKey === true && config.sort.multiColumn,
      props.compare,
    );
  };

  if (!props.enabled) {
    return null;
  }

  let sortClassName = 'neutral';

  if (direction === 1) {
    sortClassName = 'asc';
  } else if (direction === -1) {
    sortClassName = 'desc';
  }

  return (
    <button
      // because the corresponding <th> has tabIndex=0
      tabIndex={-1}
      aria-label={_(`sort.sort${direction === 1 ? 'Desc' : 'Asc'}`)}
      title={_(`sort.sort${direction === 1 ? 'Desc' : 'Asc'}`)}
      className={classJoin(
        className('sort'),
        className('sort', sortClassName),
        config.className.sort,
      )}
      onClick={changeDirection}
    />
  );
}
