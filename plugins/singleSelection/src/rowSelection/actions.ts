export const CheckRow = (rowId: string) => (state) => {
  const rowIds = state.rowSelection?.rowIds || [];

  // rowId already exists
  if (rowIds.indexOf(rowId) > -1) return state;

  return {
    ...state,
    rowSelection: {
      rowIds: [rowId],
    },
  };
};

export const UncheckRow = (rowId: string) => (state) => {
  const rowIds = state.rowSelection?.rowIds || [];
  const index = rowIds.indexOf(rowId);

  // rowId doesn't exist
  if (index === -1) return state;

  const cloned = [...rowIds];
  cloned.splice(index, 1);

  return {
    ...state,
    rowSelection: {
      rowIds: cloned,
    },
  };
};
