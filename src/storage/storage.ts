import Config from '../config';

abstract class Storage {
  protected config;

  protected constructor(config: Config) {
    this.config = config;
  }

  abstract async get(): Promise<any[][]>;
  abstract async set(rows: any[][]): Promise<boolean>;
  abstract get length(): Promise<number>;
}

export default Storage;
