import { h, RefObject } from 'preact';
import { classJoin, className } from '../../../util/className';
import { TColumn } from '../../../types';
import { throttle } from '../../../util/throttle';

export function Resize(props: {
  column: TColumn;
  thRef: RefObject<HTMLTableCellElement>;
}) {
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
      thElement.style.width = `${offsetStart + getPageX(e)}px`;
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
