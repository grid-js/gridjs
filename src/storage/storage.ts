/**
 * Base Storage class. All storage implementation must inherit this class
 */
abstract class Storage {
  abstract async get(): Promise<any[][]>;
  abstract set(data: any[][] | Function): Storage;
  abstract get length(): Promise<number>;
}

export default Storage;
