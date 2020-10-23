import { h } from 'preact';
import { BaseComponent, BaseProps } from '../../base';
import { CheckboxStore, CheckboxStoreState } from './store';
import { CheckboxActions } from './actions';
import { TD } from '../../table/td';
import Cell from '../../../cell';
import { className } from '../../../util/className';
import Row from '../../../row';
import { TH } from '../../table/th';
import { CSSDeclaration } from '../../../types';

interface CheckboxState {
  isChecked: boolean;
}

interface CheckboxProps {
  parent: BaseComponent<any, any>;
  // it's optional because thead doesn't have a row
  row?: Row;
  highlightClassName?: string;
  checkboxClassName?: string;
  style?: CSSDeclaration;
}

export class Checkbox extends BaseComponent<
  CheckboxProps & BaseProps,
  CheckboxState
> {
  private readonly actions: CheckboxActions;
  private readonly store: CheckboxStore;
  private readonly storeUpdatedFn: (...args) => void;

  static defaultProps = {
    highlightClassName: className('tr', 'highlight'),
    checkboxClassName: className('checkbox'),
    style: {
      textAlign: 'center',
      width: '35px',
      padding: 0,
      margin: 0,
    },
  };

  constructor(props: CheckboxProps & BaseProps, context) {
    super(props, context);

    this.state = {
      isChecked: false,
    };

    if (this.isTD(props)) {
      this.actions = new CheckboxActions(this.config.dispatcher);
      this.store = new CheckboxStore(this.config.dispatcher);

      this.storeUpdatedFn = this.storeUpdated.bind(this);
      this.store.on('updated', this.storeUpdatedFn);
    }
  }

  componentWillUnmount(): void {
    this.store.off('updated', this.storeUpdatedFn);
  }

  private isTD(props): boolean {
    return props.row !== undefined;
  }

  private getParent(): Element {
    return this.props.parent.base as Element;
  }

  private storeUpdated(state: CheckboxStoreState): void {
    const parent = this.getParent();
    const isChecked = state.rowIds.indexOf(this.props.row.id) > -1;

    this.setState({
      isChecked: isChecked,
    });

    if (isChecked) {
      parent.classList.add(this.props.highlightClassName);
    } else {
      parent.classList.remove(this.props.highlightClassName);
    }
  }

  private toggleCheckbox(): void {
    if (this.state.isChecked) {
      this.actions.uncheck(this.props.row.id);
    } else {
      this.actions.check(this.props.row.id);
    }
  }

  render() {
    const checkboxElement = (
      <input
        type={'checkbox'}
        checked={this.state.isChecked}
        onChange={() => this.toggleCheckbox()}
      />
    );

    if (this.isTD(this.props)) {
      return (
        <TD
          cell={new Cell(checkboxElement)}
          className={this.props.checkboxClassName}
          style={this.props.style}
        />
      );
    } else {
      return (
        <TH
          column={{
            sort: { enabled: false },
            name: 'checkbox',
          }}
          style={this.props.style}
          index={-1}
        />
      );
    }
  }
}
