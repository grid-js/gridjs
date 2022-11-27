import { h } from 'preact';
import Row from '../../row';
import { TR } from './tr';
import Tabular from '../../tabular';
import { classJoin, className } from '../../util/className';
import { Status } from '../../types';
import Header from '../../header';
import { MessageRow } from './messageRow';
import { useConfig } from '../../hooks/useConfig';
import { useTranslator } from '../../i18n/language';

export function TBody(props: {
  data: Tabular;
  status: Status;
  header?: Header;
}) {
  const config = useConfig();
  const _ = useTranslator();

  const headerLength = () => {
    if (props.header) {
      return props.header.visibleColumns.length;
    }
    return 0;
  };

  return (
    <tbody className={classJoin(className('tbody'), config.className.tbody)}>
      {props.data &&
        props.data.rows.map((row: Row) => {
          return <TR key={row.id} row={row} header={props.header} />;
        })}

      {props.status === Status.Loading &&
        (!props.data || props.data.length === 0) && (
          <MessageRow
            message={_('loading')}
            colSpan={headerLength()}
            className={classJoin(
              className('loading'),
              config.className.loading,
            )}
          />
        )}

      {props.status === Status.Rendered &&
        props.data &&
        props.data.length === 0 && (
          <MessageRow
            message={_('noRecordsFound')}
            colSpan={headerLength()}
            className={classJoin(
              className('notfound'),
              config.className.notfound,
            )}
          />
        )}

      {props.status === Status.Error && (
        <MessageRow
          message={_('error')}
          colSpan={headerLength()}
          className={classJoin(className('error'), config.className.error)}
        />
      )}
    </tbody>
  );
}
