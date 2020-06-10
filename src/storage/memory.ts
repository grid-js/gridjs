import Storage, { StorageResponse } from './storage';
import { TCell, TwoDArray } from '../types';

class MemoryStorage extends Storage<
  | TwoDArray<TCell>
  | (() => TwoDArray<TCell>)
  | (() => Promise<TwoDArray<TCell>>)
> {
  private data: (() => TwoDArray<TCell>) | (() => Promise<TwoDArray<TCell>>);

  constructor(
    data:
      | TwoDArray<TCell>
      | (() => TwoDArray<TCell>)
      | (() => Promise<TwoDArray<TCell>>),
  ) {
    super();
    this.set(data);
  }

  public async get(): Promise<StorageResponse> {
    const data = await this.data();

    return {
      data: data,
      total: data.length,
    };
  }

  public set(
    data:
      | TwoDArray<TCell>
      | (() => TwoDArray<TCell>)
      | (() => Promise<TwoDArray<TCell>>),
  ): this {
    if (data instanceof Array) {
      this.data = (): TwoDArray<TCell> => data;
    } else if (data instanceof Function) {
      this.data = data;
    }

    return this;
  }
}

export default MemoryStorage;
