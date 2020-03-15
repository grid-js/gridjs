import Row from "../row";


abstract class Storage<T> {
  abstract async get(): Promise<Iterable<Row<T>>>;
  abstract async set(rows: Iterable<Row<T>>): Promise<boolean>;
  abstract get length(): Promise<number>;
}

export default Storage;
