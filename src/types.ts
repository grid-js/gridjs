// borrowed from https://github.com/Microsoft/TypeScript/issues/20920
export type ProtoExtends<T, U> = U & Omit<T, keyof U>;

export type OneDArray<T> = T[];
export type TwoDArray<T> = T[][];

// Cell type
export type TBodyCell = number | string | boolean;

// Table header cell type
export interface THeaderCell {
  name: string;
}

// container status
export enum Status {
  Init,
  Loading,
  Loaded,
  Rendered,
}
