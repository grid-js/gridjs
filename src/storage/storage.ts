/**
 * Base Storage class. All storage implementation must inherit this class
 */
abstract class Storage<I, O> {
  /**
   * Returns all rows based on ...args
   * @param args
   */
  abstract async get(...args): Promise<O>;

  /**
   * To set all rows
   *
   * @param data
   */
  set?(data: I | Function): this;

  /**
   * Returns the total number of rows based on ...args
   *
   * @param args
   */
  total?(...args): Promise<number>;
}

export default Storage;
