/**
 * Base Storage class. All storage implementation must inherit this class
 */
abstract class Storage {
  abstract async get(...args): Promise<any[][]>;
  set?(data: any[][] | Function): Storage;
  abstract get length(): Promise<number>;
}

export default Storage;
