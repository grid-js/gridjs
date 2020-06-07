import { h, JSX } from 'preact';

import { BaseComponent, BaseProps } from '../../base';
import { className } from '../../../util/className';
import { TColumn } from '../../../types';
import { ProcessorType } from '../../../pipeline/processor';
import NativeSort from '../../../pipeline/sort/native';
import store, { SortStoreState } from './store';
import actions from './actions';
import Pipeline from '../../../pipeline/pipeline';
import log from '../../../util/log';

export interface SortProps extends BaseProps {
  pipeline: Pipeline<any>;
  index: number;
  column: TColumn;
}

interface SortState {
  direction: 1 | -1 | 0;
}

export class Sort extends BaseComponent<SortProps, SortState> {
  private sortProcessor: NativeSort;

  constructor(props: SortProps) {
    super(props);

    this.sortProcessor = this.getOrCreateSortProcessor();
    this.state = { direction: 0 };
    store.on('updated', this.storeUpdated.bind(this));
  }

  componentWillUnmount(): void {
    store.off('updated', this.storeUpdated.bind(this));
  }

  private storeUpdated(sortedColumns: SortStoreState): void {
    // updates the Sorting processor
    this.sortProcessor.setProps({
      columns: sortedColumns,
    });

    const currentColumn = store.state.find((x) => x.index === this.props.index);

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
        columns: store.state,
      });

      this.props.pipeline.register(processor);
    }

    return processor;
  }

  public changeDirection(e: JSX.TargetedMouseEvent<HTMLInputElement>): void {
    e.preventDefault();
    e.stopPropagation();

    // to sort two or more columns at the same time
    actions.sortToggle(this.props.index, e.shiftKey === true);
  }

  render() {
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
        className={`${className('sort')} ${className('sort', sortClassName)}`}
        onClick={this.changeDirection.bind(this)}
      />
    );
  }
}
