import { h } from 'gridjs';
import { RowSelectionStore, RowSelectionStoreState } from './store';
import { RowSelectionActions } from './actions';
import { className } from 'gridjs';
import { Row } from 'gridjs';
import { PluginBaseComponent, PluginBaseProps } from 'gridjs';
import { Cell } from 'gridjs';

interface RowSelectionState {
  isChecked: boolean;
}

interface RowSelectionProps {
  // row identifier
  id: (row: Row) => string;
  // it's optional because thead doesn't have a row
  row?: Row;
  cell?: Cell;
  store?: RowSelectionStore;
  selectedClassName?: string;
  checkboxClassName?: string;
}

export class RowSelection extends PluginBaseComponent<
  RowSelectionProps & PluginBaseProps<RowSelection>,
  RowSelectionState
> {
  private readonly actions: RowSelectionActions;
  private readonly store: RowSelectionStore;
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

  constructor(props: RowSelectionProps & PluginBaseProps<RowSelection>, context) {
    super(props, context);

    this.state = {
      isChecked: false,
    };

    // store/dispatcher is required only if we are rendering a TD (not a TH)
    if (this.isDataCell(props)) {
      // create a new store if a global store doesn't exist
      if (!props.store) {
        const store = new RowSelectionStore(this.config.dispatcher);
        this.store = store;

        // to reuse for other checkboxes
        props.plugin.props.store = store;
      } else {
        // restore the existing store
        this.store = props.store;
      }

      this.actions = new RowSelectionActions(this.config.dispatcher);
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

  private storeUpdated(state: RowSelectionStoreState): void {
    const parent = this.getParentTR();

    if (!parent) return;

    const isChecked = state.rowIds.indexOf(this.props.id(this.props.row)) > -1;

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
    this.actions.check(this.props.id(this.props.row));
    this.props.cell.update(true);
  }

  private uncheck(): void {
    this.actions.uncheck(this.props.id(this.props.row));
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
