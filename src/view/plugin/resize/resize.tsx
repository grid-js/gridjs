import { h, RefObject } from 'preact';
import { classJoin, className } from '../../../util/className';
import { TColumn } from '../../../types';
import { throttle } from '../../../util/throttle';
import {useConfig} from "../../../hooks/useConfig";

export function Resize(props: {
  column: TColumn;
  thRef: RefObject<HTMLTableCellElement>;
}) {
  const config = useConfig();

  let moveFn: (e) => void;

  const getPageX = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) {
      return Math.floor(e.pageX);
    } else {
      return Math.floor(e.changedTouches[0].pageX);
    }
  };

  const start = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();

    const thElement = props.thRef.current;

    const offsetStart = parseInt(thElement.style.width, 10) - getPageX(e);

    moveFn = throttle((e) => move(e, offsetStart), 10);

    document.addEventListener('mouseup', end);
    document.addEventListener('touchend', end);
    document.addEventListener('mousemove', moveFn);
    document.addEventListener('touchmove', moveFn);
  };

  const move = (e: MouseEvent | TouchEvent, offsetStart: number) => {
    e.stopPropagation();

    const thElement = props.thRef.current;

    if (offsetStart + getPageX(e) >= parseInt(thElement.style.minWidth, 10)) {
      const width = offsetStart + getPageX(e);
      thElement.style.width = `${width}px`;
      localStorage.setItem(`${config.instance.uniqueIdentifier}${props.column.id}`, width.toString()); // save column width in local storage
    }
  };

  const end = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();

    document.removeEventListener('mouseup', end);
    document.removeEventListener('mousemove', moveFn);
    document.removeEventListener('touchmove', moveFn);
    document.removeEventListener('touchend', end);
  };

  return (
    <div
      className={classJoin(className('th'), className('resizable'))}
      onMouseDown={start}
      onTouchStart={start}
      onClick={(e) => e.stopPropagation()}
    />
  );
}
