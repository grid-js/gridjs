import { ComponentChild, createRef, h, JSX } from 'preact';

import { BaseComponent, BaseProps } from '../base';
import { classJoin, className } from '../../util/className';
import { CSSDeclaration, TColumn } from '../../types';
import { Sort } from '../plugin/sort/sort';
import { PluginRenderer } from '../../plugin';

export interface THProps
  extends BaseProps,
    JSX.HTMLAttributes<HTMLTableCellElement> {
  index: number;
  column: TColumn;
  style?: CSSDeclaration;
}

export interface THState {
  style: CSSDeclaration;
}

export class TH extends BaseComponent<THProps, THState> {
  private sortRef = createRef();
  private thRef = createRef();

  constructor(props, context) {
    super(props, context);

    this.state = {
      style: {},
    };
  }

  private isSortable(): boolean {
    return this.props.column.sort.enabled;
  }

  private onClick(e: JSX.TargetedMouseEvent<HTMLInputElement>): void {
    e.stopPropagation();

    if (this.isSortable()) {
      this.sortRef.current.changeDirection(e);
    }
  }

  private keyDown(e: JSX.TargetedMouseEvent<HTMLInputElement>): void {
    if (this.isSortable() && e.which === 13) {
      this.onClick(e);
    }
  }

  componentDidMount(): void {
    setTimeout(() => {
      // sets the `top` style if the current TH is fixed
      if (this.props.column.fixedHeader && this.thRef.current) {
        const offsetTop = this.thRef.current.offsetTop;

        if (typeof offsetTop === 'number') {
          this.setState({
            style: {
              top: offsetTop,
            },
          });
        }
      }
    }, 0);
  }

  private content(): ComponentChild {
    if (this.props.column.name !== undefined) {
      return this.props.column.name;
    }

    if (this.props.column.plugin !== undefined) {
      return (
        <PluginRenderer
          pluginId={this.props.column.plugin.id}
          props={{
            column: this.props.column,
          }}
        />
      );
    }

    return null;
  }

  render() {
    const props = {};

    if (this.isSortable()) {
      props['tabIndex'] = 0;
    }

    return (
      <th
        ref={this.thRef}
        data-column-id={this.props.column && this.props.column.id}
        className={classJoin(
          className('th'),
          this.isSortable() ? className('th', 'sort') : null,
          this.props.column.fixedHeader ? className('th', 'fixed') : null,
          this.config.className.th,
        )}
        onClick={this.onClick.bind(this)}
        style={{
          ...this.config.style.th,
          ...{ width: this.props.column.width },
          ...this.state.style,
          ...this.props.style,
        }}
        onKeyDown={this.keyDown.bind(this)}
        rowSpan={this.props.rowSpan > 1 ? this.props.rowSpan : undefined}
        colSpan={this.props.colSpan > 1 ? this.props.colSpan : undefined}
        {...props}
      >
        {this.content()}
        {this.isSortable() && (
          <Sort
            ref={this.sortRef}
            index={this.props.index}
            {...this.props.column.sort}
          />
        )}
      </th>
    );
  }
}
