import { OneDArray, TwoDArray } from '../types';

export function oneDtoTwoD(data: OneDArray | TwoDArray): TwoDArray {
  if (!(data[0] instanceof Array)) {
    return [data] as TwoDArray;
  }

  return data as TwoDArray;
}
