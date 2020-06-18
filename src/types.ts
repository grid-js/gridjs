// borrowed from https://github.com/Microsoft/TypeScript/issues/20920
import { ComponentChild, VNode } from 'preact';
import Row from './row';
import { SortConfig } from './view/plugin/sort/sort';

export type ProtoExtends<T, U> = U & Omit<T, keyof U>;

export type OneDArray<T> = T[];
export type TwoDArray<T> = T[][];

// Table cell type
export type TCellPrimitive = number | string | boolean | VNode<any>;
export type TCell = TCellPrimitive | (() => TCellPrimitive);

// Table header cell type
export interface TColumn {
  name: string;
  width?: string;
  sort?: SortConfig;
  children?: OneDArray<TColumn>;
  formatter?: (cell: TCell, row: Row, column: TColumn) => ComponentChild;
}

// Comparator function for the sorting plugin
export type Comparator<T> = (a: T, b: T) => number;

export interface TColumnSort {
  index: number;
  // 1 ascending, -1 descending
  direction?: 1 | -1;
}

// container status
export enum Status {
  Init,
  Loading,
  Loaded,
  Rendered,
  Error,
}
