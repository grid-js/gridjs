import { h } from 'preact';

import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import { THeaderCell } from '../../types';

import '../../theme/mermaid/th.scss';
import Config from '../../config';
import { ProcessorType } from '../../pipeline/processor';
import NativeSort from '../../pipeline/sort/native';

export interface SortProps extends BaseProps {
  index: number;
  column: THeaderCell;
}

interface SortState {
  sort?: {
    direction: 1 | -1;
  };
}

export class Sort extends BaseComponent<SortProps, SortState> {
  private sortProcessor: NativeSort;

  constructor(props: SortProps) {
    super(props);

    let state = {};

    if (props.column.sort) {
      state = {
        sort: {
          direction: 1,
        },
        ...state,
      };
    }

    this.state = state;
    this.sortProcessor = this.getOrCreateSortProcessor();
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
        columns: [
          {
            index: this.props.index,
            direction: this.state.sort.direction,
          },
        ],
      });

      Config.current.pipeline.register(processor);
    }

    return processor;
  }

  private getSortColumns(direction: 1 | -1) {
    const sortColumns = [...this.sortProcessor.props.columns];
    const currentColumn = sortColumns.filter(
      col => col.index === this.props.index,
    );

    if (currentColumn.length === 0) {
      console.log('not found!', sortColumns, currentColumn);
      sortColumns.push({
        index: this.props.index,
        direction: direction,
      });
    } else {
      console.log('FOUNDDD', sortColumns, currentColumn);
      currentColumn[0].direction = direction;
    }

    return sortColumns;
  }

  private setDirection(direction: 1 | -1): void {
    console.log(this.props, direction);
    this.setState({
      sort: {
        direction: direction,
      },
    });

    this.sortProcessor.setProps({
      columns: this.getSortColumns(direction),
    });
  }

  private changeDirection(): void {
    const direction = this.state.sort.direction === 1 ? -1 : 1;
    this.setDirection(direction);
  }

  render() {
    if (this.state.sort) {
      let img;
      if (this.state.sort.direction === 1) {
        img = (
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiElEQVQ4T93SIQ7CYBCE0VdQXAHBdVCYOm6AQFVxBQQKxRFIBZKE65AeAtGUNIGE/OmGNnVdOztfNrOTGTnZSL+JAxZ4oMYar668ogxmKJF/TFds0aSQCHBCkSwfcegD2OMcvHeHy6+WXrDBDfMA0ObR7ty/egqosPxTridWEWBwMSfexF55vAHykg8RKs7ZRQAAAABJRU5ErkJggg==" />
        );
      } else {
        img = (
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T93TMQrCUAzG8V9x8QziiYSuXdzFC7h4AcELOPQAdXYovZCHEATlgQV5GFTe1ozJlz/kS1IpjKqw3wQBVyy++JI0y1GTe7DCBbMAckeNIQKk/BanALBB+16LtnDELoMcsM/BESDlz2heDR3WePwKSLo5eoxz3z6NNcFD+vu3ij14Aqz/DxGbKB7CAAAAAElFTkSuQmCC" />
        );
      }

      return (
        <button
          className={className('sort')}
          onClick={this.changeDirection.bind(this)}
        >
          {img}
        </button>
      );
    }

    return null;
  }
}
