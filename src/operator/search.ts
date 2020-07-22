import Tabular from '../tabular';
import { VNode } from 'preact';
import { HTMLContentProps } from '../view/htmlElement';
import { TCell } from '../types';

export default function (
  keyword: string,
  tabular: Tabular,
  selector?: (cell: TCell, rowIndex: number, cellIndex: number) => string,
): Tabular {
  // escape special regex chars
  keyword = keyword.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

  return new Tabular(
    tabular.rows.filter((row, rowIndex) =>
      row.cells.some((cell, cellIndex) => {
        if (!cell) {
          return false;
        }

        let data = '';

        if (typeof selector === 'function') {
          data = selector(cell.data, rowIndex, cellIndex);
        } else if (typeof cell.data === 'object') {
          // HTMLContent element
          const element = cell.data as VNode<HTMLContentProps>;
          if (element && element.props && element.props.content) {
            // TODO: we should only search in the content of the element. props.content is the entire HTML element
            data = element.props.content;
          }
        } else {
          // primitive types
          data = String(cell.data);
        }

        return new RegExp(keyword, 'gi').test(data);
      }),
    ),
  );
}
