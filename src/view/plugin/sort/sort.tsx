import { h, JSX } from 'preact';

import { BaseComponent, BaseProps } from '../../base';
import { classJoin, className } from '../../../util/className';
import { ProcessorType } from '../../../pipeline/processor';
import NativeSort from '../../../pipeline/sort/native';
import { SortStore, SortStoreState } from './store';
import { Comparator, TCell, TColumnSort } from '../../../types';
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
  // column index
  index: number;
}

interface SortState {
  direction: 1 | -1 | 0;
}

export class Sort extends BaseComponent<SortProps & SortConfig, SortState> {
  private readonly sortProcessor: NativeSort | ServerSort;
  private readonly actions: SortActions;
  private readonly store: SortStore;
  private readonly updateStateFn: (...args) => void;
  private updateSortProcessorFn: (sortedColumns: SortStoreState) => void;

  constructor(props: SortProps & SortConfig, context) {
    super(props, context);

    this.actions = new SortActions(this.config.dispatcher);
    this.store = new SortStore(this.config.dispatcher);

    if (props.enabled) {
      this.sortProcessor = this.getOrCreateSortProcessor();
      this.updateStateFn = this.updateState.bind(this);
      this.store.on('updated', this.updateStateFn);
      this.state = { direction: 0 };
    }
  }

  componentWillUnmount(): void {
    this.config.pipeline.unregister(this.sortProcessor);

    this.store.off('updated', this.updateStateFn);
    if (this.updateSortProcessorFn)
      this.store.off('updated', this.updateSortProcessorFn);
  }

  /**
   * Sets the internal state of component
   */
  private updateState(): void {
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

  private updateSortProcessor(sortedColumns: SortStoreState) {
    // updates the Sorting processor
    this.sortProcessor.setProps({
      columns: sortedColumns,
    });
  }

  private getOrCreateSortProcessor(): NativeSort {
    let processorType = ProcessorType.Sort;

    if (this.config.sort && typeof this.config.sort.server === 'object') {
      processorType = ProcessorType.ServerSort;
    }

    const processors = this.config.pipeline.getStepsByType(processorType);

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
      this.updateSortProcessorFn = this.updateSortProcessor.bind(this);
      this.store.on('updated', this.updateSortProcessorFn);

      if (processorType === ProcessorType.ServerSort) {
        processor = new ServerSort({
          columns: this.store.state,
          ...this.config.sort.server,
        });
      } else {
        processor = new NativeSort({
          columns: this.store.state,
        });
      }

      this.config.pipeline.register(processor);
    }

    return processor;
  }

  changeDirection(e: JSX.TargetedMouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();

    // to sort two or more columns at the same time
    this.actions.sortToggle(
      this.props.index,
      e.shiftKey === true && this.config.sort.multiColumn,
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
        // because the corresponding <th> has tabIndex=0
        tabIndex={-1}
        aria-label={this._(`sort.sort${direction === 1 ? 'Desc' : 'Asc'}`)}
        title={this._(`sort.sort${direction === 1 ? 'Desc' : 'Asc'}`)}
        className={classJoin(
          className('sort'),
          className('sort', sortClassName),
          this.config.className.sort,
        )}
        onClick={this.changeDirection.bind(this)}
      />
    );
  }
}
