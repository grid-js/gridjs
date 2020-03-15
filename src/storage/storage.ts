import Row from "../row";


abstract class Storage<T> {
  abstract get(): Iterable<Row<T>>;
  abstract set(rows: Iterable<Row<T>>): void;
  abstract get length(): number;
}

export default Storage;
