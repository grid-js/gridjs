import { h, RefObject } from 'preact';
import { classJoin, className } from '../../../util/className';
import { BaseComponent } from '../../base';
import { TColumn } from '../../../types';
import { TH } from '../../table/th';

type ResizeProps = {
  column: TColumn;
  thRef: RefObject<TH>;
};

type ResizeState = {
  width: string;
  offsetStart: number;
};

export class Resize extends BaseComponent<ResizeProps, ResizeState> {
  private mouseMoveFn: (e) => void;
  private mouseUpFn: (e) => void;

  private mouseDown(e): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const thElement: HTMLElement = this.props.thRef.current;

    this.setState({
      offsetStart: parseInt(thElement.style.width, 10) - e.pageX,
    });

    this.mouseUpFn = this.mouseUp.bind(this);
    this.mouseMoveFn = this.mouseMove.bind(this);

    document.addEventListener('mouseup', this.mouseUpFn);
    document.addEventListener('mousemove', this.mouseMoveFn);
  }

  private mouseMove(e): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const thElement: HTMLElement = this.props.thRef.current;

    if (
      this.state.offsetStart + e.pageX >=
      parseInt(thElement.style.minWidth, 10)
    ) {
      thElement.style.width = `${this.state.offsetStart + e.pageX}px`;
    }
  }

  private mouseUp(): void {
    document.removeEventListener('mouseup', this.mouseUpFn);
    document.removeEventListener('mousemove', this.mouseMoveFn);
  }

  render() {
    return (
      <div
        className={classJoin(
          className('th'),
          className('resizable'),
          className('resizable-right'),
        )}
        onMouseDown={this.mouseDown.bind(this)}
      ></div>
    );
  }
}
