import { h, JSX } from 'preact';

import { BaseComponent, BaseProps } from '../../base';
import { classJoin, className } from '../../../util/className';
import { ProcessorType } from '../../../pipeline/processor';
import NativeSort from '../../../pipeline/sort/native';
import { SortStore, SortStoreState } from './store';
import Pipeline from '../../../pipeline/pipeline';
import log from '../../../util/log';
import { Comparator, TCell } from '../../../types';
import Dispatcher from '../../../util/dispatcher';
import { SortActions } from './actions';

export interface SortConfig {
  enabled?: boolean;
  compare?: Comparator<TCell>;
}

export interface SortProps extends BaseProps {
  dispatcher: Dispatcher<any>;
  pipeline: Pipeline<any>;
  index: number;
}

interface SortState {
  direction: 1 | -1 | 0;
}

export class Sort extends BaseComponent<SortProps & SortConfig, SortState> {
  private readonly sortProcessor: NativeSort;
  private readonly actions: SortActions;
  private readonly store: SortStore;

  constructor(props: SortProps & SortConfig) {
    super(props);

    this.actions = new SortActions(props.dispatcher);
    this.store = new SortStore(props.dispatcher);

    if (props.enabled) {
      this.sortProcessor = this.getOrCreateSortProcessor();
      this.state = { direction: 0 };
      this.store.on('updated', this.storeUpdated.bind(this));
    }
  }

  componentWillUnmount(): void {
    this.store.off('updated', this.storeUpdated.bind(this));
  }

  private storeUpdated(sortedColumns: SortStoreState): void {
    // updates the Sorting processor
    this.sortProcessor.setProps({
      columns: sortedColumns,
    });

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
    const processors = this.props.pipeline.getStepsByType(ProcessorType.Sort);
    let processor;

    // my assumption is that we only have ONE sorting processor in the
    // entire pipeline and that's why I'm displaying a warning here
    if (processors.length > 1) {
      log.warn(
        'There are more than sorting pipeline registered, selecting the first one',
      );
    }

    if (processors.length > 0) {
      processor = processors[0];
    } else {
      processor = new NativeSort({
        columns: this.store.state,
      });

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
      e.shiftKey === true,
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
