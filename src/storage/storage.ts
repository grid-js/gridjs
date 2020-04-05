import Config from '../config';

/**
 * Base Storage class. All storage implementation must inherit this class
 */
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
