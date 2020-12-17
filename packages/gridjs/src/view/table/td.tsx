import { ComponentChild, h, JSX } from 'preact';

import Cell from '../../cell';
import { BaseComponent, BaseProps } from '../base';
import { classJoin, className } from '../../util/className';
import { CSSDeclaration, TColumn } from '../../types';
import Row from '../../row';
import { JSXInternal } from 'preact/src/jsx';
import { PluginRenderer } from '../../plugin';

export interface TDProps
  extends BaseProps,
  JSX.HTMLAttributes<HTMLTableCellElement> {
  cell: Cell;
  row?: Row;
  column?: TColumn;
  style?: CSSDeclaration;
  messageCell?: boolean;
}

export class TD extends BaseComponent<TDProps> {
  private content(): ComponentChild {
    if (
      this.props.column &&
      typeof this.props.column.formatter === 'function'
    ) {
      return this.props.column.formatter(
        this.props.cell.data,
        this.props.row,
        this.props.column,
      );
    }

    if (this.props.column && this.props.column.plugin) {
      return (
        <PluginRenderer
          pluginId={this.props.column.id}
          props={{
            column: this.props.column,
            cell: this.props.cell,
            row: this.props.row,
          }}
        />
      );
    }

    return this.props.cell.data;
  }

  private handleClick(e: JSX.TargetedMouseEvent<HTMLTableCellElement>): void {
    if (this.props.messageCell)
      return;
    this.config.eventEmitter.emit(
      'cellClick',
      e,
      this.props.cell,
      this.props.column,
      this.props.row,
    );
  }

  private getCustomAttributes(
    column: TColumn | null,
  ): JSXInternal.HTMLAttributes<HTMLTableCellElement> {
    if (column) {
      if (typeof column.attributes === 'function') {
        return column.attributes(
          this.props.cell.data,
          this.props.row,
          this.props.column,
        );
      } else {
        return column.attributes;
      }
    }

    return {};
  }

  render() {
    return (
      <td
        role={this.props.role}
        colSpan={this.props.colSpan}
        data-column-id={this.props.column && this.props.column.id}
        className={classJoin(
          className('td'),
          this.props.className,
          this.config.className.td,
        )}
        style={{
          ...this.props.style,
          ...this.config.style.td,
        }}
        onClick={this.handleClick.bind(this)}
        {...this.getCustomAttributes(this.props.column)}
      >
        {this.content()}
      </td>
    );
  }
}
