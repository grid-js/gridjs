import Tabular from '../../tabular';
import { TBody } from './tbody';
import { THead } from './thead';
import Header from '../../header';
import { classJoin, className } from '../../util/className';
import { Status } from '../../types';
import { useConfig } from '../../hooks/useConfig';
import { h, RefObject } from 'preact';

export function Table(props: {
  ref: RefObject<HTMLTableElement>;
  data: Tabular;
  status: Status;
  header?: Header;
  width: string;
  height: string;
}) {
  const config = useConfig();

  return (
    <table
      ref={props.ref}
      role="grid"
      className={classJoin(className('table'), config.className.table)}
      style={{
        ...config.style.table,
        ...{
          height: props.height,
        },
      }}
    >
      <THead header={props.header} />
      <TBody data={props.data} status={props.status} header={props.header} />
    </table>
  );
}
