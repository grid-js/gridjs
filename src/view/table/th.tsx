import { h, JSX } from 'preact';

import { BaseComponent, BaseProps } from '../base';
import className from '../../util/className';
import { TColumn } from '../../types';
import { Sort } from '../plugin/sort/sort';
import sortActions from '../plugin/sort/actions';
import Pipeline from '../../pipeline/pipeline';

export interface THProps extends BaseProps {
  pipeline: Pipeline<any>;
  index: number;
  column: TColumn;
}

export class TH extends BaseComponent<THProps, {}> {
  private isSortable(): boolean {
    return this.props.column.sort;
  }

  private onClick(e: JSX.TargetedMouseEvent<HTMLInputElement>): void {
    e.stopPropagation();

    if (this.isSortable()) {
      sortActions.sortToggle(this.props.index, e.shiftKey === true);
    }
  }

  render() {
    const cls = `${className('th')} ${
      this.isSortable() ? className('th', 'sort') : ''
    }`.trim();

    return (
      <th
        className={cls}
        onClick={this.onClick.bind(this)}
        style={{ width: this.props.column.width }}
      >
        {this.props.column.name}
        {this.isSortable() && (
          <Sort
            pipeline={this.props.pipeline}
            index={this.props.index}
            column={this.props.column}
          />
        )}
      </th>
    );
  }
}
