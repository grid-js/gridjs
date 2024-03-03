import { h } from 'preact';
import * as actions from './actions';
import { useStore, className, useEffect, useState, useSelector } from 'gridjs';
import { Row } from 'gridjs';
import { Cell } from 'gridjs';

interface RowSelectionProps {
  // it's optional because thead doesn't have a row
  row?: Row;
  cell?: Cell;
}

export function RowSelectionSingle(props: RowSelectionProps) {
  return RowSelectionCore(props, true);
}

export function RowSelectionMultiple(props: RowSelectionProps) {
  return RowSelectionCore(props, false);
}

export function RowSelection(props: RowSelectionProps) {
  return RowSelectionCore(props, false);
}

export function RowSelectionCore(
  props: RowSelectionProps,
  singleSelect: boolean = false,
) {
  const { dispatch } = useStore();
  const state = useSelector((state) => state.rowSelection);
  const [isChecked, setIsChecked] = useState(false);
  const selectedClassName = className('tr', 'selected');
  const checkboxClassName = className('checkbox');
  const isDataCell = (props) => props.row !== undefined;
  const getParentTR = () =>
    this.base &&
    this.base.parentElement &&
    (this.base.parentElement.parentElement as Element);

  const isSingleSelect: boolean = singleSelect;

  useEffect(() => {
    // store/dispatcher is required only if we are rendering a TD (not a TH)
    if (props.cell?.data && isDataCell(props)) {
      // mark this checkbox as checked if cell.data is true
      check();
    }
  }, []);

  useEffect(() => {
    const rowIds = state?.rowIds || [];
    const isChecked = rowIds.indexOf(props.row.id) > -1;

    setIsChecked(isChecked);

    const parent = getParentTR();

    if (!parent) return;

    if (isChecked) {
      parent.classList.add(selectedClassName);
    } else {
      parent.classList.remove(selectedClassName);
    }
  }, [state]);

  const check = () => {
    dispatch(actions.CheckRow(props.row.id, isSingleSelect));
    props.cell?.update(true);
  };

  const uncheck = () => {
    dispatch(actions.UncheckRow(props.row.id));
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
