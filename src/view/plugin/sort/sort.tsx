import { h, JSX } from 'preact';

import { BaseComponent, BaseProps } from '../../base';
import { classJoin, className } from '../../../util/className';
import { ProcessorType } from '../../../pipeline/processor';
import NativeSort from '../../../pipeline/sort/native';
import { SortStore, SortStoreState } from './store';
import Pipeline from '../../../pipeline/pipeline';
import log from '../../../util/log';
import { Comparator, TCell, TColumnSort } from '../../../types';
import Dispatcher from '../../../util/dispatcher';
import { SortActions } from './actions';
import ServerSort from '../../../pipeline/sort/server';

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

export interface SortProps extends BaseProps {
  dispatcher: Dispatcher<any>;
  pipeline: Pipeline<any>;
  // column index
  index: number;
  sort?: GenericSortConfig;
}

interface SortState {
  direction: 1 | -1 | 0;
}

export class Sort extends BaseComponent<SortProps & SortConfig, SortState> {
  private readonly sortProcessor: NativeSort | ServerSort;
  private readonly actions: SortActions;
  private readonly store: SortStore;

  constructor(props: SortProps & SortConfig) {
    super(props);

    this.actions = new SortActions(props.dispatcher);
    this.store = new SortStore(props.dispatcher);

    if (props.enabled) {
      this.sortProcessor = this.getOrCreateSortProcessor();
      this.store.on('updated', this.storeUpdated.bind(this));
      this.state = { direction: 0 };
    }
  }

  componentWillUnmount(): void {
    this.store.off('updated', this.storeUpdated.bind(this));
  }

  private storeUpdated(): void {
    const currentColumn = this.store.state.find(
      (x) => x.index === this.props.index,
    );

    if (!currentColumn) {
      this.setState({
        direction: 0,
      });
    } else {
      this.setState({
        direction: currentColumn.direction,
      });
    }
  }

  private getOrCreateSortProcessor(): NativeSort {
    let processorType = ProcessorType.Sort;

    if (this.props.sort && typeof this.props.sort.server === 'object') {
      processorType = ProcessorType.ServerSort;
    }

    const processors = this.props.pipeline.getStepsByType(processorType);

    // my assumption is that we only have ONE sorting processor in the
    // entire pipeline and that's why I'm displaying a warning here
    if (processors.length > 1) {
      log.warn(
        'There are more than sorting pipeline registered, selecting the first one',
      );
    }

    let processor;
    // A sort process is already registered
    if (processors.length > 0) {
      processor = processors[0];
    } else {
      // let's create a new sort processor

      // this event listener is here because
      // we want to subscribe to the sort store only once
      this.store.on('updated', (sortedColumns: SortStoreState) => {
        // updates the Sorting processor
        this.sortProcessor.setProps({
          columns: sortedColumns,
        });
      });

      if (processorType === ProcessorType.ServerSort) {
        processor = new ServerSort({
          columns: this.store.state,
          ...this.props.sort.server,
        });
      } else {
        processor = new NativeSort({
          columns: this.store.state,
        });
      }

      this.props.pipeline.register(processor);
    }

    return processor;
  }

  changeDirection(e: JSX.TargetedMouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();

    // to sort two or more columns at the same time
    this.actions.sortToggle(
      this.props.index,
      e.shiftKey === true && this.props.sort.multiColumn,
      this.props.compare,
    );
  }

  render() {
    if (!this.props.enabled) {
      return null;
    }

    const direction = this.state.direction;
    let sortClassName = 'neutral';

    if (direction === 1) {
      sortClassName = 'asc';
    } else if (direction === -1) {
      sortClassName = 'desc';
    }

    return (
      <button
        title={`Sort column ${direction === 1 ? 'descending' : 'ascending'}`}
        className={classJoin(
          className('sort'),
          className('sort', sortClassName),
        )}
        onClick={this.changeDirection.bind(this)}
      />
    );
  }
}
