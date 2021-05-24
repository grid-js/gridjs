import { Component, h, RefObject } from 'preact';
import { BaseComponent, BaseProps } from '../base';
import { className } from '../../util/className';

interface ShadowTableProps extends BaseProps {
  tableRef?: RefObject<Component>;
}

/**
 * ShadowTable renders a hidden table and is used to calculate the column's width
 * when autoWidth option is enabled
 */
export class ShadowTable extends BaseComponent<ShadowTableProps> {
  private tableElement: HTMLTableElement;
  private tableClassName: string;
  private tableStyle: string;

  constructor(props, context) {
    super(props, context);

    const tableRef = this.props.tableRef;
    this.tableElement = tableRef.current.base.cloneNode(
      true,
    ) as HTMLTableElement;

    this.tableElement.style.position = 'absolute';
    this.tableElement.style.width = '100%';
    this.tableElement.style.zIndex = '-2147483640';
    this.tableElement.style.visibility = 'hidden';

    this.tableClassName = this.tableElement.className;
    this.tableStyle = this.tableElement.style.cssText;
  }

  public widths(): { [columnId: string]: { minWidth: number; width: number } } {
    this.tableElement.className = `${this.tableClassName} ${className(
      'shadowTable',
    )}`;

    this.tableElement.style.tableLayout = 'auto';
    this.tableElement.style.width = 'auto';
    this.tableElement.style.padding = '0';
    this.tableElement.style.margin = '0';
    this.tableElement.style.border = 'none';
    this.tableElement.style.outline = 'none';

    let obj = Array.from(
      this.base.parentNode.querySelectorAll<HTMLElement>('thead th'),
    ).reduce((prev, current) => {
      current.style.width = `${current.clientWidth}px`;

      return {
        [current.getAttribute('data-column-id')]: {
          minWidth: current.clientWidth,
        },
        ...prev,
      };
    }, {});

    this.tableElement.className = this.tableClassName;
    this.tableElement.style.cssText = this.tableStyle;
    this.tableElement.style.tableLayout = 'auto';

    obj = Array.from(
      this.base.parentNode.querySelectorAll<HTMLElement>('thead th'),
    ).reduce((prev, current) => {
      prev[current.getAttribute('data-column-id')]['width'] =
        current.clientWidth;

      return prev;
    }, obj);

    return obj;
  }

  render() {
    if (this.props.tableRef.current) {
      return (
        <div
          ref={(nodeElement) => {
            nodeElement && nodeElement.appendChild(this.tableElement);
          }}
        />
      );
    }

    return null;
  }
}
