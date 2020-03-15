import Row from "../row";


abstract class Storage<T> {
  abstract getRows(): Row<T>[];
  abstract setRows(rows: Row<T>[]);
}

export default Storage;
