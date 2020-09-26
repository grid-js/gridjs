import { OneDArray, TwoDArray } from '../types';

export function oneDtoTwoD<T>(data: OneDArray<T> | TwoDArray<T>): TwoDArray<T> {
  if (data[0] && !(data[0] instanceof Array)) {
    return [data] as TwoDArray<T>;
  }

  return data as TwoDArray<T>;
}

export function flatten<T>(arrays: TwoDArray<T>): OneDArray<T> {
  return arrays.reduce((prev, x) => prev.concat(x), []);
}
