import Storage, { StorageResponse } from './storage';
import { TData } from '../types';

class MemoryStorage extends Storage<TData> {
  private data: (() => TData) | (() => Promise<TData>);

  constructor(data: TData | (() => TData) | (() => Promise<TData>)) {
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

  public set(data: TData | (() => TData) | (() => Promise<TData>)): this {
    if (data instanceof Array) {
      this.data = (): TData => data;
    } else if (data instanceof Function) {
      this.data = data;
    }

    return this;
  }
}

export default MemoryStorage;
