// type of each cell
export type TCell = number | string | boolean;

export type OneDArray = TCell[];
export type TwoDArray = TCell[][];

// container status
export enum Status {
  Init,
  Loading,
  Loaded,
  Rendered,
}
