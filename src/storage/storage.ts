/**
 * Base Storage class. All storage implementation must inherit this class
 */
abstract class Storage {
  abstract async get(): Promise<any[][]>;
  abstract async set(rows: any[][]): Promise<boolean>;
  abstract get length(): Promise<number>;
}

export default Storage;
