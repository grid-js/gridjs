import { h } from 'preact';
import { BaseComponent, BaseProps } from '../../base';
import { CheckboxStore, CheckboxStoreState } from './store';
import { CheckboxActions } from './actions';
import { TD } from '../../table/td';
import Cell from '../../../cell';
import { className } from '../../../util/className';
import { ID } from '../../../util/id';

interface CheckboxState {
  isChecked: boolean;
}

interface CheckboxProps {
  rowId: ID;
}

export class Checkbox extends BaseComponent<
  CheckboxProps & BaseProps,
  CheckboxState
> {
  private readonly actions: CheckboxActions;
  private readonly store: CheckboxStore;
  private readonly storeUpdatedFn: (...args) => void;

  constructor(props: CheckboxProps & BaseProps, context) {
    super(props, context);

    this.state = {
      isChecked: false,
    };

    this.actions = new CheckboxActions(this.config.dispatcher);
    this.store = new CheckboxStore(this.config.dispatcher);

    this.storeUpdatedFn = this.storeUpdated.bind(this);
    this.store.on('updated', this.storeUpdatedFn);
  }

  private storeUpdated(state: CheckboxStoreState): void {
    console.log('store updated', state);
  }

  private toggleCheckbox(): void {
    const isChecked = this.state.isChecked;

    if (isChecked) {
      this.actions.uncheck(this.props.rowId);
    } else {
      this.actions.check(this.props.rowId);
    }

    this.setState({
      isChecked: !isChecked,
    });
  }

  componentWillUnmount(): void {
    this.store.off('updated', this.storeUpdatedFn);
  }

  render() {
    const checkboxElement = (
      <input
        type={'checkbox'}
        checked={this.state.isChecked}
        onChange={() => this.toggleCheckbox()}
      />
    );

    return (
      <TD cell={new Cell(checkboxElement)} className={className('checkbox')} />
    );
  }
}
