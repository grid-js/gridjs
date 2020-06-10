import { createRef, h, JSX } from 'preact';

import { BaseComponent, BaseProps } from '../base';
import { classJoin, className } from '../../util/className';
import { TColumn } from '../../types';
import { GenericSortConfig, Sort } from '../plugin/sort/sort';
import Pipeline from '../../pipeline/pipeline';
import Dispatcher from '../../util/dispatcher';

export interface THProps extends BaseProps {
  dispatcher: Dispatcher<any>;
  pipeline: Pipeline<any>;
  index: number;
  column: TColumn;
  sort?: GenericSortConfig;
}

export class TH extends BaseComponent<THProps, {}> {
  private sortRef = createRef();

  private isSortable(): boolean {
    return this.props.column.sort.enabled;
  }

  private onClick(e: JSX.TargetedMouseEvent<HTMLInputElement>): void {
    e.stopPropagation();

    if (this.isSortable()) {
      this.sortRef.current.changeDirection(e);
    }
  }

  render() {
    const cls = classJoin(
      className('th'),
      this.isSortable() ? className('th', 'sort') : null,
    );

    return (
      <th
        className={cls}
        onClick={this.onClick.bind(this)}
        style={{ width: this.props.column.width }}
      >
        {this.props.column.name}
        {this.isSortable() && (
          <Sort
            ref={this.sortRef}
            dispatcher={this.props.dispatcher}
            pipeline={this.props.pipeline}
            index={this.props.index}
            sort={this.props.sort}
            {...this.props.column.sort}
          />
        )}
      </th>
    );
  }
}
