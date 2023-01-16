import { h, JSX } from 'preact';

import { classJoin, className } from '../../../util/className';
import { ProcessorType } from '../../../pipeline/processor';
import NativeSort from '../../../pipeline/sort/native';
import { Comparator, TCell, TColumnSort } from '../../../types';
import * as actions from './actions';
import ServerSort from '../../../pipeline/sort/server';
import { useEffect, useState } from 'preact/hooks';
import { useConfig } from '../../../hooks/useConfig';
import { useTranslator } from '../../../i18n/language';
import useSelector from '../../../hooks/useSelector';
import { useStore } from '../../../hooks/useStore';

// column specific config
export interface SortConfig {
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
  const [processor, setProcessor] = useState<NativeSort | ServerSort>(
    undefined,
  );
  const state = useSelector((state) => state.sort);
  const { dispatch } = useStore();
  const sortConfig = config.sort as GenericSortConfig;

  useEffect(() => {
    const processor = getOrCreateSortProcessor();
    if (processor) setProcessor(processor);
  }, []);

  useEffect(() => {
    config.pipeline.register(processor);

    return () => config.pipeline.unregister(processor);
  }, [config, processor]);

  /**
   * Sets the internal state of component
   */
  useEffect(() => {
    if (!state) return;

    const currentColumn = state.columns.find((x) => x.index === props.index);

    if (!currentColumn) {
      setDirection(0);
    } else {
      setDirection(currentColumn.direction);
    }
  }, [state]);

  useEffect(() => {
    if (!processor) return;
    if (!state) return;

    processor.setProps({
      columns: state.columns,
    });
  }, [state]);

  const getOrCreateSortProcessor = (): NativeSort | null => {
    let processorType = ProcessorType.Sort;

    if (sortConfig && typeof sortConfig.server === 'object') {
      processorType = ProcessorType.ServerSort;
    }

    const processors = config.pipeline.getStepsByType(processorType);

    if (processors.length === 0) {
      // my assumption is that we only have ONE sorting processor in the
      // entire pipeline and that's why I'm displaying a warning here
      let processor;

      if (processorType === ProcessorType.ServerSort) {
        processor = new ServerSort({
          columns: state ? state.columns : [],
          ...sortConfig.server,
        });
      } else {
        processor = new NativeSort({
          columns: state ? state.columns : [],
        });
      }
      return processor;
    }

    return null;
  };

  const changeDirection = (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // to sort two or more columns at the same time
    dispatch(
      actions.SortToggle(
        props.index,
        e.shiftKey === true && sortConfig.multiColumn,
        props.compare,
      ),
    );
  };

  const getSortClassName = (direction) => {
    if (direction === 1) {
      return 'asc';
    } else if (direction === -1) {
      return 'desc';
    }

    return 'neutral';
  };

  return (
    <button
      // because the corresponding <th> has tabIndex=0
      tabIndex={-1}
      aria-label={_(`sort.sort${direction === 1 ? 'Desc' : 'Asc'}`)}
      title={_(`sort.sort${direction === 1 ? 'Desc' : 'Asc'}`)}
      className={classJoin(
        className('sort'),
        className('sort', getSortClassName(direction)),
        config.className.sort,
      )}
      onClick={changeDirection}
    />
  );
}
