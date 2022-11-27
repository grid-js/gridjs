import { h, RefObject } from 'preact';
import { classJoin, className } from '../../../util/className';
import { TColumn } from '../../../types';
import { TH } from '../../table/th';
import { throttle } from '../../../util/throttle';
import { useState } from 'preact/hooks';

export function Resize(props: {
  column: TColumn;
  thRef: RefObject<typeof TH>;
}) {
  const [offsetStart, setOffsetStart] = useState(0);

  let moveFn: (e) => void;
  let upFn: (e) => void;

  const getPageX = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) {
      return Math.floor(e.pageX);
    } else {
      return Math.floor(e.changedTouches[0].pageX);
    }
  };

  const start = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const thElement: HTMLElement = props.thRef.current;

    setOffsetStart(parseInt(thElement.style.width, 10) - getPageX(e));

    upFn = end;
    moveFn = throttle(move, 10);

    document.addEventListener('mouseup', upFn);
    document.addEventListener('touchend', upFn);
    document.addEventListener('mousemove', moveFn);
    document.addEventListener('touchmove', moveFn);
  };

  const move = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const thElement: HTMLElement = props.thRef.current;

    if (offsetStart + getPageX(e) >= parseInt(thElement.style.minWidth, 10)) {
      thElement.style.width = `${offsetStart + getPageX(e)}px`;
    }
  };

  const end = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();

    document.removeEventListener('mouseup', upFn);
    document.removeEventListener('mousemove', moveFn);
    document.removeEventListener('touchmove', moveFn);
    document.removeEventListener('touchend', upFn);
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
