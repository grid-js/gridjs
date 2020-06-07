// borrowed from https://github.com/Microsoft/TypeScript/issues/20920
import { ComponentChild } from 'preact';
import Row from "./row";

export type ProtoExtends<T, U> = U & Omit<T, keyof U>;

export type OneDArray<T> = T[];
export type TwoDArray<T> = T[][];

// Table cell type
export type TCell = number | string | boolean;

// Table header cell type
export interface TColumn {
  name: string;
  width?: string;
  sort?: boolean;
  children?: OneDArray<TColumn>;
  formatter?: (cell: TCell, row: Row<TCell>, column: TColumn) => ComponentChild;
}

// container status
export enum Status {
  Init,
  Loading,
  Loaded,
  Rendered,
  Error,
}
