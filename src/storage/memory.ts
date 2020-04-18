import Storage from './storage';

class MemoryStorage extends Storage {
  private rows: any[][] = [];

  constructor(data: any[][]) {
    super();
    this.set(data);
  }

  public async get(): Promise<any[][]> {
    return this.rows;
  }

  public async set(rows: any[][]): Promise<boolean> {
    this.rows = rows;
    return true;
  }

  public get length(): Promise<number> {
    return new Promise<number>(resolve =>
      resolve(Array.from(this.rows).length),
    );
  }
}

export default MemoryStorage;
