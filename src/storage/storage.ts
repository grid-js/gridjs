import Row from "../row";
import Config from "../config";


abstract class Storage<T> {
  abstract async load(config: Config): Promise<boolean>;
  abstract async get(): Promise<Iterable<Row<T>>>;
  abstract async set(rows: Iterable<Row<T>>): Promise<boolean>;
  abstract get length(): Promise<number>;
}

export default Storage;
