import Storage from './storage';

class MemoryStorage extends Storage {
  private data: Function;

  constructor(data: any[][] | Function) {
    super();
    this.set(data);
  }

  public async get(): Promise<any[][]> {
    return await this.data();
  }

  public set(data: any[][] | Function): MemoryStorage {
    if (data instanceof Array) {
      this.data = (): any[][] => data;
    } else if (data instanceof Function) {
      this.data = data;
    }

    return this;
  }

  public get length(): Promise<number> {
    return new Promise<number>((resolve) =>
      resolve(Array.from(this.data()).length),
    );
  }
}

export default MemoryStorage;
