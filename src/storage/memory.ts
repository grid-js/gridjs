import Storage from './storage';

class MemoryStorage extends Storage<any[][] | Function, any[][]> {
  private data: Function;

  constructor(data: any[][] | Function) {
    super();
    this.set(data);
  }

  public async get(): Promise<any[][]> {
    return await this.data();
  }

  public set(data: any[][] | Function): this {
    if (data instanceof Array) {
      this.data = (): any[][] => data;
    } else if (data instanceof Function) {
      this.data = data;
    }

    return this;
  }

  total(rows: any[][]): Promise<number> {
    return new Promise<number>((resolve) =>
      resolve(rows.length),
    );
  }
}

export default MemoryStorage;
