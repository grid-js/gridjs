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
import { Plugin } from '../../../plugin';

interface CheckboxState {
  isChecked: boolean;
}

interface CheckboxProps {
  plugin: Plugin<Checkbox>;
  parent: BaseComponent<any, any>;
  // it's optional because thead doesn't have a row
  row?: Row;
  checkboxStore?: CheckboxStore;
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

  private isDataCell = (props): boolean => props.row !== undefined;
  private getParent = (): Element => this.props.parent.base as Element;

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

    // store/dispatcher is required only if we are rendering a TD (not a TH)
    if (this.isDataCell(props)) {
      // create a new store if a global store doesn't exist
      if (!props.checkboxStore) {
        const store = new CheckboxStore(this.config.dispatcher);
        this.store = store;

        // to reuse for other checkboxes
        // TODO: investigate typechecking issue here
        props.plugin.props['checkboxStore'] = store;
      } else {
        // restore the existing store
        this.store = props.checkboxStore;
      }

      this.actions = new CheckboxActions(this.config.dispatcher);
      this.storeUpdatedFn = this.storeUpdated.bind(this);
      this.store.on('updated', this.storeUpdatedFn);
    }
  }

  componentWillUnmount(): void {
    this.store.off('updated', this.storeUpdatedFn);
  }

  componentDidMount(): void {
    if (this.store) this.storeUpdated(this.store.state);
  }

  private storeUpdated(state: CheckboxStoreState): void {
    const parent = this.getParent();

    if (!parent) return;

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

    if (this.isDataCell(this.props)) {
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
