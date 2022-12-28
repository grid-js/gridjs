import Tabular from '../tabular';
import { Status } from '../types';

export const SetStatusToRendered = () => (state) => {
  if (state.status === Status.Loaded) {
    return SetStatus(Status.Rendered);
  }

  return state;
};

export const SetStatus = (status: Status) => (state) => {
  return {
    ...state,
    status: status,
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

export const SetNoData = () => (state) => {
  return {
    ...state,
    data: null,
    status: Status.Error,
  };
};
