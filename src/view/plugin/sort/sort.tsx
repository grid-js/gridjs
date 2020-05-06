import { h, JSX } from 'preact';

import { BaseComponent, BaseProps } from '../../base';
import className from '../../../util/className';
import { THeaderCell } from '../../../types';

import '../../../theme/mermaid/th.scss';
import Config from '../../../config';
import { ProcessorType } from '../../../pipeline/processor';
import NativeSort from '../../../pipeline/sort/native';
import store, { SortStoreState } from './store';
import actions from './actions';

export interface SortProps extends BaseProps {
  index: number;
  column: THeaderCell;
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

  componentDidMount(): void {
    if (this.props.column.sort) {
      actions.sortColumn(this.props.index, 1);
    }
  }

  componentWillUnmount(): void {
    store.off('updated', this.storeUpdated.bind(this));
  }

  private storeUpdated(sortedColumns: SortStoreState): void {
    // updates the Sorting processor
    this.sortProcessor.setProps({
      columns: sortedColumns,
    });

    const currentColumn = store.state.find(x => x.index === this.props.index);

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
    const processors = Config.current.pipeline.getStepsByType(
      ProcessorType.Sort,
    );
    let processor;

    // my assumption is that we only have ONE sorting processor in the
    // entire pipeline and that's why I'm displaying a warning here
    if (processors.length > 1) {
      console.warn(
        'There are more than sorting pipeline registered, selecting the first one',
      );
    }

    if (processors.length > 0) {
      processor = processors[0];
    } else {
      processor = new NativeSort({
        columns: store.state,
      });

      Config.current.pipeline.register(processor);
    }

    return processor;
  }

  private changeDirection(e: JSX.TargetedMouseEvent<HTMLInputElement>): void {
    // to sort two or more columns at the same time
    const multiSort = e.shiftKey === true;
    const direction = this.state.direction === 1 ? -1 : 1;
    actions.sortColumn(this.props.index, direction, multiSort);
  }

  render() {
    let direction = <b>sort</b>;
    if (this.state.direction === 1) {
      direction = (
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiElEQVQ4T93SIQ7CYBCE0VdQXAHBdVCYOm6AQFVxBQQKxRFIBZKE65AeAtGUNIGE/OmGNnVdOztfNrOTGTnZSL+JAxZ4oMYar668ogxmKJF/TFds0aSQCHBCkSwfcegD2OMcvHeHy6+WXrDBDfMA0ObR7ty/egqosPxTridWEWBwMSfexF55vAHykg8RKs7ZRQAAAABJRU5ErkJggg==" />
      );
    } else if (this.state.direction === -1) {
      direction = (
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T93TMQrCUAzG8V9x8QziiYSuXdzFC7h4AcELOPQAdXYovZCHEATlgQV5GFTe1ozJlz/kS1IpjKqw3wQBVyy++JI0y1GTe7DCBbMAckeNIQKk/BanALBB+16LtnDELoMcsM/BESDlz2heDR3WePwKSLo5eoxz3z6NNcFD+vu3ij14Aqz/DxGbKB7CAAAAAElFTkSuQmCC" />
      );
    }

    return (
      <button
        className={className('sort')}
        onClick={this.changeDirection.bind(this)}
      >
        {direction}
      </button>
    );
  }
}
