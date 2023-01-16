import Header from 'src/header';
import Tabular from '../tabular';
import { Status } from '../types';

export const SetStatusToRendered = () => (state) => {
  if (state.status === Status.Loaded) {
    return {
      ...state,
      status: Status.Rendered,
    };
  }

  return state;
};

export const SetLoadingData = () => (state) => {
  return {
    ...state,
    status: Status.Loading,
  };
};

export const SetData = (data: Tabular) => (state) => {
  if (!data) return state;

  return {
    ...state,
    data: data,
    status: Status.Loaded,
  };
};

export const SetDataErrored = () => (state) => {
  return {
    ...state,
    data: null,
    status: Status.Error,
  };
};

export const SetHeader = (header: Header) => (state) => {
  return {
    ...state,
    header: header,
  };
};

export const SetTableRef = (tableRef) => (state) => {
  return {
    ...state,
    tableRef: tableRef,
  };
};
