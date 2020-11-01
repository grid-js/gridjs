import { h } from 'gridjs';
import { CheckboxStore, CheckboxStoreState } from './store';
import { CheckboxActions } from './actions';
import { className } from 'gridjs';
import { Row } from 'gridjs';
import { PluginBaseComponent, PluginBaseProps } from 'gridjs';
import { Cell } from 'gridjs';

interface CheckboxState {
  isChecked: boolean;
}

interface CheckboxProps {
  // it's optional because thead doesn't have a row
  row?: Row;
  cell?: Cell;
  checkboxStore?: CheckboxStore;
  selectedClassName?: string;
  checkboxClassName?: string;
}

export class Checkbox extends PluginBaseComponent<
  CheckboxProps & PluginBaseProps<Checkbox>,
  CheckboxState
> {
  private readonly actions: CheckboxActions;
  private readonly store: CheckboxStore;
  private readonly storeUpdatedFn: (...args) => void;

  private isDataCell = (props): boolean => props.row !== undefined;
  private getParentTR = (): Element =>
    this.base &&
    this.base.parentElement &&
    (this.base.parentElement.parentElement as Element);

  static defaultProps = {
    selectedClassName: className('tr', 'selected'),
    checkboxClassName: className('checkbox'),
  };

  constructor(props: CheckboxProps & PluginBaseProps<Checkbox>, context) {
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
        props.plugin.props.checkboxStore = store;
      } else {
        // restore the existing store
        this.store = props.checkboxStore;
      }

      this.actions = new CheckboxActions(this.config.dispatcher);
      this.storeUpdatedFn = this.storeUpdated.bind(this);
      this.store.on('updated', this.storeUpdatedFn);

      // also mark this checkbox as checked if cell.data is true
      if (props.cell.data) {
        this.check();
      }
    }
  }

  componentWillUnmount(): void {
    this.store.off('updated', this.storeUpdatedFn);
  }

  componentDidMount(): void {
    if (this.store) this.storeUpdated(this.store.state);
  }

  private storeUpdated(state: CheckboxStoreState): void {
    const parent = this.getParentTR();

    if (!parent) return;

    const isChecked = state.rowIds.indexOf(this.props.row.id) > -1;

    this.setState({
      isChecked: isChecked,
    });

    if (isChecked) {
      parent.classList.add(this.props.selectedClassName);
    } else {
      parent.classList.remove(this.props.selectedClassName);
    }
  }

  private check(): void {
    this.actions.check(this.props.row.id);
    this.props.cell.update(true);
  }

  private uncheck(): void {
    this.actions.uncheck(this.props.row.id);
    this.props.cell.update(false);
  }

  private toggle(): void {
    if (this.state.isChecked) {
      this.uncheck();
    } else {
      this.check();
    }
  }

  render() {
    if (this.isDataCell(this.props)) {
      return (
        <input
          type={'checkbox'}
          checked={this.state.isChecked}
          onChange={() => this.toggle()}
          className={this.props.checkboxClassName}
        />
      );
    }

    return null;
  }
}
