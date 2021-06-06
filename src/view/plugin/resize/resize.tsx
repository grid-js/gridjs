import { h, RefObject } from 'preact';
import { classJoin, className } from '../../../util/className';
import { BaseComponent } from '../../base';
import { TColumn } from '../../../types';
import { TH } from '../../table/th';
import { throttle } from '../../../util/throttle';

type ResizeProps = {
  column: TColumn;
  thRef: RefObject<TH>;
};

type ResizeState = {
  width: string;
  offsetStart: number;
};

export class Resize extends BaseComponent<ResizeProps, ResizeState> {
  private moveFn: (e) => void;
  private upFn: (e) => void;

  private getPageX(e: MouseEvent | TouchEvent): number {
    if (e instanceof MouseEvent) {
      return Math.floor(e.pageX);
    } else {
      return Math.floor(e.changedTouches[0].pageX);
    }
  }

  private start(e: MouseEvent | TouchEvent): void {
    e.stopPropagation();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const thElement: HTMLElement = this.props.thRef.current;

    this.setState({
      offsetStart: parseInt(thElement.style.width, 10) - this.getPageX(e),
    });

    this.upFn = this.end.bind(this);
    this.moveFn = throttle(this.move.bind(this), 10);

    document.addEventListener('mouseup', this.upFn);
    document.addEventListener('touchend', this.upFn);
    document.addEventListener('mousemove', this.moveFn);
    document.addEventListener('touchmove', this.moveFn);
  }

  private move(e: MouseEvent | TouchEvent): void {
    e.stopPropagation();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const thElement: HTMLElement = this.props.thRef.current;

    if (
      this.state.offsetStart + this.getPageX(e) >=
      parseInt(thElement.style.minWidth, 10)
    ) {
      thElement.style.width = `${this.state.offsetStart + this.getPageX(e)}px`;
    }
  }

  private end(e: MouseEvent | TouchEvent): void {
    e.stopPropagation();

    document.removeEventListener('mouseup', this.upFn);
    document.removeEventListener('mousemove', this.moveFn);
    document.removeEventListener('touchmove', this.moveFn);
    document.removeEventListener('touchend', this.upFn);
  }

  render() {
    return (
      <div
        className={classJoin(className('th'), className('resizable'))}
        onMouseDown={this.start.bind(this)}
        onTouchStart={this.start.bind(this)}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }
}
