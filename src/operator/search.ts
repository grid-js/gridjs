import Tabular from '../tabular';
import { TCell } from '../types';
import { VNode } from 'preact';
import { HTMLContentProps } from '../view/htmlElement';

export default function (
  keyword: string,
  tabular: Tabular<TCell>,
): Tabular<TCell> {
  // escape special regex chars
  keyword = keyword.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

  return new Tabular(
    tabular.rows.filter((row) =>
      row.cells.some((cell) => {
        if (!cell || !cell.data) {
          return false;
        }

        let data = '';

        if (typeof cell.data === 'object') {
          // HTMLContent element
          const element = cell.data as VNode<HTMLContentProps>;
          if (element.props.content) {
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
