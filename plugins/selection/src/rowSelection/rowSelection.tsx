import * as actions from './actions';
import { useStore, className, useEffect, useState, useSelector } from 'gridjs';
import { Row } from 'gridjs';
import { Cell } from 'gridjs';

interface RowSelectionProps {
  // row identifier
  id: (row?: Row) => string;
  // it's optional because thead doesn't have a row
  row?: Row;
  cell?: Cell;
  selectedClassName?: string;
  checkboxClassName?: string;
}

export function RowSelection(props: RowSelectionProps) {
  const { dispatch } = useStore();
  const state = useSelector((state) => state.rowSelection);
  const [isChecked, setIsChecked] = useState(false);
  const selectedClassName =
    props.selectedClassName || className('tr', 'selected');
  const checkboxClassName = props.checkboxClassName || className('checkbox');
  const isDataCell = (props): boolean => props.row !== undefined;
  const getParentTR = (): Element =>
    this.base &&
    this.base.parentElement &&
    (this.base.parentElement.parentElement as Element);

  useEffect(() => {
    // store/dispatcher is required only if we are rendering a TD (not a TH)
    if (props.cell?.data && isDataCell(props)) {
      // mark this checkbox as checked if cell.data is true
      check();
    }
  }, []);

  useEffect(() => {
    const parent = getParentTR();

    if (!parent) return;

    const isChecked = state.rowIds.indexOf(props.id(props.row)) > -1;
    setIsChecked(isChecked);

    if (isChecked) {
      parent.classList.add(selectedClassName);
    } else {
      parent.classList.remove(selectedClassName);
    }
  }, [state]);

  const check = () => {
    dispatch(actions.CheckRow(props.id(props.row)));
    props.cell?.update(true);
  };

  const uncheck = () => {
    dispatch(actions.UncheckRow(props.id(props.row)));
    props.cell?.update(false);
  };

  const toggle = () => {
    if (isChecked) {
      uncheck();
    } else {
      check();
    }
  };

  if (!isDataCell(props)) return null;

  return (
    <input
      type={'checkbox'}
      checked={isChecked}
      onChange={() => toggle()}
      className={checkboxClassName}
    />
  );
}
